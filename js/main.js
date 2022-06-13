(function ($) {
  /*------------------
        Preloader
    --------------------*/
  $(window).on("load", function () {
    $(".loader").fadeOut();
    $("#preloder").delay(200).fadeOut("slow");

    /*------------------
            Filter
        --------------------*/
    $(".filter__controls li").on("click", function () {
      $(".filter__controls li").removeClass("active");
      $(this).addClass("active");
    });
    if ($(".filter__gallery").length > 0) {
      var containerEl = document.querySelector(".filter__gallery");
      var mixer = mixitup(containerEl);
    }
  });

  /*------------------
        Background Set
    --------------------*/
  $(".set-bg").each(function () {
    var bg = $(this).data("setbg");
    $(this).css("background-image", "url(" + bg + ")");
  });

  /*------------------
		Navigation
	--------------------*/
  $(".mobile-menu").slicknav({
    prependTo: "#mobile-menu-wrap",
    allowParentLinks: true,
  });

  /*------------------
        Scroll To Top
    --------------------*/
  $("#scrollToTopButton").click(function () {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });
})(jQuery);

/*------------------
        Splide
    --------------------*/
function refreshSlider() {
  new Splide(".splide", {
    type: "loop",
    autoplay: true,
    fixedWidth: "250px",
    // width: 500,
    fixedHeight: "250px",
    gap: 20,
    rewind: false,
    pagination: false,
    // cover: true,
    lazyLoad: "nearby",
    focus: "center",
  }).mount();
}

/*------------------
      Avatar Dropdown Menu
    --------------------*/
document.getElementById("avatar-sidebar").onclick = function () {
  avatarDropdownMenu();
};
function avatarDropdownMenu() {
  document.getElementById("sideBarList").classList.toggle("show");
}
document.onclick = function (e) {
  if (e.target.id !== "avatar-sidebar") {
    document.getElementById("sideBarList").classList.remove("show");
  }
};



