const admin = require("firebase-admin");
const firebase = require('firebase');

const serviceAccount = require("./zclave_privada_firebase.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://turismo2-4b07d.firebaseio.com",
    storageBucket: "turismo2-4b07d.appspot.com"
  });

const firebaseConfig = {
    apiKey: "AIzaSyBL_LLC4evVeYSpHhYl97uF2jg-hxwAP8I",
    authDomain: "turismo2-4b07d.firebaseapp.com",
    databaseURL: "https://turismo2-4b07d.firebaseio.com",
    projectId: "turismo2-4b07d",
    storageBucket: "turismo2-4b07d.appspot.com",
    messagingSenderId: "361696427572",
    appId: "1:361696427572:web:93de2285ebce8480679461"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  module.exports = { admin, firebase };