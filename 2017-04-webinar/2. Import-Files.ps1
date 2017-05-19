Add-PSSnapin Microsoft.SharePoint.PowerShell

Import-Module Microsoft.Online.SharePoint.PowerShell -DisableNameChecking



################ files shared ##########################

$targetSPOSite = "https://modXXXX.sharepoint.com/sites/sugbg4/"

$userName = "admin@modXXXX.onmicrosoft.com"
$creds = Get-Credential $userName

New-SPOMigrationPackage `
     -SourceFilesPath "\\COS-DEV-05\_FileShare\Docs" `
     -OutputPackagePath "\\COS-DEV-05\_FileShare\EXPORT_2_Package" `
     -TargetWebUrl $targetSPOSite `
     -TargetDocumentLibraryPath "/Files"


 
ConvertTo-SPOMigrationTargetedPackage `
   -SourceFilesPath "\\COS-DEV-05\_FileShare\Docs" `
   -SourcePackagePath "\\COS-DEV-05\_FileShare\EXPORT_2_Package" `
   -OutputPackagePath "\\COS-DEV-05\_FileShare\EXPORT_2_Converted_Package" `
   -TargetWebUrl $targetSPOSite `
   -TargetDocumentLibraryPath "/Files" `
   -Credentials $creds


$storageAccount = "uploadtospo"
$key1 = "<add value>"


$guid = [guid]::NewGuid().ToString()
$PackageContainerName = "Package-" + $guid
$FilesContainerName = "Files-" + $guid
 
 
$azurelocations = Set-SPOMigrationPackageAzureSource `
                    -SourceFilesPath "\\COS-DEV-05\_FileShare\Docs" `
                    -SourcePackagePath "\\COS-DEV-05\_FileShare\EXPORT_2_Converted_Package" `
                    -AccountName $storageAccount `
                    -AccountKey $key1 `
                    -PackageContainerName $PackageContainerName `
                    -FileContainerName $FilesContainerName

$job = Submit-SPOMigrationJob `
            -TargetWebUrl $targetSPOSite `
            -MigrationPackageAzureLocations $azurelocations `
            -Credentials $creds