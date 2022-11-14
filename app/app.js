function initListeners() {
  console.log("ready");
}

$(document).ready(function () {
  initListeners();
  initURLListener();
});

function changeRoute() {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace("#", "");
  //   console.log(hashTag + ' ' + pageID);

  if (pageID != "") {
    $.get(`pages/pageID.html`, function (data) {
      console.log("data " + data);
      $("#app").html(data);
    });
  } else {
    $.get(`pages/home.html`, function (data) {
      console.log("data " + data);
      $("#app").html(data);
    });
  }
}

function initURLListener() {
  $(window).on("hashchange", changeRoute);
  changeRoute();
}
