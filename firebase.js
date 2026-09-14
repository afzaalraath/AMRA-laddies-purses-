import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyCtvJkz63GTce8woKTDI_avfxcXsAH0gWQ",
  authDomain: "amra-purses.firebaseapp.com",
  projectId: "amra-purses",
  storageBucket: "amra-purses.firebasestorage.app",
  messagingSenderId: "961999594619",
  appId: "1:961999594619:web:0ed4115caab9edadc7aede"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export {
  db,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc
};
