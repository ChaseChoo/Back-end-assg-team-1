-- Create SQL Server Login and User
-- Run this in SQL Server Management Studio

-- Create the login at server level
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'BEDASG')
BEGIN
    CREATE LOGIN BEDASG WITH PASSWORD = 'Pixelmon12345';
    PRINT 'Login BEDASG created successfully.';
END
ELSE
BEGIN
    PRINT 'Login BEDASG already exists.';
END

-- Switch to your database
USE BED_ASSIGNMENT;
GO

-- Create user in the database
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'BEDASG')
BEGIN
    CREATE USER BEDASG FOR LOGIN BEDASG;
    PRINT 'User BEDASG created in BED_ASSIGNMENT database.';
END
ELSE
BEGIN
    PRINT 'User BEDASG already exists in database.';
END

-- Grant necessary permissions
ALTER ROLE db_owner ADD MEMBER BEDASG;
PRINT 'BEDASG user granted db_owner permissions.';

PRINT 'Database authentication setup completed!';
