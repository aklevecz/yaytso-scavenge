import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const firebaseConfig = require("./firebase-config.json");

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

const CARTONS = "CARTONS";
const YAYTSO = "YAYTSOS";

export { CARTONS };
export { auth, db };
