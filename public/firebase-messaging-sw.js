importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDynyowiSp7LCfeH9Nq0iWqzdbYEdQ9mpk",
  authDomain: "magoprinpro-abe2d.firebaseapp.com",
  projectId: "magoprinpro-abe2d",
  storageBucket: "magoprinpro-abe2d.firebasestorage.app",
  messagingSenderId: "324468777837",
  appId: "1:324468777837:web:986cee69265706f8c4b064",
  measurementId: "G-W378NFV9LJ"
};


firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = { body: payload.notification.body };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
