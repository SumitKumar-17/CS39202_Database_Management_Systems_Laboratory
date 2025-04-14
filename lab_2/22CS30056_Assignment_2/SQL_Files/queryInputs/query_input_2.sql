-- Query 2
-- Purpose: Identify female students from households with income less than 1 lakh
-- Tables used:
--   - Citizen: Contains personal and occupation information
--   - Household: Contains household details
--   - Income: Contains household income records
-- Returns: Student names sorted by household income

SELECT DISTINCT c.first_name, c.last_name, i.amount as household_income
FROM "Citizen" c 
JOIN "Household" h ON c.address = h.house_no  -- Join based on shared address
JOIN "Income" i ON h.household_id = i.income_id 
WHERE c.gender = 'Female' 
AND c.occupation = 'Student' 
AND i.amount < 100000
ORDER BY household_income; 