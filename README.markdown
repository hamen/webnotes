# WebNotes
WebNotes is a simple TODO list app, based on *localStorage* HTML5 feature. Every note you take stays in your personal Firefox/IE/Safari profile. Nothing is sent from your PC to the Internet.

# Usage
You can use WebNotes from [here](http://hamen.github.com/webnotes) or
run your own local copy.

## Local copy
### Opera/Safari
Simply
[download](http://github.com/hamen/itasanotifier/archives/master)
sources and extract them somewhere. Open *index.html* It should work.

### Firefox
Sorry, but you cannot run WebNotes locally with Firefox, 'cos [this
bug](https://bugzilla.mozilla.org/show_bug.cgi?id=507361).

But if you are using GNU/Linux, you can run a tiny webserver in
WebNotes folder with:

`hamen@horus:~/webnotes$ python -m SimpleHTTPServer`

and point you Firefox to [127.0.0.1:8000](http://127.0.0.1:8000)

# Security
It should be safe enough to use WebNotes from
[here](http://hamen.github.com/webnotes), but if you are worry you can
read [here](http://dev.w3.org/html5/webstorage/#security-storage) and
choose if a local instance is safer for you ;)
