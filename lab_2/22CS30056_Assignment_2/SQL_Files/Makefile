# Define PostgreSQL settings
DB_NAME=22CS30056
DB_USER=22CS30056
DB_HOST=10.5.18.73
DB_PORT=5432
DB_PASSWORD=''  

# Output files for the queries
OUTPUT_1=queryOutputs/query_output_1.txt
OUTPUT_2=queryOutputs/query_output_2.txt
OUTPUT_3=queryOutputs/query_output_3.txt
OUTPUT_4=queryOutputs/query_output_4.txt
OUTPUT_5=queryOutputs/query_output_5.txt
OUTPUT_6=queryOutputs/query_output_6.txt
OUTPUT_7=queryOutputs/query_output_7.txt
OUTPUT_8=queryOutputs/query_output_8.txt
OUTPUT_9=queryOutputs/query_output_9.txt
OUTPUT_10=queryOutputs/query_output_10.txt

# Queries to run
QUERY_1=queryInputs/query_input_1.sql
QUERY_2=queryInputs/query_input_2.sql
QUERY_3=queryInputs/query_input_3.sql
QUERY_4=queryInputs/query_input_4.sql
QUERY_5=queryInputs/query_input_5.sql
QUERY_6=queryInputs/query_input_6.sql
QUERY_7=queryInputs/query_input_7.sql
QUERY_8=queryInputs/query_input_8.sql
QUERY_9=queryInputs/query_input_9.sql
QUERY_10=queryInputs/query_input_10.sql

# Make target to run all queries and store outputs
all: query_1 query_2 query_3 query_4 query_5 query_6 query_7 query_8 query_9 query_10

query_1:
	@echo "Running Query 1: Citizens with more than 1 acre land"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f $(QUERY_1)  > $(OUTPUT_1)

query_2:
	@echo "Running Query 2: Female students with household income < 1 lakh"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f $(QUERY_2) > $(OUTPUT_2)

query_3:
	@echo "Running Query 3: Total rice cultivation area"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f $(QUERY_3) > $(OUTPUT_3)

query_4:
	@echo "Running Query 4: Citizens born after 2000 with 10th class education"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f $(QUERY_4) > $(OUTPUT_4)

query_5:
	@echo "Running Query 5: Panchayat employees with >1 acre land"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f $(QUERY_5) > $(OUTPUT_5)

query_6:
	@echo "Running Query 6: Household members of Pradhan"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f $(QUERY_6) > $(OUTPUT_6)

query_7:
	@echo "Running Query 7: Street lights in Phulera in 2024"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f $(QUERY_7) > $(OUTPUT_7)

query_8:
	@echo "Running Query 8: Vaccinations for 10th class citizens in 2024"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f $(QUERY_8) > $(OUTPUT_8)

query_9:
	@echo "Running Query 9: Male births in 2024"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f $(QUERY_9) > $(OUTPUT_9)

query_10:
	@echo "Running Query 10: Citizens in panchayat employee households"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f $(QUERY_10) > $(OUTPUT_10)

insert:
	@echo "Inserting Records into tables"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f SQL_Commands/insertRecord/insert_1.sql
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f SQL_Commands/insertRecord/insert_2.sql
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f SQL_Commands/insertRecord/insert_3.sql
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f SQL_Commands/insertRecord/insert_4.sql
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f SQL_Commands/insertRecord/insert_5.sql

create:
	@echo "Creating tables for the Gram Panchayat Management System"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f SQL_Commands/createTable.sql

drop:
	@echo "Dropping all the tables from the Database"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f SQL_Commands/dropTable.sql

final:
	@echo "Dropping all the tables from the Database"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f 22CS30056.sql


# Clean target to remove output files
clean:
	rm -f $(OUTPUT_1) $(OUTPUT_2) $(OUTPUT_3) $(OUTPUT_4) $(OUTPUT_5) $(OUTPUT_6) $(OUTPUT_7) $(OUTPUT_8) $(OUTPUT_9) $(OUTPUT_10)

.PHONY: all query_1 query_2 query_3 query_4 query_5 query_6 query_7 query_8 query_9 query_10 clean
