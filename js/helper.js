// Get top view on sidebar
function comicsToTopViewedItems(comics) {
  var outputString = "";

  comics.forEach(function (comic) {
    let name = comic.comic_name;
    let viewed = comic.comic_view ? comic.comic_view : 0;
    let newestChap = comic.newest_chapter ? comic.newest_chapter : 0;
    let thumbnail = idToImageString(comic.comic_thumbnail);

    let string =
      `
          <div class="product__sidebar__view__item set-bg lozad" data-background-image="`+thumbnail+`"
              style="box-shadow: inset 2000px 0 0 0 rgba(0, 0, 0, 0.5);">
              <a href="details.html?comicID=`+comic.id+`" class="position-absolute background-href"></a>
              <div class="ep">`+newestChap+`</div>
              <div class="view"><i class="fa fa-eye"></i> `+viewed+`</div>
              <h5><a href="details.html?comicID=`+comic.id+`">`+name+`</a></h5>
          </div> 
      `;
    outputString = outputString + string;
  });


  return outputString;
}

//Get slider content in homepage
function comicToSliderItems(comics) {
  var outputString = `<section class="container splide mt-6 comic-slider" aria-label="splide-comic">
        <div class="splide__track">
        <ul class="splide__list">
    `;

  comics.forEach(function (comic) {
    let name = comic.comic_name;
    let newestChapter = comic.newest_chapter ? comic.newest_chapter : 0;
    let thumbnail = idToImageString(comic.comic_thumbnail);

    let string =
      `
        <li class="splide__slide position-relative" style="width: 250px; height: 300px; background-image: url('`+thumbnail+`'); background-size: cover; background-position: center;">
            <div class="slide-caption position-absolute px-3">
                <span class="fs-bold fs-7">
                    <a href="details.html?comicID=`+comic.id+`">`+name+`</a>
                    <span class="fs-8">`+newestChapter+`</span>
                </span>
            </div>
            <a href="details.html?comicID=`+comic.id+`" class="position-absolute background-href"></a>
        </li>
      `;
    outputString = outputString + string;
  });

  outputString =
    outputString +
    ` </ul>
          </div>
      </section>
    `;

  return outputString;
}

//Get newest content
function comicToNewestContentItems(comics) {
  var outputString = "";

  comics.forEach(function (comic) {
    let name = comic.comic_name;
    let viewed = comic.comic_view ? comic.comic_view : 0;
    let newestChapter = comic.newest_chapter ? comic.newest_chapter : 0;
    // let totalChapter = comic.comic_total_chapter ? comic.comic_total_chapter : 1;
    let thumbnail = idToImageString(comic.comic_thumbnail.id);

    let categories = comic.comic_category;
    var categoriesString = "";
    categories.forEach(function (category) {
      if (
        category &&
        category.category_id &&
        category.category_id.category_name
      ) {
        categoriesString =
          categoriesString +
          "<li>" +
          category.category_id.category_name +
          "</li> ";
      }
    });

    //<div class="comment"><i class="fa fa-comments"></i> `+viewed+`</div>

    let string =
      `
      <div class="col-lg-4 col-md-6 col-sm-6">
          <div class="product__item">
              <div class="product__item__pic set-bg" style="background-image: url('`+thumbnail+`');">
                <a href="details.html?comicID=`+comic.id+`" class="position-absolute background-href"></a>
                <div class="ep">`+newestChapter+`</div>
                <div class="view"><i class="fa fa-eye"></i> `+viewed+`</div>
              </div>
              <div class="product__item__text">
                  <ul>`+categoriesString+`</ul>
                  <h5><a href="details.html?comicID=`+comic.id+`">` +name+`</a></h5>
              </div>
          </div>
      </div>`;
    outputString = outputString + string;
  });

  return outputString;
}

//Get all Comic
function comicToAll(allComic) {
  var outputAllComicString = "";

  allComic.forEach(function (comic) {
    let name = comic.comic_name;
    let viewed = comic.comic_view ? comic.comic_view : 0;
    let newestChap = comic.newest_chapter ? comic.newest_chapter : 0;
    let thumbnail = idToImageString(comic.comic_thumbnail.id);
    let categories = comic.comic_category;
    var listComicCategoryString = "";
    categories.forEach(function (category) {
      if (
        category &&
        category.category_id &&
        category.category_id.category_name
      ) {
        listComicCategoryString =
          listComicCategoryString +
          "<li>" +
          category.category_id.category_name +
          "</li> ";
      }
    });
    // <div class="comment"><i class="fa fa-comments"></i> 11</div>
    let string =
      `<div class="col-lg-2 col-md-6 col-sm-6">
		  <div class="product__item">
			  <div class="product__item__pic set-bg" style="background-image: url('`+thumbnail+`');">
          <a href="details.html?comicID=`+comic.id+`" class="position-absolute background-href"></a>
				  <div class="ep">`+newestChap+`</div>
				  <div class="view"><i class="fa fa-eye"></i> `+viewed+`</div>
			  </div>
			  <div class="product__item__text">
				  <ul>
				  `+listComicCategoryString+`
				  </ul>
				  <h5><a href="details.html?comicID=`+comic.id+`">`+name+`</a></h5>
			  </div>
		  </div>
	  </div>`; 
    outputAllComicString = outputAllComicString + string;
  });
  return outputAllComicString;
}

//Get comic from category
function comicToCategoryViewItem(comics) {
  var outputAllComicString = "";

  comics.forEach(function (comic) {
    let name = comic.comic_name;
    let viewed = comic.comic_view ? comic.comic_view : 0;
    let newestChap = comic.newest_chapter ? comic.newest_chapter : 0;
    let thumbnail = idToImageString(comic.comic_thumbnail.id);

    // <div class="comment"><i class="fa fa-comments"></i> 11</div>
    let string =
      `<div class="col-lg-2 col-md-4 col-sm-6">
      <div class="product__item">
          <div class="product__item__pic set-bg" style="background-image: url('`+thumbnail+`');">
              <a href="details.html?comicID=`+comic.id+`" class="position-absolute background-href"></a>
              <div class="ep">`+newestChap+`</div>
              <div class="view"><i class="fa fa-eye"></i> `+viewed+`</div>
          </div>
          <div class="product__item__text">
              <h5><a href="details.html?comicID=`+comic.id+`">` +name+`</a></h5>
          </div>
      </div>
    </div>`;
    outputAllComicString = outputAllComicString + string;
  });

  if (outputAllComicString == "") {
    let string = `<div class="d-flex flex-column col-12 mt-8" style= "color: white; align-items: center" >
      <img src="/img/empty.svg" style="width: 400px;">
      <span class="fs-3 fw-bolder mt-4">Không tìm thấy truyện</span>
    </div>`;
    outputAllComicString = outputAllComicString + string;
  }
  return outputAllComicString;
}

//Get list category in category
function categoriesToSearchItems(categories, search_category) {
  var string = "";

  categories.forEach(function (category) {
    let isSelected = category.category_name == search_category ? "selected " : "";
    string = string +"<option " +isSelected+'id="' +category.category_name+ '_des" value="' +category.category_name +'" name="'+category.category_description+'">' +category.category_name+"</option>";
});

  return string;
}

//Get Category on Header
function cateOnHeader(allCategory) {
  let string =
    '<ul class="d-flex flex-wrap multi_column_dropdowmn" style ="width: 690px">';

  allCategory.forEach(function (category) {
    if (category && category.category_name) {
      let itemLi = "<li class='col-3'>";
      itemLi +="<a href='categories.html?category="+category.category_name+"'>"+category.category_name+"</a>";
      itemLi += "</li>";
      string += itemLi;
    }
  });

  string += "</ul>";
  return string;
}

// Get Category on Mobile Header
function mobileHeader(allCategory) {
  let li = document.querySelector("li.slicknav_collapsed");
  let ul = li.childNodes[1].childNodes[1].childNodes[1];
  ul.classList.add("d-flex", "flex-wrap");

  let string = "";
  allCategory.forEach(function (category) {
    if (category && category.category_name) {
      let itemLi = "<li class='col-6'>";
      itemLi += "<a href='categories.html?category="+category.category_name+"'>"+category.category_name+"</a>";
      itemLi += "</li>";
      string += itemLi;
    }
  });
  ul.innerHTML = string;
}

//Get comic details
function comicToDetail(comicDetail) {
  var outputComicDetailString = "";
  // var comicDetail;

  let name = comicDetail.comic_name;
  let name_alternative = comicDetail.comic_name_alternative;
  if (name_alternative == null) {
    name_alternative = "";
  }
  let description = comicDetail.comic_description;
  let author = comicDetail.comic_authors;
  let totalLike = comicDetail.comic_total_like;
  if (totalLike == null) {
    totalLike = 0;
  }
  let imgThumbs = idToImageString(comicDetail.comic_thumbnail.id);
  let view = comicDetail.comic_view;
  let status = comicDetail.comic_status;
  if (status == 2) {
    statusView = "Hoàn thành";
  } else if (status == 1) {
    statusView = "Đang tiến hành";
  }
  let nation = comicDetail.comic_nation;
  if (nation == 1) {
    nationView = "Việt Nam";
  } else if (nation == 2) {
    nationView = "Nhật Bản";
  } else if (nation == 3) {
    nationView = "Trung Quốc";
  } else if (nation == 4) {
    nationView = "Hàn Quốc";
  }
  let categories = comicDetail.comic_category;
  var listCategoryString = "";
  categories.forEach(function (category) {
    if (
      category &&
      category.category_id &&
      category.category_id.category_name
    ) {
      listCategoryString =
        listCategoryString +
        `<a href="#" class="category-btn unstyled">` +category.category_id.category_name+`</a>`;
    }
  });


  if(comicDetail.chapters.length > 0){
    btnRead = `<a href="manga_reading.html?chapterID=`+comicDetail.chapters[0].id+`&comicID=` +comicDetail.id+ `" class="read-btn" id="read-now"><i class="fa fa-book"></i> Đọc ngay</a>`;
  } else {
    btnRead = ``;
  }

  let string =
    `
    <div class="col-lg-3">
      <div class="anime__details__pic set-bg"" style ="background-image: url(`+imgThumbs+`)">
      </div>
    </div>
    <div class="col-lg-9">
      <div class="anime__details__text">
      <div class="anime__details__title">
          <h3 class="comic_name">`+name+`</h3>
          <span class="name_alternative">` +name_alternative+`</span>
      </div>
      <p>
      `+description+`
      </p>
      <div class="anime__details__widget">
          <div class="row">
              <div class="col-lg-12 col-md-12">
                  <ul>
                      <li>
                          <span>Tác giả:</span>`+author+`
                      </li>
                      <li>
                          <span>Quốc gia:</span>`+nationView+`
                      </li>
                      <li>
                          <span>Trạng thái:</span>`+statusView+`
                      </li>
                      <li>
                          <span>Lượt xem:</span>`+view+`
                      </li>
                      <li>
                          <span>Lượt thích:</span>`+totalLike+`
                      </li>
                      <div class="d-flex flex-wrap mt-3">
                        `+listCategoryString +`
                      </div>
                  </ul>
              </div>
          </div>
      </div>
  </div>
  <div class="anime__details__btn">
  <a href="#" class="like-btn"><i class="fa fa-heart"></i> Yêu thích</a>
  `+btnRead+`
</div>
  </div>
`;
  outputComicDetailString = string;
  return outputComicDetailString;
}

// manga_reading.html?chapterID=`+comicDetail.chapters[0].id+`&comicID=` +comicDetail.id+ `

//Get chapter in detail
function chapterListToDetail(comicID, chapterListDetail) {
  var outputChapterDetailString = "";
  let listChapterString = "";
  if (chapterListDetail.length == 0) {
    listChapterString =
      listChapterString +
      `<span style="color: white">Hiện chưa có chapter</span>`;
  } else {
    chapterListDetail.forEach(function (chapter) {
      listChapterString =
        listChapterString +
        `<div class="active-chapter-item d-flex flex-wrap justify-content-spacebetween"> <div class="chapter-name"> <a href="manga_reading.html?chapterID=`+chapter.id+`&comicID=`+comicID+`">` +
        chapter.chapter_name +
        `</a> </div> <div class="update-time">`+convertISODate(chapter.date_created)+`</div> </div>`;
    });
  }

  let string =
    `<div class="active-chapter-list">`+listChapterString+`</div>`;
  outputChapterDetailString = string;
  return outputChapterDetailString;
}

//Get comment in detail
function commentListToDetail(comicID, commentListDetail) {
  var outputcommentString = "";

  var listCommentString = "";
  var numberOfCommentString ="";
  let numberOfComment = commentListDetail.length;

// <h4 style="color: white">Chưa có ai comment ở đây cả ~~</h4>

  let formComment = `
  <div class="comment-form" id="comicViewCommentBox">
  <h4>`+numberOfComment+` bình luận</h4>
  <form action="#">
      <div class="row">
          <div class="col-lg-12"><textarea
                  placeholder="Nhập bình luận của bạn" id="comicViewCommentBoxTextarea"></textarea>
          </div>
      </div>
  </form>
  <button class="site-btn" onclick="sendComment('`+comicID+`')">Gửi bình luận</button>
  </div>
  `;

  outputcommentString = outputcommentString + formComment;

  commentListDetail.forEach(function (comment) {
    var avatarUser = "";
    if (comment.user_created.avatar && comment.user_created.avatar.id) {
      avatarUser = idToImageString(comment.user_created.avatar.id);
    }
    
    if (comment.total_like === null){
      comment.total_like = 0;
    }
    listCommentString = listCommentString +
      `<div class="comment-section" id="comment_`+comment.id+`">
      <div class="comment-section-item">
      <div class="comment-section-item-avatar"> 
      <img src="` +avatarUser +`" alt="" style="width: 85px; height: 80px; border-radius: 50%;"> 
      </div> <div class="comment-section-item-text"> 
      <h5>` +comment.user_created.last_name+` ` +comment.user_created.first_name+`</h5> 
      <span>` +convertISODate(comment.date_created)+`</span> <p>`+comment.content+`</p> 
      <a href=""> <i class="fa fa-thumbs-up" aria-hidden="true"></i> `+comment.total_like+` </a> 
      <a onclick="addCommentBox('`+comicID+`','comment_`+comment.id+`')" id="reply-comment">Trả lời</a> </div>
      </div></div>
      `;

      let subComments = comment.childCmts;
      subComments.forEach(function(item){
        var avatarSubUser = "";
        if (item.user_created.avatar && item.user_created.avatar.id) {
          avatarSubUser = idToImageString(item.user_created.avatar.id);
        }
        if (item.total_like === null){
          item.total_like = 0;
        }

        console.log(subComments)
        listCommentString  = listCommentString + `
        <div class="comment-section-item comment-section-item-reply">
            <div class="comment-section-item-avatar">
                <img src="`+avatarSubUser+`" alt="" style="width: 85px; height: 80px; border-radius: 50%;"">
            </div>
            <div class="comment-section-item-text">
                <span>` +convertISODate(item.date_created)+`</span>
                <h5>`+item.user_created.last_name+` `+item.user_created.first_name+`</h5>
                <p>`+item.content+`</p>
                <a href=""><i class="fa fa-thumbs-up" aria-hidden="true"></i> `+item.total_like+`</a>
            </div>
        </div>
        `
      })
  });

  let string = outputcommentString + numberOfCommentString  + listCommentString ;
  return string;
}

//add reply comment box
function addCommentBox(comicID, commentID) {
  let oldForm = document.getElementById('comicViewReplyCommentBox');
  if (oldForm) {
    oldForm.remove();
  }

  let string = `
  <div class="comment-form" id="comicViewReplyCommentBox" style="padding-top: 0px;">
      <form action="#">
          <div class="row">
              <div class="col-lg-12"><textarea
                      placeholder="Nhập bình luận của bạn" id="comicViewReplyCommentBoxTextarea"></textarea >
              </div>
          </div>
      </form>
      <button
        class="site-btn"  onclick="sendComment('`+comicID+`','`+commentID+`')">Gửi bình luận</button>
    </div>
  `
  let section = document.getElementById(commentID);
  if (section) {
    section.insertAdjacentHTML("beforeend", string);
  }
}

//Get chapter content in reading page
function chapterContentToReadingPage(chapterContents) {
  var outputChapterContentString = "";

  comicName = chapterContents.id_comic.comic_name;
  chapterName = chapterContents.chapter_name;
  chapterCreated = chapterContents.date_created;

  //Output content
  let contentInChapter = chapterContents.chapter_content;
  console.log(contentInChapter);
  var listChapterContentString = "";
  contentInChapter.forEach(function (contentChapter) {
    if (
      contentChapter &&
      contentChapter.id &&
      contentChapter.directus_files_id.id
    ) {
      chapterContentLink = idToImageString(contentChapter.directus_files_id.id);
      listChapterContentString =
        listChapterContentString +
        `<img src="" alt="pic" class="lozad" data-src="`+chapterContentLink+`">`;
    }
  });
                                                              
  //Output comment
  let string =
`
  <div class="col-lg-8">
  <div class="comic-title d-flex flex-column">
      <h3 class="current-comic mb-4 fw-bolder" style="color: whitesmoke;">`+comicName +`
      </h3>
      <span class="current-chapter fw-bold" style="color: whitesmoke;">`+chapterName+`</span>
      <span class="mt-4" style="color: whitesmoke;">Cập nhật lần cuồi vào 
      `+convertISODate(chapterCreated)+`</span>
  </div>
  </div>
  <div class="col-lg-12" style="padding-left: 0; padding-right: 0;">
  <div class="d-flex flex-column align-items-center reading-details-pic">
      <div id="comicPage" style="text-align: center">`+listChapterContentString+`</div>
  </div>
`;
  outputChapterContentString = string;
  return outputChapterContentString;
}

//Get list chapter in reading page
function chapterListToReadingPage(comicID, chapterID, listChapter){
  var outputListChapterString = "";
  var listChapString = '';

  listChapter.forEach(function(chaps, index){
    if(chaps.id == chapterID){
      listChapString = listChapString + `<option selected value="chapterID=`+chaps.id+`&comicID=`+comicID+`">`+chaps.chapter_name+`</option>`;

      if(index > 0){
        document.getElementById("previous-chap").setAttribute("href", "/manga_reading.html?chapterID="+listChapter[index-1].id+"&comicID="+comicID);
      } else {
        document.getElementById("previous-chap").setAttribute("href", "javascript: void(0)");
      }                      

      if(index < (listChapter.length - 1)){
        document.getElementById("next-chap").setAttribute("href", "/manga_reading.html?chapterID="+listChapter[index+1].id+"&comicID="+comicID);
      } else {
        document.getElementById("next-chap").setAttribute("href", "javascript: void(0)");
      }

    }else{
      listChapString = listChapString + `<option value="chapterID=`+chaps.id+`&comicID=`+comicID+`">`+chaps.chapter_name+`</option>`;
    }

  });

  console.log(chapterID);

  console.log(listChapter);

  let string = listChapString;
  outputListChapterString = string;
  return outputListChapterString;
}

//Get search items
function searchResult(searchComic) {
  var outputSearchComicString = "";

  searchComic.forEach(function (comic) {
    let name = comic.comic_name;
    let viewed = comic.comic_view ? comic.comic_view : 0;
    let newestChapter = comic.newest_chapter;
      // ? comic.comic_total_chapter
      // : 1;
    let thumbnail = idToImageString(comic.comic_thumbnail.id);
    let categories = comic.comic_category;
    var listComicCategoryString = "";
    categories.forEach(function (category) {
      if (
        category &&
        category.category_id &&
        category.category_id.category_name
      ) {
        listComicCategoryString =
          listComicCategoryString +
          "<li>" +
          category.category_id.category_name +
          "</li> ";
      }
    });
    // <div class="comment"><i class="fa fa-comments"></i> 11</div>
    let string =
      `<div class="col-lg-2 col-md-6 col-sm-6">
		  <div class="product__item">
			  <div class="product__item__pic set-bg" style="background-image: url('`+thumbnail+`');">
          <a href="details.html?comicID=`+comic.id+`" class="position-absolute background-href"></a>
				  <div class="ep">`+newestChapter+`</div>
				  <div class="view"><i class="fa fa-eye"></i> `+viewed+`</div>
			  </div>
			  <div class="product__item__text">
				  <ul>
				  `+listComicCategoryString+`
				  </ul>
				  <h5><a href="details.html?comicID=`+comic.id+`">`+name+`</a></h5>
			  </div>
		  </div>
	  </div>`; 
    outputSearchComicString = outputSearchComicString + string;
  });

  if (outputSearchComicString == "") {
    let string = `<div class="d-flex flex-column col-12 mt-8" style= "color: white; align-items: center; height: 45vh;">
      <img src="/img/empty.svg" style="width: 400px;">
      <span class="fs-3 fw-bolder mt-4">Không tìm thấy truyện</span>
    </div>`;
    outputSearchComicString = outputSearchComicString + string;
  }
  return outputSearchComicString;
}

//Get user avatar
function userToNavigation(json) {
  if (json.data.avatar) {
    let avatar = idToImageString(json.data.avatar);
    let avatarSidebar = document.getElementById("avatar-sidebar");
    avatarSidebar.src = avatar;
  } else {
    let dummyAvatar =
      "http://localhost:8055/assets/9aaadd31-698f-4619-860f-a0ffd3e79daa.svg";
    let dummyAvatarSidebar = document.getElementById("avatar-sidebar");
    dummyAvatarSidebar.src = dummyAvatar;
  }
}

//Get user history
function historyToComicItem(json){

  let historys = json.data.comic;
  var outputHistoryString = "";

  var newArray = new Array();
  historys.forEach(function(his){
    
  });

  historys.forEach(function(his){
    let comicID = his.id;
    let thumbnail = his.comic_thumbnail.id;
    let name = his.comic_name;
    let read = his.read.length > 0 ? his.read[0] : null;
    let chapterID = read.chapter_id.id;
    let string = `
    <tr>
        <td>
            <a href="manga_reading.html?chapterID=`+chapterID+`&comicID=`+comicID+`" class="d-flex flex-row comic-history-name">
                <div class="d-flex flex-column"><img src="`+idToImageString(thumbnail)+`" alt=""
                        class="history-comic-img">
                </div>
                <div href="" class="d-flex flex-column ms-3 justify-content-center"> <a href="details.html?comicID=`+comicID+`">`+name+`</a></div>
            </a>
        </td>
        <td>
            <span>`+convertISODate(read.date_created)+`</span>
        </td>
        <td>
            `+read.chapter_id.chapter_name+`
        </td>
        <td>
            <a href="manga_reading.html?chapterID=`+chapterID+`&comicID=`+comicID+`" class="continue px-5 py-3">
                Đọc tiếp
            </a>
        </td>
    </tr>
    `;
    outputHistoryString += string;
  });

  return outputHistoryString;
}

//Get user details
function profileInfo(userDetail){
  var outputProfileInfoString;
  
    let first_name = userDetail.first_name;
    let last_name = userDetail.last_name;
    let email = userDetail.email;
    let avatar = userDetail.avatar;

  let string = `
  <div class="choose-avatar d-flex flex-column align-items-center pt-5 ">
  <img src="`+idToImageString(avatar)+`" alt="" class="img-avatar">
  <form action="" class="mt-3">
      <label for="file-upload" class="custom-file-upload">
          <i class="fa fa-cloud-upload"></i> Chọn ảnh mới
      </label>
      <input id="file-upload" type="file" />
  </form>
  </div>
  <form action="" method="">
    <div class="email d-flex flex-column mt-3">
        <label class="email-info fw-bold">Email của bạn</label>
        <input type="email" value="`+email+`" disabled style="width:95%; height: 36px;">
    </div>
    <div class="change-username d-flex flex-column mt-3 mb-5">
        <label class="email-info fw-bold">Họ</label>
        <input type="text" value="`+last_name+`" id="last-name" style="width:95%; height: 36px;">
        <label class="email-info fw-bold mt-3">Tên</label>
        <input type="text" value="`+first_name+`" id="first-name"style="width:95%; height: 36px;">
    </div>
    <div class="save-changes-btn text-align-center my-4">
        <button class="submit-btn" id="submit-change" type="button" onclick="changeUserName()">Lưu thay đổi</button>
    </div>
  </form>
`;
  outputProfileInfoString = string;
  return string;
}

// Config
function idToImageString(id) {
  if (id) {
    return "http://localhost:8055/assets/" + id;
  }
  // return "https://..../assets/415e18b2-1aa3-4f84-b2f9-12e0f2077860";
}

//Output content
function pushContent(id, string) {
  let element = document.getElementById(id);
  element.innerHTML = string;
}

function pushContentWithImg(id, string) {
  let element = document.getElementById(id);
  element.innerHTML = string;
  const observer = lozad(".lozad", {
    enableAutoReload: true,
  });
  observer.observe();
}

// Validate Email
function validateEmail(field) {
  let email = field.value;
  var isError = false;
  if (!email) {
    isError = true;
  }
  if (email == "") {
    isError = true;
  }
  var reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!reg.test(email)) {
    isError = true;
  }

  if (isError) {
    field.style.border = "2px solid #db3939";
    setTimeout(function () {
      field.style.border = "none";
    }, 5000);
    return false;
  }
  return true;
}

// Validate Name
function validateName(field) {
  let name = field.value;
  var isError = false;
  if (!name) {
    isError = true;
  }
  if (name == "") {
    isError = true;
  }
  var reg = /[a-zA-Z]+/g;
  if (!reg.test(name)) {
    isError = true;
  }

  if (isError) {
    field.style.border = "2px solid #db3939";
    setTimeout(function () {
      field.style.border = "none";
    }, 5000);
    return false;
  }
  return true;
}

//Validate Empty
function validateEmpty(field) {
  let value = field.value;
  var isError = false;
  if (!value) {
    isError = true;
  }
  if (value == "") {
    value = true;
  }
  if (isError) {
    field.style.border = "2px solid #db3939";
    setTimeout(function () {
      field.style.border = "none";
    }, 5000);
    return false;
  }
  return true;
}

//Validate password <8 charater
function validatePassword(field) {
  let value = field.value;
  var isError = false;
  if (!value) {
    isError = true;
  }
  if (value == "") {
    value = true;
  }
  if (value.length < 8) {
    isError = true;
  }
  if (isError) {
    field.style.border = "2px solid #db3939";
    setTimeout(function () {
      field.style.border = "none";
    }, 5000);
    return false;
  }
  return true;
}

function registerValidate(lastName, firstName, email, password, repassword) {
  if (!validateName(lastName)) {
    alertError("Họ không đúng định dạng");
    return false;
  } else if (!validateName(firstName)) {
    alertError("Tên đệm và tên không đúng định dạng");
    return false;
  } else if (!validateEmail(email)) {
    alertError("Email không đúng định dạng");
    return false;
  } else if (!validatePassword(password)) {
    alertError("Mật khẩu phải đủ 8 kí tự");
    return false;
  } else if (!validatePassword(repassword)) {
    alertError("Mật khẩu nhập lại phải đủ 8 kí tự");
    return false;
  } else if (password.value != repassword.value) {
    alertError("Mật khẩu nhập lại không khớp");
    return false;
  } else {
    return true;
  }
}
