-- This file Contains All the SQL Queries

-- 1. Citizens with more than 1 acre land:

SELECT c.first_name, c.last_name 
FROM "Citizen" c 
JOIN "AgricultureData" ad ON c.citizen_id = ad.record_id 
WHERE ad.area_hectares > 0.4047;  -- Converting 1 acre to hectares


-- 2. Female students with household income < 1 lakh:

SELECT DISTINCT c.first_name, c.last_name, i.amount as household_income
FROM "Citizen" c 
JOIN "Household" h ON c.address = h.house_no  -- Join based on shared address
JOIN "Income" i ON h.household_id = i.income_id 
WHERE c.gender = 'Female' 
AND c.occupation = 'Student' 
AND i.amount < 100000
ORDER BY household_income;


-- 3. Total rice cultivation area:

SELECT SUM(ad.area_hectares) AS total_area 
FROM "AgricultureData" ad 
WHERE ad.crop_type = 'Rice';


-- 4. Citizens born after 2000 with 10th class education:

SELECT COUNT(*) AS total_citizens 
FROM "Citizen" c 
WHERE c.dob > '2000-01-01' 
AND c.occupation = '10th Class';


-- 5. Panchayat employees with >1 acre land:

SELECT DISTINCT c.first_name, c.last_name 
FROM "Citizen" c 
JOIN "PanchayatMember" pm ON c.citizen_id = pm.citizen_id 
JOIN "AgricultureData" ad ON c.citizen_id = ad.record_id 
WHERE ad.area_hectares > 0.4047;


-- 6. Household members of Pradhan:

SELECT c.first_name, c.last_name 
FROM "Citizen" c 
JOIN "Household" h ON c.citizen_id = h.head_citizen_id 
JOIN "PanchayatMember" pm ON h.head_citizen_id = pm.citizen_id 
WHERE pm.role = 'Pradhan';


-- 7. Street lights in Phulera in 2024:

SELECT COUNT(*) AS total_street_lights 
FROM "Asset" a 
WHERE a.asset_type = 'Street Light' 
AND a.location = 'Phulera' 
AND EXTRACT(YEAR FROM a.acquisition_date) = 2024;


-- 8. Vaccinations for 10th class citizens in 2024:

SELECT COUNT(*) AS total_vaccinations 
FROM "Certificate" cert 
JOIN "Citizen" c ON cert.citizen_id = c.citizen_id 
WHERE cert.certificate_type = 'Vaccination' 
AND EXTRACT(YEAR FROM cert.issue_date) = 2024 
AND c.occupation = '10th Class';


-- 9. Male births in 2024:

SELECT COUNT(*) AS total_boy_births 
FROM "Certificate" cert 
JOIN "Citizen" c ON cert.citizen_id = c.citizen_id 
WHERE cert.certificate_type = 'Birth' 
AND c.gender = 'Male' 
AND EXTRACT(YEAR FROM cert.issue_date) = 2024;


-- 10. Citizens in panchayat employee households:

SELECT COUNT(DISTINCT c.citizen_id) AS total_citizens 
FROM "Citizen" c 
JOIN "Household" h ON c.citizen_id = h.head_citizen_id 
JOIN "PanchayatMember" pm ON h.head_citizen_id = pm.citizen_id;

