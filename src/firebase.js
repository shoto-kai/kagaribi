// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpkh9C6PBadd4cawBtCtBRK8ZnBvFqxDk",
  authDomain: "kagaribi-bddbc.firebaseapp.com",
  projectId: "kagaribi-bddbc",
  storageBucket: "kagaribi-bddbc.appspot.com",
  messagingSenderId: "343586900723",
  appId: "1:343586900723:web:9fd58a18da0a76e13d0586",
  measurementId: "G-VE66KP2D9L"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export {app, storage};