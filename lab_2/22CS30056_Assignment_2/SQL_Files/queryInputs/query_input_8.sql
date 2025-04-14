-- Query 8
-- Purpose: Count vaccinations given to 10th class students in 2024
-- Tables used:
--   - Certificate: Contains vaccination records
--   - Citizen: Contains education information

SELECT COUNT(*) AS total_vaccinations 
FROM "Certificate" cert 
JOIN "Citizen" c ON cert.citizen_id = c.citizen_id 
WHERE cert.certificate_type = 'Vaccination' 
AND EXTRACT(YEAR FROM cert.issue_date) = 2024 
AND c.occupation = '10th Class'; 