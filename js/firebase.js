import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// CONFIG FIREBASE
const firebaseConfig = {

  apiKey: "AIzaSyCpDANdwBksAfDAgvhff_9zDEOUdvA4oTg",

  authDomain: "dav-lais.firebaseapp.com",

  projectId: "dav-lais",

  storageBucket: "dav-lais.firebasestorage.app",

  messagingSenderId: "669039734911",

  appId: "1:669039734911:web:6e7245343d37e3b80f4f4a"
};

// INICIA FIREBASE
const app = initializeApp(firebaseConfig);

// INICIA FIRESTORE
const db = getFirestore(app);

// EXPORTA
export {
  db,
  collection,
  addDoc,
  getDocs
};