import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  UserCredential,
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { runPopupWithRedirectFallback } from './authFlow';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/spreadsheets'
];

const provider = new GoogleAuthProvider();
SCOPES.forEach(scope => provider.addScope(scope));

let activeSignInPromise: Promise<{ user: User; accessToken: string } | null> | null = null;
let cachedAccessToken: string | null = null;

const readGoogleCredential = (result: UserCredential) => {
  const credential = GoogleAuthProvider.credentialFromResult(result);
  if (!credential?.accessToken) {
    throw new Error('Failed to get access token from Firebase Auth');
  }
  cachedAccessToken = credential.accessToken;
  return { user: result.user, accessToken: cachedAccessToken };
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: (error?: unknown) => void
) => {
  let resolvingRedirect = true;
  let disposed = false;

  void getRedirectResult(auth)
    .then((result) => {
      if (!result || disposed) return;
      const authResult = readGoogleCredential(result);
      if (onAuthSuccess) onAuthSuccess(authResult.user, authResult.accessToken);
    })
    .catch((error) => {
      console.error('Redirect sign-in error:', error);
      if (!disposed && onAuthFailure) onAuthFailure(error);
    })
    .finally(() => {
      resolvingRedirect = false;
      if (!disposed && auth.currentUser && !cachedAccessToken && !activeSignInPromise) {
        if (onAuthFailure) onAuthFailure();
      }
    });

  const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!activeSignInPromise && !resolvingRedirect) {
        // Cached token might need refresh upon page reload via re-login prompt
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });

  return () => {
    disposed = true;
    unsubscribe();
  };
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  if (activeSignInPromise) {
    return activeSignInPromise;
  }

  activeSignInPromise = (async () => {
    try {
      const result = await runPopupWithRedirectFallback(
        () => signInWithPopup(auth, provider),
        () => signInWithRedirect(auth, provider),
      );
      if (!result) return null;
      return readGoogleCredential(result);
    } catch (error: any) {
      if (
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/popup-closed-by-user' ||
        error?.message?.includes('cancelled-popup-request') ||
        error?.message?.includes('popup-closed-by-user')
      ) {
        // User closed or superseded popup, handled cleanly
        console.warn('Google sign-in popup closed or superseded.');
        return null;
      }
      console.error('Sign in error:', error);
      throw error;
    } finally {
      activeSignInPromise = null;
    }
  })();

  return activeSignInPromise;
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
