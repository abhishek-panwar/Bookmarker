window.addEventListener('load', fetchBookmarks);

document.getElementById("emImageClose").addEventListener('click', editModal_hide);
document.getElementById("imImageClose").addEventListener('click', importModal_hide);

document.getElementById("btnDownload").addEventListener('click', downloadBookmarks);
document.getElementById("updateButton").addEventListener('click', updateBookmark);
document.getElementById("btnImport").addEventListener('click', importModal_show);
document.getElementById("importInputButton").addEventListener('change', readFile, false);
document.getElementById("updateImportButton").addEventListener('click', importBookmarks);

window.onload=function(){
  buttonDelete = document.querySelectorAll("#bookmarkForm .btn-danger")
  buttonEdit = document.querySelectorAll("#bookmarkForm button.btn-default")
  if(buttonDelete)
  {
    for (i = 0; i < buttonDelete.length; i++) {
      buttonDelete[i].addEventListener('click', deleteBookmark);
    }
  }
  if(buttonEdit)
  {
    for (i = 0; i < buttonEdit.length; i++) {
      buttonEdit[i].addEventListener('click', editBookmark);
    }
  }
}

function fetchBookmarks()
{
  var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  var results = document.getElementById('bookmarksResults');
  if(bookmarks == null || bookmarks.length==0)
  {
    results.innerHTML = '<div class="well"><h4>You have no Bookmarks!!! '+
                         ' </h4></div';
  }
  else
  {
    results.innerHTML = '';
    for (var i = 0; i < bookmarks.length; i++) {
      name = bookmarks[i].name;
      url = bookmarks[i].url;

      results.innerHTML += '<div class="well"><h5>'+name+'<button class="btn btn-danger margin_left" value="'+name+'" style="float: right">delete</button> '+
                            '<button type="button" class="btn btn-default margin_left" style="float: right" value="'+name+'">edit</button>'+
                            '<a class="btn btn-default" target="_blank" href="'+url+'" style="float: right">visit</a>'+
                           ' </h5></div';
    }
  }
  console.log('Bookmarks fetched from localStorage...');
}

function deleteBookmark(event)
{
  name = event.target.value

  var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  var bookmark;
  if(bookmarks!=null)
  {
    for (var i = 0; i < bookmarks.length; i++)
    {
      if(bookmarks[i].name==name)
      {
        bookmarks.splice(i,1);
        bookmark = bookmarks[i];
      }
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  console.log('bookmark deleted...');
  //console.log('bookmark '+JSON.parse(bookmark)+' deleted...');
  location.reload();


}

function editModal_show()
{
  document.getElementById('editModal').style.display = "block";
}

function editModal_hide()
{
  document.getElementById('editModal').style.display = "none";
}

function editBookmark(event)
{
  editModal_show();
  var url;
  name = event.target.value
  var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  if(bookmarks!=null)
  {
    for (var i = 0; i < bookmarks.length; i++)
    {
      if(bookmarks[i].name==name)
      {
        url = bookmarks[i].url;
      }
    }

    document.getElementById('siteName').value = name;
    document.getElementById('siteUrl').value = url;
    localStorage.setItem('oldName', name);
    localStorage.setItem('oldUrl', url);
  }
}

function updateBookmark()
{
  var newName = document.getElementById('siteName').value;
  var newUrl = document.getElementById('siteUrl').value;
  var oldName = localStorage.getItem('oldName');
  var oldUrl = localStorage.getItem('oldUrl');

  if(!validateForm(newName, newUrl))
  {
    document.getElementById('siteName').value = oldName;
    document.getElementById('siteUrl').value = oldUrl;
    document.getElementById('updateButtonParaSuccess').innerHTML = "";

  }
  else {
    document.getElementById('updateButtonPara').innerHTML = "";
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    if(bookmarks!=null)
    {
      for (var i = 0; i < bookmarks.length; i++)
      {
        if(bookmarks[i].name==oldName && bookmarks[i].url==oldUrl)
        {
          bookmarks[i].name = newName;
          bookmarks[i].url = newUrl;
        }
      }
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      document.getElementById('updateButtonParaSuccess').innerHTML = "bookmark updated...";
      localStorage.removeItem('oldName');
      localStorage.removeItem('oldUrl');

    }
    editModal_hide()
    location.reload();
  }

}

function validateForm(siteName, siteUrl)
{
  if(!siteUrl || !siteName)
  {
    document.getElementById('updateButtonPara').innerHTML = "Incorrect Update...";
    return false
  }

  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  if (!siteUrl.match(regex)) {
    document.getElementById('updateButtonPara').innerHTML = "Invalid url...";
    return false
  }

  if(siteName.length>66)
  {
    document.getElementById('updateButtonPara').innerHTML = "Site name can not exceed 66 characters...";
    return false
  }
  return true
}

function downloadBookmarks()
{

  //alert("hello");
  chrome.storage.local.get(null, function(items) { // null implies all items
    // Convert object to a string.
    var result = localStorage.getItem('bookmarks');
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    //alert(bookmarks);
    if(bookmarks==null || bookmarks.length==0)
    {
      alert('No Bookmarks Found');
    }
    else {
      // Save as file
      var url = 'data:application/json;base64,' + btoa(result);
      chrome.downloads.download({
          url: url,
          filename: 'bookmarks.json'
      });
    }
  });
}

function importModal_show()
{
  document.getElementById('importModal').style.display = "block";
}

function importModal_hide()
{
  document.getElementById('importModal').style.display = "none";
}


function importBookmarks()
{
    var importedBookmarks = JSON.parse(sessionStorage.getItem('importedFile'));
    var bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    if(bookmarks==null)
    {
      localStorage.setItem('bookmarks', JSON.stringify(importedBookmarks));
    }
    else {
      for(var i=0;i<importedBookmarks.length;i++)
      {
        bookmarks.push(importedBookmarks[i]);
      }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

  importModal_hide();
  fetchBookmarks();
}

function readFile(e)
{
  //Retrieve the first (and only!) File from the FileList object
   var file = e.target.files[0];
   var name = file.name;
   var fileExtension = name.substr(name.length-5);
   if(fileExtension!='.json')
   {
     document.getElementById('importSuccessMessage').innerHTML = '';
     document.getElementById('importFailureMessage').innerHTML = 'Invalid file format...';
   }
   else {
     document.getElementById('importFailureMessage').innerHTML = '';
     document.getElementById('importSuccessMessage').innerHTML = 'File added...';

     var bookmarks = [];

     if (file) {
       var reader = new FileReader();
       reader.onload = function(ev) {
         var contents = JSON.parse(ev.target.result);

         for(var i=0;i<contents.length;i++)
         {
           //alert(contents[i].name);
           var bookmark = {
           name:contents[i].name,
           url:contents[i].url
          }
           bookmarks.push(bookmark);
         }

         if(sessionStorage.getItem('importedFile')===null)
         {
           sessionStorage.setItem('importedFile', JSON.stringify(bookmarks));
         }
         else {
           sessionStorage.removeItem('importedFile');
           sessionStorage.setItem('importedFile', JSON.stringify(bookmarks));
         }
       }
       reader.readAsText(file);

     } else {
       alert("Failed to load file");
     }

   }
}
