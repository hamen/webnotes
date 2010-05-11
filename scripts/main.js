function $(id) {
    return document.getElementById(id);
}

var host = location.hostname;
//var myLocalStorage = globalStorage[host]; // firefox 3+
var myLocalStorage = localStorage; // firefox 3.5+

function writeLocal() {
  var data = $('text').value;
  var itemName = $('item_name').value;
  myLocalStorage.setItem(itemName, data);
  updateItemsList();
}

function deleteLocal(itemName) {
  myLocalStorage.removeItem(itemName);
  updateItemsList();
}

function readLocal(itemName) {
  $('item_name').value=itemName;
  $('text').value=myLocalStorage.getItem(itemName);
}

function updateItemsList() {
  var items = myLocalStorage.length;
  // list items
  var s = '<h2>Items for '+host+'</h2>';
  s+= '<ul>';
  for (var i=0;i<items;i++) {
    var itemName = myLocalStorage.key(i);
    s+= '<li>'+
        '<div style="float:right;">'+
        '<input type="button" value="Load" onclick="readLocal(\''+itemName+'\');"/'+'> '+
        '<input type="button" value="Delete" onclick="deleteLocal(\''+itemName+'\');"/'+'> '+
        '</div>'+
        '<strong>'+itemName+'</strong>'+
        '</li>';
  }
  $('items').innerHTML = s+'</ul>';
}
