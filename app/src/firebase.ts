import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";

const firebaseConfig = require("firebase.json");

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const CARTONS = "CARTONS";

export { CARTONS };
export { db };
