// IndoSpeed Firebase client configuration.
// This file contains the public web-app configuration only.
// Keep Firebase Authentication and Realtime Database security rules configured
// in the Firebase console; do not put service-account/private keys here.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js';

const firebaseConfig = Object.freeze({
  apiKey: 'AIzaSyCjRlWU2AU14BvUp4oEUpfUHuGkl8uuo_c',
  authDomain: 'indospeed.firebaseapp.com',
  databaseURL: 'https://indospeed-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'indospeed',
  storageBucket: 'indospeed.firebasestorage.app',
  messagingSenderId: '33060314147',
  appId: '1:33060314147:web:cab227dae93455db9fe596',
  measurementId: 'G-CTCRH4VMB7'
});

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseDatabase = getDatabase(firebaseApp);

export { firebaseApp, firebaseAuth, firebaseDatabase, firebaseConfig };
