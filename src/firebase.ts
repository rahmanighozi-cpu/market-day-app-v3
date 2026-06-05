import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Konfigurasi Firebase asli milik database Anda
const firebaseConfig = {
  apiKey: "AIzaSy", // Ini biarkan default atau isi dari config web Firebase Anda jika ada
  authDomain: "market-day-app.firebaseapp.com",
  databaseURL: "https://market-day-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "market-day-app",
  storageBucket: "market-day-app.appspot.com",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor database agar bisa langsung dipakai di file lain
export const db = getDatabase(app);
