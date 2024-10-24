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
Base64, HEX, DEC, BIN, Base64S, BSB64 are supported for decoding.  

![txtbin1](https://github.com/user-attachments/assets/8389801b-ac49-4c8f-9ea6-8998054f3e20)

You can also drag and drop the file into the text area to convert to binary values.    
So you can use it as a binary editor by editing the HEX values and saving it to a file with the save button.  
The binary value written in the text is converted to a byte array on the server side and can be downloaded as a file.

![txtbin2](https://github.com/user-attachments/assets/b023dfb0-5641-41cc-a789-2660285e194a)

Except for the save function, it also works locally as a standalone application without a server.  
In that case, just open index.html.
