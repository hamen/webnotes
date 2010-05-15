/*
 This file is part of 'WebNotes'.
 
 'WebNotes' is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License,
 or any later version.
 
 'WebNotes' is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with 'WebNotes'.  If not, see <http://www.gnu.org/licenses/>.
 
 Author: Ivan Morgillo < imorgillo [at] sannioglug [dot] org >
 */
function _(id) {
    return document.getElementById(id);
}

var host = location.hostname;
//var myLocalStorage = globalStorage[host]; // firefox 3+
var myLocalStorage = localStorage; // firefox 3.5+

function writeLocal() {
    var data = _('text').value;
    var itemName = _('item_name').value;
    myLocalStorage.setItem(itemName, data);
    updateItemsList();
    resetFields();
}

function deleteLocal() {
    var itemName = _('item_name').value;
    myLocalStorage.removeItem(itemName);
    updateItemsList();
    resetFields();
}

function readLocal(itemName) {
    _('note_h').firstChild.nodeValue="Edit note";
    $('#noteText').show('slow');
    _('deleteButton').disabled=false;
    _('item_name').value=itemName;
    _('text').value=myLocalStorage.getItem(itemName);
}

function updateItemsList() {
  var items = myLocalStorage.length;
    if (items > 0) {
	// list items
	var s = '<h2>Stored items:</h2>';
	s+= '<ul>';
	for (var i=0; i < items; i++) {
	    var itemName = myLocalStorage.key(i);
	    s+= '<li id="note_'+ i + '">'+
		'<span class=\"item_li\" onclick="readLocal(\''+itemName+'\');" title="Click to load"><strong>'+itemName+'</strong></span></li>';
  }
	_('items').innerHTML = s+'</ul>';	
    }
}

function resetFields(){
    _('note_h').firstChild.nodeValue="Add note";
    $('#noteText').hide();
    $('#item_name').attr("value","Put a name here");
    $('#text').attr("value","Write some text");
}

function showTextarea(){
    $('#noteText').show('slow');
}

function deleteWarning(){
    if ($('#noteText').is(':visible')){
	var item_name = _('item_name').value;
	var answer = confirm('Delete note: ' + item_name);
	
	if(answer) {
	    deleteLocal();
	}
	else {
	    $('#noteText').hide();
	}
    }
}
