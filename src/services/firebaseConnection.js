import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDemQICsQ-Sq3wsE0qm6PQlDTQzXUiy3V8",
    authDomain: "testes-dc53c.firebaseapp.com",
    databaseURL: "https://testes-dc53c-default-rtdb.firebaseio.com",
    projectId: "testes-dc53c",
    storageBucket: "testes-dc53c.appspot.com",
    messagingSenderId: "539292700874",
    appId: "1:539292700874:web:67748b8a37eab93d216433",
    measurementId: "G-Q1SS38GGJJ"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);

}

export { storage };
export default firebase;
