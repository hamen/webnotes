function enableCommands() {
    $(document).bind('keydown', {combi: 'a', disableInInput: true}, showTextarea);    
    $(document).bind('keydown', {combi: 'r', disableInInput: true}, resetFields);    
    $(document).bind('keydown', {combi: 'd', disableInInput: true}, deleteWarning);    
    $(document).bind('keydown', {combi: 'ctrl+return', disableInInput: false}, writeLocal);    
}
