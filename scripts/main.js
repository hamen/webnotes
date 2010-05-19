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

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};
 
Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
};

var host = location.hostname;
//var myLocalStorage = globalStorage[host]; // firefox 3+
var myLocalStorage = localStorage; // firefox 3.5+

function writeLocal(tag) {
    var illegalChars = /\W/; // allow letters, numbers, and underscores
    if (illegalChars.test(_('item_name').value)){
	var $dialog = $('<div></div>')
	    .html('Note title can only contain letters, numbers and underscores.<br/> Don\'t use esoteric characters, please ')
	    .dialog({
			autoOpen: false,
			title: 'Bad characters'
		    });
	
	$dialog.dialog('open');
	return;
    }

    // Allow only date as yyyy-mm-dd
    var illegalDate = /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;
    if (!illegalDate.test(_('datepicker').value)){
	var $dialog = $('<div></div>')
	    .html('Date must be yyyy-mm-dd.<br/> Don\'t use esoteric characters, please ')
	    .dialog({
			autoOpen: false,
			title: 'Bad data'
		    });
	
	$dialog.dialog('open');
	return;
    }

    var note = { name: _('item_name').value,
		 data : _('text').value,
		 tag: 'normal',
		 date: _('datepicker').value
	       };
    if(tag){
	note.tag = tag;
    }
    myLocalStorage.setObject(note.name, note);
    updateItemsList();
    resetFields();
}

function deleteLocal() {
    var itemName = _('item_name').value;
    myLocalStorage.removeItem(itemName);
    updateItemsList();
    resetFields();
    if ( myLocalStorage.length === 0){
	location.reload();
    }
}

function readLocal(itemName) {
    var noteName = document.getElementById(itemName).innerHTML;

    var note = myLocalStorage.getObject(noteName);
    _('note_h').firstChild.nodeValue="Edit note";
    $('#noteText').show('slow');
    _('deleteButton').disabled=false;
    _('item_name').value = note.name;
    _('text').value = note.data;
    
    if(note.date){
	_('datepicker').value = note.date;
    }
    else {
	_('datepicker').value = '';
    }

    var encodedData = window.btoa(JSON.stringify(note));
    _('export').innerHTML = '<a href=\"data:application/webnotes;base64,' + encodedData + '>Export note</a>';
}

function updateItemsList() {
    var items = myLocalStorage.length;
    var notesArray = [];
    if (items > 0) {
	// Create a sorted array from unsorted myLocalStorage items
	for (var i=0; i < items; i++) {
	    var itemName = myLocalStorage.key(i);
	    try {
		var note = myLocalStorage.getObject(itemName);
		notesArray.push(note);
	    } catch (x) {
		if(x.message === "JSON parse"){
		    myLocalStorage.clear();
		}
		    
	    }
	    
	}
	notesArray.sort(sort_by('name', false, function(a){return a.toUpperCase();}));

	// list items
	var s = '<h2>Stored notes</h2>';
	s+= '<ul>';
	for (i = 0; i < notesArray.length; i++) {
	    var note = myLocalStorage.getObject(notesArray[i].name);
	    var tag = 'item_li_' + note.tag;

	    s+= '<li class="item_li" onclick="readLocal(\'note_'+ i + '\');" >'+
		'<span id="note_'+ i + '" title="Click to load" class="' +
		tag + '">'+note.name+'</span></li>';
	}
	_('items').innerHTML = s+'</ul>';	
    }
    else {
	_('items').innerHTML = '<h2>Stored items</h2><p>There is no note</p>';
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

function sort_by(field, reverse, primer){
	
	reverse = (reverse) ? -1 : 1;
	
	return function(a,b){
	    
	    a = a[field];
	    b = b[field];
	    
	    if (typeof(primer) != 'undefined'){
		a = primer(a);
		b = primer(b);
	    }
	    
	    if (a<b) return reverse * -1;
	    if (a>b) return reverse * 1;
	    return 0;
	};
}

function setTag(tag) {
    writeLocal(tag);
}

function getExportURI() {
    var items = myLocalStorage.length;
    var notesArray = [];
    var encodedData;
    if (items > 0) {
	for (var i=0; i < items; i++) {
	    var itemName = myLocalStorage.key(i);
	    try {
		var note = myLocalStorage.getObject(itemName);
		notesArray.push(note);
	    } catch (x) {
		if(x.message === "JSON parse"){
		    myLocalStorage.clear();
		}
	    }
	}
	encodedData = window.btoa(JSON.stringify(notesArray));
	return '<a href=\"data:application/webnotes;base64,' + encodedData + '>Export all notes</a>';
    }
}

function exportAll(){
    var exportURI = getExportURI();

    var $dialog = $('<div></div>')
	.html('Click the link below and save the opening page.<br/>' + exportURI)
	.dialog({
		    autoOpen: false,
		    title: 'Export notes'
		});

    $dialog.dialog('open');

}

function handleFiles(files) {
    // Read a file containing JSON notes from user hd
    var fileText;
    for (var i = 0; i < files.length; i++) {
	var file = files[i];
	var reader = new FileReader();
	fileText = file.getAsBinary();
    }
    var notesArray = JSON.parse(fileText);

    // Save every imported notes to localStorage
    if (notesArray.length > 0) {
    notesArray.forEach(function(item) {
			   myLocalStorage.setObject(item.name, item);
		       });
    }
    else {
	myLocalStorage.setObject(notesArray.name, notesArray);
    }
    location.reload(true);
}
