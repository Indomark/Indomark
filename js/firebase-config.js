// Indomark Firebase client configuration.
// Firebase is DATA ONLY in Indomark. Authentication and sessions are handled by IndoVerification.

const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyDj5T2zj5GUc4hhkAgbYimLa6ZKlZwnpss",
  authDomain: "trigger-aa214.firebaseapp.com",
  databaseURL: "https://trigger-aa214-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trigger-aa214",
  storageBucket: "trigger-aa214.firebasestorage.app",
  messagingSenderId: "633598033396",
  appId: "1:633598033396:web:2e45b99a6b584f5ba78da1",
  measurementId: "G-540WDMJTQ4"
});

if (!window.firebase) {
  console.error('Firebase SDK failed to load.');
} else if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

window.IndomarkFirebase = {
  app: firebase.app(),
  database: firebase.database(),
  config: firebaseConfig
};
