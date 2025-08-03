-- Quick Database Reset Script
-- This script will drop and recreate the BED_ASSIGNMENT database with fresh tables

USE master;
GO

PRINT '========================================';
PRINT 'SilverConnect Database Reset Script';
PRINT '========================================';
PRINT '';

-- Step 1: Drop existing database if it exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'BED_ASSIGNMENT')
BEGIN
    PRINT '1. Dropping existing BED_ASSIGNMENT database...';
    
    -- Kill all connections and drop
    ALTER DATABASE BED_ASSIGNMENT SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE BED_ASSIGNMENT;
    
    PRINT '   ✓ Database dropped successfully';
END
ELSE
BEGIN
    PRINT '1. No existing BED_ASSIGNMENT database found';
END

-- Step 2: Create new database
PRINT '2. Creating fresh BED_ASSIGNMENT database...';
CREATE DATABASE BED_ASSIGNMENT;
PRINT '   ✓ Database created successfully';

-- Step 3: Switch to new database
USE BED_ASSIGNMENT;
GO

PRINT '3. Creating tables...';

-- Users table
CREATE TABLE Users (
    userId INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    passwordHash NVARCHAR(255) NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);
PRINT '   ✓ Users table created';

-- Doctors table
CREATE TABLE Doctors (
    doctorId INT IDENTITY(1,1) PRIMARY KEY,
    doctorName NVARCHAR(100) NOT NULL,
    specialization NVARCHAR(100) NOT NULL,
    clinicName NVARCHAR(150) NOT NULL,
    location NVARCHAR(200) NOT NULL,
    contactNumber NVARCHAR(20),
    email NVARCHAR(100),
    createdAt DATETIME2 DEFAULT GETDATE()
);
PRINT '   ✓ Doctors table created';

-- Medications table
CREATE TABLE Medications (
    medicationId INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    medicationName NVARCHAR(200) NOT NULL,
    dosage NVARCHAR(100) NOT NULL,
    frequency NVARCHAR(50) NOT NULL,
    instructions NVARCHAR(500),
    sideEffects NVARCHAR(500),
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);
PRINT '   ✓ Medications table created';

-- MedicationSchedules table
CREATE TABLE MedicationSchedules (
    scheduleId INT IDENTITY(1,1) PRIMARY KEY,
    medicationId INT NOT NULL,
    doseTime TIME NOT NULL,
    markAsTaken BIT DEFAULT 0,
    lastTaken DATETIME2,
    createdAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (medicationId) REFERENCES Medications(medicationId) ON DELETE CASCADE
);
PRINT '   ✓ MedicationSchedules table created';

-- Appointments table
CREATE TABLE Appointments (
    appointmentId INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    doctorId INT NOT NULL,
    appointmentDate DATE NOT NULL,
    appointmentTime TIME NOT NULL,
    notes NVARCHAR(500),
    status NVARCHAR(20) DEFAULT 'Scheduled',
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES Doctors(doctorId)
);
PRINT '   ✓ Appointments table created';

-- MealLogs table
CREATE TABLE MealLogs (
    mealLogId INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    mealType NVARCHAR(20) NOT NULL,
    foodItems NVARCHAR(500) NOT NULL,
    calories INT,
    mealDate DATE NOT NULL,
    notes NVARCHAR(300),
    createdAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
);
PRINT '   ✓ MealLogs table created';

-- FamilyGroups table
CREATE TABLE FamilyGroups (
    familyGroupId INT IDENTITY(1,1) PRIMARY KEY,
    groupName NVARCHAR(100) NOT NULL,
    createdBy INT NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (createdBy) REFERENCES Users(userId)
);
PRINT '   ✓ FamilyGroups table created';

-- FamilyMembers table
CREATE TABLE FamilyMembers (
    familyMemberId INT IDENTITY(1,1) PRIMARY KEY,
    familyGroupId INT NOT NULL,
    userId INT NOT NULL,
    role NVARCHAR(50) DEFAULT 'Member',
    joinedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (familyGroupId) REFERENCES FamilyGroups(familyGroupId) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    UNIQUE(familyGroupId, userId)
);
PRINT '   ✓ FamilyMembers table created';

-- Step 4: Insert sample data
PRINT '4. Inserting sample data...';

INSERT INTO Doctors (doctorName, specialization, clinicName, location, contactNumber, email) VALUES
('Dr. Sarah Chen', 'General Practitioner', 'Clementi Medical Centre', '535 Clementi Road, Singapore 599489', '+65-6460-6999', 'dr.chen@clementimc.sg'),
('Dr. Michael Tan', 'Cardiologist', 'Heart Specialist Clinic', '123 Orchard Road, Singapore 238858', '+65-6734-8888', 'dr.tan@heartclinic.sg'),
('Dr. Emily Wong', 'Endocrinologist', 'Diabetes Care Centre', '456 Jurong East Street, Singapore 609123', '+65-6565-1234', 'dr.wong@diabetescare.sg'),
('Dr. James Lim', 'Orthopedic Surgeon', 'Bone & Joint Clinic', '789 Tampines Avenue, Singapore 521789', '+65-6587-4567', 'dr.lim@boneclinic.sg'),
('Dr. Rachel Kumar', 'Geriatrician', 'Senior Health Centre', '321 Toa Payoh Lorong, Singapore 310321', '+65-6253-9876', 'dr.kumar@seniorhealth.sg');

PRINT '   ✓ Sample doctors inserted';

PRINT '';
PRINT '========================================';
PRINT 'Database reset completed successfully!';
PRINT 'Your SilverConnect application is ready to use.';
PRINT '========================================';

-- Show table summary
SELECT 
    t.name AS TableName,
    p.rows AS RecordCount
FROM sys.tables t
INNER JOIN sys.partitions p ON t.object_id = p.object_id
WHERE p.index_id < 2
ORDER BY t.name;
