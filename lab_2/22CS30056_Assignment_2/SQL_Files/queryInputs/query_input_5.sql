-- Query 5
-- Purpose: Find panchayat employees who own more than 1 acre of land
-- Tables used:
--   - Citizen: Contains citizen information
--   - PanchayatMember: Contains panchayat employment records
--   - AgricultureData: Contains land ownership records
--   - Note: 1 acre is 0.4047 hectares

SELECT DISTINCT c.first_name, c.last_name 
FROM "Citizen" c 
JOIN "PanchayatMember" pm ON c.citizen_id = pm.citizen_id 
JOIN "AgricultureData" ad ON c.citizen_id = ad.record_id 
WHERE ad.area_hectares > 0.4047; 