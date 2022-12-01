import * as MODEL from "./model.js";

$(document).ready(function () {
  initListeners();
  //MODEL.IU();
  //getImageFromName();
  //MODEL.addKeywordstoData();
  //MODEL.addKeywordstoData();
  //MODEL.removeKeywords();
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

async function initHomeListeners() {
  $("#home-search-form").submit(function (event) {
    event.preventDefault();
    let searchParam = $("#home-search").val();
    MODEL.searchColleges(searchParam);
  });
  let homecolleges = await MODEL.getPreSearchColleges();
  $.each(homecolleges, async (idx, college) => {
    await getImageFromName(college.Name);
    $(".colleges-container").append(`<div class="college-card">
    <img src="../assets/bed.PNG" alt="" />
    <h3>${college.Name}</h3>
    <p>
      Funding Model: ${college.FundingModel}
    </p>
    <p>
      Geography: ${college.Geography}
    </p>
    <div class="college-card-buttons">
      <a class="dark-button" href="#">Add to Favorites</a>
      <a class="light-button" href="#"
        >Learn More <i class="fa-solid fa-arrow-right"></i
      ></a>
    </div>
  </div>`);
  });
}

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

function getImageFromName(nameinput) {
  //url escape the name
  let schoolname = encodeURIComponent("Indiana University");
  $.get(
    `http://en.wikipedia.org/w/api.php?action=query&origin=*&prop=pageimages&format=json&piprop=original&titles=${schoolname}`,
    function (data) {
      console.log(data);
    }
  );
}

window.addEventListener("DOMContentLoaded", async (event) => {
  console.log("DOM fully loaded and parsed");
});
