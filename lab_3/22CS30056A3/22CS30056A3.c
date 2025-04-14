/*
 ===============================================
 =   Name: Sumit Kumar                         =
 =  Roll No: 22CS30056                         =
 =   DBMS Lab                                  =
 =   Assignment 3: Database Connectivity (ODBC)=
 ===============================================
*/
#include <sql.h>
#include <sqlext.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

#define MAX_COLS 10
#define MAX_ROW_LENGTH 1024

void execute_query(SQLHDBC hdbc, int choice) {
  const char *queries[] = {
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
    printf("Invalid choice. Please select a valid query number.\n");
    return;
  }

  SQLHSTMT hstmt;
  SQLAllocHandle(SQL_HANDLE_STMT, hdbc, &hstmt);
  SQLExecDirect(hstmt, (SQLCHAR *)queries[choice - 1], SQL_NTS);

  SQLSMALLINT colCount;
  SQLNumResultCols(hstmt, &colCount);

  if (colCount > MAX_COLS) {
    printf("Too many columns to handle!\n");
    return;
  }

  char **colNames = (char **)malloc(colCount * sizeof(char *));
  char **colData = (char **)malloc(colCount * sizeof(char *));
  for (int i = 0; i < colCount; i++) {
    colNames[i] = (char *)malloc(64 * sizeof(char));
    colData[i] = (char *)malloc(256 * sizeof(char));
  }

  for (int i = 1; i <= colCount; i++) {
    SQLDescribeCol(hstmt, i, (SQLCHAR *)colNames[i - 1], 64, NULL, NULL, NULL,
                   NULL, NULL);
  }

  for (int i = 0; i < colCount; i++) {
    printf("| %-18s ", colNames[i]);
  }
  printf("|\n");
  for (int i = 0; i < colCount; i++) {
    printf("+--------------------");
  }
  printf("+\n");

  mkdir("COutput", 0755);
  char filename[50];
  snprintf(filename, sizeof(filename), "COutput/output_query_%d.txt", choice);
  FILE *file = fopen(filename, "w");

  for (int i = 0; i < colCount; i++) {
    fprintf(file, "| %-18s ", colNames[i]);
  }
  fprintf(file, "|\n");
  for (int i = 0; i < colCount; i++) {
    fprintf(file, "+--------------------");
  }
  fprintf(file, "+\n");

  while (SQLFetch(hstmt) == SQL_SUCCESS) {
    for (int i = 0; i < colCount; i++) {
      SQLGetData(hstmt, i + 1, SQL_C_CHAR, colData[i], 256, NULL);
      printf("| %-18s ", colData[i]);
      fprintf(file, "| %-18s ", colData[i]);
    }
    printf("|\n");
    fprintf(file, "|\n");
  }

  fclose(file);
  printf("Results saved to %s\n", filename);

  for (int i = 0; i < colCount; i++) {
    free(colNames[i]);
    free(colData[i]);
  }
  free(colNames);
  free(colData);
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
    printf("Connected to database.\n");
    printf("Select a query to execute (1-10): ");
    int choice;
    if (scanf("%d", &choice) == 1) {
      execute_query(hdbc, choice);
    } else {
      printf("Invalid input. Please enter a valid query number.\n");
    }
  } else {
    printf("Database connection failed.\n");
  }

  SQLDisconnect(hdbc);
  SQLFreeHandle(SQL_HANDLE_DBC, hdbc);
  SQLFreeHandle(SQL_HANDLE_ENV, henv);
  return 0;
}