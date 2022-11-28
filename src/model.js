import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDWTiU8sX3higW8JVXfXfEiGfy2qMDK-uM",
  authDomain: "college-772e4.firebaseapp.com",
  projectId: "college-772e4",
  storageBucket: "college-772e4.appspot.com",
  messagingSenderId: "640584460002",
  appId: "1:640584460002:web:6de22f5cb0643f1191e0bb",
  measurementId: "G-PTFJYWBZ80",
});

export function currentPage(pageID, callback) {
  if (pageID == "" || pageID == "home") {
    $.get(`pages/home.html`, function (data) {
      $("#app").html(data);
    });
  }
  callback();
}

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);

//const students = collection(db, "Students");

//const snapshot = await getDocs(students);

// detect auth state
onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("logged in");
  } else {
    console.log("No user");
  }
});

export function signInEmailPassword(em, pw) {
  signInWithEmailAndPassword(auth, em, pw)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error.message);
    });
}

export function registerEP(em, pw) {
  createUserWithEmailAndPassword(auth, em, pw)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error.message);
    });
}
export function signOutBtnFunction() {
  signOut(auth)
    .then(() => {
      console.log("you are signed out");
    })
    .catch((error) => {
      console.log(error.message);
    });
}
