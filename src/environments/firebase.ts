// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  firebase:{
    apiKey: "AIzaSyBdZAQwhUs-8m_TqtNSa-Mwlv9aYPt7yf8",
    authDomain: "lovelink-imagens.firebaseapp.com",
    projectId: "lovelink-imagens",
    storageBucket: "lovelink-imagens.firebasestorage.app",
    messagingSenderId: "500165439538",
    appId: "1:500165439538:web:612243a9266d59443f4c2b",
    measurementId: "G-FTQ75XB6GP"
  }
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig.firebase);
const analytics = getAnalytics(app);