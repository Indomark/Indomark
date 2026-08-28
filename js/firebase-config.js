// Indomark Firebase client configuration.
// Firebase owns user accounts and authentication. IndoVerification is OTP service only.

const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyAXQHLuhGrPRjsPhI0hlG5ZGdf1BbRhqK8",
  authDomain: "indomark-f4d55.firebaseapp.com",
  databaseURL: "https://indomark-f4d55-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "indomark-f4d55",
  storageBucket: "indomark-f4d55.firebasestorage.app",
  messagingSenderId: "563704316553",
  appId: "1:563704316553:web:05566e268db653f4f4bc58",
  measurementId: "G-SK3CY5WYT8"
});

if (!window.firebase) {
  console.error('Firebase SDK failed to load.');
} else if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

window.IndomarkFirebase = {
  app: firebase.app(),
  auth: firebase.auth(),
  database: firebase.database(),
  config: firebaseConfig
};
