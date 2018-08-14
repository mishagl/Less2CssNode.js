Automate LESS2CSS compilation by monitoring folder for changes in .less files and compiling them to .css upon creating or update.

To run less2css.js as a Windows service, run the following:
c:\nssm-2.12\win32\nssm.exe install less2css-node "c:\Program Files\nodejs\node.exe" c:\nodejs\server\less2css.js

### Install Prerequisites
* [NSSM](https://nssm.cc/) - the Non-Sucking Service Manager
