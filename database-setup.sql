-- SilverConnect Database Setup Script
-- Run this script in SQL Server Management Studio or Azure Data Studio

-- WARNING: This script will DROP and RECREATE the BED_ASSIGNMENT database
-- All existing data will be PERMANENTLY DELETED!
-- Make sure to backup any important data before running this script.

-- Check if database exists and drop it
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'BED_ASSIGNMENT')
BEGIN
    PRINT 'Dropping existing BED_ASSIGNMENT database...';
    
    -- Set database to single user mode to close all connections
    ALTER DATABASE BED_ASSIGNMENT SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    
    -- Drop the database
    DROP DATABASE BED_ASSIGNMENT;
    
    PRINT 'BED_ASSIGNMENT database dropped successfully.';
END
ELSE
BEGIN
    PRINT 'BED_ASSIGNMENT database does not exist.';
END
GO

-- Create fresh database
PRINT 'Creating new BED_ASSIGNMENT database...';
CREATE DATABASE BED_ASSIGNMENT;
GO

PRINT 'BED_ASSIGNMENT database created successfully.';
PRINT 'Switching to BED_ASSIGNMENT database...';
USE BED_ASSIGNMENT;
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        userId INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        email NVARCHAR(100) NOT NULL UNIQUE,
        passwordHash NVARCHAR(255) NOT NULL,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
    );
    PRINT 'Users table created successfully.';
END
ELSE
BEGIN
    PRINT 'Users table already exists.';
END
GO

-- Create Doctors table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Doctors' AND xtype='U')
BEGIN
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
    PRINT 'Doctors table created successfully.';
END
ELSE
BEGIN
    PRINT 'Doctors table already exists.';
END
GO

-- Create Medications table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Medications' AND xtype='U')
BEGIN
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
    PRINT 'Medications table created successfully.';
END
ELSE
BEGIN
    PRINT 'Medications table already exists.';
END
GO

-- Create MedicationSchedules table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='MedicationSchedules' AND xtype='U')
BEGIN
    CREATE TABLE MedicationSchedules (
        scheduleId INT IDENTITY(1,1) PRIMARY KEY,
        medicationId INT NOT NULL,
        doseTime TIME NOT NULL,
        markAsTaken BIT DEFAULT 0,
        lastTaken DATETIME2,
        createdAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (medicationId) REFERENCES Medications(medicationId) ON DELETE CASCADE
    );
    PRINT 'MedicationSchedules table created successfully.';
END
ELSE
BEGIN
    PRINT 'MedicationSchedules table already exists.';
END
GO

-- Create Appointments table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Appointments' AND xtype='U')
BEGIN
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
    PRINT 'Appointments table created successfully.';
END
ELSE
BEGIN
    PRINT 'Appointments table already exists.';
END
GO

-- Create MealLogs table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='MealLogs' AND xtype='U')
BEGIN
    CREATE TABLE MealLogs (
        mealLogId INT IDENTITY(1,1) PRIMARY KEY,
        userId INT NOT NULL,
        mealType NVARCHAR(20) NOT NULL, -- Breakfast, Lunch, Dinner, Snack
        foodItems NVARCHAR(500) NOT NULL,
        calories INT,
        mealDate DATE NOT NULL,
        notes NVARCHAR(300),
        createdAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE
    );
    PRINT 'MealLogs table created successfully.';
END
ELSE
BEGIN
    PRINT 'MealLogs table already exists.';
END
GO

-- Create FamilyGroups table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FamilyGroups' AND xtype='U')
BEGIN
    CREATE TABLE FamilyGroups (
        familyGroupId INT IDENTITY(1,1) PRIMARY KEY,
        groupName NVARCHAR(100) NOT NULL,
        createdBy INT NOT NULL,
        createdAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (createdBy) REFERENCES Users(userId)
    );
    PRINT 'FamilyGroups table created successfully.';
END
ELSE
BEGIN
    PRINT 'FamilyGroups table already exists.';
END
GO

-- Create FamilyMembers table (Many-to-Many relationship)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='FamilyMembers' AND xtype='U')
BEGIN
    CREATE TABLE FamilyMembers (
        familyMemberId INT IDENTITY(1,1) PRIMARY KEY,
        familyGroupId INT NOT NULL,
        userId INT NOT NULL,
        role NVARCHAR(50) DEFAULT 'Member', -- Admin, Member, Caregiver
        joinedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (familyGroupId) REFERENCES FamilyGroups(familyGroupId) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
        UNIQUE(familyGroupId, userId)
    );
    PRINT 'FamilyMembers table created successfully.';
END
ELSE
BEGIN
    PRINT 'FamilyMembers table already exists.';
END
GO

-- Insert sample doctors
IF NOT EXISTS (SELECT * FROM Doctors)
BEGIN
    INSERT INTO Doctors (doctorName, specialization, clinicName, location, contactNumber, email) VALUES
    ('Dr. Sarah Chen', 'General Practitioner', 'Clementi Medical Centre', '535 Clementi Road, Singapore 599489', '+65-6460-6999', 'dr.chen@clementimc.sg'),
    ('Dr. Michael Tan', 'Cardiologist', 'Heart Specialist Clinic', '123 Orchard Road, Singapore 238858', '+65-6734-8888', 'dr.tan@heartclinic.sg'),
    ('Dr. Emily Wong', 'Endocrinologist', 'Diabetes Care Centre', '456 Jurong East Street, Singapore 609123', '+65-6565-1234', 'dr.wong@diabetescare.sg'),
    ('Dr. James Lim', 'Orthopedic Surgeon', 'Bone & Joint Clinic', '789 Tampines Avenue, Singapore 521789', '+65-6587-4567', 'dr.lim@boneclinic.sg'),
    ('Dr. Rachel Kumar', 'Geriatrician', 'Senior Health Centre', '321 Toa Payoh Lorong, Singapore 310321', '+65-6253-9876', 'dr.kumar@seniorhealth.sg');
    
    PRINT 'Sample doctors inserted successfully.';
END
ELSE
BEGIN
    PRINT 'Doctors table already contains data.';
END
GO

PRINT 'Database setup completed successfully!';
PRINT 'You can now run your SilverConnect application.';
