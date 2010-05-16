function enableCommands() {
    $(document).bind('keydown', {combi: 'a', disableInInput: true}, showTextarea);    
    $(document).bind('keydown', {combi: 'r', disableInInput: true}, resetFields);    
    $(document).bind('keydown', {combi: 'd', disableInInput: true}, deleteWarning);    
    $(document).bind('keydown', {combi: 'ctrl+return', disableInInput: false}, writeLocal);    
    $(document).bind('keydown', {combi: 'i', disableInInput: true}, function(){setTag("important");});    
    $(document).bind('keydown', {combi: 'n', disableInInput: true}, function(){setTag("normal");});    
    $(document).bind('keydown', {combi: 'l', disableInInput: true}, function(){setTag("later");});    
}
