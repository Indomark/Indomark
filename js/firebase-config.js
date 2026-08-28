// Indomark Firebase client configuration.
// Firebase is DATA ONLY in Indomark. Authentication and sessions are handled by IndoVerification.

const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyAXQHLuhGrPRjsPhI0hlG5ZGdf1BbRhqK8",
  authDomain: "indomark-f4d55.firebaseapp.com",
  projectId: "indomark-f4d55",
  storageBucket: "indomark-f4d55.firebasestorage.app",
  messagingSenderId: "563704316553",
  appId: "1:563704316553:web:59bdbb1f6a241e25f4bc58",
  measurementId: "G-ZSZ4PYD5E0"
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
