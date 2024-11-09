// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPYtL_rvaPb6xPVDjTaW4EIApLBJ92Emw",
    authDomain: "cceditor-e1b05.firebaseapp.com",
    projectId: "cceditor-e1b05",
    storageBucket: "cceditor-e1b05.firebasestorage.app",
    messagingSenderId: "199293646532",
    appId: "1:199293646532:web:85765ce835bfc1b2217b91",
    measurementId: "G-FLQBH28N69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;