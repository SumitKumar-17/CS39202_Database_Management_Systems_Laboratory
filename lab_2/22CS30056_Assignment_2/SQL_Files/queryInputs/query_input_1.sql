-- Query 1
-- Purpose: Find citizens who own more than 1 acre of land
-- Tables used: 
--   - Citizen: Contains citizen personal information
--   - AgricultureData: Contains land ownership records
-- Note: 1 acre = 0.4047 hectares

SELECT c.first_name, c.last_name 
FROM "Citizen" c 
JOIN "AgricultureData" ad ON c.citizen_id = ad.record_id 
WHERE ad.area_hectares > 0.4047;  -- Converting 1 acre to hectares data