// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDvTVi6h37wBhxiJ0kn_TZ3S_f8q0Etxg",
  authDomain: "trial-browser.firebaseapp.com",
  projectId: "trial-browser",
  storageBucket: "trial-browser.appspot.com",
  messagingSenderId: "130229177704",
  appId: "1:130229177704:web:4edef3d8f5360e41621add",
  measurementId: "G-FSBP4VDRWH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc, analytics };
