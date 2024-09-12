
import { createConnection } from 'mysql2/promise';

/**
 * Enum that is linked to a GET query.
 *
 * @param name - The SQL query to be executed.
 * @returns A promise that resolves when the query execution is complete.
 */


export enum additonalFunction {
    TABLE_ONE = "INSERT INTO table_one (column1, column2, column3) VALUES (?, ?, ?);",
    TABLE_TWO = "INSERT INTO table_two (column1, column2, column3) VALUES (?, ?, ?);",
    TABLE_THREE = "INSERT INTO table_three (column1, column2, column3) VALUES (?, ?, ?);"
  }



async function getHandler(command : getQueries, additionalFunction?: any ) {
  
}

//Enums for each function

enum FunctionType {
  FUNCTION_ONE,
  FUNCTION_TWO,
  FUNCTION_THREE
}

enum Crudoperation {
  HTTP_DATABASE_GET_USER = 
  `SELECT firstname, lastname 
  FROM user 
  WHERE id = 1;` ,
  HTTP_DATABASE_GET_USER_ADRESS = 
  `SELECT street, city, zipcode
  FROM user
  WHERE 
  id = 1;` ,
}

//Three defined functions

function functionOne() {
  console.log("Function One called!");
}

function functionTwo() {
  console.log("Function Two called!");
}

function functionThree() {
  console.log("Function Three called!");
}

// simple function that returns the correct function tied to the specific enum

const functionMap: Record<FunctionType, () => void> = {
  [FunctionType.FUNCTION_ONE]: functionOne,
  [FunctionType.FUNCTION_TWO]: functionTwo,
  [FunctionType.FUNCTION_THREE]: functionThree,
};

// A function that can be called to start a certain function
// ex: a HTTP function calls this function if it wants

function callFunctionByEnum(enumValue: FunctionType) {
  const func = functionMap[enumValue]; // Extract the function tied to the enum
  func(); // Call the function
}

// Examples of how the function is called

callFunctionByEnum(FunctionType.FUNCTION_ONE);
callFunctionByEnum(FunctionType.FUNCTION_TWO);
callFunctionByEnum(FunctionType.FUNCTION_THREE);


//###############################################################################
//###############################################################################
//###############################################################################

//enum tied functions that do not have a return value

enum FunctionTypeA {
  FUNCTION_ONE,
  FUNCTION_TWO
}

//enum tied functions that have a return value

enum FunctionTypeB {
  FUNCTION_THREE,
  FUNCTION_FOUR
}

// Functions that return nothing
function function_One(): void {
  console.log("Function One called, returns nothing!"); // Function returns nothing
}

function function_Two(): void {
  console.log("Function Two called, also returns nothing!"); // Function returns nothing
}

// Functions that return a value
function function_Three(): string {
  return "Function Three returns a string!"; // Function Three returns a string
}

function function_Four(): number {
  return 123; // Function Four returns a number
}

// Map for functions that return void
const voidFunctionMap: Record<FunctionTypeA, () => void> = {
  [FunctionTypeA.FUNCTION_ONE]: function_One,
  [FunctionTypeA.FUNCTION_TWO]: function_Two
};

// Map for functions that return a value
const returnFunctionMap: Record<FunctionTypeB, () => any> = {
  [FunctionTypeB.FUNCTION_THREE]: function_Three,
  [FunctionTypeB.FUNCTION_FOUR]: function_Four
};

// Function to call void functions
function callVoidFunction(enumValue: FunctionTypeA): void {

  const func = voidFunctionMap[enumValue]; // Retrieve the function tied to the enumn
    func(); // Start the function
}

// Function to call functions that return a value
function callReturnFunction(enumValue: FunctionTypeB): void {

  const func = returnFunctionMap[enumValue]; // Retrieve the function tied to the enumn
    const result = func(); // Call the function and store the returned value
}

// Function to call functions that return a value and the returns to caller
function callReturnFunction2(enumValue: FunctionTypeB): any {
  const func = returnFunctionMap[enumValue]; 
  const value = func();
  return value;
}

callVoidFunction(FunctionTypeA.FUNCTION_ONE)

callReturnFunction(FunctionTypeB.FUNCTION_THREE)

var returnvalue = callReturnFunction2(FunctionTypeB.FUNCTION_THREE)

//###############################################################################
//###############################################################################
//###############################################################################

// Define the database connection configuration
const connectionConfig = {
  host: 'localhost',      
  user: 'root',           
  password: 'password',   
  database: 'our_database'
};

// Queries tied to enums

export enum getQueries {
  TABLE_ONE = "SELECT * FROM table_one;",
  TABLE_TWO = "SELECT * FROM table_two;",
  TABLE_THREE = "SELECT * FROM table_three;"
}

// Normal function to execute a query based on the provided enum

async function executeQuery(command: getQueries): Promise<any> {
  const connection = await createConnection(connectionConfig);

  try {
    const [rows] = await connection.execute(command);  // Execute the query tied to the enum value
    console.log('Query executed successfully:', command);

    return rows; // Return the query result
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

var response = executeQuery(getQueries.TABLE_ONE)

//###############################################################################
//###############################################################################
//###############################################################################


// New function that accepts two optional parameters
function executeBasedOnEnums( functionAEnum?: FunctionTypeA, functionBEnum?: FunctionTypeB 
): void {

  if (functionAEnum !== undefined) {
    console.log(`Executing FunctionTypeA enum: ${FunctionTypeA[functionAEnum]}`);
    callVoidFunction(functionAEnum);
  }

  // Check if a FunctionTypeB enum value is provided
  if (functionBEnum !== undefined) {
    console.log(`Executing FunctionTypeB enum: ${FunctionTypeB[functionBEnum]}`);
    callReturnFunction(functionBEnum); 
  }

}

//###############################################################################
//###############################################################################
//###############################################################################

export enum postQueries {
  TABLE_ONE = "INSERT INTO table_one (column1, column2, column3) VALUES (?, ?, ?);",
  TABLE_TWO = "INSERT INTO table_two (column1, column2, column3) VALUES (?, ?, ?);",
  TABLE_THREE = "INSERT INTO table_three (column1, column2, column3) VALUES (?, ?, ?);"
}

//Function that calls the database
async function executePostQuery(command: postQueries, values: any[]): Promise<any> {
  const connection = await createConnection(connectionConfig);

  try {

    const [result] = await connection.execute(command, values);

    return result; // Return the result of the query execution
  } catch (error) {
    console.error('Error executing post query:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Wrapper for cleaner code
async function insertIntoTable(query: postQueries, values: any[]): Promise<any> {
  try {
    const result = await executePostQuery(query, values);
    return result; // Return the result of the query execution
  } catch (error) {
    console.error('Error during insert operation:', error);
    throw error;
  }
}

//how it is called
(async () => {
    await insertIntoTable(postQueries.TABLE_ONE, ['value1', 'value2', 'value3']);
})();

//###############################################################################
//###############################################################################
//###############################################################################


// Enums for different query types
enum SELECTqueries {
  GET_USER = "SELECT firstname, lastname FROM user WHERE id = ?;",
  GET_ADDRESS = "SELECT street, city, zipcode FROM user WHERE id = ?;"
}

enum INSERTqueries {
  ADD_USER = "INSERT INTO user (firstname, lastname, email) VALUES (?, ?, ?);",
  ADD_ADDRESS = "INSERT INTO address (street, city, zipcode) VALUES (?, ?, ?);"
}

enum UPDATEqueries {
  UPDATE_USER = "UPDATE user SET firstname = ?, lastname = ? WHERE id = ?;",
  UPDATE_ADDRESS = "UPDATE address SET street = ?, city = ?, zipcode = ? WHERE id = ?;"
}

enum DELETEqueries {
  DELETE_USER = "DELETE FROM user WHERE id = ?;",
  DELETE_ADDRESS = "DELETE FROM address WHERE id = ?;"
}

// Helper functions to check the type of query
function isSELECTquery(query: any): query is SELECTqueries {
  return Object.values(SELECTqueries).includes(query);
}

function isINSERTquery(query: any): query is INSERTqueries {
  return Object.values(INSERTqueries).includes(query);
}

function isUPDATEquery(query: any): query is UPDATEqueries {
  return Object.values(UPDATEqueries).includes(query);
}

function isDELETEquery(query: any): query is DELETEqueries {
  return Object.values(DELETEqueries).includes(query);
}

function executeInsertQuery(queryType : INSERTqueries , inParameters? : any[])
 {

 }

 function executeUpdateQuery(queryType : UPDATEqueries , inParameters? : any[])
 {

 }

 function executeDeleteQuery(queryType : DELETEqueries , inParameters? : any[])
 {

 }

// Function to execute SELECT queries
async function executeSelectQuery(query: string, parameters?: any[]): Promise<any> {
  let connection;
  try {
    // Create a new database connection
    connection = await createConnection(connectionConfig);

    // Execute the query with parameters using a prepared statement
    const [rows] = await connection.execute(query, parameters);

    // Log and return the results
    console.log('Query executed successfully:', rows);
    return rows;
  } catch (error) {
    console.error('Error executing SELECT query:', error);
    throw error;
  } finally {
    // Ensure the connection is closed
    if (connection) {
      await connection.end();
    }
  }
}

// Function to handle different query types, with optional parameters
function handleQuery(
  queryType?: SELECTqueries | INSERTqueries | UPDATEqueries | DELETEqueries,
  inParameters?: any[]
): void {
  if (!queryType) {
    console.warn('No query provided');
    return;
  }

  switch (true) {
    case isSELECTquery(queryType):
      executeSelectQuery(queryType, inParameters); // Call the function to handle SELECT queries
      break;

    case isINSERTquery(queryType):
      executeInsertQuery(queryType, inParameters); // Call the function to handle INSERT queries
      break;

    case isUPDATEquery(queryType):
      executeUpdateQuery(queryType, inParameters); // Call the function to handle UPDATE queries
      break;

    case isDELETEquery(queryType):
      executeDeleteQuery(queryType, inParameters); // Call the function to handle DELETE queries
      break;

    default:
      console.error('Invalid query type provided');
      break;
  }
}

/*
(async () => {
  await handleQuery(SELECTqueries.GET_USER, [1]);
  await handleQuery(INSERTqueries.ADD_USER, ["John", "Doe", "john.doe@example.com"]);
})();
*/

// Example usage
handleQuery(); // No query provided
handleQuery(SELECTqueries.GET_USER, [1]); // Executes SELECT query with parameters
handleQuery(INSERTqueries.ADD_USER, ["John", "Doe", "john.doe@example.com"]);