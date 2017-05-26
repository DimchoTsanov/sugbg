@echo off

set CONFIG_FOLDER="%~dp0config"
set MODULE_FOLDER="%~dp0module"
::set PROVISIONING_FOLDER="%~dp0provisioning"
set SPENV=%1

IF [%1]==[] set SPENV=DEV

powershell.exe -executionpolicy bypass -file "%~dp0Upload-Assets.ps1"
::powershell.exe -executionpolicy bypass -file %PROVISIONING_FOLDER%\Uplaod-Assets.ps1

set CONFIG_FOLDER=""
set MODULE_FOLDER=""
set PROVISIONING_FOLDER=""

pause