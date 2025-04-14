const { faker } = require('@faker-js/faker');
const fs = require('fs');

const NUM_RECORDS = 10000;
const NUM_SCHEMES = 20;
const NUM_PANCHAYAT_MEMBERS = 50;
const NUM_INCOME_RECORDS = 500;
const NUM_EXPENDITURE_RECORDS = 500;
const NUM_ASSETS = 200;
const NUM_AGRICULTURE_RECORDS = 300;
const NUM_ENVIRONMENTAL_RECORDS = 365; 

function formatDate(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}


function createInsertStatement(tableName, columns, values) {
    return `INSERT INTO "${tableName}" (${columns.map(c => `"${c}"`).join(', ')}) VALUES ${values.join(', ')};\n`;
}

async function generateSQL() {
    let sqlCommands = '';
    const citizenIds = [];


    console.log('Generating Citizens...');
    const citizenColumns = ['aadhar_no', 'first_name', 'last_name', 'dob', 'gender', 'phone', 'email', 'address', 'occupation', 'registration_date'];
    const citizenValues = Array.from({ length: NUM_RECORDS }).map(() => {
        return `('${faker.string.uuid()}', 
                '${faker.person.firstName().replace(/'/g, "''")}', 
                '${faker.person.lastName().replace(/'/g, "''")}', 
                '${formatDate(faker.date.past({ years: 50, refDate: '2005-01-01' }))}', 
                '${faker.person.sex()}', 
                '${faker.phone.number('##########')}', 
                '${faker.internet.email()}', 
                '${faker.location.streetAddress().replace(/'/g, "''")}', 
                '${faker.person.jobTitle().replace(/'/g, "''")}', 
                '${formatDate(faker.date.recent({ days: 730 }))}')`
    });
    sqlCommands += createInsertStatement('Citizen', citizenColumns, citizenValues);

    for (let i = 1; i <= NUM_RECORDS; i++) {
        citizenIds.push(i);
    }

    console.log('Generating Households...');
    const householdColumns = ['head_citizen_id', 'house_no', 'category', 'total_members', 'last_census_date'];
    const householdValues = citizenIds.slice(0, NUM_RECORDS / 10).map((citizenId, idx) => {
        return `(${citizenId}, 
                'H-${idx + 1}', 
                '${faker.helpers.arrayElement(['A', 'B', 'C'])}', 
                ${faker.number.int({ min: 2, max: 8 })}, 
                '${formatDate(faker.date.recent({ days: 365 }))}')`
    });
    sqlCommands += createInsertStatement('Household', householdColumns, householdValues);

    console.log('Generating Panchayat Members...');
    const panchayatColumns = ['citizen_id', 'role', 'term_start', 'term_end', 'status', 'committee_name'];
    const panchayatValues = citizenIds.slice(0, NUM_PANCHAYAT_MEMBERS).map(citizenId => {
        const termStart = faker.date.past({ years: 2 });
        return `(${citizenId}, 
                '${faker.helpers.arrayElement(['President', 'Vice President', 'Secretary', 'Member'])}', 
                '${formatDate(termStart)}', 
                '${formatDate(faker.date.future({ years: 3, refDate: termStart }))}', 
                '${faker.helpers.arrayElement(['Active', 'Inactive'])}', 
                '${faker.helpers.arrayElement(['Education', 'Health', 'Infrastructure', 'Agriculture', 'Women Empowerment'])}')`
    });
    sqlCommands += createInsertStatement('PanchayatMember', panchayatColumns, panchayatValues);


    console.log('Generating Tax Records...');
    const taxColumns = ['citizen_id', 'tax_type', 'amount', 'due_date', 'paid_date', 'payment_status', 'financial_year'];
    const taxValues = citizenIds.map(citizenId => {
        const paidDate = faker.helpers.maybe(() => formatDate(faker.date.past({ years: 1 })), { probability: 0.7 });
        return `(${citizenId}, 
                '${faker.helpers.arrayElement(['Income Tax', 'Property Tax', 'Service Tax'])}', 
                ${faker.number.float({ min: 1000, max: 100000 })}, 
                '${formatDate(faker.date.future({ years: 1 }))}', 
                ${paidDate ? `'${paidDate}'` : 'NULL'}, 
                '${faker.helpers.arrayElement(['Paid', 'Pending'])}', 
                'FY${faker.date.past().getFullYear()}')`
    });
    sqlCommands += createInsertStatement('TaxRecord', taxColumns, taxValues);


    console.log('Generating Certificates...');
    const certificateColumns = ['citizen_id', 'certificate_type', 'issue_date', 'valid_until', 'status', 'issued_by'];
    const certificateValues = citizenIds.map(citizenId => {
        return `(${citizenId}, 
                '${faker.helpers.arrayElement(['Birth', 'Death', 'Marriage', 'Income'])}', 
                '${formatDate(faker.date.past({ years: 3 }))}', 
                '${formatDate(faker.date.future({ years: 5 }))}', 
                '${faker.helpers.arrayElement(['Active', 'Expired'])}', 
                '${faker.company.name().replace(/'/g, "''")}')`
    });
    sqlCommands += createInsertStatement('Certificate', certificateColumns, certificateValues);


    console.log('Generating Income Records...');
    const incomeColumns = ['source', 'amount', 'receipt_date', 'financial_year', 'description'];
    const incomeValues = Array.from({ length: NUM_INCOME_RECORDS }).map(() => {
        const receiptDate = faker.date.past({ years: 1 });
        return `('${faker.helpers.arrayElement(['Tax Collection', 'Grants', 'Fees', 'Donations', 'Rent'])}', 
                ${faker.number.float({ min: 5000, max: 500000 })}, 
                '${formatDate(receiptDate)}', 
                'FY${receiptDate.getFullYear()}', 
                '${faker.lorem.sentence().replace(/'/g, "''")}')`
    });
    sqlCommands += createInsertStatement('Income', incomeColumns, incomeValues);


    console.log('Generating Expenditure Records...');
    const expenditureColumns = ['category', 'amount', 'expense_date', 'purpose', 'approved_by', 'payment_mode'];
    const expenditureValues = Array.from({ length: NUM_EXPENDITURE_RECORDS }).map(() => {
        return `('${faker.helpers.arrayElement(['Infrastructure', 'Salaries', 'Maintenance', 'Welfare', 'Administrative'])}', 
                ${faker.number.float({ min: 1000, max: 200000 })}, 
                '${formatDate(faker.date.past({ years: 1 }))}', 
                '${faker.lorem.sentence().replace(/'/g, "''")}', 
                '${faker.person.fullName().replace(/'/g, "''")}', 
                '${faker.helpers.arrayElement(['Cash', 'Cheque', 'Bank Transfer', 'UPI'])}')`
    });
    sqlCommands += createInsertStatement('Expenditure', expenditureColumns, expenditureValues);


    console.log('Generating Assets...');
    const assetColumns = ['asset_type', 'name', 'acquisition_date', 'value', 'status', 'location'];
    const assetValues = Array.from({ length: NUM_ASSETS }).map(() => {
        return `('${faker.helpers.arrayElement(['Building', 'Land', 'Vehicle', 'Equipment', 'Furniture'])}', 
                '${faker.commerce.productName().replace(/'/g, "''")}', 
                '${formatDate(faker.date.past({ years: 5 }))}', 
                ${faker.number.float({ min: 10000, max: 1000000 })}, 
                '${faker.helpers.arrayElement(['Active', 'Maintenance', 'Disposed'])}', 
                '${faker.location.streetAddress().replace(/'/g, "''")}')`
    });
    sqlCommands += createInsertStatement('Asset', assetColumns, assetValues);


    console.log('Generating Agriculture Data...');
    const agricultureColumns = ['crop_type', 'area_hectares', 'season', 'year', 'estimated_yield', 'soil_type'];
    const agricultureValues = Array.from({ length: NUM_AGRICULTURE_RECORDS }).map(() => {
        return `('${faker.helpers.arrayElement(['Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton', 'Pulses'])}', 
                ${faker.number.float({ min: 1, max: 100 })}, 
                '${faker.helpers.arrayElement(['Kharif', 'Rabi', 'Zaid'])}', 
                ${faker.date.past({ years: 2 }).getFullYear()}, 
                ${faker.number.float({ min: 10, max: 500 })}, 
                '${faker.helpers.arrayElement(['Clay', 'Sandy', 'Loamy', 'Black', 'Red'])}')`
    });
    sqlCommands += createInsertStatement('AgricultureData', agricultureColumns, agricultureValues);


    console.log('Generating Environmental Data...');
    const environmentalColumns = ['recorded_date', 'rainfall_mm', 'groundwater_level', 'waste_collection_status', 'trees_planted'];
    const environmentalValues = Array.from({ length: NUM_ENVIRONMENTAL_RECORDS }).map(() => {
        return `('${formatDate(faker.date.past({ years: 1 }))}', 
                ${faker.number.float({ min: 0, max: 300 })}, 
                ${faker.number.float({ min: 10, max: 100 })}, 
                '${faker.helpers.arrayElement(['Completed', 'Partial', 'Pending'])}', 
                ${faker.number.int({ min: 0, max: 100 })})`
    });
    sqlCommands += createInsertStatement('EnvironmentalData', environmentalColumns, environmentalValues);


    console.log('Generating Welfare Schemes...');
    const schemeColumns = ['scheme_name', 'description', 'start_date', 'end_date', 'budget_allocated', 'status'];
    const schemeValues = Array.from({ length: NUM_SCHEMES }).map(() => {
        return `('${faker.company.catchPhrase().replace(/'/g, "''")}', 
                '${faker.lorem.sentence().replace(/'/g, "''")}', 
                '${formatDate(faker.date.past({ years: 5 }))}', 
                '${formatDate(faker.date.future({ years: 3 }))}', 
                ${faker.number.float({ min: 10000, max: 1000000 })}, 
                '${faker.helpers.arrayElement(['Active', 'Completed', 'Terminated'])}')`
    });
    sqlCommands += createInsertStatement('WelfareScheme', schemeColumns, schemeValues);

    console.log('Generating Scheme Beneficiaries...');
    const beneficiaryColumns = ['scheme_id', 'citizen_id', 'enrollment_date', 'status', 'benefit_amount'];
    const beneficiaryValues = citizenIds.map(citizenId => {
        return `(${faker.number.int({ min: 1, max: NUM_SCHEMES })}, 
                ${citizenId}, 
                '${formatDate(faker.date.past({ years: 2 }))}', 
                '${faker.helpers.arrayElement(['Enrolled', 'Completed', 'Terminated'])}', 
                ${faker.number.float({ min: 500, max: 50000 })})`
    });
    sqlCommands += createInsertStatement('SchemeBeneficiary', beneficiaryColumns, beneficiaryValues);


    fs.writeFileSync('insert_1.sql', sqlCommands);
    console.log('SQL commands have been written to insert_1.sql');
}

generateSQL().catch(console.error);