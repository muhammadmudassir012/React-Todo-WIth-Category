import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCpu8Y6M4jYxysHA5M95RP8gnToxOszxRc",
    authDomain: "todo-website-b7719.firebaseapp.com",
    projectId: "todo-website-b7719",
    storageBucket: "todo-website-b7719.firebasestorage.app",
    messagingSenderId: "402264761905",
    appId: "1:402264761905:web:8f84241d31301d18905710",
    measurementId: "G-PJDMRT28ML"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {auth,db}