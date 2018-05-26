document.getElementById("myForm").addEventListener('submit', saveBookmark);

function saveBookmark(e)
{
  var siteName = document.getElementById('siteName').value;
  var siteUrl = document.getElementById('siteUrl').value;

  if(!validateForm(siteName, siteUrl))
  {
    return false
  }

  if(!siteUrl.includes("http://"))
  {
    siteUrl = "http://"+siteUrl;
  }


    var bookmark = {
    name:siteName,
    url:siteUrl
  }

  //console.log(bookmark);

  if(localStorage.getItem('bookmarks')===null)
  {
    var bookmarks = [];
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    //localStorage.setItem('bookmarks', bookmarks);
    console.log(bookmarks);

  }
  else {
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    console.log(bookmarks);
  }


  document.getElementById('myForm').reset();
  fetchBookmarks();
  //e.preventDefault();

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

function deleteBookmark(name)
{
  var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  if(bookmarks!=null)
  {
    for (var i = 0; i < bookmarks.length; i++)
    {
      if(bookmarks[i].name==name)
      {
        bookmarks.splice(i,1);
      }
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  fetchBookmarks();
}


function fetchBookmarks()
{
  var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  if(bookmarks!=null)
  {
    var results = document.getElementById('bookmarksResults');
    results.innerHTML = '';
    for (var i = 0; i < bookmarks.length; i++) {
      name = bookmarks[i].name;
      url = bookmarks[i].url;
      console.log(url);

      results.innerHTML += '<div class="well"><h3>'+name+' <a class="btn btn-default" target="_blank" href="'+url+'">visit</a> '+
                           ' <a onclick="deleteBookmark(\''+name+'\')" class="btn btn-danger">delete</a></h3></div';

    }
  }
}
