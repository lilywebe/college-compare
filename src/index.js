import * as MODEL from "./model.js";

$(document).ready(function () {
  initListeners();
});

function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  //   console.log(hashTag + ' ' + pageID);

  if (pageID == "home" || pageID == "") {
    MODEL.currentPage("home", initHomeListeners);
  } else if (pageID == "login") {
    MODEL.currentPage("login", initAuthListeners);
  } else {
    MODEL.currentPage(pageID);
  }
}

function getUserInfo() {
  return MODEL.getUserInfo();
}

async function initListeners() {
  $(window).on("hashchange", changeRoute);
  changeRoute();
  //var signOutBtn = document.getElementById("signOut");
  //signOutBtn.addEventListener("click", MODEL.signOutBtnFunction);
}

function initHomeListeners() {}

function initAuthListeners() {
  // var register = document.getElementById("register");
  // register.addEventListener("click", registerUser);

  $("#register").on("click", registerUser);
  $("#signin").on("click", signInUser);
  //$("#logout").on("click", signOutUser);
}

async function registerUser() {
  let em = document.getElementById("s-email").value;
  let pw = document.getElementById("s-pass").value;
  let name = document.getElementById("s-name").value;

  let user = {
    name: name,
    email: em,
    password: pw,
  };
  await MODEL.registerUser(user);
  document.getElementById("s-email").value = "";
  document.getElementById("s-pass").value = "";
}

async function signInUser() {
  let em = document.getElementById("l-email").value;
  let pw = document.getElementById("l-pass").value;
  await MODEL.signInEmailPassword(em, pw);
  document.getElementById("l-email").value = "";
  document.getElementById("l-pass").value = "";
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
