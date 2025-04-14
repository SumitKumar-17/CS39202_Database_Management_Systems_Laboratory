const { faker } = require('@faker-js/faker');
const fs = require('fs');


const NUM_FEMALE_STUDENTS = 20;
const NUM_TENTH_CLASS = 15;
const NUM_MALE_BIRTHS = 10;

function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

async function generateSQL() {
    let sqlCommands = '';
    
    sqlCommands += `BEGIN;

-- Get current sequence values
DO $$ 
DECLARE
    citizen_seq INTEGER;
    household_seq INTEGER;
    income_seq INTEGER;
    certificate_seq INTEGER;
BEGIN
    SELECT COALESCE(MAX(citizen_id), 0) + 1 INTO citizen_seq FROM "Citizen";
    SELECT COALESCE(MAX(household_id), 0) + 1 INTO household_seq FROM "Household";
    SELECT COALESCE(MAX(income_id), 0) + 1 INTO income_seq FROM "Income";
    SELECT COALESCE(MAX(certificate_id), 0) + 1 INTO certificate_seq FROM "Certificate";
    
    -- Set sequence values
    EXECUTE 'ALTER SEQUENCE IF EXISTS "Citizen_citizen_id_seq" RESTART WITH ' || citizen_seq;
    EXECUTE 'ALTER SEQUENCE IF EXISTS "Household_household_id_seq" RESTART WITH ' || household_seq;
    EXECUTE 'ALTER SEQUENCE IF EXISTS "Income_income_id_seq" RESTART WITH ' || income_seq;
    EXECUTE 'ALTER SEQUENCE IF EXISTS "Certificate_certificate_id_seq" RESTART WITH ' || certificate_seq;
END $$;

-- Create female students and their household heads (parents)
WITH inserted_parents AS (
    INSERT INTO "Citizen" (
        aadhar_no, first_name, last_name, dob, gender, phone, email, 
        address, occupation, registration_date
    )
    SELECT 
        MD5(random()::text)::varchar(12),
        'Parent' || n::text,
        'Family' || n::text,
        (NOW() - interval '40 years' - (random() * 10 * interval '1 year'))::timestamp,
        CASE WHEN random() < 0.5 THEN 'Male' ELSE 'Female' END,
        SUBSTRING(MD5(random()::text), 1, 10),
        'parent' || n || '@example.com',
        'Address ' || n,
        'Other',
        NOW() - interval '2 years'
    FROM generate_series(1, ${NUM_FEMALE_STUDENTS}) n
    RETURNING citizen_id, first_name, last_name
), inserted_students AS (
    INSERT INTO "Citizen" (
        aadhar_no, first_name, last_name, dob, gender, phone, email, 
        address, occupation, registration_date
    )
    SELECT 
        MD5(random()::text)::varchar(12),
        'Student' || n::text,
        'Family' || n::text,
        (NOW() - interval '15 years' - (random() * 5 * interval '1 year'))::timestamp,
        'Female',
        SUBSTRING(MD5(random()::text), 1, 10),
        'student' || n || '@example.com',
        'Address ' || n,
        'Student',
        NOW() - interval '1 year'
    FROM generate_series(1, ${NUM_FEMALE_STUDENTS}) n
    RETURNING citizen_id, first_name, last_name
), inserted_households AS (
    INSERT INTO "Household" (
        head_citizen_id, house_no, category, total_members, last_census_date
    )
    SELECT 
        p.citizen_id,
        'H' || p.citizen_id,
        'BPL',
        4,
        NOW() - interval '6 months'
    FROM inserted_parents p
    RETURNING household_id, head_citizen_id
)
INSERT INTO "Income" (
    source, amount, receipt_date, financial_year, description
)
SELECT 
    'Salary',
    random() * 40000 + 30000,  -- Income between 30k and 70k
    NOW() - interval '3 months',
    '2023-24',
    'Low income household'
FROM inserted_households;

-- Create 10th class students for vaccination records
WITH inserted_tenth_class AS (
    INSERT INTO "Citizen" (
        aadhar_no, first_name, last_name, dob, gender, phone, email, 
        address, occupation, registration_date
    )
    SELECT 
        MD5(random()::text)::varchar(12),
        'Student' || n::text,
        'TenthClass' || n::text,
        (NOW() - interval '15 years' - (random() * 2 * interval '1 year'))::timestamp,
        CASE WHEN random() < 0.5 THEN 'Male' ELSE 'Female' END,
        SUBSTRING(MD5(random()::text), 1, 10),
        'tenthclass' || n || '@example.com',
        'Address ' || n,
        '10th Class',
        NOW() - interval '1 year'
    FROM generate_series(1, ${NUM_TENTH_CLASS}) n
    RETURNING citizen_id
)
INSERT INTO "Certificate" (
    citizen_id, certificate_type, issue_date, valid_until, status, issued_by
)
SELECT 
    tc.citizen_id,
    'Vaccination',
    NOW() - (random() * 180 * interval '1 day'),  -- Spread over 2024
    NOW() + interval '10 years',
    'Active',
    'Gram Panchayat'
FROM inserted_tenth_class tc;

-- Create male citizens with birth certificates in 2024
WITH new_males AS (
    INSERT INTO "Citizen" (
        aadhar_no, first_name, last_name, dob, gender, phone, email, 
        address, occupation, registration_date
    )
    SELECT 
        MD5(random()::text)::varchar(12),
        'Baby' || n::text,
        'Boy' || n::text,
        NOW() - (random() * 180 * interval '1 day'),  -- Born in 2024
        'Male',
        SUBSTRING(MD5(random()::text), 1, 10),
        'baby' || n || '@example.com',
        'Address ' || n,
        'Other',
        NOW()
    FROM generate_series(1, ${NUM_MALE_BIRTHS}) n
    RETURNING citizen_id, dob
)
INSERT INTO "Certificate" (
    citizen_id, certificate_type, issue_date, valid_until, status, issued_by
)
SELECT 
    nm.citizen_id,
    'Birth',
    nm.dob,  -- Birth certificate issued on birth date
    nm.dob + interval '100 years',
    'Active',
    'Gram Panchayat'
FROM new_males nm;

COMMIT;`;


    fs.writeFileSync('insert_3.sql', sqlCommands);
    console.log('SQL commands have been written to insert_3.sql');
}

generateSQL().catch(console.error);