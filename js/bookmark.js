window.addEventListener('load', fetchBookmarks);
var button
window.onload=function(){
  button = document.querySelectorAll("#bookmarkForm .btn-danger")
  if(button)
  {
    for (i = 0; i < button.length; i++) {
      button[i].addEventListener('click', deleteBookmark);
    }
  }
}



function fetchBookmarks()
{
  //alert("hello")
  var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  //alert(bookmarks)
  var results = document.getElementById('bookmarksResults');
  if(bookmarks == null || bookmarks.length==0)
  {
    results.innerHTML = '<div class="well"><h4>You have no Bookmarks!!! '+
                         ' </h4></div';
  }
  //if(bookmarks!=null)
  else
  {
    //alert(results)
    results.innerHTML = '';
    for (var i = 0; i < bookmarks.length; i++) {
      name = bookmarks[i].name;
      //name = name.slice(0,55)+'...';
      url = bookmarks[i].url;
      //console.log(url);

      // results.innerHTML += '<div class="well"><h3>'+name+' <a class="btn btn-default" target="_blank" href="'+url+'">visit</a> '+
      //                      ' <a onclick="deleteBookmark(\''+name+'\')" class="btn btn-danger">delete</a></h3></div';

      results.innerHTML += '<div class="well"><h4>'+name+'<button type="submit" class="btn btn-danger margin_left" value="'+name+'" style="float: right">delete</button> '+
                            '<a class="btn btn-default" target="_blank" href="'+url+'" style="float: right">visit</a>'+
                           ' </h4></div';
    }
  }
}

function deleteBookmark(event)
{
  name = event.target.value

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
  location.reload();
  //fetchBookmarks();
}
