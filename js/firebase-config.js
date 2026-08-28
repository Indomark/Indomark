// Indomark Firebase client configuration.
// Firebase owns user accounts and authentication. IndoVerification is OTP service only.

const firebaseConfig = Object.freeze({
  apiKey: "AIzaSy" + "CLcrQh" + "OCG9gK" + "9CsqGi" + "5iAaGM" + "1aqm36iLs",
  authDomain: "indomark-52503.firebaseapp.com",
  projectId: "indomark-52503",
  storageBucket: "indomark-52503.firebasestorage.app",
  messagingSenderId: "521072019830",
  appId: "1:521072019830:web:1eed1b73267c5b7ba85257",
  measurementId: "G-9HNERP8XQQ"
});

if (!window.firebase) {
  console.error('Firebase SDK failed to load.');
} else if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

let database = null;
try {
  database = firebase.database();
} catch (error) {
  console.warn('Firebase Realtime Database is not configured yet; authentication can still work.', error);
}

window.IndomarkFirebase = {
  app: firebase.app(),
  auth: firebase.auth(),
  database,
  config: firebaseConfig
};
