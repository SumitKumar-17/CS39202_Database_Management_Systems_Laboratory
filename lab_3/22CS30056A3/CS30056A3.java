
//  ===============================================
//  =   Name: Sumit Kumar                         =      
//  =  Roll No: 22CS30056                         =
//  =   DBMS Lab                                  =
//  =   Assignment 3: Database Connectivity(JDBC) =
//  ===============================================

import org.postgresql.Driver;
import java.sql.*;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class CS30056A3 {

    private static final String DB_URL = "jdbc:postgresql://10.5.18.73:5432/22CS30056";
    private static final String USER = "22CS30056";
    private static final String PASSWORD = "";

    private static final String[] QUERIES = {
        "SELECT c.first_name, c.last_name FROM \"Citizen\" c JOIN \"AgricultureData\" ad ON c.citizen_id = ad.record_id WHERE ad.area_hectares > 0.4047;",
        "SELECT DISTINCT c.first_name, c.last_name, i.amount AS household_income FROM \"Citizen\" c JOIN \"Household\" h ON c.address = h.house_no JOIN \"Income\" i ON h.household_id = i.income_id WHERE c.gender = 'Female' AND c.occupation = 'Student' AND i.amount < 100000 ORDER BY household_income;",
        "SELECT SUM(ad.area_hectares) AS total_area_rice_cultivation_in_hectares FROM \"AgricultureData\" ad WHERE ad.crop_type = 'Rice';",
        "SELECT first_name AS name FROM \"Citizen\" c WHERE c.dob > '2000-01-01' AND c.occupation = '10th Class';",
        "SELECT DISTINCT c.first_name, c.last_name FROM \"Citizen\" c JOIN \"PanchayatMember\" pm ON c.citizen_id = pm.citizen_id JOIN \"AgricultureData\" ad ON c.citizen_id = ad.record_id WHERE ad.area_hectares > 0.4047;",
        "SELECT c.first_name, c.last_name FROM \"Citizen\" c JOIN \"Household\" h ON c.citizen_id = h.head_citizen_id JOIN \"PanchayatMember\" pm ON h.head_citizen_id = pm.citizen_id WHERE pm.role = 'Pradhan';",
        "SELECT COUNT(*) AS total_street_lights FROM \"Asset\" a WHERE a.asset_type = 'Street Light' AND a.location = 'Phulera' AND EXTRACT(YEAR FROM a.acquisition_date) = 2024;",
        "SELECT COUNT(*) AS total_vaccinations FROM \"Certificate\" cert JOIN \"Citizen\" c ON cert.citizen_id = c.citizen_id WHERE cert.certificate_type = 'Vaccination' AND EXTRACT(YEAR FROM cert.issue_date) = 2024 AND c.occupation = '10th Class';",
        "SELECT COUNT(*) AS total_boy_births FROM \"Certificate\" cert JOIN \"Citizen\" c ON cert.citizen_id = c.citizen_id WHERE cert.certificate_type = 'Birth' AND c.gender = 'Male' AND EXTRACT(YEAR FROM cert.issue_date) = 2024;",
        "SELECT COUNT(DISTINCT c.citizen_id) AS total_citizens FROM \"Citizen\" c JOIN \"Household\" h ON c.citizen_id = h.head_citizen_id JOIN \"PanchayatMember\" pm ON h.head_citizen_id = pm.citizen_id;"
    };

    public static void main(String[] args) {
        try (Connection connection = DriverManager.getConnection(DB_URL, USER, PASSWORD)) {
            Scanner scanner = new Scanner(System.in);

            System.out.println("Enter the query number (1-10) to execute: ");
            int choice = scanner.nextInt();

            if (choice < 1 || choice > 10) {
                System.out.println("Invalid choice. Please select a number between 1 and 10.");
                return;
            }

            executeQuery(connection, choice);
        } catch (SQLException e) {
            System.err.println("Database connection failed: " + e.getMessage());
        }
    }

    private static void executeQuery(Connection connection, int queryChoice) {
        try (Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(QUERIES[queryChoice - 1])) {

            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();

            new File("JavaOutput").mkdirs();
            String outputFile = "JavaOutput/output_query_" + queryChoice + ".txt";

            StringBuilder outputTable = new StringBuilder();
            String formatString = "| %-20s ";

            for (int i = 1; i <= columnCount; i++) {
                System.out.format(formatString, metaData.getColumnName(i));
                outputTable.append(String.format(formatString, metaData.getColumnName(i)));
            }
            System.out.println("|");
            outputTable.append("|\n");
            System.out.println(String.join("", java.util.Collections.nCopies(columnCount * 23, "-")));
            outputTable.append(String.join("", java.util.Collections.nCopies(columnCount * 23, "-"))).append("\n");

            while (resultSet.next()) {
                for (int i = 1; i <= columnCount; i++) {
                    System.out.format(formatString, resultSet.getString(i));
                    outputTable.append(String.format(formatString, resultSet.getString(i)));
                }
                System.out.println("|");
                outputTable.append("|\n");
            }

            try (FileWriter writer = new FileWriter(outputFile)) {
                writer.write(outputTable.toString());
            }

            System.out.println("Results saved to " + outputFile);

        } catch (SQLException | IOException e) {
            System.err.println("Error while executing query: " + e.getMessage());
        }
    }
}
