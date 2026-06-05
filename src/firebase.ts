import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Konfigurasi Firebase asli milik database Anda
const firebaseConfig = {
  apiKey: "AIzaSyDD8-ZJU3rPgfjqymahRkEiEGzqiW5LnOQ",
  authDomain: "market-day-app.firebaseapp.com",
  databaseURL: "https://market-day-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "market-day-app",
  storageBucket: "market-day-app.firebasestorage.app",
  messagingSenderId: "745951785761",
  appId: "1:745951785761:web:6bf856c49cea16ba438460"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor database agar bisa langsung dipakai di file store.ts
export const db = getDatabase(app);
