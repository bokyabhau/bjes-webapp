import {
  GoogleAuthProvider,
  GithubAuthProvider,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { firebaseAuth, firebaseDb } from './firebaseConfig';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Sign in with Google functionality
export const signInWithGoogle = async () => {
  try {
    return setPersistence(firebaseAuth, browserSessionPersistence).then(
      async () => {
        const result = await signInWithPopup(firebaseAuth, googleProvider);
        return {
          success: true,
          user: result.user,
          error: null,
        };
      }
    );
  } catch (error: any) {
    return {
      success: false,
      user: null,
      error: error.message,
    };
  }
};

// Sign in with GitHub functionality
export const signInWithGithub = async () => {
  try {
    return setPersistence(firebaseAuth, browserSessionPersistence).then(
      async () => {
        const result = await signInWithPopup(firebaseAuth, githubProvider);
        return {
          success: true,
          user: result.user,
          error: null,
        };
      }
    );
  } catch (error: any) {
    return {
      success: false,
      user: null,
      error: error.message,
    };
  }
};

// Sign in with email and password
export async function signInWithCredentials(email: string, password: string) {
  try {
    return setPersistence(firebaseAuth, browserSessionPersistence).then(
      async () => {
        const userCredential = await signInWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );
        const role = await getUserRole(userCredential.user.uid); 
        return {
          success: true,
          user: {
            ...userCredential.user,
            role,
          },
          error: null,
        };
      }
    );
  } catch (error: any) {
    return {
      success: false,
      user: null,
      error: error.message || 'Failed to sign in with email/password',
    };
  }
}

export const getUserRole = async (id: string) => {
  const userDocRef = doc(firebaseDb, 'roles', id);
  const userDocSnap = await getDoc(userDocRef);

  return userDocSnap.exists() ? userDocSnap.data().name : 'guest';
};
// Sign out functionality
export const firebaseSignOut = async () => {
  try {
    await signOut(firebaseAuth);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Auth state observer
export const onAuthStateChanged = (callback: (user: any) => void) => {
  console.log('onAuthStateChanged');
  return firebaseAuth.onAuthStateChanged(callback);
};
