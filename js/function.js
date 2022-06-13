includeJS("js/alert.js");
includeJS("js/helper.js");

function includeJS(incFile) {
  document.write(
    '<script type="text/javascript" src="' + incFile + '"></script>'
  );
}

// ========================================================================================================================================
// First Load Config
// ========================================================================================================================================
var search_category = "";
var search_status = "";
var search_nation = "";
var search_sort = "";


router();
function router() {
  let path = getPathName();
  // alert(path)
  if (path.startsWith("index") || path == "") {
    let isLogin = getStore();
    configIndex(isLogin);

    getTopViewed("month");
    getSliderContent();
    getNewestContent();
    outputAllComic();
    outputCategoryHeader();
  }

  if (path.startsWith("login")) {
    outputCategoryHeader();
    showHidePassInLogin();
  }

  if (path.startsWith("signup")) {
    outputCategoryHeader();
    showHidePassInSignup();
  }

  if (path.startsWith("categories")) {
    let isLogin = getStore();
    configIndex(isLogin);

    getCategoriesForSearchView();

    let mainPath = window.location.href;
    var url = new URL(mainPath);
    var category = url.searchParams.get("category");
    search_category = category;


    getComicWithCategory();
    outputCategoryHeader();
  }

  if (path.startsWith("details")) {
    let isLogin = getStore();
    configIndex(isLogin);    
    outputCategoryHeader();

    let urlParams = new URLSearchParams(window.location.search);
    let comicID = urlParams.get('comicID');
    getDetailForComic(comicID);
    getCommentForComic(comicID);
  }

  if (path.startsWith("manga_reading")) {
    let isLogin = getStore();
    configIndex(isLogin);

    let urlParams = new URLSearchParams(window.location.search);
    let chapterID = urlParams.get('chapterID');
    let comicID = urlParams.get('comicID');
    
    outputCategoryHeader();
    getChapterContentForComic(chapterID);
    getListChapter(comicID, chapterID);

    saveReadHistory(comicID, chapterID);
  }

  if (path.startsWith("search")) {
    let isLogin = getStore();
    configIndex(isLogin);

    let urlParams = new URLSearchParams(window.location.search);
    let keyword = urlParams.get('keyword');
    outputCategoryHeader();
    getComicFromSearch(keyword);
  }

  if(path.startsWith("profile_info")){
    let isLogin = getStore();
    configIndex(isLogin);
    
    outputCategoryHeader();
    uploadUserAvatar();

  }

  if(path.startsWith("change_password")){
    let isLogin = getStore();
    configIndex(isLogin);
    outputCategoryHeader();

    getUserDetail2();
  }

  if (path.startsWith("history")) {
    let isLogin = getStore();
    configIndex(isLogin);
    outputCategoryHeader();
  }

  search();
}

// ========================================================================================================================================
// Home View Config
// ========================================================================================================================================

function configIndex(isLogin) {
  var indexViewButtonLogin = document.getElementById("indexViewButtonLogin");
  var indexViewUserDetail = document.getElementById("indexViewUserDetail");
  var historyBtn = document.getElementById("history-btn");
  var history = document.getElementById("history");
  
  if (isLogin) {
    indexViewButtonLogin.style = "display: none;";
    indexViewUserDetail.style = "";

    getUserDetail(function (json) {
      userToNavigation(json);

      let path = getPathName();

      if (path.startsWith("history")) {
        let userID = json.data.id;
        if(userID){
          getReadHistory(userID);
        }
      }
    });
  } else {
    indexViewButtonLogin.style = "";
    indexViewUserDetail.style = "display: none;";
    historyBtn.removeAttribute("href");
    history.setAttribute("class", "pointer")

    historyBtn.onclick = () =>{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Hãy đăng nhập để sử dụng tính năng này!',
      });
    }
  }
}

// ========================================================================================================================================
// Authentication
// ========================================================================================================================================

function login() {
  var email = document.getElementById("loginViewEmailField").value;
  var password = document.getElementById("loginViewPasswordField").value;

  if (email != "" && password != "") {
    let data = {
      email: email,
      password: password,
    };

    queryApi("/auth/login", "POST", data, null, function (json) {
      let token = json.data.access_token;
      setStore(token);
      window.location.href = "index.html";
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Hãy nhập đủ thông tin!!!!",
    });
  }
}

function register() {
  var lastName = document.getElementById("last_name");
  var firstName = document.getElementById("first_name");
  var email = document.getElementById("email");
  var password = document.getElementById("password");
  var repassword = document.getElementById("repassword");

  let isValidated = registerValidate(
    lastName,
    firstName,
    email,
    password,
    repassword
  );
  if (isValidated) {
    let data = {
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: password.value,
      role: "8b0246fe-a8e2-444e-815d-8f6973727cba",
    };

    queryApi("/users", "POST", data, null, function (json) {
      alertRegisterSuccess(function () {
        window.location.href = "login.html";
      });
    });
  }
}

function getUserDetail2() {
  let auth = getStore();
  if (auth) {
    queryApi("/users/me", "GET", null, auth, function (json) {
      console.log(json);
      // handle(json);
      let user = json.data;
      var currentPassword = user.password;
      console.log(currentPassword);
      document.getElementById("save-change-password").onclick = function(){
        let oldP = document.getElementById("old-password").value;
        let newP = document.getElementById("new-password").value;
        let confirmP = document.getElementById("retype-new-password").value;
        changePassword(currentPassword, oldP, newP, confirmP);
      };
    });
  }
}

function getUserDetail(handle) {
  let auth = getStore();
  if (auth) {
    queryApi("/users/me", "GET", null, auth, function (json) {
      console.log(json);
      handle(json);
      let user = json.data;      
      var outputProfileInfoString = profileInfo(user)
      pushContent("profile-detail-section", outputProfileInfoString);

        var currentFirstName = document.getElementById("first-name").value;
        var currentLastName = document.getElementById("last-name").value;
  
        document.getElementById("save-change-password").onclick = function(){
          changeUserName(currentFirstName, currentLastName);
        };  
    });
  }
}

function logout() {
  setCookie("authorization", "", 1);
  window.location.href = "index.html";
}

// ========================================================================================================================================
// Comic
// ========================================================================================================================================

//Output top view in sidebar
function getTopViewed(filter) {
  var limit = 5;
  let today = new Date();
  // console.log(today);

  var date = today;

  if (filter == "week") {
    today.setDate(today.getDate() - 7);
  } else if (filter == "month") {
    today.setDate(today.getDate() - 30);
  } else if (filter == "year") {
    today.setDate(today.getDate() - 365);
  }

  let todayString = toDateString(date);
  let router =
    "/items/comic?sort[]=comic_view&limit=" +
    limit +
    "&filter[created_date][_gte]=" +
    todayString;

  queryApi(router, "GET", null, null, function (json) {
    console.log(json.data);

    let comics = json.data;
    let outputString = comicsToTopViewedItems(comics);

    pushContentWithImg("indexViewFilterByViewed", outputString);
  });
}

//Output slider content in homepage
function getSliderContent() {

  queryApi("/items/comic?filter[on_slider][_eq]=1&limit=10", "GET", null, null,
    function (json) {
      console.log(json.data);

      let comics = json.data;
      var outputString = comicToSliderItems(comics);

      pushContent("indexViewSliderComic", outputString);

      refreshSlider();
    }
  );
}

//Output newest content in homepage
function getNewestContent(comicID) {
  let query = getRouter("getComics", comicID);

  queryGraphql(query, null, function (json) {
    // console.log(json);

    let comics = json.data.comic;
    let outputString = comicToNewestContentItems(comics);

    pushContentWithImg("indexViewNewestContent", outputString);
  });
}

//Output all comic in homepage
function outputAllComic() {
  let query = getAllComic("queryAllComic");

  queryGraphql(query, null, function (json) {
    console.log(json)
    
    let allComic = json.data.comic;
    let outputAllComicString = comicToAll(allComic);

    pushContent("showAllComic", outputAllComicString);
  })
}

//Output category in header 
function outputCategoryHeader(){
  let query = allCategoriesOnHeader();

  queryGraphql(query, null, function (json){
    // console.log (json);

    let headerCategory = json.data.category;
    let outputHeaderCategoryString = cateOnHeader(headerCategory);
    mobileHeader(headerCategory);

    pushContent("displayCategoryOnHeader", outputHeaderCategoryString);
  })
}

//Output list categories in category view
function getCategoriesForSearchView() {
  let query = allCategoriesOnHeader();

  queryGraphql(query, null, function (json){
    // console.log (json);

    let categories = json.data.category;
    let string = categoriesToSearchItems(categories, search_category);

    pushContent("choose-cate", string);
    setCategoryViewTitle(search_category);
  });
}

//Get selected category value in category
function searchConfigCategory() {
  var e = document.getElementById("choose-cate");
  var category = e.options[e.selectedIndex].value;

  // search_category = category;
  window.location.href = "categories.html?category=" + category;
  // getComicWithCategory();
}

//Get selected value in comic status
function searchConfigStatus(status) {

  if (status == "1") {
  document.getElementById('categoryViewButtonStatusOnGoing').classList.add("active");
  document.getElementById('categoryViewButtonStatusFinished').classList.remove("active");
  document.getElementById('categoryViewButtonStatusAll').classList.remove('active');
  } else if (status == "2"){
    document.getElementById('categoryViewButtonStatusOnGoing').classList.remove("active");
    document.getElementById('categoryViewButtonStatusFinished').classList.add("active");
    document.getElementById('categoryViewButtonStatusAll').classList.remove('active');
  } else if (status == ""){
    document.getElementById('categoryViewButtonStatusOnGoing').classList.remove("active");
    document.getElementById('categoryViewButtonStatusFinished').classList.remove("active");
    document.getElementById('categoryViewButtonStatusAll').classList.add('active');
  }

  search_status = status;
  getComicWithCategory();
}

//Get selected value in comic nation
function searchConfigNation(nation) {

  if (nation == "1"){
    document.getElementById('categoryViewButtonNationAll').classList.remove("active");
    document.getElementById('categoryViewButtonNationJapan').classList.remove("active");
    document.getElementById('categoryViewButtonNationVietnam').classList.add('active');
    document.getElementById('categoryViewButtonNationKorea').classList.remove('active');
    document.getElementById('categoryViewButtonNationChina').classList.remove('active');
  } else if (nation == "2"){
    document.getElementById('categoryViewButtonNationAll').classList.remove("active");
    document.getElementById('categoryViewButtonNationJapan').classList.add("active");
    document.getElementById('categoryViewButtonNationVietnam').classList.remove('active');
    document.getElementById('categoryViewButtonNationKorea').classList.remove('active');
    document.getElementById('categoryViewButtonNationChina').classList.remove('active');
  } else if (nation == "3"){
    document.getElementById('categoryViewButtonNationAll').classList.remove("active");
    document.getElementById('categoryViewButtonNationJapan').classList.remove("active");
    document.getElementById('categoryViewButtonNationVietnam').classList.remove('active');
    document.getElementById('categoryViewButtonNationKorea').classList.remove('active');
    document.getElementById('categoryViewButtonNationChina').classList.add('active');
  } else if (nation == "4"){
    document.getElementById('categoryViewButtonNationAll').classList.remove("active");
    document.getElementById('categoryViewButtonNationJapan').classList.remove("active");
    document.getElementById('categoryViewButtonNationVietnam').classList.remove('active');
    document.getElementById('categoryViewButtonNationKorea').classList.add('active');
    document.getElementById('categoryViewButtonNationChina').classList.remove('active');
  } else if (nation == ""){
    document.getElementById('categoryViewButtonNationAll').classList.add("active");
    document.getElementById('categoryViewButtonNationJapan').classList.remove("active");
    document.getElementById('categoryViewButtonNationVietnam').classList.remove('active');
    document.getElementById('categoryViewButtonNationKorea').classList.remove('active');
    document.getElementById('categoryViewButtonNationChina').classList.remove('active');
  }

  search_nation = nation;
  getComicWithCategory() 
}

//Get selected value in comic filter
function searchConfigSort(sort){
  var e = document.getElementById("sortViewCategory");
  var sort = e.options[e.selectedIndex].value;

  search_sort = sort;
  getComicWithCategory();
}

//Get category name and description
function setCategoryViewTitle(category){
  var description = 'Thể loại này thường có nội dung về đánh nhau, bạo lực, hỗn loạn, với diễn biến nhanh';
  var categoryName = "Action";
  if (document.getElementById(category + "_des")) {
    description = document.getElementById(category + "_des").getAttribute("name");
    categoryName = document.getElementById(category + "_des").getAttribute("value");
}

  document.getElementById('categoryViewDescription').innerHTML = description;
  document.getElementById('categoryViewName').innerHTML = categoryName;
}

//Output comic in category
function getComicWithCategory(){

  let category = search_category ? search_category : "Action";
  setCategoryViewTitle(category);

  let query = getComicByCategory(category, search_status, search_nation, search_sort)
  queryGraphql(query, null, function (json) {
    // console.log(json);
    // alert(category);
    let comics = json.data.comic;
    let outputString = comicToCategoryViewItem(comics);

    pushContent("categoryViewComic", outputString);
  });
}

//Output comic details
function getDetailForComic(comicID){
  let query = getComicDetail(comicID);
  
  queryGraphql(query, null, function (json) {
      let comicDetail = json.data.comic_by_id;
      let chapterListDetail = json.data.comic_by_id.chapters;

      let outputComicDetailString = comicToDetail(comicDetail);
      let outputChapterDetailString = chapterListToDetail(comicDetail.id, chapterListDetail);

      pushContent("comicDetailSection", outputComicDetailString);
      pushContent("comicChapterSection", outputChapterDetailString);
      getBreadcrumbName();

});
}

//Output comment in comic details
function getCommentForComic(comicID){
  let query = `
    query{
      comments (filter: {_and:[
          {comic_id: {id: {_eq: `+comicID+`}}},
          {is_sub_comment: {_eq: false}}
      ]}){
          id
          content
          total_like
          date_created
          user_created{
              id
              avatar{
                  id
              }
              first_name
              last_name
          }
          childCmts{
              id
              content
              total_like
              date_created
              user_created{
                  id
                  avatar{
                      id
                  }
                  first_name
                  last_name
              }
          }
      }
  }
  `;
  
  queryGraphql(query, null, function (json) {
      let commentListDetail = json.data.comments;

      let outputcommentString = commentListToDetail(comicID, commentListDetail);

      pushContent("comicCommentSection", outputcommentString);

});
}

//Output breadcrumb name in details
function getBreadcrumbName(){
  var comicBreadcrumbName = document.getElementsByClassName("comic_name")[0];
  document.getElementById("breadcrumb_name").innerHTML = 
  `
  <a href="./index.html"><i class="fa fa-home"></i>Trang chủ</a>
  <span>`+comicBreadcrumbName.innerText+`</span>
  `
}

//Output chapter content
function getChapterContentForComic(chapterID){
  let query = getChapterContent(chapterID);

  queryGraphql(query, null, function (json){
    let chapterContents = json.data.chapter_by_id;
    let outputChapterContentString = chapterContentToReadingPage(chapterContents);

    pushContentWithImg("readingSection", outputChapterContentString);

    getBreadcrumbNameInReading()
  });
}

//Send comment
function sendComment(comicID, commentID) {
  var comentValue = '';
  var comment = document.getElementById('comicViewReplyCommentBoxTextarea');
  var comment2 = document.getElementById('comicViewCommentBoxTextarea');

  if (comment) {
    comentValue = comment.value;
  } else if (comment2) {
    comentValue = comment2.value;
  }

  var sendString = '';

  if (commentID) {
    let sendID = commentID.replace('comment_', '');
    
    if (sendID) {
      sendString = 'parentCmt: {id: '+sendID+'}, is_sub_comment: true,';
    }
  }
  
  let query = `
    mutation {
      create_comments_item (data: {comic_id: `+comicID.toString()+`, `+sendString+` content: "`+comentValue+`"}) {
          id
          content
          date_created
          user_created {
              id
              avatar {
                  id
              }
              first_name
              last_name
          }
      }
  }
  `

console.log(query);

  let auth = getStore();
  if (auth) {
    queryGraphql(query, auth, function (json){
      
      var avatarSubUser = "";
        if (json.data.create_comments_item.user_created.avatar && json.data.create_comments_item.user_created.avatar.id) {
          avatarSubUser = idToImageString(json.data.create_comments_item.user_created.avatar.id);
        }

      let comment = `
      <div class="comment-section-item comment-section-item-reply">
          <div class="comment-section-item-avatar">
              <img src="`+avatarSubUser+`" alt="" style="width: 90px; height: 80px; border-radius: 50%;"">
          </div>
          <div class="comment-section-item-text">
              <span>` +convertISODate(json.data.create_comments_item.date_created)+`</span>
              <h5>`+json.data.create_comments_item.user_created.last_name+` `+ json.data.create_comments_item.user_created.first_name+`</h5>
              <p>`+json.data.create_comments_item.content+`</p>
              <a href="#">Like</a>
          </div>
      </div>
      `
      let section = document.getElementById(commentID);
      if (section) {
        section.insertAdjacentHTML("afterend", comment);
      } else {
        let cmtBox = document.getElementById('comicViewCommentBox');
        cmtBox.insertAdjacentHTML("afterend", comment);
      }

      let oldForm = document.getElementById('comicViewReplyCommentBox');
      if (oldForm) {
        oldForm.remove();
      }
    });
  }

}

//Output list chapter in reading page
function getListChapter(comicID, chapterID){
  let query = getComicDetail(comicID);
  queryGraphql(query, null, function (json){
    let listChap = json.data.comic_by_id.chapters;
    let outputListChapterString = chapterListToReadingPage(comicID, chapterID, listChap);
    pushContent("chaps", outputListChapterString);
    configChapterListDropdown();
  });
}

//Output breadcrumb name in reading page
function getBreadcrumbNameInReading(){
  let comicBreadcrumbName = document.getElementsByClassName("current-comic")[0];
  let chapterBreadcrumbName = document.getElementsByClassName("current-chapter")[0];
  document.getElementById("breadcrumb-in-reading").innerHTML = 
  `
  <a href="./index.html"><i class="fa fa-home"></i>Trang chủ</a>
  <a href="#">`+comicBreadcrumbName.innerText+`</a>
  <span>`+chapterBreadcrumbName.innerText+`</span>
  `
}

//Get chapter list dropdown in reading page
function configChapterListDropdown(){
  let select = document.getElementById("chaps");
  select.onchange = function() {
    window.location.href = "manga_reading.html?" +select.value;
  }
}

//Get search
function search(keyWord){

  var inputSearch = document.getElementById("search-content");
  var inputSearch2 = document.getElementById("search-content-responsive");
  var searchIcon = document.getElementById("search-icon");
  var searchIcon2 = document.getElementById("search-icon-responsive");
   
  inputSearch.addEventListener("keypress", function(event){
      if(event.keyCode === 13){
        keyWord = inputSearch.value;
        window.location.href = "search.html?keyword=" +keyWord;
      }
  });

  searchIcon.addEventListener("click", () => {
    keyWord = inputSearch.value;
    if (keyWord){
      window.location.href = "search.html?keyword=" +keyWord;
    }
  });

  searchIcon2.addEventListener("click", () => {
    keyWord = inputSearch.value;
    if (keyWord){
      window.location.href = "search.html?keyword=" +keyWord;
    }
  });

  inputSearch2.addEventListener("keypress", function(event){
    if(event.keyCode === 13){
      keyWord = inputSearch2.value;
      window.location.href = "search.html?keyword=" +keyWord;
    }
  });

}

//Search
function getComicFromSearch(keyWord){

  let query = getSearchItems(keyWord);
  queryGraphql(query, null, function (json){

    let searchComic = json.data.comic;
    let outputSearchComicString = searchResult(searchComic);

    pushContent("showSearchComic", outputSearchComicString);
  });
  
}

//Save history
function saveReadHistory(comicID, chapterID) {

  let query = `
  mutation{
    create_read_item (data: {comic_id: `+comicID+`, chapter_id: `+chapterID+`}){
        id
    }
}
  `;

  let auth = getStore();
  if (auth){
    queryGraphql(query, auth, function (json){
      console.log(json);
    });
  }
}

//Query save history
function getReadHistory(userID){
  let query = `
  query{
    comic (filter: {read: {user_created:{id:{_eq: "`+userID+`"}}}} ){
        id
        comic_thumbnail{
            id
        }
        comic_name
        read (sort: "-date_created"){
           chapter_id{
               id
               chapter_name
           }
           date_created
        }
    }
}
  `;

  let auth = getStore();
  if (auth){
    queryGraphql(query, auth, function (json){


      let string = historyToComicItem(json);
      pushContent("historyViewData", string);

      console.log(json);
    });
  }
}

//Change password
function changePassword(currentPassword, oldP, newP, confirmP){

  let auth = getStore();
  console.log(currentPassword);
  var newPasswordString = "";
  // let lengthNewP = document.getElementById("newP").length;
  // let lengthConfirmP = document.getElementById("confirmP").length;

  if (currentPassword == oldP && newP != oldP && newP == confirmP)
    newPasswordString = "(data: {password: \""+newP+"\"})";

  console.log()
  console.log(newP);

  string = `mutation {
    update_users_me `+newPasswordString+`{
          first_name
          last_name
      password
    }
  }
  `
  console.log(string);
  
  if(auth){
    let query = string;
    queryGraphSystem(query, auth, function(json){
    })
  }

}


// ========================================================================================================================================
// Config
// ========================================================================================================================================

//Conver Date
function toDateString(today) {
  var date = today.toISOString().split("T")[0];
  var dateTime = date + "T00:00:00";
  return dateTime;
}

//Convert ISO date
function convertISODate(isoDate){
  const d = new Date(isoDate);
  year = d.getFullYear();
  month = d.getMonth()+1;
  dt = d.getDate();
  if(dt < 10){
    dt = "0" + dt;
  }
  if (month < 10){
    month = "0" + month;
  }
  return +dt+ '/' + month +'/' +year;
}

//Show, hide password in login site
function showHidePassInLogin(){
var showPassword = document.getElementById("show-pass");

showPassword.addEventListener("click", () =>{
  var passField = document.getElementById("loginViewPasswordField");

  if(passField.type === "password"){
    passField.type = "text";
  } else {
    passField.type = "password";
  }
});
}

//Show, hide password in signup site
function showHidePassInSignup(){
  var showPassword = document.getElementById("show-pass");
  showPassword.addEventListener("click", () =>{
    var passField = document.getElementById("password");
    var retypePass = document.getElementById("repassword");
  
    if(passField.type === "password" && retypePass.type === "password"){
      passField.type = "text";
      retypePass.type = "text";
    } else {
      passField.type = "password";
      retypePass.type = "password";
    }
  });
}

//========================================================================================================================================
// Call API Helper
// ========================================================================================================================================

//Call RestAPI
function queryApi(router, method, data, auth, handle) {
  var headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth.token,
    };
  }

  var sendData = data;
  if (method == "POST") {
    sendData = JSON.stringify(data);
  }

  jQuery
    .ajax({
      url: "https://admin.vietdev.org" + router,
      type: method,
      headers: headers,
      data: sendData,
    })
    .done(function (json, textStatus, jqXHR) {
      handle(json);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alertResponseError(jqXHR);
    });
}

//Call GraphQL
function queryGraphql(query, auth, handle) {
  let headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth.token,
    };
  }

  let data = JSON.stringify({
    query: query,
  });
 
  jQuery.ajax({
      url: "https://admin.vietdev.org/graphql",
      type: "POST",
      headers: headers,
      data: data,
    })
    .done(function (json, textStatus, jqXHR) {
      handle(json);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("HTTP Request Failed");
    });
}

//Call graph system
function queryGraphSystem(query, auth, handle) {
  let headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + auth.token,
    };
  }

  let data = JSON.stringify({
    query: query,
  });
 
  jQuery.ajax({
      url: "https://admin.vietdev.org/graphql/system",
      type: "POST",
      headers: headers,
      data: data,
    })
    .done(function (json, textStatus, jqXHR) {
      handle(json);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      console.log("HTTP Request Failed");
    });
}

// ========================================================================================================================================
// Router API
// ========================================================================================================================================

function getRouter(name, limit) {
  if (name == "getComics") {
    return (`
          query {
              comic (sort: ["-updated_date"], limit: ` +
      (limit ? limit : 9) +
      `) {
                  id
                  comic_name
                  comic_view
                  newest_chapter
                  comic_thumbnail {
                      id
                  }
                  comic_total_chapter
                  comic_category {
                      category_id {
                          id
                          category_name
                      }
                  }
              }
          }
      `
    );
  }
  return "";
}

//Query all comic
function getAllComic(getAll) {
  if (getAll == "queryAllComic") {
    return ( `
    query{
      comic (limit: 60){
          id
          comic_name
          comic_thumbnail{
              id
          }
          newest_chapter
          comic_view
          comic_category{
              category_id{
                  id
                  category_name
              }
          }
      }
  }`
);
}
  return "";
}

//Query list category on header
function allCategoriesOnHeader() {
  return `query {
      category{
          id
          category_name
          category_description
      }
    }
  `;
}

//Query comic by category  
function getComicByCategory(category, status, nation, sort) {

  var statusString = "";
  if (status != "") {
    statusString = '{comic_status: {_eq: "'+status+'"}},';
  }

  var nationString = "";
  if (nation != "") {
    nationString = '{comic_nation: {_eq: "'+nation+'"}},';
  }

  var sortString = "";
  if (sort == "created_date_desc"){
    sortString = ', sort: ["-created_date"]';
  } if (sort == "created_date_asc"){
    sortString = ', sort: ["created_date"]';
  } if (sort == "comic_view_desc"){
    sortString = ', sort: ["-comic_view"]'
  } if (sort == "comic_view_asc"){
    sortString = ', sort: ["comic_view"]'
  }

  return `
    query {
      comic(filter: {
          _and: [
              {comic_category: {category_id: {category_name:{_eq:"`+category+`"}}}},
              `+statusString+`
              `+nationString+`
          ]
      }`+sortString+`)  {
          id
          comic_name
          comic_thumbnail{
              id
          }
          newest_chapter
          comic_view
          comic_category {
              category_id {
                  id
                  category_name
                  category_description
              }
          }
      }
  }
  `
}

//Query comic detail
function getComicDetail(comicId){

  var comicIdString = "";
  if (comicId != ""){
    comicIdString = '(id: '+comicId+')';
  }

  return `
  query{
    comic_by_id `+comicIdString+` {
        id
        comic_name
        comic_name_alternative
        comic_description
        
        comic_total_like
        comic_authors
        comic_thumbnail{
          id
        }
        comic_nation
        comic_status
        user_like (filter: {users_id: {id: {_eq: "b7608e76-822f-4423-81c5-bf9ff4f9f440"}}}){
          users_id{
              id
          }
      }
        comic_view
        comic_category{
            category_id{
                id
                category_name
            }
        }
        chapters{
          id
          chapter_name
          date_created
        }
      }
    }
  
`;
}

//Query chapter content
function getChapterContent(chapterId){
  var chapterIdString = "";
  if (chapterId != ""){
    chapterIdString = '(id: '+chapterId+')';
  }

  return `
  query{
    chapter_by_id `+chapterIdString+`{
        id
        id_comic{
            id
            comic_name
        } 
        date_created
        chapter_name
        chapter_content{
            id
            directus_files_id{
                id
            }
        }
    }
}
`;
}

//Query items when search
function getSearchItems(comicKeyword){
  var comicKeywordString = "";
  if(comicKeyword != ""){
    comicKeywordString = '(search: "'+comicKeyword+'")'
  }
  return `
query{
  comic `+comicKeywordString+`{
      id
      comic_name
      comic_view
      newest_chapter
      comic_category{
          id
          category_id{
              category_name
          }
      }
      comic_thumbnail{
          id
      }
  }
}`
}

//Change username
function changeUserName(currentFirstName, currentLastName){

  var newUserNameString;  
  let auth = getStore();

  var newFirstName = document.getElementById("first-name").value;
  var newLastName = document.getElementById("last-name").value;

  if (newFirstName && newLastName){
    newUserNameString = "(data: { first_name: \""+newFirstName+"\", last_name: \""+newLastName+"\"})"
  }
  else if(newFirstName && newFirstName != currentFirstName){
    newUserNameString = "(data: { first_name: \""+newFirstName+"\" })"
  } 
  else if (newLastName && newLastName != currentLastName){
    newUserNameString = "(data: { last_name: \""+newLastName+"\" })"
  }
  updateUserDataString = `
  mutation {
    update_users_me `+newUserNameString+` {
          id
          first_name
          last_name
    }
  }
`;

  if (newFirstName && newLastName){
    let query = updateUserDataString;
    queryGraphSystem(query, auth, function(json){
    })
  }
  else if(newFirstName && newFirstName != currentFirstName){
    let query = updateUserDataString;
    queryGraphSystem(query, auth, function(json){
    })
  }
  else if (newLastName && newLastName != currentLastName){
    let query = updateUserDataString;
    queryGraphSystem(query, auth, function(json){
    })
  }

  Swal.fire({
    icon: "success",
    title: "Thay đổi thông tin thành công",
    confirmButtonText: "OK"
    }).then((result) => {
      location.reload();
    })

}

//Upload Avatar
function uploadUserAvatar(){
  const fileInput = document.querySelector('input[type="file"]');

  const formData = new FormData();

  formData.append('title', 'My First File');
  formData.append('file', fileInput.files[0]);

  console.log(formData);
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//Save cookie
function setStore(token) {
  setCookie("authorization", '{"token":"' + token + '"}', 1);
}

//Get cookie
function getStore(){
  var authorization = getCookie("authorization");
  if (authorization != "") {
    let json = JSON.parse(authorization);
    if (json.token && json.token != "") {
      return json;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

//Get path name
function getPathName(){
  let mainPath = window.location.href;
  let domain1 = "http://127.0.0.1:5500/";
  let domain2 = "http://127.0.0.1:5501/";
  let domain3 = "https://vietdev.org/";
  var file = mainPath.replace(domain1, "");
  file = file.replace(domain2, "");
  file = file.replace(domain3, "")
  return file;
}
