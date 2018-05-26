document.getElementById("myForm").addEventListener('submit', saveBookmark);
window.addEventListener('load', saveBookmark1);



function saveBookmark1(e)
{
  //alert(document.getElementById("myForm"));
  //alert("hello")
  chrome.tabs.getSelected(null,function(tab) { // null defaults to current window
    var title = tab.title;
    var url = tab.url;
    document.getElementById('siteName').value = title;
    document.getElementById('siteUrl').value = url;

  });

}


function saveBookmark(e)
{
  // var currentUrl = window.location.href;
  // alert("vjdnvj");
  //console.log(currentUrl);
  var siteName = document.getElementById('siteName').value;
  var siteUrl = document.getElementById('siteUrl').value;
  //alert(siteUrl);


  if(!validateForm(siteName, siteUrl))
  {
    return false
  }

  if(!siteUrl.includes("http://") && !siteUrl.includes("https://") && siteUrl.includes("www."))
  {
    siteUrl = "https://"+siteUrl;
  }

    var bookmark = {
    name:siteName,
    url:siteUrl
  }

  //alert(bookmark)
  //
  // //console.log(bookmark);
  //
  if(localStorage.getItem('bookmarks')===null)
  {
    var bookmarks = [];
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    //localStorage.setItem('bookmarks', bookmarks);
    //console.log(bookmarks);

  }
  else {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    if(!bookmarkExist(bookmarks, bookmark))
    {
      bookmarks.push(bookmark);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    else {
      alert("already exist");
    }

    //console.log(bookmarks);
  }
  //
  //
  //document.getElementById('myForm').reset();
  // fetchBookmarks();
  // //e.preventDefault();

  //alert(localStorage.getItem('bookmarks'));


}

function bookmarkExist(bookmarks, bookmark)
{
  for (var i = 0; i < bookmarks.length; i++) {
    name = bookmarks[i].name;
    url = bookmarks[i].url;

    if(name==bookmark.name)
    {
      return true;
    }
  }
  return false;
}


function validateForm(siteName, siteUrl)
{
  if(!siteUrl || !siteName)
  {
    alert("please fill the form");
    return false
  }

  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  if (!siteUrl.match(regex)) {
    alert("Invalid URL");
    return false
  }
  return true

}
