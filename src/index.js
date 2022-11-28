import * as MODEL from "./model.js";

$(document).ready(function () {
  initListeners();
});

function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  //   console.log(hashTag + ' ' + pageID);

  if (pageID != "") {
    $.get(`pages/${pageID}.html`, function (data) {
      console.log("data " + data);
      $("#app").html(data);
    });
  } else {
    MODEL.currentPage("home", initAuthListeners);
  }
}

async function initListeners() {
  $(window).on("hashchange", changeRoute);
  changeRoute();
  //var signOutBtn = document.getElementById("signOut");
  //signOutBtn.addEventListener("click", MODEL.signOutBtnFunction);
}

function initAuthListeners() {
  var register = document.getElementById("register");
  register.addEventListener("click", registerUser);
  var signin = document.getElementById("signin");
  signin.addEventListener("click", signInUser);
  var signout = document.getElementById("logout");
  signout.addEventListener("click", signOutUser);
}

async function registerUser() {
  let em = document.getElementById("email").value;
  let pw = document.getElementById("pw").value;
  await MODEL.registerEP(em, pw);
  document.getElementById("email").value = "";
  document.getElementById("pw").value = "";
}

async function signInUser() {
  let em = document.getElementById("email").value;
  let pw = document.getElementById("pw").value;
  await MODEL.signInEmailPassword(em, pw);
  document.getElementById("email").value = "";
  document.getElementById("pw").value = "";
}

function signOutUser() {
  MODEL.signOutBtnFunction();
}

// function getImageFromName() {
//   $.get(
//     "http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=Tailor",
//     function (data) {
//       $(".result").html(data);
//       alert("Load was performed.");
//     }
//   );
// }
