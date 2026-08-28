// IndoSpeed Firebase client configuration.
// This file contains the public web-app configuration only.
// Keep Firebase Authentication and Realtime Database security rules configured in the Firebase console.

const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyDj5T2zj5GUc4hhkAgbYimLa6ZKlZwnpss",
  authDomain: "trigger-aa214.firebaseapp.com",
  databaseURL: "https://trigger-aa214-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trigger-aa214",
  storageBucket: "trigger-aa214.firebasestorage.app",
  messagingSenderId: "633598033396",
  appId: "1:633598033396:web:0141ccdffee99772a78da1",
  measurementId: "G-1LZ4V6FT0B"
});

if (!window.firebase) {
  console.error('Firebase SDK failed to load.');
} else if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

window.IndoSpeedFirebase = {
  app: firebase.app(),
  auth: firebase.auth(),
  database: firebase.database(),
  config: firebaseConfig
};
