Add-PSSnapin Microsoft.SharePoint.PowerShell
Import-Module Microsoft.Online.SharePoint.PowerShell -DisableNameChecking


###########################################################################################

## Migrate SharePoint Library to SharePoint Online

# Step 1: Export on premise data
Export-spweb "https://intranet.cosingens.com" `
            -ItemUrl "/SUGBGDocs" `
            -path "\\COS-DEV-05\_FileShare\EXPORT_1_Files" `
            -IncludeUserSecurity `
            -NoFileCompr -IncludeVersions 4 #new 


$targetSPOSite = "https://modXXXX.sharepoint.com/sites/sugbg6/"

# Step 2: Convert the on premise data to SharePoint Online packadge
# - conect 
$userName = "admin@modXXXX.onmicrosoft.com"
$creds = Get-Credential $userName
# - convert
ConvertTo-SPOMigrationTargetedPackage `
   -SourceFilesPath "\\COS-DEV-05\_FileShare\EXPORT_1_Files" `
   -SourcePackagePath "\\COS-DEV-05\_FileShare\EXPORT_1_Files" `
   -OutputPackagePath "\\COS-DEV-05\_FileShare\EXPORT_1_Converted_Package" `
   -TargetWebUrl $targetSPOSite `
   -TargetDocumentLibraryPath "/SUGBGDocs" `
   -Credentials $creds

# Step 3: Upload the packages to Azure Storage
cls
# 3.1 Create Create storage account


# /settings already created account /
$storageAccount = "uploadtospo"
$key1 = "<add value>"

#tool: Azure Storage Explore

# 
$guid = [guid]::NewGuid().ToString()
$PackageContainerName = "Package-" + $guid
$FilesContainerName = "Files-" + $guid
 
# 3.2 Upload to Azure 
$azurelocations = Set-SPOMigrationPackageAzureSource `
                    -SourceFilesPath "\\COS-DEV-05\_FileShare\EXPORT_1_Files" `
                    -SourcePackagePath "\\COS-DEV-05\_FileShare\EXPORT_1_Converted_Package" `
                    -AccountName $storageAccount `
                    -AccountKey $key1 `
                    -PackageContainerName $PackageContainerName `
                    -FileContainerName $FilesContainerName

# 4. Upload to Azure 
$job = Submit-SPOMigrationJob `
            -TargetWebUrl $targetSPOSite `
            -MigrationPackageAzureLocations $azurelocations `
            -Credentials $creds


Remove-SPOMigrationJob -JobId $job[0].Guid `
                        -TargetWebUrl $targetSPOSite `
                        -Credentials $creds



###############################################
<#
    1. Columns and Content Types

    2. Lookup list

    3. Taxonomy 

    4. Users

    5. Security

    6. 
#>





Connect-PnPOnline -Url $sourceSiteUrl
$template = Get-PnPProvisioningTemplate -OutputInstance -IncludeSiteGroups  -SkipVersionCheck -Force #-IncludeSearchConfiguration


New-PnPTenantSite -Url $newSiteUrl -Title $newSiteTitle -Template $newSiteTemplate -Owner $newSiteOwner -TimeZone $TimezoneId
Connect-PnPOnline -Url $newSiteUrl
Apply-PnPProvisioningTemplate -InputInstance $template


$siteUrl = "https://modXXXX.sharepoint.com/sites/training"

$userName = "admin@modXXXX.onmicrosoft.com"
$creds = Get-Credential $userName
Connect-PnPOnline -Url $siteUrl -Credentials $creds

Apply-PnPProvisioningTemplate -Path template.xml


Connect-SPOnline -Url "https://intranet.cosingens.com" -CurrentCredentials

Export-PnPTaxonomy -IncludeID -TermStoreName "Site Terms" -Path "C:\Users\administrator.COSINGENS\Desktop\_SUGBG\site-terms.txt"

Include-PnPTaxonomy -IncludeID -TermStoreName "Site Terms" -Path "C:\Users\administrator.COSINGENS\Desktop\_SUGBG\site-terms.txt"





################ files shared ##########################

$userName = "admin@modXXXX.onmicrosoft.com"
$creds = Get-Credential $userName

New-SPOMigrationPackage `
     -SourceFilesPath "\\COS-DEV-05\_FileShare\Docs" ` #EXPORT_2_Files
     -OutputPackagePath "\\COS-DEV-05\_FileShare\EXPORT_2_Package" `
     -TargetWebUrl "https://modXXXX.sharepoint.com/sites/sugbg2/" `
     -TargetDocumentLibraryPath "/Files"


 
ConvertTo-SPOMigrationTargetedPackage `
   -SourceFilesPath "\\COS-DEV-05\_FileShare\Docs" `
   -SourcePackagePath "\\COS-DEV-05\_FileShare\EXPORT_2_Package" `
   -OutputPackagePath "\\COS-DEV-05\_FileShare\EXPORT_2_Converted_Package" `
   -TargetWebUrl "https://modXXXX.sharepoint.com/sites/sugbg2/" `
   -TargetDocumentLibraryPath "/Files" `
   -Credentials $creds


$storageAccount = "uploadtospo"
$key1 = "kBjcwJGqHgBJqpZ8awOZrkx79Y6/6tl1+TLKpavC/MbxvQmHVvnzk1VzvRL+0JVXVq6VyP7pdq6FlJXB/LfCdA=="


$guid = [guid]::NewGuid().ToString()
$PackageContainerName = "Package-" + $guid
$FilesContainerName = "Files-" + $guid
 
 
$azurelocations = Set-SPOMigrationPackageAzureSource `
                    -SourceFilesPath "\\COS-DEV-05\_FileShare\Docs" `
                    -SourcePackagePath "\\COS-DEV-05\_FileShare\_System\Package_target5" `
                    -AccountName $storageAccount `
                    -AccountKey $key1 `
                    -PackageContainerName $PackageContainerName `
                    -FileContainerName $FilesContainerName

$job = Submit-SPOMigrationJob `
            -TargetWebUrl "https://modXXXX.sharepoint.com/sites/sugbg2/" `
            -MigrationPackageAzureLocations $azurelocations `
            -Credentials $creds