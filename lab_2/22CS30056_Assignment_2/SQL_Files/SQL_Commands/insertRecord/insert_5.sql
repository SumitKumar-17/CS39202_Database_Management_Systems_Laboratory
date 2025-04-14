BEGIN;

-- Get current sequence values
DO $$ 
DECLARE
    citizen_seq INTEGER;
    household_seq INTEGER;
    income_seq INTEGER;
BEGIN
    SELECT COALESCE(MAX(citizen_id), 0) + 1 INTO citizen_seq FROM "Citizen";
    SELECT COALESCE(MAX(household_id), 0) + 1 INTO household_seq FROM "Household";
    SELECT COALESCE(MAX(income_id), 0) + 1 INTO income_seq FROM "Income";
    
    EXECUTE 'ALTER SEQUENCE IF EXISTS "Citizen_citizen_id_seq" RESTART WITH ' || citizen_seq;
    EXECUTE 'ALTER SEQUENCE IF EXISTS "Household_household_id_seq" RESTART WITH ' || household_seq;
    EXECUTE 'ALTER SEQUENCE IF EXISTS "Income_income_id_seq" RESTART WITH ' || income_seq;
END $$;

-- First create parent/guardian records (household heads)
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
        'House' || n::text,  -- Important: This matches with student's address
        'Other',
        NOW() - interval '2 years'
    FROM generate_series(1, 20) n  -- Create 20 parents
    RETURNING citizen_id, first_name, last_name, address
), create_households AS (
    INSERT INTO "Household" (
        head_citizen_id, house_no, category, total_members, last_census_date
    )
    SELECT 
        citizen_id,
        address,  -- Use the same address as in Citizen table
        'BPL',
        4,
        NOW() - interval '6 months'
    FROM inserted_parents
    RETURNING household_id, house_no
), create_income AS (
    -- Create mix of incomes, some below 1 lakh, some above
    INSERT INTO "Income" (
        source, amount, receipt_date, financial_year, description
    )
    SELECT 
        'Salary',
        CASE WHEN random() < 0.7  -- 70% households below 1 lakh
            THEN random() * 40000 + 30000  -- 30k to 70k
            ELSE random() * 50000 + 100000  -- 100k to 150k
        END,
        NOW() - interval '3 months',
        '2023-24',
        'Household income'
    FROM create_households
    RETURNING income_id
)
-- Now create the female students, linking them to the same addresses as their parents
INSERT INTO "Citizen" (
    aadhar_no, first_name, last_name, dob, gender, phone, email, 
    address, occupation, registration_date
)
SELECT 
    MD5(random()::text)::varchar(12),
    'Girl' || n::text,
    'Family' || (n/2)::integer::text,  -- Same family name as parent
    (NOW() - interval '15 years' - (random() * 5 * interval '1 year'))::timestamp,
    'Female',
    SUBSTRING(MD5(random()::text), 1, 10),
    'girl' || n || '@example.com',
    'House' || (n/2)::integer::text,  -- Same address as parent
    'Student',
    NOW() - interval '1 year'
FROM generate_series(1, 30) n;  -- Create 30 female students

COMMIT;