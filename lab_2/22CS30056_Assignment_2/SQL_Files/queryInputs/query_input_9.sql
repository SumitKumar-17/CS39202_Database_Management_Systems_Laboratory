-- Query 9
-- Purpose: Count male births in 2024
-- Tables used:
--   - Certificate: Contains birth records
--   - Citizen: Contains gender information

SELECT COUNT(*) AS total_boy_births 
FROM "Certificate" cert 
JOIN "Citizen" c ON cert.citizen_id = c.citizen_id 
WHERE cert.certificate_type = 'Birth' 
AND c.gender = 'Male' 
AND EXTRACT(YEAR FROM cert.issue_date) = 2024; 