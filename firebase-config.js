// إعدادات الاتصال بقاعدة بيانات Firebase (Realtime Database)
// هذا الملف مشترك بين index.html و owner.html

const firebaseConfig = {
  apiKey: "AIzaSyApiEOsFwBD1J7NcTd-rYr_FK-fxRNQl8g",
  authDomain: "wisamstore-8dda1.firebaseapp.com",
  databaseURL: "https://wisamstore-8dda1-default-rtdb.firebaseio.com",
  projectId: "wisamstore-8dda1",
  storageBucket: "wisamstore-8dda1.firebasestorage.app",
  messagingSenderId: "225703638175",
  appId: "1:225703638175:web:c3e01935e7e974a5349eaa"
};

try {
  firebase.initializeApp(firebaseConfig);
} catch (e) {
  console.warn("Firebase init failed:", e);
}
