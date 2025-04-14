-- Query 10
-- Purpose: Count total citizens living in households headed by panchayat employees
-- Tables used:
--   - Citizen: Contains citizen information
--   - Household: Contains household relationships
--   - PanchayatMember: Contains panchayat employment records

SELECT COUNT(DISTINCT c.citizen_id) AS total_citizens 
FROM "Citizen" c 
JOIN "Household" h ON c.citizen_id = h.head_citizen_id 
JOIN "PanchayatMember" pm ON h.head_citizen_id = pm.citizen_id; 