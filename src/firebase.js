import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBYzmKtwaieGem-mLZ_x2BUrceJU7JIEX0",
    authDomain: "cbuserapp.firebaseapp.com",
    projectId: "cbuserapp",
    storageBucket: "cbuserapp.appspot.com",
    messagingSenderId: "878847920847",
    appId: "1:878847920847:web:7f7c47558c208ce65e85ba",
    measurementId: "G-W6ENGLMEE8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);