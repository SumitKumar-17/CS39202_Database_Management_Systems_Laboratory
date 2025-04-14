-- Query 7
-- Purpose: Count street lights installed in Phulera in 2024
-- Tables used:
--   - Asset: Contains infrastructure asset information
-- Returns: Total count of street lights

SELECT COUNT(*) AS total_street_lights 
FROM "Asset" a 
WHERE a.asset_type = 'Street Light' 
AND a.location = 'Phulera' 
AND EXTRACT(YEAR FROM a.acquisition_date) = 2024; 