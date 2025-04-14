-- Query 6
-- Purpose: List all household members of the Pradhan
-- Tables used:
--   - Citizen: Contains citizen information
--   - Household: Contains household relationships
--   - PanchayatMember: Contains panchayat role information

SELECT c.first_name, c.last_name 
FROM "Citizen" c 
JOIN "Household" h ON c.citizen_id = h.head_citizen_id 
JOIN "PanchayatMember" pm ON h.head_citizen_id = pm.citizen_id 
WHERE pm.role = 'Pradhan'; 