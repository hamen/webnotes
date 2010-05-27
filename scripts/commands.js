function enableCommands() {
    // Action keys
    $(document).bind('keystrokes', {keys: ['a']}, addNote);
    $(document).bind('keystrokes', {keys: ['l']}, createList);
    $(document).bind('keystrokes', {keys: ['d']}, deleteWarning);
    $(document).bind('keystrokes', {keys: ['e']}, exportAll);
    $(document).bind('keystrokes', {keys: ['r']}, resetFields);
    // Tags
    $(document).bind('keystrokes', {keys: ['i']}, function(){setTag("important");});
    $(document).bind('keystrokes', {keys: ['n']}, function(){setTag("normal");});
    $(document).bind('keystrokes', {keys: ['l']}, function(){setTag("later");});
}
