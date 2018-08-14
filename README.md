To run less2css.js as a Windows service, run the following:
c:\nssm-2.12\win32\nssm.exe install less2css-node "c:\Program Files\nodejs\node.exe" c:\nodejs\server\less2css.js

### Install Prerequisites
* [NSSM](https://nssm.cc/) - the Non-Sucking Service Manager
* [LESS](http://lesscss.org/) - It's CSS, with just a little more.

```
Once the service is running, open your browser and navigate to http://localhost:8000
Web form will allow you to upload your LESS file and in return you will get a compiled CSS file.
```
