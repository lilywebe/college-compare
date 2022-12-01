import { startAfter } from "firebase/firestore";
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
  } else if (pageID == "allcolleges") {
    MODEL.currentPage("allcolleges", initSearchPage);
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
  // $("#home-search-form").submit(function (event) {
  //   event.preventDefault();
  //   let searchParam = $("#home-search").val();
  //   MODEL.searchColleges(searchParam);
  // });
  // let homecolleges = await MODEL.getPreSearchColleges();
  // $.each(homecolleges, async (idx, college) => {
  //   let image = await getImageFromName(college.Name);
  //   $(".colleges-container").append(`<div class="college-card">
  //   <img src="${image}" alt="" />
  //   <h3>${college.Name}</h3>
  //   <p>
  //     Funding Model: ${college.FundingModel}
  //   </p>
  //   <p>
  //     Geography: ${college.Geography}
  //   </p>
  //   <div class="college-card-buttons">
  //     <a class="dark-button" href="#">Add to Favorites</a>
  //     <a class="light-button" href="#"
  //       >Learn More <i class="fa-solid fa-arrow-right"></i
  //     ></a>
  //   </div>
  // </div>`);
  // });
}

function getFilterValues() {
  let funding = [];
  let degree = [];
  let cost = [];
  let sat = [];
  if ($("#fm1").is(":checked")) {
    funding.push($("#fm1").val());
  }
  if ($("#fm2").is(":checked")) {
    funding.push($("#fm2").val());
  }
  if ($("#hd1").is(":checked")) {
    degree.push($("#hd1").val());
  }
  if ($("#hd2").is(":checked")) {
    degree.push($("#hd2").val());
  }
  if ($("#ac1").is(":checked")) {
    cost.push($("#ac1").val());
  }
  if ($("#ac2").is(":checked")) {
    cost.push($("#ac2").val());
  }
  if ($("#ac3").is(":checked")) {
    cost.push($("#ac3").val());
  }
  if ($("#sat1").is(":checked")) {
    sat.push($("#sat1").val());
  }
  if ($("#sat2").is(":checked")) {
    sat.push($("#sat2").val());
  }
  if ($("#sat3").is(":checked")) {
    sat.push($("#sat3").val());
  }
  let checkObj = {
    funding: funding,
    degree: degree,
    cost: cost,
    sat: sat,
  };
  return checkObj;
}

async function displaySearchResults() {}

async function initSearchPage() {
  $("#search-page-form").submit(function (event) {
    event.preventDefault();
    let checkboxes = getFilterValues();
    let searchParam = $("#search-search").val();
    MODEL.searchColleges(searchParam, checkboxes, displaySearchResults);
  });
  let presearchcolleges = await MODEL.getPreSearchColleges();
  $.each(presearchcolleges, async (idx, college) => {
    let image = await getImageFromName(college.Name);
    $(".colleges-container").append(`<div class="college-card">
    <img src="${image}" alt="" />
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

async function getImageFromName(nameinput) {
  //url escape the name

  //https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=Indiana+University-Bloomington&prop=text&formatversion=2&redirects=1&format=json
  let schoolname = encodeURIComponent(nameinput);
  let data = await $.get(
    `https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=${schoolname}&prop=text&formatversion=2&redirects=1&format=json`
  ).promise();
  let images = [
    ...data.parse.text.matchAll(/<img alt="[^"]*" src="([^"]*)" [^>]*>/g),
  ];
  if (images.length == 0) {
    return false;
  } else if (images.length == 1) {
    return images[0][1];
  } else if (images.length == 2) {
    return images[1][1];
  } else {
    return images[2][1];
  }
}

window.addEventListener("DOMContentLoaded", async (event) => {
  console.log("DOM fully loaded and parsed");
});
