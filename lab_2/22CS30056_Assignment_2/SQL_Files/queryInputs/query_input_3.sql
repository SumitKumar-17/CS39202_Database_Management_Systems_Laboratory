-- Query 3
-- Purpose: Calculate total area used for rice cultivation
-- Tables used:
--   - AgricultureData: Contains crop and land information
-- Returns: Sum of area in hectares where rice is grown

SELECT SUM(ad.area_hectares) AS total_area_rice_cultivation_in_hectares 
FROM "AgricultureData" ad 
WHERE ad.crop_type = 'Rice'; 