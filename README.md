# TxtBin
Browser-based text and binary editor & inspector.  
Parse and convert data between multiple text and binary representations.

## Required
- util.js, util.py https://libutil.com/
- debug.js https://debugjs.net/
- bsb64.py https://github.com/takashiharano/bsb64
- xb64.py https://github.com/takashiharano/xb64

## Deploy
Edit the shebang in `index.cgi` and `txtbin.cgi` to the Python path of your web server.  
Deploy the files to the server as below:
```
/
|
+- txtbin/
|  |
|  +- appconfig.py [644]
|  +- index.cgi [755]
|  +- index_impl.py [644]
|  +- style.css [644]
|  +- txtbin.cgi [755]
|  +- txtbin.html [644]
|  +- txtbin.js [644]
|  +- txtbinimpl.py [644]
|
+- libs/
   |
   +- bsb64.py
   +- debug.js
   +- util.js
   +- util.py
   +- xb64.py
```

## Usage
Open the editor: http(s)://SERVER/txtbin/  
Input the source text into the textarea and select the decode mode, then decode it with the Parse button or save it to a file.  
Base64, HEX, DEC, BIN, BSB64 and XB64 are supported for decoding.  

![txtbin1](https://github.com/user-attachments/assets/470fb1fd-2c4b-4025-9c5b-e3a0ecdda69b)

You can also drag and drop a file into the textarea to convert it to binary values.    
So you can use it as a binary editor by editing the HEX values and saving them to a file with the Save button.  
The binary data written in the text is converted to a byte array on the server side and can be downloaded as a file.

![txtbin2](https://github.com/user-attachments/assets/34bd26fa-1853-4452-b119-8f60da2cd572)

Except for the save function, it also works locally as a standalone application without a server.  
In that case, just open txtbin.html.
