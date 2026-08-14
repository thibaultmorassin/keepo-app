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
};

type SessionContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
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

  const signUp = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { error: mapAuthError(error) };
    }

    if (!data.session) {
      return {
        error: null,
        needsEmailConfirmation: true,
      };
    }

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
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

      return { error: null, verified: !!data.session };
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
