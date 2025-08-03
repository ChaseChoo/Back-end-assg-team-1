-- Drop Database Script for SilverConnect
-- WARNING: This will permanently delete the BED_ASSIGNMENT database and ALL data
-- Make sure to backup any important data before running this script!

-- Use master database to drop other databases
USE master;
GO

-- Check if BED_ASSIGNMENT database exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'BED_ASSIGNMENT')
BEGIN
    PRINT 'Found BED_ASSIGNMENT database. Preparing to drop...';
    
    -- Kill all active connections to the database
    DECLARE @sql NVARCHAR(MAX) = '';
    SELECT @sql = @sql + 'KILL ' + CAST(session_id AS NVARCHAR(10)) + '; '
    FROM sys.dm_exec_sessions
    WHERE database_id = DB_ID('BED_ASSIGNMENT')
      AND session_id != @@SPID;
    
    IF @sql != ''
    BEGIN
        PRINT 'Killing active connections...';
        EXEC sp_executesql @sql;
    END
    
    -- Set database to single user mode to ensure no new connections
    ALTER DATABASE BED_ASSIGNMENT SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    
    -- Drop the database
    DROP DATABASE BED_ASSIGNMENT;
    
    PRINT 'BED_ASSIGNMENT database has been dropped successfully!';
END
ELSE
BEGIN
    PRINT 'BED_ASSIGNMENT database does not exist - nothing to drop.';
END
GO

-- Optional: List all remaining databases
PRINT 'Current databases on this server:';
SELECT name, create_date, database_id 
FROM sys.databases 
WHERE name NOT IN ('master', 'tempdb', 'model', 'msdb')
ORDER BY name;
GO
