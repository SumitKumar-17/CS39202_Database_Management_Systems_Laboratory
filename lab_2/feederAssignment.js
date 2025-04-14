// Import Prisma client and faker library
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const NUM_RECORDS = 10000;

  // Generate citizens
  const citizens = Array.from({ length: NUM_RECORDS }).map(() => ({
    aadhar_no: faker.string.uuid(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    dob: faker.date.past({ years: 50, refDate: '2005-01-01' }),
    gender: faker.person.sex(),
    phone: faker.phone.number('##########'),
    email: faker.internet.email(),
    address: faker.location.streetAddress(),
    occupation: faker.person.jobTitle(),
    registration_date: faker.date.recent({ days: 730 }),
  }));

  const citizenData = await prisma.citizen.createMany({
    data: citizens,
    skipDuplicates: true,
  });
  console.log(`${citizenData.count} Citizen records created.`);

  const citizenIds = await prisma.citizen.findMany({
    select: { citizen_id: true },
  });

  // Generate households
  const households = citizenIds.slice(0, NUM_RECORDS / 10).map((citizen, idx) => ({
    head_citizen_id: citizen.citizen_id,
    house_no: `H-${idx + 1}`,
    category: faker.helpers.arrayElement(['A', 'B', 'C']),
    total_members: faker.number.int({ min: 2, max: 8 }),
    last_census_date: faker.date.recent({ days: 365 }),
  }));

  await prisma.household.createMany({
    data: households,
  });
  console.log(`${households.length} Household records created.`);

  // Generate tax records
  const taxRecords = citizenIds.map((citizen) => ({
    citizen_id: citizen.citizen_id,
    tax_type: faker.helpers.arrayElement(['Income Tax', 'Property Tax', 'Service Tax']),
    amount: faker.number.float({ min: 1000, max: 100000 }),
    due_date: faker.date.future({ years: 1 }),
    paid_date: faker.helpers.maybe(() => faker.date.past({ years: 1 }), { probability: 0.7 }),
    payment_status: faker.helpers.arrayElement(['Paid', 'Pending']),
    financial_year: `FY${faker.date.past().getFullYear()}`,
  }));

  await prisma.taxRecord.createMany({
    data: taxRecords,
  });
  console.log(`${taxRecords.length} TaxRecord records created.`);

  // Generate certificates
  const certificates = citizenIds.map((citizen) => ({
    citizen_id: citizen.citizen_id,
    certificate_type: faker.helpers.arrayElement(['Birth', 'Death', 'Marriage', 'Income']),
    issue_date: faker.date.past({ years: 3 }),
    valid_until: faker.date.future({ years: 5 }),
    status: faker.helpers.arrayElement(['Active', 'Expired']),
    issued_by: faker.company.name(),
  }));

  await prisma.certificate.createMany({
    data: certificates,
  });
  console.log(`${certificates.length} Certificate records created.`);

  // Generate welfare schemes
  const schemes = Array.from({ length: 20 }).map(() => ({
    scheme_name: faker.company.catchPhrase(),
    description: faker.lorem.sentence(),
    start_date: faker.date.past({ years: 5 }),
    end_date: faker.date.future({ years: 3 }),
    budget_allocated: faker.number.float({ min: 10000, max: 1000000 }),
    status: faker.helpers.arrayElement(['Active', 'Completed', 'Terminated']),
  }));

  const welfareSchemes = await prisma.welfareScheme.createMany({
    data: schemes,
  });
  console.log(`${welfareSchemes.count} WelfareScheme records created.`);

  const schemeIds = await prisma.welfareScheme.findMany({
    select: { scheme_id: true },
  });

  // Generate scheme beneficiaries
  const beneficiaries = citizenIds.map((citizen) => ({
    scheme_id: faker.helpers.arrayElement(schemeIds).scheme_id,
    citizen_id: citizen.citizen_id,
    enrollment_date: faker.date.past({ years: 2 }),
    status: faker.helpers.arrayElement(['Enrolled', 'Completed', 'Terminated']),
    benefit_amount: faker.number.float({ min: 500, max: 50000 }),
  }));

  await prisma.schemeBeneficiary.createMany({
    data: beneficiaries,
  });
  console.log(`${beneficiaries.length} SchemeBeneficiary records created.`);

  // Clean up
  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
