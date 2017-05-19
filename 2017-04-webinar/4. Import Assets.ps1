#Import-Module MSOnline 
#Import-Module SharePointPnPPowerShellOnline


<#
    What we need?
     - Import of the site assets.
        1. Taxonomy 

        2. Columns and Content Types, List Intances
        3. [?] Create\Import Lookup list

#>




$targetSiteUrl = "https://modXXXX.sharepoint.com/sites/sugbg6"  #!!!!


$userName = "admin@modXXXX.onmicrosoft.com"
$creds = Get-Credential $userName
Connect-PnPOnline -Url $targetSiteUrl -Credentials $creds
# 1. Global
Import-PnPTaxonomy -Path "\\192.168.0.105\_FileShare\Provisioning\GlobalTerms.txt"

# 1. Site
Import-PnPTaxonomy -SynchronizeDeletions -Path "\\192.168.0.105\_FileShare\Provisioning\SiteTerms.txt"

#verification
#Export-PnPTaxonomy -IncludeID -Path "Terms.txt"

Apply-PnPProvisioningTemplate -Path "\\192.168.0.105\_FileShare\Provisioning\template-Edited4.xml"