/*
 ===============================================
 =   Name: Sumit Kumar                         =
 =  Roll No: 22CS30056                         =
 =   DBMS Lab                                  =
 =   Assignment 3: Database Connectivity (ODBC)=
 ===============================================
*/

#include <fstream>
#include <iomanip>
#include <iostream>
#include <sql.h>
#include <sqlext.h>
#include <sys/stat.h>
#include <vector>

using namespace std;

void executeQuery(SQLHDBC hdbc, int choice) {
  vector<string> queries = {
      "SELECT c.first_name, c.last_name FROM \"Citizen\" c JOIN "
      "\"AgricultureData\" ad ON c.citizen_id = ad.record_id WHERE "
      "ad.area_hectares > 0.4047;",
      "SELECT DISTINCT c.first_name, c.last_name, i.amount as household_income "
      "FROM \"Citizen\" c JOIN \"Household\" h ON c.address = h.house_no JOIN "
      "\"Income\" i ON h.household_id = i.income_id WHERE c.gender = 'Female' "
      "AND c.occupation = 'Student' AND i.amount < 100000 ORDER BY "
      "household_income;",
      "SELECT SUM(ad.area_hectares) AS total_area_rice_cultivation_in_hectares "
      "FROM \"AgricultureData\" ad WHERE ad.crop_type = 'Rice';",
      "SELECT COUNT(*) AS total_citizens_class_10 FROM \"Citizen\" c WHERE "
      "c.dob > '2000-01-01' AND c.occupation = '10th Class';",
      "SELECT DISTINCT c.first_name, c.last_name FROM \"Citizen\" c JOIN "
      "\"PanchayatMember\" pm ON c.citizen_id = pm.citizen_id JOIN "
      "\"AgricultureData\" ad ON c.citizen_id = ad.record_id WHERE "
      "ad.area_hectares > 0.4047;",
      "SELECT c.first_name, c.last_name FROM \"Citizen\" c JOIN \"Household\" "
      "h ON c.citizen_id = h.head_citizen_id JOIN \"PanchayatMember\" pm ON "
      "h.head_citizen_id = pm.citizen_id WHERE pm.role = 'Pradhan';",
      "SELECT COUNT(*) AS total_street_lights FROM \"Asset\" a WHERE "
      "a.asset_type = 'Street Light' AND a.location = 'Phulera' AND "
      "EXTRACT(YEAR FROM a.acquisition_date) = 2024;",
      "SELECT COUNT(*) AS total_vaccinations FROM \"Certificate\" cert JOIN "
      "\"Citizen\" c ON cert.citizen_id = c.citizen_id WHERE "
      "cert.certificate_type = 'Vaccination' AND EXTRACT(YEAR FROM "
      "cert.issue_date) = 2024 AND c.occupation = '10th Class';",
      "SELECT COUNT(*) AS total_boy_births FROM \"Certificate\" cert JOIN "
      "\"Citizen\" c ON cert.citizen_id = c.citizen_id WHERE "
      "cert.certificate_type = 'Birth' AND c.gender = 'Male' AND EXTRACT(YEAR "
      "FROM cert.issue_date) = 2024;",
      "SELECT COUNT(DISTINCT c.citizen_id) AS total_citizens FROM \"Citizen\" "
      "c JOIN \"Household\" h ON c.citizen_id = h.head_citizen_id JOIN "
      "\"PanchayatMember\" pm ON h.head_citizen_id = pm.citizen_id;"};

  if (choice < 1 || choice > 10) {
    cout << "Invalid choice. Please select a valid query number.\n";
    return;
  }

  SQLHSTMT hstmt;
  SQLAllocHandle(SQL_HANDLE_STMT, hdbc, &hstmt);
  SQLExecDirect(hstmt, (SQLCHAR *)queries[choice - 1].c_str(), SQL_NTS);

  SQLSMALLINT colCount;
  SQLNumResultCols(hstmt, &colCount);

  vector<string> columnNames(colCount);
  vector<vector<string>> results;

  for (int i = 0; i < colCount; i++) {
    SQLCHAR colName[64];
    SQLDescribeCol(hstmt, i + 1, colName, sizeof(colName), NULL, NULL, NULL,
                   NULL, NULL);
    columnNames[i] = (char *)colName;
  }

  SQLCHAR colData[256];
  while (SQLFetch(hstmt) == SQL_SUCCESS) {
    vector<string> row;
    for (int i = 0; i < colCount; i++) {
      SQLGetData(hstmt, i + 1, SQL_C_CHAR, colData, sizeof(colData), NULL);
      row.push_back((char *)colData);
    }
    results.push_back(row);
  }

  mkdir("CppOutput", 0755);
  string filename = "CppOutput/output_query_" + to_string(choice) + ".txt";
  ofstream file(filename);

  for (const auto &col : columnNames) {
    cout << setw(20) << left << col;
    file << "| " << setw(18) << left << col << " ";
  }
  cout << "\n";
  file << "|\n";

  for (size_t i = 0; i < columnNames.size(); i++) {
    cout << "----------------------";
    file << "+--------------------";
  }
  cout << "\n";
  file << "+\n";

  for (const auto &row : results) {
    for (const auto &cell : row) {
      cout << setw(20) << left << cell;
      file << "| " << setw(18) << left << cell << " ";
    }
    cout << "\n";
    file << "|\n";
  }

  cout << "\nResults saved to: " << filename << "\n";
  file.close();
  SQLFreeHandle(SQL_HANDLE_STMT, hstmt);
}

int main() {
  SQLHENV henv;
  SQLHDBC hdbc;

  SQLAllocHandle(SQL_HANDLE_ENV, SQL_NULL_HANDLE, &henv);
  SQLSetEnvAttr(henv, SQL_ATTR_ODBC_VERSION, (void *)SQL_OV_ODBC3, 0);
  SQLAllocHandle(SQL_HANDLE_DBC, henv, &hdbc);

  SQLCHAR connStr[] = "DSN=PostgreSQLDSN;";
  SQLCHAR connOut[1024];
  SQLSMALLINT connOutLen;

  if (SQLDriverConnect(hdbc, NULL, connStr, SQL_NTS, connOut, sizeof(connOut),
                       &connOutLen, SQL_DRIVER_NOPROMPT) == SQL_SUCCESS) {
    cout << "Connected to database.\n";
    cout << "Select a query to execute (1-10): ";
    int choice;
    if (cin >> choice) {
      executeQuery(hdbc, choice);
    } else {
      cout << "Invalid input. Please enter a valid query number.\n";
    }
  } else {
    cout << "Database connection failed.\n";
  }

  SQLDisconnect(hdbc);
  SQLFreeHandle(SQL_HANDLE_DBC, hdbc);
  SQLFreeHandle(SQL_HANDLE_ENV, henv);
  return 0;
}
