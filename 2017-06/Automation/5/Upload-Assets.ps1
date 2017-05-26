$ErrorActionPreference = "Stop"

$tenantUrl = "https://mstnd901684.sharepoint.com/sites/sugbg "

#Connect to Tenant
Connect-PnPOnline –Url $tenantUrl  -Credentials "O365-mstnd901684"

# upload files  
Add-PnPFile -Path '..\..\5. react\dist\sugbg.js' -Folder "\Style Library\SUGBG\CDN" -Checkout  -Publish | Out-Null
Add-PnPFile -Path '..\..\5. react\dist\sugbg.js.map' -Folder "\Style Library\SUGBG\CDN" -Checkout  -Publish | Out-Null
Add-PnPFile -Path '..\..\5. react\spcomponent.html' -Folder "\Style Library\SUGBG" -Checkout  -Publish | Out-Null
