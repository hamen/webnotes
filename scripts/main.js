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
    // allow letters, numbers, whitespaces, underscores, , . ' ` ! ? -
    var illegalChars = /\w*\s\,\.\'\`\!\?\-/g; 
    if (illegalChars.test($('#item_name').val())){
	var $dialog = $('<div></div>')
	    .html('Note title can only contain letters, numbers and underscores.<br/> Don\'t use esoteric characters, please ')
	    .dialog({
			autoOpen: false,
			title: 'Bad characters'
		    });
	
	$dialog.dialog('open');
	return;
    }
   
    if ($('#datepicker').val()){
	// Allow only date as yyyy-mm-dd
	var illegalDate = /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;
	if (!illegalDate.test($('#datepicker').val())){
	    var $dialog = $('<div></div>')
		.html('Date must be yyyy-mm-dd.<br/> Don\'t use esoteric characters, please ')
		.dialog({
			    autoOpen: false,
			    title: 'Bad data'
			});
	    
	    $dialog.dialog('open');
	    return;
	}
    }
    
    if (illegalChars.test($('#listNameField').val())){
	var $dialog = $('<div></div>')
	    .html('List can only contain letters, numbers and underscores.<br/> Don\'t use esoteric characters, please ')
	    .dialog({
			autoOpen: false,
			title: 'Bad characters'
		    });
	
	$dialog.dialog('open');
	return;
    }
    
    // Allow only date as yyyy-mm-dd
    if($('#datepicker').val()){
	var illegalDate = /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/;
	if (!illegalDate.test($('#datepicker').val())){
	    var $dialog = $('<div></div>')
		.html('Date must be yyyy-mm-dd.<br/> Don\'t use esoteric characters, please ')
		.dialog({
			    autoOpen: false,
			    title: 'Bad data'
			});
	    
	$dialog.dialog('open');
	    return;
	}
    }

    var note = { name: $('#item_name').val(),
		 type: 'note',
		 mother: $('#listNameField').val(),
		 data : $('#text').val(),
		 tag: 'normal',
		 date: $('#datepicker').val()
	       };
    if(tag){
	note.tag = tag;
    }
    if($('#listNameField').val() == ''){
	note.mother = 'none';
    }
//    alert('note.name is: ' + note.name + ' and note is: ' + note.toSource());
    myLocalStorage.setObject(note.name, note);
    updateItemsList();
    resetFields();
}

function deleteLocal() {
    var itemName = $('#item_name').val();
    myLocalStorage.removeItem(itemName);
    updateItemsList();
    resetFields();
    if ( myLocalStorage.length === 0){
	location.reload();
    }
}

function readLocal(itemName) {
    var note = myLocalStorage.getObject(itemName);
    $('#note_h').html("Edit note");
    $('#noteText').show('slow');
    $('#deleteButton').disabled = false;
    $('#item_name').val(note.name);
    $('#text').val(note.data);
    
    if(note.date){
	$('#datepicker').val(note.date);
    }
    else {
	$('#datepicker').val('');
    }
    if(note.mother != 'none'){
	$('#listNameField').val(note.mother);
    }
    else {
	$('#listNameField').val('');
    }
    var encodedData = window.btoa(JSON.stringify(note));
    $('#export').html('<a href=\"data:application/webnotes;base64,' + encodedData + '>Export note</a>');
}

function updateItemsList() {
    var arrays = getNotesNLists();
    arrays.notesArray.sort(sort_by('name', false, function(a){return a.toUpperCase();}));
    arrays.listsArray.sort(sort_by('name', false, function(a){return a.toUpperCase();}));
	
//	alert('lists: ' + listsArray.toSource() + '\nnotes: ' + notesArray.toSource());

	// Create note list
	$('#items').empty();
	$('#items').append('<ul id="itemsUL"></ul>');
	$(arrays.notesArray).each(function(n){
			       var item = $('<li></li>');
			       item.attr('onclick', 'readLocal("'+this.name+'")');
			       item.attr('class', 'item_li_' + this.tag);
			       item.html(this.name);
			       $('#itemsUL').append(item);
			   });
}

function resetFields(){
    $('#note_h').val("Add note");
    $('#noteText').hide();
    $('#item_name').attr("value","Put a name here");
    $('#text').attr("value","Write some text");
}

function addNote(){
    resetFields();
    $('#noteText').show('slow');
}

function deleteWarning(){
    if ($('#noteText').is(':visible')){
	var item_name = $('#item_name').val();
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

function createList() {
    var name = prompt('List name:');
    
    var list = {
	name: name,
	type: 'list',
	children: []
    };
    myLocalStorage.setObject(list.name, list);
}

function getNotesNLists(){
    var items = myLocalStorage.length;
    var arrays = {
	notesArray: [],
	listsArray: []
    };

    if (items > 0) {
	for (var i=0; i < items; i++) {
	    var itemName = myLocalStorage.key(i);
	    try {
		var item = myLocalStorage.getObject(itemName);
		if(item.type == 'note'){
		    arrays.notesArray.push(item);		    
		}
		if(item.type == 'list'){
		    arrays.listsArray.push(item);
		}
	    } catch (x) {
		if(x.message === "JSON parse"){
		    myLocalStorage.clear();
		}
	    }
	}
    }
    return arrays;
}
