@echo off
echo Setting up SilverConnect Database...
echo.
echo Please follow these steps:
echo.
echo 1. Open SQL Server Management Studio (SSMS) or Azure Data Studio
echo 2. Connect to your SQL Server instance (localhost\SQLEXPRESS)
echo 3. Create the database 'BED_ASSIGNMENT' if it doesn't exist:
echo    CREATE DATABASE BED_ASSIGNMENT;
echo 4. Open the file: database-setup.sql
echo 5. Execute the script to create all tables
echo.
echo After completing these steps, your registration should work!
echo.
pause
