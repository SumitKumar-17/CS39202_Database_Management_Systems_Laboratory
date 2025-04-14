
#  ===============================================
#  =   Name: Sumit Kumar                         =      
#  =  Roll No: 22CS30056                         =
#  =   DBMS Lab                                  =
#  =   Assignment 3: Database Connectivity       =
#  ===============================================


import psycopg2
from psycopg2 import sql
import os
from prettytable import PrettyTable

def connect_to_database():
    try:
        connection = psycopg2.connect(
            database="22CS30056",
            user="22CS30056",
            password="",
            host="10.5.18.73",
            port="5432"
        )
        return connection
    except Exception as e:
        print("Error while connecting to the database:", e)
        return None

queries = {
    1: """SELECT c.first_name, c.last_name \
            FROM "Citizen" c \
            JOIN "AgricultureData" ad ON c.citizen_id = ad.record_id \
            WHERE ad.area_hectares > 0.4047;""",

    2: """SELECT DISTINCT c.first_name, c.last_name, i.amount as household_income \
            FROM "Citizen" c \
            JOIN "Household" h ON c.address = h.house_no \
            JOIN "Income" i ON h.household_id = i.income_id \
            WHERE c.gender = 'Female' \
            AND c.occupation = 'Student' \
            AND i.amount < 100000 \
            ORDER BY household_income;""",

    3: """SELECT SUM(ad.area_hectares) AS total_area_rice_cultivation_in_hectares \
            FROM "AgricultureData" ad \
            WHERE ad.crop_type = 'Rice';""",

    4: """SELECT first_name  \
            FROM "Citizen" c \
            WHERE c.dob > '2000-01-01' \
            AND c.occupation = '10th Class';""",

    5: """SELECT DISTINCT c.first_name, c.last_name \
            FROM "Citizen" c \
            JOIN "PanchayatMember" pm ON c.citizen_id = pm.citizen_id \
            JOIN "AgricultureData" ad ON c.citizen_id = ad.record_id \
            WHERE ad.area_hectares > 0.4047;""",

    6: """SELECT c.first_name, c.last_name \
            FROM "Citizen" c \
            JOIN "Household" h ON c.citizen_id = h.head_citizen_id \
            JOIN "PanchayatMember" pm ON h.head_citizen_id = pm.citizen_id \
            WHERE pm.role = 'Pradhan';""",

    7: """SELECT COUNT(*) AS total_street_lights \
            FROM "Asset" a \
            WHERE a.asset_type = 'Street Light' \
            AND a.location = 'Phulera' \
            AND EXTRACT(YEAR FROM a.acquisition_date) = 2024;""",

    8: """SELECT COUNT(*) AS total_vaccinations \
            FROM "Certificate" cert \
            JOIN "Citizen" c ON cert.citizen_id = c.citizen_id \
            WHERE cert.certificate_type = 'Vaccination' \
            AND EXTRACT(YEAR FROM cert.issue_date) = 2024 \
            AND c.occupation = '10th Class';""",

    9: """SELECT COUNT(*) AS total_boy_births \
            FROM "Certificate" cert \
            JOIN "Citizen" c ON cert.citizen_id = c.citizen_id \
            WHERE cert.certificate_type = 'Birth' \
            AND c.gender = 'Male' \
            AND EXTRACT(YEAR FROM cert.issue_date) = 2024;""",

    10: """SELECT COUNT(DISTINCT c.citizen_id) AS total_citizens \
            FROM "Citizen" c \
            JOIN "Household" h ON c.citizen_id = h.head_citizen_id \
            JOIN "PanchayatMember" pm ON h.head_citizen_id = pm.citizen_id;"""
}

def execute_query(choice, connection):
    try:
        query = queries.get(choice)
        if not query:
            print("Invalid choice. Please select a number between 1 and 10.")
            return

        with connection.cursor() as cursor:
            cursor.execute(query)
            results = cursor.fetchall()

            colnames = [desc[0] for desc in cursor.description]

            table = PrettyTable()
            table.field_names = colnames

            for row in results:
                table.add_row(row)

            print(table)

            os.makedirs("pythonOutput", exist_ok=True)
            output_file = os.path.join("pythonOutput", f"output_query_{choice}.txt")

            with open(output_file, "w") as file:
                file.write(table.get_string())

            print(f"Results have been saved to {output_file}")
    except Exception as e:
        print("Error while executing query:", e)

def main():
    connection = connect_to_database()
    if not connection:
        return

    try:
        print("Select a query to execute (1-10):")
        choice = int(input("Enter the query number: "))
        execute_query(choice, connection)
    except ValueError:
        print("Please enter a valid number between 1 and 10.")
    finally:
        connection.close()

if __name__ == "__main__":
    main()
