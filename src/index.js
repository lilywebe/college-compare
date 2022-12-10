import { startAfter } from "firebase/firestore";
import * as MODEL from "./model.js";

$(document).ready(function () {
  initListeners();
  MODEL.registerOnAuthStateChanged(addNavandFooter);
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
  } else if (pageID.includes("favorites")) {
    MODEL.currentPage(pageID, initFavoritesPage);
  } else if (pageID.includes("usercolleges")) {
    MODEL.currentPage(pageID, initUserColleges);
  } else if (pageID.includes("addcollege")) {
    MODEL.currentPage(pageID, initAddCollegePage);
  } else if (pageID.includes("updatecollege_")) {
    MODEL.currentPage(pageID, initUpdateUserCollege);
  } else if (pageID.includes("shouldnotbehere")) {
    MODEL.currentPage(pageID, initNotLoggedIn);
  } else {
    MODEL.currentPage(pageID, () => {});
  }
}

function getUserInfo() {
  return MODEL.getUserInfo();
}

function initNotLoggedIn() {
  $(".not-logged-in").html(`
  <h2>Hmm.... I don't think you're supposed to be here yet..</h2>
  <h3>You should log in!</h3>
  <a id="login-button" href="#login">Login</a>

  `);
}

async function addNavandFooter() {
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
    $("footer").html(
      `<div class="footer-container">
        <div class="logo">
          <a href="#home"> <img src="assets/logo.png" alt="" /></a>
        </div>
        <div class="links">
          <a href="#allcolleges">Search Colleges</a>
          <a href="#comparecolleges">Compare Colleges</a>
          <a href="#favorites">My Colleges</a>
          <a href="#profile">My Profile</a>
        </div>
      </div>`
    );
  } else {
    $("nav").html(` 
    <div class="logo">
      <a href="#home"><img src="assets/logo.png" alt="" /></a>
    </div>
    <div class="links">
      <a href="#allcolleges">Search Colleges</a>
      <a href="#comparecolleges">Compare Colleges</a>
      
      <a id="login-button" href="#login">Login</a>
    </div>
  `);
    $("footer").html(`<div class="footer-container">
        <div class="logo">
          <a href="#home"> <img src="assets/logo.png" alt="" /></a>
        </div>
        <div class="links">
          <a href="#allcolleges">Search Colleges</a>
          <a href="#comparecolleges">Compare Colleges</a>
          
        </div>
      </div>`);
  }
}

async function initListeners() {
  $(window).on("hashchange", changeRoute);
  changeRoute();
  //var signOutBtn = document.getElementById("signOut");
  //signOutBtn.addEventListener("click", MODEL.signOutBtnFunction);
}

async function initAddCollegePage() {
  let collegeObj = {};
  $("#add-user-college").on("click", async () => {
    collegeObj.name = $("#name").val();
    collegeObj.act = $("#act").val();
    collegeObj.adm = $("#adm").val();
    collegeObj.age = $("#age").val();
    collegeObj.cost = $("#cost").val();
    collegeObj.sal = $("#sal").val();
    collegeObj.exp = $("#exp").val();
    collegeObj.fm = $("#fm").val();
    collegeObj.geo = $("#geo").val();
    collegeObj.high = $("#high").val();
    collegeObj.debt = $("#debt").val();
    collegeObj.earn = $("#earn").val();
    collegeObj.inc = $("#fam").val();
    collegeObj.pre = $("#pre").val();
    collegeObj.sat = $("#sat").val();
    collegeObj.reg = $("#reg").val();
    if (collegeObj.name !== "" && collegeObj.fm && collegeObj.geo !== "") {
      let success = await MODEL.addUserCollege(collegeObj);
      if (success) {
        Swal.fire("Nice!", `You added ${collegeObj.name}! `, "success");
        routeTo("usercolleges");
      } else {
        Swal.fire(
          "Oops!",
          `You need to be signed in to add ${collegeObj.name}! `,
          "error"
        );
      }
    } else {
      Swal.fire(
        "Oops!",
        `At a minimum, your college needs a name, funding model and geography.`,
        "error"
      );
    }
  });
}

async function initUpdateUserCollege(collegeid) {
  let collegePreLoad = await MODEL.getSingleUserCollege(collegeid);
  let collegedata = collegePreLoad.data();

  $("#name").val(collegedata.Name);
  $("#act").val(collegedata.ACTMedian);
  $("#adm").val(collegedata.AdmissionRate);
  $("#age").val(collegedata.AverageAgeofEntry);
  $("#cost").val(collegedata.AverageCost);
  $("#sal").val(collegedata.AverageFacultySalary);
  $("#exp").val(collegedata.Expenditure);
  $("#fm").val(collegedata.FundingModel);
  $("#geo").val(collegedata.Geography);
  $("#high").val(collegedata.HighestDegree);
  $("#debt").val(collegedata.MedianDebt);
  $("#earn").val(collegedata.MedianEarnings);
  $("#fam").val(collegedata.MedianFamilyIncome);
  $("#pre").val(collegedata.PredominantDegree);
  $("#sat").val(collegedata.SATAverage);
  $("#reg").val(collegedata.Region);

  $("#update-user-college").on("click", async (idx, college) => {
    let collegeObj = {
      id: collegeid,
      name: $("#name").val(),
      act: $("#act").val(),
      adm: $("#adm").val(),
      age: $("#age").val(),
      cost: $("#cost").val(),
      sal: $("#sal").val(),
      exp: $("#exp").val(),
      fm: $("#fm").val(),
      geo: $("#geo").val(),
      high: $("#high").val(),
      debt: $("#debt").val(),
      earn: $("#earn").val(),
      inc: $("#fam").val(),
      pre: $("#pre").val(),
      sat: $("#sat").val(),
      reg: $("#reg").val(),
    };
    if (await MODEL.updateUserCollege(collegeObj)) {
      Swal.fire("Nice!", `You updated ${collegeObj.name}! `, "success");
      routeTo("usercolleges");
    } else {
      Swal.fire(
        "Oops!",
        `You need to be signed in to update ${collegeObj.name}! `,
        "error"
      );
    }
  });
}

async function initUserColleges() {
  let colleges = await MODEL.getUserColleges();

  $(".colleges-container").html("");
  $.each(colleges, async (idx, college) => {
    let collegeid = college.id;
    let collegedata = college.data();
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
      <button class="dark-button" id="remove-college-${collegeid}">Delete</button>
      <a class="light-button" href="#updatecollege_${collegeid}">Update</a>
      <a class="light-button" href="#indcollege_${collegeid}"
        >Learn More <i class="fa-solid fa-arrow-right"></i
      ></a>
    </div>
  </div>`);
    $(`#remove-college-${collegeid}`).on("click", async () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#900C3F",
        cancelButtonColor: "#152238",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          MODEL.removeFromUserColleges(collegeid, initUserColleges);
          Swal.fire("Deleted!", "Your college has been deleted.", "success");
        }
      });
    });
  });
}

async function initFavoritesPage() {
  let user = getUserInfo();
  if (user) {
    let colleges = await MODEL.getUserFavorites();
    $(".colleges-container").html("");

    $.each(colleges, async (idx, college) => {
      let collegeid = college.id;
      let collegedata = college.data;
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
      <button class="dark-button" id="remove-fav-${collegeid}">Remove from Favorites</button>
      <a class="light-button" href="#indcollege_${collegeid}"
        >Learn More <i class="fa-solid fa-arrow-right"></i
      ></a>
    </div>
  </div>`);
      $(`#remove-fav-${collegeid}`).on("click", async () => {
        Swal.fire({
          title: "Are you sure?",

          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, remove from favorites!",
        }).then((result) => {
          if (result.isConfirmed) {
            MODEL.removeFromFavorites(collegeid, initFavoritesPage);
            Swal.fire(
              "Deleted!",
              `${collegedata.Name} has been removed from your favorites list.`,
              "success"
            );
          }
        });
      });
    });
  } else {
    routeTo("shouldnotbehere");
  }
}

async function initCompareColleges() {
  $("#left-compare-form").submit((event) => {
    if (event) {
      event.preventDefault();
    }
    let searchParam = $("#left-search").val();
    MODEL.searchColleges(searchParam, "left", displayCompareResults);
  });
  $("#right-compare-form").submit((event) => {
    if (event) {
      event.preventDefault();
    }
    let searchParam = $("#right-search").val();
    MODEL.searchColleges(searchParam, "right", displayCompareResults);
  });
}

async function displayCompareResults(searchResults, sideOfPage) {
  console.log(sideOfPage);
  if (sideOfPage == "right") {
    $("#right-names").html(
      `<option value="none" selected disabled hidden>Select an Option</option>`
    );
    $.each(searchResults, (idx, result) => {
      $("#right-names").append(
        `<option value="${result.id}">${result.data().Name}</option>`
      );
    });
  } else {
    $("#left-names").html(
      `<option value="none" selected disabled hidden>Select an Option</option>`
    );

    $.each(searchResults, (idx, result) => {
      $("#left-names").append(
        `<option value="${result.id}">${result.data().Name}</option>`
      );
    });
  }
  $("#left-names").on("change", async function (e) {
    if (await MODEL.getSingleCollege(this.value)) {
      var college = await MODEL.getSingleCollege(this.value);
    } else {
      var college = await MODEL.getSingleUserCollege(this.value);
    }
    displayCompareColleges(college, "left");
  });
  $("#right-names").on("change", async function (e) {
    if (await MODEL.getSingleCollege(this.value)) {
      var college = await MODEL.getSingleCollege(this.value);
    } else {
      var college = await MODEL.getSingleUserCollege(this.value);
    }
    displayCompareColleges(college, "right");
  });
}

async function displayCompareColleges(wholecollegedoc, sideOfPage) {
  let college = wholecollegedoc.data();
  let collegeid = wholecollegedoc.id;
  let admissionrate = college.AdmissionRate * 100;
  $(`#${sideOfPage}-name-fav`)
    .html(`<h3 id="${sideOfPage}-side-name">${college.Name}</h3>
  <button id ="fav-${collegeid}"><i class="fa-regular fa-heart"></i></button>`);
  $(`#adr-${sideOfPage}`).html(`${admissionrate.toFixed(2)}%`);
  $(`#fm-${sideOfPage}`).html(college.FundingModel);
  $(`#geo-${sideOfPage}`).html(college.Geography);
  $(`#reg-${sideOfPage}`).html(college.Region);
  $(`#pre-${sideOfPage}`).html(college.PredominantDegree);
  $(`#high-${sideOfPage}`).html(college.HighestDegree);
  $(`#cost-${sideOfPage}`).html(`$${college.AverageCost}`);
  $(`#sat-${sideOfPage}`).html(college.SATAverage);
  $(`#act-${sideOfPage}`).html(college.ACTMedian);

  $(`#fav-${collegeid}`).on("click", async () => {
    let success = await MODEL.addToFavorites(collegeid);
    if (success == true) {
      Swal.fire(
        "Nice!",
        `You added ${college.Name} to your favorites! `,
        "success"
      );
    } else if (success == "already added") {
      Swal.fire(
        "Oops!",
        `You already added ${collegedata.Name} to your favorites! `,
        "error"
      );
    } else {
      Swal.fire(
        "Oops!",
        `You need to be signed in to add ${college.Name} to your favorites! `,
        "error"
      );
    }
  });
}

async function initProfilePage() {
  let user = getUserInfo();
  if (user) {
    $("#name-greeting").html(`hey ${user.displayName}!`);
    $(".account-info").append(`<div class="name">
  <h3>display name:</h3>
  <p>${user.displayName}</p>
</div>
<div class="Email">
  <h3>email :</h3>
  <p>${user.email}</p>
</div>
  <a class="dark-button" href="#editaccount">edit account info</a>
  `);
    let usercolleges = await MODEL.getUserColleges();
    $.each(usercolleges, (idx, college) => {
      $(".profile-colleges").append(`<p>${college.data().Name}</p>`);
    });
    $(".profile-colleges").append(
      `<a class="dark-button" href="#usercolleges">view all</a>`
    );
  } else {
    routeTo("shouldnotbehere");
  }
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
      <button class="dark-button" id="fav-${collegeid}">Add to Favorites</button>
      <a class="light-button" href="#indcollege_${collegeid}"
        >Learn More <i class="fa-solid fa-arrow-right"></i
      ></a>
    </div>
  </div>`);

    $(`#fav-${collegeid}`).on("click", async () => {
      let success = await MODEL.addToFavorites(collegeid);
      if (success == true) {
        Swal.fire(
          "Nice!",
          `You added ${collegedata.Name} to your favorites! `,
          "success"
        );
      } else if (success == "already added") {
        Swal.fire(
          "Oops!",
          `You already added ${collegedata.Name} to your favorites! `,
          "error"
        );
      } else {
        Swal.fire(
          "Oops!",
          `You need to be signed in to add ${collegedata.Name} to your favorites! `,
          "error"
        );
      }
    });
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
  if (await MODEL.getSingleCollege(collegeid)) {
    var wholecollegedoc = await MODEL.getSingleCollege(collegeid);
  } else {
    var wholecollegedoc = await MODEL.getSingleUserCollege(collegeid);
  }
  console.log(wholecollegedoc);

  let college = wholecollegedoc.data();
  let admissionrate = college.AdmissionRate * 100;
  let image = await getImageFromName(college.Name);
  $(".ind-college-page").html(`
  <div class="image-name-side">
    <div class="name-button">
      <h2>${college.Name}</h2>
      <button id ="fav-${collegeid}"><i class="fa-regular fa-heart"></i></button>
    </div>
    <img src="${image}" alt="">
  </div>
  <div class="college-info-side">
    <div class="admission">
      <h3>Admission Rate:</h3>
      <p>${admissionrate.toFixed(2)}%</p>
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
      <p>$${college.AverageCost}</p>
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
  $(`#fav-${collegeid}`).on("click", async () => {
    let success = await MODEL.addToFavorites(collegeid);
    if (success == true) {
      Swal.fire(
        "Nice!",
        `You added ${college.Name} to your favorites! `,
        "success"
      );
    } else if (success == "already added") {
      Swal.fire(
        "Oops!",
        `You already added ${college.Name} to your favorites! `,
        "error"
      );
    } else {
      Swal.fire(
        "Oops!",
        `You need to be signed in to add ${college.Name} to your favorites! `,
        "error"
      );
    }
  });
}

function initSearchListeners() {}

async function displaySearchResults(searchResults, checkboxes) {
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
    <button id ="fav-${collegeid}"><i class="fa-regular fa-heart"></i></button>
      <a class="light-button" href="#indcollege_${collegeid}"
        >Learn More <i class="fa-solid fa-arrow-right"></i
      ></a>
    </div>
  </div>`);
    $(`#fav-${collegeid}`).on("click", async () => {
      let success = await MODEL.addToFavorites(collegeid);
      if (success == true) {
        Swal.fire(
          "Nice!",
          `You added ${collegedata.Name} to your favorites! `,
          "success"
        );
      } else if (success == "already added") {
        Swal.fire(
          "Oops!",
          `You already added ${collegedata.Name} to your favorites! `,
          "error"
        );
      } else {
        Swal.fire(
          "Oops!",
          `You need to be signed in to add ${collegedata.Name} to your favorites! `,
          "error"
        );
      }
    });
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
    <button id ="fav-${collegeid}"><i class="fa-regular fa-heart"></i></button>
      <a class="light-button" href="#indcollege_${collegeid}"
        >Learn More <i class="fa-solid fa-arrow-right"></i
      ></a>
    </div>
  </div>`);
      $(`#fav-${collegeid}`).on("click", async () => {
        let success = await MODEL.addToFavorites(collegeid);
        if (success == true) {
          Swal.fire(
            "Nice!",
            `You added ${collegedata.Name} to your favorites! `,
            "success"
          );
        } else if (success == "already added") {
          Swal.fire(
            "Oops!",
            `You already added ${collegedata.Name} to your favorites! `,
            "error"
          );
        } else {
          Swal.fire(
            "Oops!",
            `You need to be signed in to add ${collegedata.Name} to your favorites! `,
            "error"
          );
        }
      });
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
  <button class="dark-button" id="saveedits">apply changes</button>`);

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
