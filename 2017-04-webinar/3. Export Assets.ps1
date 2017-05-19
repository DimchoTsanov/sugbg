#Add-PSSnapin Microsoft.SharePoint.PowerShell
#Import-Module Microsoft.Online.SharePoint.PowerShell -DisableNameChecking

<# 
    BE Careful for the Modul version you need:

    - Install-Module SharePointPnPPowerShellOnline

    - Install-Module SharePointPnPPowerShell2016

    - Install-Module SharePointPnPPowerShell2013

 
 Link: https://github.com/SharePoint/PnP-PowerShell

#>


<#
    What we need?
     - Export\Import of the site assets. 
        1. Columns and Content Types
        2. Taxonomy
        3. Lookup list
    
#>



## Export Columns, Content Types, List Intances 
## Approach: using the Patterns and Practices code (cmds)

$sourceSiteUrl = "https://intranet.cosingens.com"


Connect-PnPOnline -Url $sourceSiteUrl -CurrentCredentials
Get-PnPProvisioningTemplate `
                 -IncludeSiteGroups `
                 -SkipVersionCheck `
                 -Out \\COS-DEV-05\_FileShare\Provisioning\template6.xml
                 #-OutputInstance `

# Documentation: https://github.com/SharePoint/PnP-PowerShell/blob/master/Documentation/GetPnPProvisioningTemplate.md


## Taxonomy
# Approach 1: Export\Import the terms with Ids
Connect-SPOnline -Url $sourceSiteUrl -CurrentCredentials

# -- export Global Temrs
Export-PnPTaxonomy `
            -IncludeID `
            -TermSetId 9956fa8d-11ba-4650-ad21-ead26ca62a15 `
            -Path "\\COS-DEV-05\_FileShare\Provisioning\GlobalTerms.txt"


# -- export Site Temrs
Export-PnPTaxonomy `
            -IncludeID `
            -TermSetId be7d6a18-cace-46dc-a0bf-f8f6e766021b `
            -Path "\\COS-DEV-05\_FileShare\Provisioning\SiteTerms.txt"
            #-TermStoreName "Managed Metadata Service Application" `



# Documentation: https://github.com/SharePoint/PnP-PowerShell/blob/master/Documentation/ExportPnPTaxonomy.md

# Approach 2: Hybrid!

