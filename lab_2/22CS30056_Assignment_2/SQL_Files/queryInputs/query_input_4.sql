-- Query 4
-- Purpose: Count citizens born after 2000 who are in 10th class
-- Tables used:
--   - Citizen: Contains birth date and education information
-- Returns: Total count of qualifying citizens

SELECT COUNT(*) AS total_citizens_class_10 
FROM "Citizen" c 
WHERE c.dob > '2000-01-01' 
AND c.occupation = '10th Class'; 