import { updateProfilePrefs } from "@/utils/profile";
import { clearSyncedPersistence } from "@/utils/SupaLegend";
import { supabase } from "@/utils/supabase";
import type { AuthError, Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type AuthResult = {
  error: string | null;
  needsEmailConfirmation?: boolean;
};

type EmailVerificationResult = {
  error: string | null;
  verified: boolean;
  /** The now-authenticated user's id, once `verified` — lets the caller finish writing the profile row created at signup. */
  userId?: string;
};

type SessionContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  checkEmailVerified: (
    email: string,
    password: string,
  ) => Promise<EmailVerificationResult>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function mapAuthError(error: AuthError | null): string | null {
  if (!error) return null;

  const message = error.message.toLowerCase();

  if (message.includes("invalid login credentials")) {
    return "Email ou mot de passe incorrect.";
  }
  if (message.includes("user already registered")) {
    return "Un compte existe déjà avec cet email.";
  }
  if (message.includes("password")) {
    return "Le mot de passe ne respecte pas les critères requis.";
  }
  if (message.includes("email not confirmed")) {
    return "Email pas encore confirmé. Ouvrez le lien reçu par email.";
  }
  if (message.includes("email")) {
    return "Adresse email invalide.";
  }

  return "Une erreur est survenue. Réessayez dans un instant.";
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: mapAuthError(error) };
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
    ) => {
      // `options.data` lands in `auth.users.raw_user_meta_data` — kept as a
      // backup for whatever out-of-band trigger seeds `profiles` on signup.
      // The explicit `updateProfilePrefs` below is the one we can actually
      // verify, so it's the source of truth whenever a session comes back
      // immediately (email confirmation disabled).
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName },
        },
      });
      if (error) {
        return { error: mapAuthError(error) };
      }

      // Signing up with an email that's already registered AND confirmed
      // doesn't come back as an error on a project with "Confirm email" on
      // — Supabase returns a 200 with a user that has no identities, so it
      // can't be used to tell an attacker which emails exist. Auto-confirm
      // projects instead surface this as a normal "already registered"
      // error, already handled by `mapAuthError` above.
      if (data.user && data.user.identities?.length === 0) {
        return { error: "Un compte existe déjà avec cet email." };
      }

      if (!data.session) {
        return {
          error: null,
          needsEmailConfirmation: true,
        };
      }

      await updateProfilePrefs(data.session.user.id, { firstName, lastName });

      return { error: null };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await clearSyncedPersistence();
    const { error } = await supabase.auth.signOut();
    return { error: mapAuthError(error) };
  }, []);

  const checkEmailVerified = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const message = error.message.toLowerCase();
        if (message.includes("email not confirmed")) {
          return { error: null, verified: false };
        }
        return { error: mapAuthError(error), verified: false };
      }

      return {
        error: null,
        verified: !!data.session,
        userId: data.session?.user.id,
      };
    },
    [],
  );

  const value = useMemo(
    () => ({
      session,
      isLoading,
      signIn,
      signUp,
      signOut,
      checkEmailVerified,
    }),
    [session, isLoading, signIn, signUp, signOut, checkEmailVerified],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}
