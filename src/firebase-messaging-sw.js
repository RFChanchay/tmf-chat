importScripts('https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDbXbILdm4UyMdanadVVQEQF2SR2FaOSRc",
    authDomain: "chat-widget-90bae.firebaseapp.com",
    databaseURL: "https://chat-widget-90bae-default-rtdb.firebaseio.com",
    projectId: "chat-widget-90bae",
    storageBucket: "chat-widget-90bae.appspot.com",
    messagingSenderId: "1088926716480",
    appId: "1:1088926716480:web:3c137aadf3eb26e1fa05a5",
    measurementId: "G-XT5SXNN9FR"
});

const messaging = firebase.messaging();