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
  updateProfile,
  userCredential,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
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
  limit,
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
  console.log(pageID);
  if (pageID == "" || pageID == "home") {
    $.get(`pages/home.html`, function (data) {
      $("#app").html(data);
      callback("");
    });
  } else if (pageID.includes("_")) {
    let collegeid = decodeURIComponent(
      pageID.substring(pageID.indexOf("_") + 1)
    );
    let pageName = pageID.substring(0, pageID.indexOf("_"));
    $.get(`pages/${pageName}.html`, function (data) {
      $("#app").html(data);
      callback(collegeid);
    });
  } else {
    $.get(`pages/${pageID}.html`, function (data) {
      $("#app").html(data);
      callback("");
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
  if (user) {
    console.log("logged in");
  } else {
    console.log("No user");
  }
});

export async function updateUserInfo(userObj, oldPass) {
  const auth = getAuth();
  const credential = EmailAuthProvider.credential(
    auth.currentUser.email,
    oldPass
  );
  const result = await reauthenticateWithCredential(
    auth.currentUser,
    credential
  );
  console.log(result);

  updateProfile(auth.currentUser, {
    displayName: userObj.name,
  });

  updateEmail(auth.currentUser, userObj.email);

  updatePassword(auth.currentUser, userObj.password);
}

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
  return auth.currentUser;
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
      "Purdue University",
      "Indiana University-Bloomington",
      "Indiana University-Purdue University-Indianapolis",
      "University of Indianapolis",
    ])
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    collegesList.push({
      collegeid: doc.id,
      collegedata: doc.data(),
    });
    console.log(doc.id, " => ", doc.data());
  });

  return collegesList;
}

export async function registerEP(userObj) {
  await createUserWithEmailAndPassword(auth, userObj.email, userObj.password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      console.log(error.message);
    });
  await updateProfile(auth.currentUser, {
    displayName: userObj.name,
  })
    .then(() => {
      const user = auth.currentUser;
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

export async function searchColleges(search, checkboxes, callback) {
  console.log("made it to search");
  let searchResultsList = [];
  const collegesRef = collection(db, "colleges");
  const q = query(
    collegesRef,
    where("keywords", "array-contains", search),
    limit(50)
  );

  const querySnapshot = await getDocs(q);
  if (checkboxes && checkboxes !== "left" && checkboxes !== "right") {
    querySnapshot.forEach((doc) => {
      if (checkboxes.funding.includes(doc.data().FundingModel)) {
        if (checkboxes.degree.includes(doc.data().HighestDegree)) {
          let costlevel = "";
          if (doc.data().AverageCost < 25000) {
            costlevel = "low";
          } else if (
            doc.data().AverageCost >= 25000 &&
            doc.data().AverageCost <= 45000
          ) {
            costlevel = "medium";
          } else {
            costlevel = "high";
          }

          if (checkboxes.cost.includes(costlevel)) {
            let sat = "";
            if (doc.data().SATAverage < 1000) {
              sat = "low";
            } else if (
              doc.data().SATAverage >= 1000 &&
              doc.data().SATAverage <= 1200
            ) {
              sat = "medium";
            } else {
              sat = "high";
            }
            if (checkboxes.sat.includes(sat)) {
              searchResultsList.push(doc);
            }
          }
        }
      }
    });
  } else {
    querySnapshot.forEach((doc) => {
      searchResultsList.push(doc);
    });
  }

  console.log(searchResultsList);
  callback(searchResultsList, checkboxes);
}

export async function addToFavorites(collegeid) {
  const user = auth.currentUser;
  if (user) {
    const docRef = await addDoc(collection(db, "favorites"), {
      user: user.uid,
      college: collegeid,
    });
    return true;
  } else {
    return false;
  }
}

export async function getSingleCollege(collegeid) {
  console.log(collegeid);
  const docRef = doc(db, "colleges", collegeid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    console.log(docSnap);
    return docSnap;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

export async function getUserFavorites() {
  const user = auth.currentUser;
  if (user) {
    console.log("is user");
    let favoritesList = [];
    const favoritesRef = collection(db, "favorites");

    const q = query(favoritesRef, where("user", "==", user.uid));

    const querySnapshot = await getDocs(q);
    for (const doc of querySnapshot.docs) {
      let college = await getSingleCollege(doc.data().college);

      favoritesList.push({
        id: doc.data().college,
        data: college.data(),
      });
    }
    return favoritesList;
  }
  return false;
}

export async function removeFromFavorites(collegeid) {
  const user = auth.currentUser;
  var q = db
    .collection("favorites")
    .where("college", "==", collegeid)
    .where("user", "==", user.uid);
  q.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      doc.ref.delete();
    });
  });
}

// export async function getAllColleges() {
//   const snapshot = await firebase.firestore().collection("colleges").get();
//   return snapshot.docs.map((doc) => {
//     return { docid: doc.id, docdata: doc.data() };
//   });
// }
