Add-PSSnapin Microsoft.SharePoint.PowerShell



# 1) Backup\Restore SPWeb
# onpremise SharePoint 2013 
Export-spweb "https://intranet.cosingens.com" `
             -path \\COS-DEV-05\_FileShare\_System\tests\web_with_security.cmp `
             -IncludeVersions All `
             -IncludeUserSecurity 

Import-spweb "https://sharepoint.cosingens.com/sites/restore2" `
             -path \\COS-DEV-05\_FileShare\_System\tests\web_with_security.cmp `
             -IncludeUserSecurity 



# 2) Backup\Restore library
# onpremise SharePoint 2013 
Export-spweb "https://intranet.cosingens.com" `
            -ItemUrl "/sugbg" `
            -path \\COS-DEV-05\_FileShare\_System\tests\library_with_security1.cmp `
            -IncludeVersions All `
            -IncludeUserSecurity 

Import-spweb "https://sharepoint.cosingens.com/sites/restore3" `
             -path \\COS-DEV-05\_FileShare\_System\tests\library_with_security1.cmp `
             -IncludeUserSecurity
