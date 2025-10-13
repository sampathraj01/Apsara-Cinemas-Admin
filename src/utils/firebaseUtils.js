// firebase.js
import { initializeApp } from 'firebase/app';
import { getToken, getMessaging, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDynyowiSp7LCfeH9Nq0iWqzdbYEdQ9mpk",
  authDomain: "magoprinpro-abe2d.firebaseapp.com",
  projectId: "magoprinpro-abe2d",
  storageBucket: "magoprinpro-abe2d.firebasestorage.app",
  messagingSenderId: "324468777837",
  appId: "1:324468777837:web:986cee69265706f8c4b064",
  measurementId: "G-W378NFV9LJ"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  if (Notification.permission === 'granted') {
    new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: payload.notification.icon,
    });
  }
});

export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return window.navigator.serviceWorker
      .getRegistration('/firebase-push-notification-scope')
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/firebase-push-notification-scope',
        });
      });
  }
  throw new Error('The browser doesn`t support service worker.');
};

const vapidKey = "BOEZcNv8VU4eIwkYmaEsmEWCu5bd6XcFRpErgnK-BMhD163qC-u75qeYJK9ETnCc_08sFNhRWMI70oCMC0bOVtM"


export const getFirebaseToken = () =>
  getOrRegisterServiceWorker()
    .then((serviceWorkerRegistration) =>
      getToken(messaging, { vapidKey: vapidKey , serviceWorkerRegistration }));
