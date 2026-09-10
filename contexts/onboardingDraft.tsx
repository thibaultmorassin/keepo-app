import { observable } from "@legendapp/state";

/**
 * The in-progress "Créer un compte" wizard, kept in a module-level Legend
 * State observable rather than component state, because the `onboarding`
 * modal's own screens unmount every time a step is popped — `useState`
 * there wouldn't survive navigating from step 4 back to step 3. Never
 * persisted to AsyncStorage, and explicitly reset whenever the modal itself
 * closes (see `onboarding/_layout.tsx`) — closing partway through starts
 * over, it does not resume.
 *
 * Read from inside a component wrapped in `observer()` (every
 * `onboarding/*` screen that reads this is), exactly like `useClaimDraft`.
 */
type OnboardingDraftState = {
  /** Step 3 — multi-select JTBD signal. Ephemeral: no `profiles` column, no analytics layer in this app to send it to. */
  concerns: string[];
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

function createInitialState(): OnboardingDraftState {
  return {
    concerns: [],
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };
}

const draft$ = observable<OnboardingDraftState>(createInitialState());

function toggleConcern(value: string) {
  const current = draft$.concerns.peek();
  draft$.concerns.set(
    current.includes(value)
      ? current.filter((concern) => concern !== value)
      : [...current, value],
  );
}

function setFirstName(value: string) {
  draft$.firstName.set(value);
}

function setLastName(value: string) {
  draft$.lastName.set(value);
}

function setEmail(value: string) {
  draft$.email.set(value);
}

function setPassword(value: string) {
  draft$.password.set(value);
}

function reset() {
  draft$.set(createInitialState());
}

/**
 * Called whenever the `onboarding` modal itself unmounts — see
 * `onboarding/_layout.tsx`. Not called explicitly on success: the whole
 * `(auth)` group (this modal included) unmounts on its own once the root
 * auth guard flips to `(app)`, which fires that same cleanup — unlike the
 * `declare` modal, nothing here needs to call `router.dismissTo`.
 */
export const resetOnboardingDraft = reset;

export function useOnboardingDraft() {
  return {
    concerns: draft$.concerns.get(),
    toggleConcern,
    firstName: draft$.firstName.get(),
    setFirstName,
    lastName: draft$.lastName.get(),
    setLastName,
    email: draft$.email.get(),
    setEmail,
    password: draft$.password.get(),
    setPassword,
    reset,
  };
}
