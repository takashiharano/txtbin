# txtbin - Text / Binary Editor
A simple web text editor and binary editor.

## Required
- util.js, util.py https://libutil.com/
- debug.js https://debugjs.net/
- bsb64.py https://github.com/takashiharano/bsb64

## Deploy
Edit the shebang in `txtbin.cgi` to the Python path of your web server.  
Deploy the files to the server as below:
```
/
|
+- txtbin/
|  |
|  +- index.html [644]
|  +- style.css [644]
|  +- txtbin.cgi [755]
|  +- txtbin.js [644]
|  +- txtbinimpl.py [644]
|
+- libs/
|  |
|  +- bsb64.py
|  +- debug.js
|  +- util.js
|  +- util.py
```

## Usage
Open the editor: http(s)://SERVER/txtbin/  
Input the source text into the textarea and select the decode mode, then decode or save to the file.  
Base64, HEX, DEC, BIN, Plain Text, Base64S, BSB64 are supported for decoding.

![image](https://github.com/user-attachments/assets/8389801b-ac49-4c8f-9ea6-8998054f3e20)

Except for the save function, it also works locally as a standalone application without a server.  
In that case, open index.html.
