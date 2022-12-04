import { startAfter } from "firebase/firestore";
import * as MODEL from "./model.js";

$(document).ready(function () {
  addNav();
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
  addNav();
  if (pageID == "home" || pageID == "") {
    MODEL.currentPage("home", initHomeListeners);
  } else if (pageID == "login") {
    MODEL.currentPage("login", initAuthListeners);
  } else if (pageID == "logout") {
    MODEL.currentPage("logout", initAuthListeners);
  } else if (pageID == "allcolleges") {
    MODEL.currentPage("allcolleges", initSearchPage);
  } else if (pageID.includes("indcollege_")) {
    MODEL.currentPage(pageID, initIndCollegePage);
  } else if (pageID.includes("allcolleges_")) {
    MODEL.currentPage(pageID, initSearchPage);
  } else if (pageID.includes("editaccount")) {
    MODEL.currentPage(pageID, initEditAccount);
  } else if (pageID.includes("profile")) {
    MODEL.currentPage(pageID, initProfilePage);
  } else if (pageID.includes("comparecolleges")) {
    MODEL.currentPage(pageID, initCompareColleges);
  } else {
    MODEL.currentPage(pageID, () => {});
  }
}

function getUserInfo() {
  return MODEL.getUserInfo();
}
async function addNav() {
  let user = getUserInfo();

  if (user) {
    $("nav").html(`<div class="logo">
    <a href="#home"><img src="assets/logo.png" alt="" /></a>
  </div>
  <div class="links">
    <a href="#allcolleges">Search Colleges</a>
    <a href="#comparecolleges">Compare Colleges</a>
    <a href="#favorites">My Colleges</a>
    <a href="#profile">My Profile</a>
    <a id="logout-button" href="#logout">Logout</a>
  </div>`);
  } else {
    $("nav").html(` 
    <div class="logo">
      <a href="#home"><img src="assets/logo.png" alt="" /></a>
    </div>
    <div class="links">
      <a href="#allcolleges">Search Colleges</a>
      <a href="#comparecolleges">Compare Colleges</a>
      <a href="#favorites">My Colleges</a>
      <a href="#profile">My Profile</a>
      <a id="login-button" href="#login">Login</a>
    </div>
  `);
  }
}

async function initListeners() {
  $(window).on("hashchange", changeRoute);
  changeRoute();
  //var signOutBtn = document.getElementById("signOut");
  //signOutBtn.addEventListener("click", MODEL.signOutBtnFunction);
}

async function initCompareColleges() {
  $("#left-compare-form").submit((event) => {
    if (event) {
      event.preventDefault();
    }
    let searchParam = $("#left-search").val();
    MODEL.searchColleges(searchParam, null, displayCompareResults);
  });
  $("#right-compare-form").submit((event) => {
    if (event) {
      event.preventDefault();
    }
    let searchParam = $("#right-search").val();
    MODEL.searchColleges(searchParam, null, displayCompareResults);
  });
}

async function displayCompareResults() {}

async function initProfilePage() {
  let user = getUserInfo();
  $(".account-info").append(`<div class="name">
  <h3>Display Name:</h3>
  <p>${user.displayName}</p>
</div>
<div class="Email">
  <h3>Email</h3>
  <p>${user.email}</p>
</div>
  <a href="#editaccount">edit account info</a>
  `);
}

async function handleHometoSearch(searchParam) {
  let newSearchParam = encodeURIComponent(searchParam);
  routeTo(`allcolleges_${newSearchParam}`);
}

async function initHomeListeners() {
  $("#home-search-form").submit(function (event) {
    event.preventDefault();
    let searchParam = $("#home-search").val();

    handleHometoSearch(searchParam);
  });
  let homecolleges = await MODEL.getPreSearchColleges();
  $.each(homecolleges, async (idx, college) => {
    let collegeid = college.collegeid;
    let collegedata = college.collegedata;
    let image = await getImageFromName(collegedata.Name);
    $(".colleges-container").append(`<div class="college-card">
    <img src="${image}" alt="" />
    <h3>${collegedata.Name}</h3>
    <p>
      Funding Model: ${collegedata.FundingModel}
    </p>
    <p>
      Geography: ${collegedata.Geography}
    </p>
    <div class="college-card-buttons">
      <a class="dark-button" href="#">Add to Favorites</a>
      <a class="light-button" href="#indcollege_${collegeid}"
        >Learn More <i class="fa-solid fa-arrow-right"></i
      ></a>
    </div>
  </div>`);
  });
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

async function initIndCollegePage(collegeid) {
  let college = await MODEL.getSingleCollege(collegeid);
  let image = await getImageFromName(college.Name);
  $(".ind-college-page").html(`
  <div class="image-name-side">
    <div class="name-button">
      <h2>${college.Name}</h2>
      <a href="#"><i class="fa-regular fa-heart"></i></a>
    </div>
    <img src="${image}" alt="">
  </div>
  <div class="college-info-side">
    <div class="admission">
      <h3>Admission Rate:</h3>
      <p>${college.AdmissionRate}</p>
    </div>
    <div class="funding">
      <h3>Funding Model:</h3>
      <p>${college.FundingModel}</p>
    </div>
    <div class="geography">
      <h3>Geography:</h3>
      <p>${college.Geography}</p>
    </div>
    <div class="region">
      <h3>Region:</h3>
      <p>${college.Region}</p>
    </div>
    <div class="predegree">
      <h3>Predominant Degree:</h3>
      <p>${college.PredominantDegree}</p>
    </div>
    <div class="highdegree">
      <h3>Highest Degree Offered:</h3>
      <p>${college.HighestDegree}</p>
    </div>
    <div class="avgcost">
      <h3>Average Cost:</h3>
      <p>${college.AverageCost}</p>
    </div>
    <div class="avgsat">
      <h3>Average SAT:</h3>
      <p>${college.SATAverage}</p>
    </div>
    <div class="avgact">
      <h3>Median ACT:</h3>
      <p>${college.ACTMedian}</p>
    </div>
  </div>`);
}

function initSearchListeners() {}

async function displaySearchResults(searchResults) {
  $(".colleges-container").html("");
  $.each(searchResults, async (idx, college) => {
    let collegedata = college.data();
    let collegeid = college.id;
    let image = await getImageFromName(collegedata.Name);
    $(".colleges-container").append(`<div class="college-card">
    <img src="${image}" alt="" />
    <h3>${collegedata.Name}</h3>
    <p>
      Funding Model: ${collegedata.FundingModel}
    </p>
    <p>
      Geography: ${collegedata.Geography}
    </p>
    <div class="college-card-buttons">
      <a class="dark-button" href="#">Add to Favorites</a>
      <a class="light-button" href="#indcollege_${collegeid}"
        >Learn More <i class="fa-solid fa-arrow-right"></i
      ></a>
    </div>
  </div>`);
  });
}
function routeTo(routeloc) {
  window.location.hash = `#${routeloc}`;
}

async function initSearchPage(searchTerm) {
  let searchFunc = function (event) {
    if (event) {
      event.preventDefault();
    }
    let checkboxes = getFilterValues();
    let searchParam = $("#search-search").val();
    MODEL.searchColleges(searchParam, checkboxes, displaySearchResults);
  };
  $("#search-page-form").submit(searchFunc);

  if (searchTerm !== "") {
    $("#search-search").val(searchTerm);
    searchFunc();
  } else {
    let presearchcolleges = await MODEL.getPreSearchColleges();
    $.each(presearchcolleges, async (idx, college) => {
      let collegeid = college.collegeid;
      let collegedata = college.collegedata;
      let image = await getImageFromName(collegedata.Name);
      $(".colleges-container").append(`<div class="college-card">
    <img src="${image}" alt="" />
    <h3>${collegedata.Name}</h3>
    <p>
      Funding Model: ${collegedata.FundingModel}
    </p>
    <p>
      Geography: ${collegedata.Geography}
    </p>
    <div class="college-card-buttons">
      <a class="dark-button" href="#">Add to Favorites</a>
      <a class="light-button" href="#indcollege_${collegeid}"
        >Learn More <i class="fa-solid fa-arrow-right"></i
      ></a>
    </div>
  </div>`);
    });
  }
}

async function initEditAccount() {
  let currentuser = getUserInfo();
  let userObj = {
    name: "",
    email: "",
    password: "",
  };

  const { value: password } = await Swal.fire({
    title: "Enter your password",
    input: "password",
    inputLabel: "Password",
    inputPlaceholder: "Enter your password",
    inputAttributes: {
      maxlength: 30,
      autocapitalize: "off",
      autocorrect: "off",
    },
  });

  if (password) {
    console.log(password);

    $(".sign-in-side")
      .append(`<input id="s-name" type="text" value="${currentuser.displayName}" />
  <input id="s-email" type="text" value="${currentuser.email}" />
  <input id="s-pass" type="password" value="${password}" />
  <button id="saveedits">apply changes</button>`);

    $("#saveedits").on("click", async () => {
      userObj.name = $("#s-name").val();
      userObj.email = $("#s-email").val();
      userObj.password = $("#s-pass").val();

      console.log(userObj);

      await MODEL.updateUserInfo(userObj, password);
      routeTo("profile");
    });
  }
}

function initAuthListeners() {
  // var register = document.getElementById("register");
  // register.addEventListener("click", registerUser);

  $("#register").on("click", async () => {
    await registerUser();
    routeTo("home");
  });
  $("#signin").on("click", async () => {
    await signInUser();
    routeTo("home");
  });
  $("#logout").on("click", async () => {
    await signOutUser();
    routeTo("home");
  });
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
  await MODEL.registerEP(user);
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

//src stackoverflow lol
function getHashFromString(text) {
  var hash = 0,
    i,
    chr;
  if (text.length === 0) return hash;
  for (i = 0; i < text.length; i++) {
    chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  hash = Math.abs(hash);
  return hash.toString(16);
}

async function getImageFromName(nameinput) {
  //url escape the name

  //https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=Indiana+University-Bloomington&prop=text&formatversion=2&redirects=1&format=json
  let schoolname = encodeURIComponent(nameinput);
  let schoolhash = getHashFromString(schoolname);
  let gravatar = `https://www.gravatar.com/avatar/${schoolhash}?d=identicon`;
  let data = await $.get(
    `https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=${schoolname}&prop=text&formatversion=2&redirects=1&format=json`
  ).promise();
  if (data && data.parse && data.parse.text) {
    let rawimages = [
      ...data.parse.text.matchAll(/<img alt="[^"]*" src="([^"]*)" [^>]*>/g),
    ];
    let images = [];
    $.each(rawimages, (idx, raw) => {
      if (
        raw[1].includes("UI_icon") ||
        raw[1].includes("Edit-clear") ||
        raw[1].includes("Question_book") ||
        raw[1].includes("Disambig") ||
        raw[1].includes("Commons-logo.svg") ||
        raw[1].includes("Wiki_logo") ||
        raw[1].includes("Loudspeaker") ||
        raw[1].includes("Red_pog") ||
        raw[1].includes("Diploma_icon") ||
        raw[1].includes("Unbalanced_scales") ||
        raw[1].includes("Ambox_") ||
        raw[1].includes("Wiki_letter")
      ) {
      } else {
        images.push(raw[1]);
      }
    });
    if (images.length == 0) {
      return gravatar;
    } else if (images.length == 1) {
      return images[0];
    } else if (images.length == 2) {
      return images[1];
    } else {
      return images[2];
    }
  } else {
    return gravatar;
  }
}

window.addEventListener("DOMContentLoaded", async (event) => {
  console.log("DOM fully loaded and parsed");
});
