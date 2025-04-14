const { faker } = require('@faker-js/faker');
const fs = require('fs');


const NUM_CITIZENS = 5000;
const NUM_HOUSEHOLDS = 150;
const NUM_AGRICULTURE_RECORDS = 100;
const NUM_INCOME_RECORDS = 150;
const NUM_PANCHAYAT_MEMBERS = 10;
const NUM_CERTIFICATES = 200;
const NUM_ASSETS = 50;
const NUM_TAX_RECORDS = 300;


function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}


function createInsertStatement(tableName, columns, values) {
    return `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES ${values.join(', ')};\n`;
}

async function generateSQL() {
    let sqlCommands = '';
    

    console.log('Generating Citizens...');
    const citizenColumns = ['aadhar_no', 'first_name', 'last_name', 'dob', 'gender', 'phone', 'email', 'address', 'occupation', 'registration_date'];
    const citizenValues = Array.from({ length: NUM_CITIZENS }).map(() => {
        const dob = faker.helpers.arrayElement([
            faker.date.between({ from: '1960-01-01', to: '1999-12-31' }),
            faker.date.between({ from: '2000-01-02', to: '2010-12-31' })
        ]);
        return `('${faker.string.numeric(12)}', 
                '${faker.person.firstName().replace(/'/g, "''")}', 
                '${faker.person.lastName().replace(/'/g, "''")}', 
                '${formatDate(dob)}', 
                '${faker.helpers.arrayElement(['Male', 'Female'])}', 
                '${faker.phone.number('##########')}', 
                '${faker.internet.email()}', 
                '${faker.location.streetAddress().replace(/'/g, "''")}', 
                '${faker.helpers.arrayElement(['10th Class', 'Student', 'Farmer', 'Panchayat Employee', 'Other'])}', 
                '${formatDate(faker.date.past({ years: 2 }))}')`
    });
    sqlCommands += createInsertStatement('Citizen', citizenColumns, citizenValues);


    console.log('Generating Households...');
    sqlCommands += `
-- Insert households with check for existing head_citizen_id
WITH available_citizens AS (
    SELECT citizen_id 
    FROM "Citizen" 
    WHERE citizen_id NOT IN (SELECT head_citizen_id FROM "Household")
    ORDER BY citizen_id
    LIMIT ${NUM_HOUSEHOLDS}
)
INSERT INTO "Household" (head_citizen_id, house_no, category, total_members, last_census_date)
SELECT 
    citizen_id,
    'H' || floor(random() * 900 + 100)::text,
    (ARRAY['APL', 'BPL', 'General'])[floor(random() * 3 + 1)],
    floor(random() * 7 + 2),
    NOW() - (random() * 365 * interval '1 day')
FROM available_citizens;\n`;


    console.log('Generating Agriculture Data...');
    const agricultureColumns = ['crop_type', 'area_hectares', 'season', 'year', 'estimated_yield', 'soil_type'];
    const agricultureValues = Array.from({ length: NUM_AGRICULTURE_RECORDS }).map(() => {
        return `('${faker.helpers.arrayElement(['Rice', 'Wheat', 'Sugarcane'])}', 
                ${faker.helpers.arrayElement([
                    faker.number.float({ min: 0.2, max: 0.4, precision: 0.01 }),
                    faker.number.float({ min: 0.5, max: 2.0, precision: 0.01 })
                ])}, 
                '${faker.helpers.arrayElement(['Kharif', 'Rabi'])}', 
                2024, 
                ${faker.number.float({ min: 1000, max: 5000 })}, 
                '${faker.helpers.arrayElement(['Clay', 'Loam', 'Sandy'])}')`
    });
    sqlCommands += createInsertStatement('AgricultureData', agricultureColumns, agricultureValues);


    console.log('Generating Income Records...');
    const incomeColumns = ['source', 'amount', 'receipt_date', 'financial_year', 'description'];
    const incomeValues = Array.from({ length: NUM_INCOME_RECORDS }).map(() => {
        return `('${faker.helpers.arrayElement(['Salary', 'Business', 'Agriculture'])}', 
                ${faker.helpers.arrayElement([
                    faker.number.float({ min: 30000, max: 99999 }),
                    faker.number.float({ min: 100000, max: 500000 })
                ])}, 
                '${formatDate(faker.date.past({ years: 1 }))}', 
                '2023-24', 
                '${faker.lorem.sentence().replace(/'/g, "''")}')`
    });
    sqlCommands += createInsertStatement('Income', incomeColumns, incomeValues);


    console.log('Generating Panchayat Members...');
    sqlCommands += `
-- Insert panchayat members with check for existing citizen_id
WITH available_citizens AS (
    SELECT citizen_id 
    FROM "Citizen" 
    WHERE citizen_id NOT IN (SELECT citizen_id FROM "PanchayatMember")
    ORDER BY citizen_id
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
    CASE row_number() OVER (ORDER BY citizen_id)
        WHEN 1 THEN 'Gram Panchayat'
        ELSE (ARRAY['Development', 'Education', 'Health'])[floor(random() * 3 + 1)]
    END
FROM available_citizens;\n`;


    console.log('Generating Certificates...');
    const certificateColumns = ['citizen_id', 'certificate_type', 'issue_date', 'valid_until', 'status', 'issued_by'];
    const certificateValues = Array.from({ length: NUM_CERTIFICATES }).map(() => {
        return `(${faker.number.int({ min: 1, max: NUM_CITIZENS })}, 
                '${faker.helpers.arrayElement(['Birth', 'Vaccination', 'Death', 'Marriage'])}', 
                '${formatDate(faker.date.between({ from: '2024-01-01', to: '2024-12-31' }))}', 
                '${formatDate(faker.date.future({ years: 5 }))}', 
                'Active', 
                'Gram Panchayat')`
    });
    sqlCommands += createInsertStatement('Certificate', certificateColumns, certificateValues);


    console.log('Generating Assets...');
    const assetColumns = ['asset_type', 'name', 'acquisition_date', 'value', 'status', 'location'];
    const assetValues = Array.from({ length: NUM_ASSETS }).map(() => {
        const assetType = faker.helpers.arrayElement(['Street Light', 'Building', 'Vehicle']);
        const assetNames = {
            'Street Light': ['LED Street Light', 'Solar Street Light'],
            'Building': ['Community Building'],
            'Vehicle': ['Panchayat Vehicle']
        };
        return `('${assetType}', 
                '${faker.helpers.arrayElement(assetNames[assetType])}', 
                '${formatDate(faker.date.between({ from: '2024-01-01', to: '2024-12-31' }))}', 
                ${faker.number.float({ min: 5000, max: 100000 })}, 
                'Active', 
                '${faker.helpers.arrayElement(['Phulera', 'Main Road', 'Market Area'])}')`
    });
    sqlCommands += createInsertStatement('Asset', assetColumns, assetValues);


    console.log('Generating Tax Records...');
    const taxColumns = ['citizen_id', 'tax_type', 'amount', 'due_date', 'paid_date', 'payment_status', 'financial_year'];
    const taxValues = Array.from({ length: NUM_TAX_RECORDS }).map(() => {
        const paidDate = faker.helpers.maybe(() => formatDate(faker.date.past({ years: 1 })));
        return `(${faker.number.int({ min: 1, max: NUM_CITIZENS })}, 
                '${faker.helpers.arrayElement(['Property Tax', 'Professional Tax', 'Other'])}', 
                ${faker.number.float({ min: 1000, max: 50000 })}, 
                '${formatDate(faker.date.future({ years: 1 }))}', 
                ${paidDate ? `'${paidDate}'` : 'NULL'}, 
                '${faker.helpers.arrayElement(['Paid', 'Pending'])}', 
                '2023-24')`
    });
    sqlCommands += createInsertStatement('TaxRecord', taxColumns, taxValues);

    fs.writeFileSync('insert_4.sql', sqlCommands);
    console.log('SQL commands have been written to insert_4.sql');
}

generateSQL().catch(console.error);