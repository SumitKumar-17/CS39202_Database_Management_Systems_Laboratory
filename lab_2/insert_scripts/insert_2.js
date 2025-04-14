const { faker } = require('@faker-js/faker');
const fs = require('fs');


const NUM_CITIZENS = 1000;
const NUM_HOUSEHOLDS = 100;
const NUM_PANCHAYAT_MEMBERS = 20;
const NUM_CERTIFICATES = 200;
const NUM_ASSETS = 50;


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
    agriculture_seq INTEGER;
    income_seq INTEGER;
BEGIN
    SELECT COALESCE(MAX(citizen_id), 0) + 1 INTO citizen_seq FROM "Citizen";
    SELECT COALESCE(MAX(record_id), 0) + 1 INTO agriculture_seq FROM "AgricultureData";
    SELECT COALESCE(MAX(income_id), 0) + 1 INTO income_seq FROM "Income";
    
    -- Set sequence values
    EXECUTE 'ALTER SEQUENCE IF EXISTS "Citizen_citizen_id_seq" RESTART WITH ' || citizen_seq;
    EXECUTE 'ALTER SEQUENCE IF EXISTS "AgricultureData_record_id_seq" RESTART WITH ' || agriculture_seq;
    EXECUTE 'ALTER SEQUENCE IF EXISTS "Income_income_id_seq" RESTART WITH ' || income_seq;
END $$;

`;
    

    console.log('Generating Citizens...');
    sqlCommands += `
WITH new_citizens AS (
    SELECT 
        nextval('"Citizen_citizen_id_seq"') as new_id,
        gen_random_uuid() as temp_id,
        CASE 
            WHEN random() < 0.2 THEN 'Student'
            WHEN random() < 0.4 THEN '10th Class'
            WHEN random() < 0.6 THEN 'Panchayat Employee'
            ELSE 'Farmer'
        END as occupation,
        CASE WHEN random() < 0.5 THEN 'Male' ELSE 'Female' END as gender,
        CASE 
            WHEN random() < 0.3 THEN 
                (NOW() - interval '15 years' - (random() * 5 * interval '1 year'))::timestamp
            ELSE
                (NOW() - interval '30 years' - (random() * 30 * interval '1 year'))::timestamp
        END as dob
    FROM generate_series(1, ${NUM_CITIZENS})
)
INSERT INTO "Citizen" (citizen_id, aadhar_no, first_name, last_name, dob, gender, phone, email, address, occupation, registration_date)
SELECT 
    new_id,
    SUBSTRING(MD5(temp_id::text), 1, 12),
    CASE WHEN gender = 'Male' THEN 'John' ELSE 'Jane' END || new_id::text,
    'Doe' || new_id::text,
    dob,
    gender,
    SUBSTRING(MD5(temp_id::text), 1, 10),
    'email' || new_id::text || '@example.com',
    'Address ' || new_id::text,
    occupation,
    NOW() - interval '1 year'
FROM new_citizens;

`;


    console.log('Generating Agriculture Data...');
    sqlCommands += `
WITH new_agriculture AS (
    SELECT 
        nextval('"AgricultureData_record_id_seq"') as record_id,
        CASE WHEN random() < 0.6 THEN 'Rice' ELSE 'Wheat' END as crop_type,
        CASE 
            WHEN random() < 0.4 THEN random() * 0.2 + 0.5  -- Large plots (>0.4047 hectares)
            ELSE random() * 0.2 + 0.1                      -- Small plots
        END as area_hectares
    FROM generate_series(1, 150)
)
INSERT INTO "AgricultureData" (record_id, crop_type, area_hectares, season, year, estimated_yield, soil_type)
SELECT 
    record_id,
    crop_type,
    area_hectares,
    CASE WHEN random() < 0.5 THEN 'Kharif' ELSE 'Rabi' END,
    2024,
    area_hectares * 1000 * (random() * 2 + 3),  -- Yield based on area
    CASE floor(random() * 3)
        WHEN 0 THEN 'Clay'
        WHEN 1 THEN 'Loam'
        ELSE 'Sandy'
    END
FROM new_agriculture;

`;

    console.log('Generating Households...');
    sqlCommands += `
WITH available_citizens AS (
    SELECT citizen_id 
    FROM "Citizen" c
    WHERE NOT EXISTS (
        SELECT 1 FROM "Household" h 
        WHERE h.head_citizen_id = c.citizen_id
    )
    AND c.occupation != 'Student'  -- Students shouldn't be household heads
    ORDER BY random()
    LIMIT ${NUM_HOUSEHOLDS}
)
INSERT INTO "Household" (head_citizen_id, house_no, category, total_members, last_census_date)
SELECT 
    citizen_id,
    'H' || citizen_id,
    CASE WHEN random() < 0.3 THEN 'BPL' ELSE 'APL' END,
    floor(random() * 6 + 2),
    NOW() - (random() * 365 * interval '1 day')
FROM available_citizens;

`;

    console.log('Generating Income Records...');
    sqlCommands += `
WITH household_heads AS (
    SELECT h.household_id, h.head_citizen_id, c.occupation
    FROM "Household" h
    JOIN "Citizen" c ON h.head_citizen_id = c.citizen_id
)
INSERT INTO "Income" (source, amount, receipt_date, financial_year, description)
SELECT 
    CASE 
        WHEN occupation = 'Farmer' THEN 'Agriculture'
        WHEN occupation = 'Panchayat Employee' THEN 'Salary'
        ELSE 'Business'
    END,
    CASE 
        WHEN occupation = 'Student' OR random() < 0.3 THEN 
            random() * 50000 + 30000  -- Low income
        ELSE 
            random() * 400000 + 100000  -- Higher income
    END,
    NOW() - (random() * 365 * interval '1 day'),
    '2023-24',
    'Income for household ' || household_id
FROM household_heads;

`;

    console.log('Generating Panchayat Members...');
    sqlCommands += `
WITH panchayat_employees AS (
    SELECT citizen_id 
    FROM "Citizen"
    WHERE occupation = 'Panchayat Employee'
    AND NOT EXISTS (
        SELECT 1 FROM "PanchayatMember" pm 
        WHERE pm.citizen_id = "Citizen".citizen_id
    )
    ORDER BY random()
    LIMIT ${NUM_PANCHAYAT_MEMBERS}
)
INSERT INTO "PanchayatMember" (citizen_id, role, term_start, term_end, status, committee_name)
SELECT 
    citizen_id,
    CASE row_number() OVER (ORDER BY citizen_id)
        WHEN 1 THEN 'Pradhan'
        ELSE (ARRAY['Secretary', 'Member', 'Treasurer'])[floor(random() * 3 + 1)]
    END,
    NOW() - interval '2 year',
    NOW() + interval '3 year',
    'Active',
    CASE WHEN row_number() OVER (ORDER BY citizen_id) = 1 
        THEN 'Gram Panchayat'
        ELSE (ARRAY['Development', 'Education', 'Health'])[floor(random() * 3 + 1)]
    END
FROM panchayat_employees;

`;

    console.log('Generating Assets...');
    sqlCommands += `
INSERT INTO "Asset" (asset_type, name, acquisition_date, value, status, location)
SELECT
    CASE WHEN random() < 0.4 THEN 'Street Light' ELSE 'Building' END,
    CASE WHEN asset_type = 'Street Light' 
        THEN (ARRAY['LED Street Light', 'Solar Street Light'])[floor(random() * 2 + 1)]
        ELSE 'Community Building'
    END,
    NOW() - (random() * 180 * interval '1 day'),
    CASE WHEN asset_type = 'Street Light' 
        THEN random() * 45000 + 5000
        ELSE random() * 900000 + 100000
    END,
    'Active',
    CASE WHEN random() < 0.4 THEN 'Phulera' ELSE 'Main Road' END
FROM (
    SELECT CASE WHEN random() < 0.4 THEN 'Street Light' ELSE 'Building' END as asset_type
    FROM generate_series(1, ${NUM_ASSETS})
) t;

`;

    console.log('Generating Certificates...');
    sqlCommands += `
WITH citizen_groups AS (
    SELECT 
        citizen_id,
        occupation,
        gender
    FROM "Citizen"
    WHERE occupation = '10th Class'  -- For vaccination records
    OR gender = 'Male'               -- For birth records
)
INSERT INTO "Certificate" (citizen_id, certificate_type, issue_date, valid_until, status, issued_by)
SELECT 
    citizen_id,
    CASE 
        WHEN occupation = '10th Class' AND random() < 0.5 THEN 'Vaccination'
        WHEN gender = 'Male' AND random() < 0.3 THEN 'Birth'
        ELSE (ARRAY['Marriage', 'Death'])[floor(random() * 2 + 1)]
    END,
    NOW() - (random() * 180 * interval '1 day'),
    NOW() + interval '5 year',
    'Active',
    'Gram Panchayat'
FROM citizen_groups
ORDER BY random()
LIMIT ${NUM_CERTIFICATES};

COMMIT;`;

    fs.writeFileSync('insert_2.sql', sqlCommands);
    console.log('SQL commands have been written to insert_2.sql');
}

generateSQL().catch(console.error);