document.getElementById("btnAdd").addEventListener('click', saveBookmark);
window.addEventListener('load', loadBookmark);

function loadBookmark(e)
{
  chrome.tabs.getSelected(null,function(tab) { // null defaults to current window
    var title = tab.title;
    var url = tab.url;
      if(title.length>66)
      {
        title = title.substring(0,65);
      }
    document.getElementById('siteName').value = title;
    document.getElementById('siteUrl').value = url;
  });
}

function saveBookmark(e)
{
  var siteName = document.getElementById('siteName').value;
  var siteUrl = document.getElementById('siteUrl').value;
  if(siteName.length>66)
  {
    siteName = siteName.substring(0,65);
  }
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
  if(localStorage.getItem('bookmarks')===null)
  {
    var bookmarks = [];
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    document.getElementById('successMessage').innerHTML='Bookmark added...';
  }
  else {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    if(!bookmarkExist(bookmarks, bookmark))
    {
      bookmarks.push(bookmark);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      document.getElementById('failureMessage').innerHTML='';
      document.getElementById('successMessage').innerHTML='Bookmark added...';
    }
    else {
      document.getElementById('successMessage').innerHTML='';
      document.getElementById('failureMessage').innerHTML='Bookmark already exists...';
    }
  }
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
    document.getElementById('failureMessage').innerHTML='Please fill the form...';
    return false
  }

  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  if (!siteUrl.match(regex)) {
    document.getElementById('failureMessage').innerHTML='Invalid URL...';
    return false
  }
  return true
}
