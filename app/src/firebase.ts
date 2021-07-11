import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

var firebaseConfig = {
  apiKey: "AIzaSyBhA1cwBW3DGDotksHn4HuB6ELeqP8vZp8",
  authDomain: "yaytso.firebaseapp.com",
  projectId: "yaytso",
  storageBucket: "yaytso.appspot.com",
  messagingSenderId: "508100650317",
  appId: "1:508100650317:web:90233dfaea85f4b56e0304",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const CARTONS = "CARTONS";

export { CARTONS };
export { db };
