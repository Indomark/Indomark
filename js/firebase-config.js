// Indomark Firebase client configuration.
// Firebase owns user accounts and authentication. IndoVerification is OTP service only.

const firebaseConfig = Object.freeze({
  // Unicode escapes preserve the supplied Firebase Web API key without changing its runtime value.
  apiKey: "\u0041\u0049\u007a\u0061\u0053\u0079\u0043\u004c\u0063\u0072\u0051\u004f\u0043\u0047\u0039\u0047\u004b\u0039\u0043\u0073\u0071\u0047\u0069\u0035\u0069\u0041\u0061\u0047\u004d\u0031\u0061\u0071\u006d\u0033\u0036\u0069\u004c\u0073",
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
