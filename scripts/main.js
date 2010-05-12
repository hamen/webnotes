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

function deleteLocal() {
    var itemName = $('item_name').value;
    myLocalStorage.removeItem(itemName);
    updateItemsList();
    location.reload(true);
}

function readLocal(itemName) {
    $('deleteButton').disabled=false;
    $('item_name').value=itemName;
    $('text').value=myLocalStorage.getItem(itemName);
}

function updateItemsList() {
  var items = myLocalStorage.length;
  // list items
  var s = '<h2>Items for '+host+'</h2>';
  s+= '<ul>';
  for (var i=0; i < items; i++) {
    var itemName = myLocalStorage.key(i);
    s+= '<li>'+
	  '<span onclick="readLocal(\''+itemName+'\');" title="Click to load"><strong>'+itemName+'</strong></span>'+ 
          '</li>';
  }
  $('items').innerHTML = s+'</ul>';
}
