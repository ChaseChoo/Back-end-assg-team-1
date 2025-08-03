-- Add language preference column to Users table
-- This script adds language localization support

USE SilverConnectDB;
GO

-- Add language preference column if it doesn't exist
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'languagePreference')
BEGIN
    ALTER TABLE Users 
    ADD languagePreference NVARCHAR(10) DEFAULT 'en' NOT NULL;
    
    PRINT 'Language preference column added to Users table.';
END
ELSE
BEGIN
    PRINT 'Language preference column already exists in Users table.';
END
GO

-- Update existing users to have default English preference
UPDATE Users 
SET languagePreference = 'en' 
WHERE languagePreference IS NULL;

PRINT 'Language preference updated for existing users.';
GO
