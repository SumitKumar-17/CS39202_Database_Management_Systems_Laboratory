const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting targeted data seeding...');

    // Clear existing data (optional - uncomment if needed)
    // await prisma.$transaction([
    //   prisma.schemeBeneficiary.deleteMany({}),
    //   prisma.welfareScheme.deleteMany({}),
    //   prisma.certificate.deleteMany({}),
    //   prisma.taxRecord.deleteMany({}),
    //   prisma.agricultureData.deleteMany({}),
    //   prisma.environmentalData.deleteMany({}),
    //   prisma.panchayatMember.deleteMany({}),
    //   prisma.household.deleteMany({}),
    //   prisma.income.deleteMany({}),
    //   prisma.expenditure.deleteMany({}),
    //   prisma.asset.deleteMany({}),
    //   prisma.citizen.deleteMany({})
    // ]);

    const NUM_CITIZENS = 5000;

    // Generate citizens
    const citizens = Array.from({ length: NUM_CITIZENS }).map(() => ({
      aadhar_no: faker.string.numeric(12),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      dob: faker.helpers.arrayElement([
        faker.date.between({ from: '1960-01-01', to: '1999-12-31' }),
        faker.date.between({ from: '2000-01-02', to: '2010-12-31' })
      ]),
      gender: faker.helpers.arrayElement(['Male', 'Female']),
      phone: faker.phone.number('##########'),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      occupation: faker.helpers.arrayElement([
        '10th Class',
        'Student',
        'Farmer',
        'Panchayat Employee',
        'Other'
      ]),
      registration_date: faker.date.past({ years: 2 })
    }));

    const citizenRecords = await prisma.citizen.createMany({
      data: citizens,
      skipDuplicates: true,
    });
    console.log(`Created ${citizenRecords.count} citizens`);

    // Get citizen IDs
    const citizenIds = await prisma.citizen.findMany({
      select: { citizen_id: true }
    });

    // Create households
    const households = Array.from({ length: 150 }).map((_, index) => ({
      head_citizen_id: citizenIds[index].citizen_id,
      house_no: `H${faker.number.int({ min: 100, max: 999 })}`,
      category: faker.helpers.arrayElement(['APL', 'BPL', 'General']),
      total_members: faker.number.int({ min: 2, max: 8 }),
      last_census_date: faker.date.past({ years: 1 })
    }));

    await prisma.household.createMany({
      data: households,
      skipDuplicates: true
    });
    console.log('Created households');

    // Create agriculture data
    const agricultureData = Array.from({ length: 100 }).map(() => ({
      crop_type: faker.helpers.arrayElement(['Rice', 'Wheat', 'Sugarcane']),
      area_hectares: faker.helpers.arrayElement([
        faker.number.float({ min: 0.2, max: 0.4, precision: 0.01 }), // Less than 1 acre
        faker.number.float({ min: 0.5, max: 2.0, precision: 0.01 })  // More than 1 acre
      ]),
      season: faker.helpers.arrayElement(['Kharif', 'Rabi']),
      year: 2024,
      estimated_yield: faker.number.float({ min: 1000, max: 5000 }),
      soil_type: faker.helpers.arrayElement(['Clay', 'Loam', 'Sandy'])
    }));

    for (const data of agricultureData) {
      await prisma.agricultureData.create({
        data: data
      });
    }
    console.log('Created agriculture data');

    // Create income records
    const incomeRecords = Array.from({ length: 150 }).map(() => ({
      source: faker.helpers.arrayElement(['Salary', 'Business', 'Agriculture']),
      amount: faker.helpers.arrayElement([
        faker.number.float({ min: 30000, max: 99999 }),    // Below 1 lakh
        faker.number.float({ min: 100000, max: 500000 })   // Above 1 lakh
      ]),
      receipt_date: faker.date.past({ years: 1 }),
      financial_year: '2023-24',
      description: faker.lorem.sentence()
    }));

    await prisma.income.createMany({
      data: incomeRecords
    });
    console.log('Created income records');

    // Create panchayat members
    const panchayatMembers = [
      // Pradhan
      {
        citizen_id: citizenIds[0].citizen_id,
        role: 'Pradhan',
        term_start: faker.date.past({ years: 2 }),
        term_end: faker.date.future({ years: 3 }),
        status: 'Active',
        committee_name: 'Gram Panchayat'
      },
      // Other members
      ...Array.from({ length: 9 }).map((_, index) => ({
        citizen_id: citizenIds[index + 1].citizen_id,
        role: faker.helpers.arrayElement(['Secretary', 'Member', 'Treasurer']),
        term_start: faker.date.past({ years: 2 }),
        term_end: faker.date.future({ years: 3 }),
        status: 'Active',
        committee_name: faker.helpers.arrayElement([
          'Development',
          'Education',
          'Health'
        ])
      }))
    ];

    for (const member of panchayatMembers) {
      await prisma.panchayatMember.create({
        data: member
      });
    }
    console.log('Created panchayat members');

    // Create certificates
    const certificates = Array.from({ length: 200 }).map(() => ({
      citizen_id: faker.helpers.arrayElement(citizenIds).citizen_id,
      certificate_type: faker.helpers.arrayElement(['Birth', 'Vaccination', 'Death', 'Marriage']),
      issue_date: faker.date.between({ 
        from: '2024-01-01', 
        to: '2024-12-31' 
      }),
      valid_until: faker.date.future({ years: 5 }),
      status: 'Active',
      issued_by: 'Gram Panchayat'
    }));

    await prisma.certificate.createMany({
      data: certificates
    });
    console.log('Created certificates');

    // Create assets
    const assets = Array.from({ length: 50 }).map(() => ({
      asset_type: faker.helpers.arrayElement(['Street Light', 'Building', 'Vehicle']),
      name: faker.helpers.arrayElement([
        'LED Street Light',
        'Solar Street Light',
        'Community Building',
        'Panchayat Vehicle'
      ]),
      acquisition_date: faker.date.between({ 
        from: '2024-01-01', 
        to: '2024-12-31' 
      }),
      value: faker.number.float({ min: 5000, max: 100000 }),
      status: 'Active',
      location: faker.helpers.arrayElement(['Phulera', 'Main Road', 'Market Area'])
    }));

    await prisma.asset.createMany({
      data: assets
    });
    console.log('Created assets');

    // Create tax records
    const taxRecords = Array.from({ length: 300 }).map(() => ({
      citizen_id: faker.helpers.arrayElement(citizenIds).citizen_id,
      tax_type: faker.helpers.arrayElement(['Property Tax', 'Professional Tax', 'Other']),
      amount: faker.number.float({ min: 1000, max: 50000 }),
      due_date: faker.date.future({ years: 1 }),
      paid_date: faker.helpers.maybe(() => faker.date.past({ years: 1 })),
      payment_status: faker.helpers.arrayElement(['Paid', 'Pending']),
      financial_year: '2023-24'
    }));

    await prisma.taxRecord.createMany({
      data: taxRecords
    });
    console.log('Created tax records');

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });