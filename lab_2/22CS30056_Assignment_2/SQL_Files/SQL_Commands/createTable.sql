-- This snippet creates the tables in the database for the Gram Panchayat Management System
-- This file includes all the Create Table Statements

CREATE TABLE "Citizen" (
  "citizen_id" SERIAL PRIMARY KEY,
  "aadhar_no" VARCHAR NOT NULL UNIQUE,
  "first_name" VARCHAR NOT NULL,
  "last_name" VARCHAR NOT NULL,
  "dob" TIMESTAMP NOT NULL,
  "gender" VARCHAR NOT NULL,
  "phone" VARCHAR NOT NULL,
  "email" VARCHAR NOT NULL,
  "address" VARCHAR NOT NULL,
  "occupation" VARCHAR NOT NULL,
  "registration_date" TIMESTAMP NOT NULL
);

CREATE TABLE "Household" (
  "household_id" SERIAL PRIMARY KEY,
  "head_citizen_id" INT NOT NULL UNIQUE,
  "house_no" VARCHAR NOT NULL,
  "category" VARCHAR NOT NULL,
  "total_members" INT NOT NULL,
  "last_census_date" TIMESTAMP NOT NULL,
  FOREIGN KEY ("head_citizen_id") REFERENCES "Citizen"("citizen_id")
);

CREATE TABLE "TaxRecord" (
  "tax_id" SERIAL PRIMARY KEY,
  "citizen_id" INT NOT NULL,
  "tax_type" VARCHAR NOT NULL,
  "amount" FLOAT NOT NULL,
  "due_date" TIMESTAMP NOT NULL,
  "paid_date" TIMESTAMP,
  "payment_status" VARCHAR NOT NULL,
  "financial_year" VARCHAR NOT NULL,
  FOREIGN KEY ("citizen_id") REFERENCES "Citizen"("citizen_id")
);

CREATE TABLE "Certificate" (
  "certificate_id" SERIAL PRIMARY KEY,
  "citizen_id" INT NOT NULL,
  "certificate_type" VARCHAR NOT NULL,
  "issue_date" TIMESTAMP NOT NULL,
  "valid_until" TIMESTAMP NOT NULL,
  "status" VARCHAR NOT NULL,
  "issued_by" VARCHAR NOT NULL,
  FOREIGN KEY ("citizen_id") REFERENCES "Citizen"("citizen_id")
);

CREATE TABLE "PanchayatMember" (
  "member_id" SERIAL PRIMARY KEY,
  "citizen_id" INT NOT NULL UNIQUE,
  "role" VARCHAR NOT NULL,
  "term_start" TIMESTAMP NOT NULL,
  "term_end" TIMESTAMP NOT NULL,
  "status" VARCHAR NOT NULL,
  "committee_name" VARCHAR NOT NULL,
  FOREIGN KEY ("citizen_id") REFERENCES "Citizen"("citizen_id")
);

CREATE TABLE "Income" (
  "income_id" SERIAL PRIMARY KEY,
  "source" VARCHAR NOT NULL,
  "amount" FLOAT NOT NULL,
  "receipt_date" TIMESTAMP NOT NULL,
  "financial_year" VARCHAR NOT NULL,
  "description" VARCHAR NOT NULL
);

CREATE TABLE "Expenditure" (
  "expenditure_id" SERIAL PRIMARY KEY,
  "category" VARCHAR NOT NULL,
  "amount" FLOAT NOT NULL,
  "expense_date" TIMESTAMP NOT NULL,
  "purpose" VARCHAR NOT NULL,
  "approved_by" VARCHAR NOT NULL,
  "payment_mode" VARCHAR NOT NULL
);

CREATE TABLE "Asset" (
  "asset_id" SERIAL PRIMARY KEY,
  "asset_type" VARCHAR NOT NULL,
  "name" VARCHAR NOT NULL,
  "acquisition_date" TIMESTAMP NOT NULL,
  "value" FLOAT NOT NULL,
  "status" VARCHAR NOT NULL,
  "location" VARCHAR NOT NULL
);

CREATE TABLE "AgricultureData" (
  "record_id" SERIAL PRIMARY KEY,
  "crop_type" VARCHAR NOT NULL,
  "area_hectares" FLOAT NOT NULL,
  "season" VARCHAR NOT NULL,
  "year" INT NOT NULL,
  "estimated_yield" FLOAT NOT NULL,
  "soil_type" VARCHAR NOT NULL
);

CREATE TABLE "EnvironmentalData" (
  "record_id" SERIAL PRIMARY KEY,
  "recorded_date" TIMESTAMP NOT NULL,
  "rainfall_mm" FLOAT NOT NULL,
  "groundwater_level" FLOAT NOT NULL,
  "waste_collection_status" VARCHAR NOT NULL,
  "trees_planted" INT NOT NULL
);

CREATE TABLE "WelfareScheme" (
  "scheme_id" SERIAL PRIMARY KEY,
  "scheme_name" VARCHAR NOT NULL,
  "description" VARCHAR NOT NULL,
  "start_date" TIMESTAMP NOT NULL,
  "end_date" TIMESTAMP NOT NULL,
  "budget_allocated" FLOAT NOT NULL,
  "status" VARCHAR NOT NULL
);

CREATE TABLE "SchemeBeneficiary" (
  "beneficiary_id" SERIAL PRIMARY KEY,
  "scheme_id" INT NOT NULL,
  "citizen_id" INT NOT NULL,
  "enrollment_date" TIMESTAMP NOT NULL,
  "status" VARCHAR NOT NULL,
  "benefit_amount" FLOAT NOT NULL,
  FOREIGN KEY ("scheme_id") REFERENCES "WelfareScheme"("scheme_id"),
  FOREIGN KEY ("citizen_id") REFERENCES "Citizen"("citizen_id")
);
