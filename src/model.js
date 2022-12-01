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
  getCurrentUser,
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
  writeBatch,
  deleteField,
} from "firebase/firestore";

//import { createKeywords, generateKeywords } from "./keywordgenerator";

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
      callback();
    });
  } else {
    $.get(`pages/${pageID}.html`, function (data) {
      $("#app").html(data);
      callback();
    });
  }
}
// export async function removeKeywords() {
//   const querySnapshot = await getDocs(collection(db, "colleges"));
//   querySnapshot.forEach((collegedoc) => {
//     const collegeRef = doc(db, "colleges", collegedoc.id);
//     updateDoc(collegeRef, {
//       keywords: deleteField(),
//     });
//   });
// }

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp);
const user = auth.currentUser;

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

export async function IU() {
  const collegesRef = collection(db, "colleges");
  const q = query(
    collegesRef,
    where("keywords", "array-contains", "Indiana University")
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}

export function getUserInfo() {
  return user;
}

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

//does not work
export function registerUser(newUser) {
  createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((user) => {
      // here you can use either the returned user object or       firebase.auth().currentUser. I will use the returned user object
      if (user) {
        user
          .updateProfile({
            displayName: newUser.name,
          })
          .then(console.log("user has display name"));
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

export async function getPreSearchColleges() {
  let collegesList = [];
  const collegesRef = collection(db, "colleges");

  const q = query(
    collegesRef,
    where("Name", "in", [
      "Purdue University-Main Campus",
      "Indiana University-Bloomington",
      "Indiana University-Purdue University-Indianapolis",
      "University of Indianapolis",
    ])
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    collegesList.push(doc.data());
    console.log(doc.id, " => ", doc.data());
  });

  return collegesList;
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

// export function generateKeywords(name) {
//   let keywords = new Set();
//   for (let begin = 0; begin < name.length; begin++) {
//     for (let end = begin + 1; end < name.length; end++) {
//       keywords.add(name.substring(begin, end));
//     }
//   }
//   console.log(keywords);
//   return [...keywords];
// }

// //needs rethought and should not be run until we are certain we have it correct
// export async function addKeywordstoData() {
//   const querySnapshot = await getDocs(collection(db, "colleges"));
//   querySnapshot.forEach((collegedoc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(collegedoc.id, " => ", collegedoc.data());
//     const data = collegedoc.data();
//     const name = data.Name;
//     console.log(name);
//     let keywords = generateKeywords(name);
//     const collegeRef = doc(db, "colleges", collegedoc.id);

//     updateDoc(collegeRef, {
//       keywords: keywords,
//     });
//   });
// }

export async function searchColleges(search) {
  console.log("made it to search");
  const collegesRef = collection(db, "colleges");
  const q = query(collegesRef, where("keywords", "array-contains", search));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
}
