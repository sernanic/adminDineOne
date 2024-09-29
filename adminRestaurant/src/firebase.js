// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB7oEMxFoHLj6M_tw8ywwBpan8e7zN2g6U",
  authDomain: "adminrestaurantapp-7ae66.firebaseapp.com",
  projectId: "adminrestaurantapp-7ae66",
  storageBucket: "adminrestaurantapp-7ae66.appspot.com",
  messagingSenderId: "919819500332",
  appId: "1:919819500332:web:b12fee34a70159e0f1ca89",
  measurementId: "G-EMGXYGX1B7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
