# TxtBin
Browser-based text and binary editor & inspector.  
Analyze and convert data between multiple text and binary representations.

## Required
- util.js https://libutil.com/
- util.py https://libutil.com/
- debug.js https://debugjs.net/
- bsb64.py https://github.com/takashiharano/bsb64
- xb64.py https://github.com/takashiharano/xb64
- sha.js https://github.com/Caligatio/jsSHA

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
   +- sha.js
   +- util.js
   +- util.py
   +- xb64.py
```

## Usage
Open the editor: http(s)://SERVER/txtbin/  
Enter the source data into the textarea and select the input mode.  
Click `ANALYZE` to inspect the data and display its information and preview, or click `SAVE` to decode and download it as a file.  
The decoder supports Base64, BSB64, XB64, and the numeric representations HEX, DEC, and BIN.  
For example, the character `A` can be represented as `41` (HEX), `65` (DEC), `01000001` (BIN), or `QQ==` (Base64).

![txtbin1](https://github.com/user-attachments/assets/3efd74fc-4b80-4c0e-97b1-e41fb81839f2)

You can also drag and drop a file into the textarea to convert it to binary values.    
This allows you to edit the HEX values and save them to a file using `SAVE`.  
The binary data represented as text is converted to a byte array on the server and can be downloaded as a file.

![txtbin2](https://github.com/user-attachments/assets/ed2ce947-c33a-4be3-95bc-131243af991c)

Except for the save function, it also works locally as a standalone application without a server.  
In that case, just open txtbin.html.
