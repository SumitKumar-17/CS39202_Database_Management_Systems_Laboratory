# Define PostgreSQL settings
DB_NAME=22CS30056
DB_USER=22CS30056
DB_HOST=10.5.18.73
DB_PORT=5432
DB_PASSWORD=''  

JAR_PATH=lib/postgresql-42.7.5.jar

# Compiler settings
CC=gcc
CXX=g++
JAVAC=javac
PYTHON=python3

# Output folders
C_OUTPUT=./COutput
CPP_OUTPUT=./CppOutput
JAVA_OUTPUT=./JavaOutput
PYTHON_OUTPUT=./pythonOutput

# Source files
C_SRC=22CS30056A3.c
CPP_SRC=22CS30056A3.cpp
JAVA_SRC=CS30056A3.java
PYTHON_SRC=22CS30056A3.py

# Executables
C_EXE=22CS30056A3_c
CPP_EXE=22CS30056A3_cpp

all: c cpp java python

# Build and run C code
c:
	mkdir -p $(C_OUTPUT)
	$(CC) -o $(C_OUTPUT)/$(C_EXE) $(C_SRC) -lodbc
	$(C_OUTPUT)/$(C_EXE)

# Build and run C++ code
cpp:
	mkdir -p $(CPP_OUTPUT)
	$(CXX) -o $(CPP_OUTPUT)/$(CPP_EXE) $(CPP_SRC) -lodbc
	$(CPP_OUTPUT)/$(CPP_EXE)

# Compile and run Java code
$(JAVA_OUTPUT)/CS30056A3.class: $(JAVA_SRC)
	mkdir -p $(JAVA_OUTPUT)
	javac -cp $(JAR_PATH) -d $(JAVA_OUTPUT) $(JAVA_SRC)

java: $(JAVA_OUTPUT)/CS30056A3.class
	java -cp $(JAVA_OUTPUT):$(JAR_PATH) CS30056A3

# Run Python script
python:
	mkdir -p $(PYTHON_OUTPUT)
	$(PYTHON) $(PYTHON_SRC)

# Initalize the database for running queries
initialize:
	@echo "Dropping Tables,Creating Tables, Inserting Records into tables"
	PGPASSWORD=$(DB_PASSWORD) psql -U $(DB_USER) -h $(DB_HOST) -d $(DB_NAME) -p $(DB_PORT) -f 22CS30056.sql

# Clean all outputs
clean:
	rm -rf $(C_OUTPUT) $(CPP_OUTPUT) $(JAVA_OUTPUT) $(PYTHON_OUTPUT)
