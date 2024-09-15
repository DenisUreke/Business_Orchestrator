import { createConnection } from 'mysql2/promise';
import { registerUser } from './Functions/helper';

/**
 * Enum representing different SQL queries linked to a GET request.
 * 
 * @enum {string}
 */
// Enums for different query types
export enum SELECTqueries {
  GET_USER = "SELECT email, password FROM user WHERE id = ?;",
  GET_ADDRESS = "SELECT street, city, zipcode FROM address WHERE id = ?;",
  GET_USER_AND_PASSWORD = 'SELECT email, password FROM user WHERE email = ?',
  GET_USER_EMAIL = 'SELECT * FROM user WHERE email = ?',
  GET_USER_ID_BY_USERNAME = 'SELECT id FROM user WHERE email = ?'
}

export enum INSERTqueries {
  ADD_USER = "INSERT INTO user (email, password) VALUES (?, ?)",
  ADD_ADDRESS = "INSERT INTO address (street, city, zipcode) VALUES (?, ?, ?);",
}

export enum UPDATEqueries {
  UPDATE_USER = "UPDATE user SET firstname = ?, lastname = ? WHERE id = ?;",
  UPDATE_ADDRESS = "UPDATE address SET street = ?, city = ?, zipcode = ? WHERE id = ?;"
}

export enum DELETEqueries {
  DELETE_USER_BY_ID = 'DELETE FROM user WHERE id = ?',
  DELETE_ADDRESS = "DELETE FROM address WHERE id = ?;"
}

// Helper functions to check the type of query
export function isSELECTquery(query: any): query is SELECTqueries {
  return Object.values(SELECTqueries).includes(query);
}

export function isINSERTquery(query: any): query is INSERTqueries {
  return Object.values(INSERTqueries).includes(query);
}

export function isUPDATEquery(query: any): query is UPDATEqueries {
  return Object.values(UPDATEqueries).includes(query);
}

export function isDELETEquery(query: any): query is DELETEqueries {
  return Object.values(DELETEqueries).includes(query);
}

// Helper function to create a connection
export async function getConnection() {
  return createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'mockdata',
    port: 3307,
  });
}

// Function to execute SELECT queries
export async function executeSelectQuery(query: string, parameters?: any[]): Promise<any> {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(query, parameters);
    console.log('Query executed successfully:', rows);
    return rows;
  } catch (error) {
    console.error('Error executing SELECT query:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Function to execute INSERT queries
export async function executeInsertQuery(queryType: INSERTqueries, inParameters?: any[]): Promise<void> {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(queryType, inParameters);
    console.log('INSERT query executed successfully:', result);
  } catch (error) {
    console.error('Error executing INSERT query:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Function to execute UPDATE queries
export async function executeUpdateQuery(queryType: UPDATEqueries, inParameters?: any[]): Promise<void> {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(queryType, inParameters);
    console.log('UPDATE query executed successfully:', result);
  } catch (error) {
    console.error('Error executing UPDATE query:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Handles DELETE SQL queries.
 *
 * @param queryType - The query to execute.
 * @param inParameters - Optional parameters for the query.
 * @returns A promise that resolves when the query is handled.clear
 */

export async function executeDeleteQuery(queryType: DELETEqueries, inParameters?: any[]): Promise<void> {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(queryType, inParameters);
    console.log('DELETE query executed successfully:', result);
  } catch (error) {
    console.error('Error executing DELETE query:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

/**
 * Handles different types of SQL queries.
 *
 * @param queryType - The type of query to execute.
 * @param inParameters - Optional parameters for the query.
 * @returns A promise that resolves when the query is handled.
 */

// Function to handle different query types
export async function handleQuery(queryType?: SELECTqueries | INSERTqueries | UPDATEqueries | DELETEqueries, inParameters?: any[]): Promise<any> {
  if (!queryType) {
    console.warn('No query provided');
    return;
  }

  switch (true) {
    case isSELECTquery(queryType):
      return await executeSelectQuery(queryType, inParameters);

    case isINSERTquery(queryType):
      return await executeInsertQuery(queryType, inParameters);

    case isUPDATEquery(queryType):
      return await executeUpdateQuery(queryType, inParameters);

    case isDELETEquery(queryType):
      return await executeDeleteQuery(queryType, inParameters);

    default:
      console.error('Invalid query type provided');
      break;
  }
}

async function endpoint(){

  var name = await handleQuery(SELECTqueries.GET_USER, [1]);

  console.log(name)

}


//###############################################################################
//###############################################################################
//###############################################################################


// Function definitions
export function functionA(): void {
  console.log("Function A was called");
}

export function functionB(stop: boolean): void {
  console.log("Function B was called");
}

export function functionC(): string {
  console.log("Function C was called");
  return "Function Three returns a string!";
}

export function functionD(id: number): number {
  console.log(`Function D was called \n`);
  return 123;
}

// Enums for different types of functions
export enum HTTPvoidFunctions {
  Function_A = 0
}

export enum HTTPvoidInparameterFunctions {
  Function_B = 100
}

export enum HTTPreturnFunctions {
  Function_C = 200
}

export enum HTTPreturnInparameterFunctions {
  Function_D = 300,
  REGISTER_USER = 301
}

// Functions that map the enum to a function and returns it
export const voidFunctionMap: Record<HTTPvoidFunctions, () => void> = {
  [HTTPvoidFunctions.Function_A]: functionA
};

export const voidInparameterFunctionMap: Record<HTTPvoidInparameterFunctions, (param: any) => void> = {
  [HTTPvoidInparameterFunctions.Function_B]: functionB
};

export const returnFunctionMap: Record<HTTPreturnFunctions, () => any> = {
  [HTTPreturnFunctions.Function_C]: functionC
};

export const returnInparameterFunctionMap: Record<HTTPreturnInparameterFunctions, (param: any) => any> = {
  [HTTPreturnInparameterFunctions.Function_D]: functionD,
  [HTTPreturnInparameterFunctions.REGISTER_USER]: registerUser
};


// Helper functions to check the type of enum, the switch calls this to see which enum was sent in as a parameter
export function isHTTPVoidFunction(query: any): query is HTTPvoidFunctions {
  return Object.values(HTTPvoidFunctions).includes(query);
}

export function isHTTPVoidInparameterFunction(query: any): query is HTTPvoidInparameterFunctions{
  return Object.values(HTTPvoidInparameterFunctions).includes(query);
}

export function isHTTPReturnFunction(query: any): query is HTTPreturnFunctions {
  return Object.values(HTTPreturnFunctions).includes(query);
}

export function isHTTPReturnInparameterFunction(query: any): query is HTTPreturnInparameterFunctions{
  return Object.values(HTTPreturnInparameterFunctions).includes(query);
}

//Switch
export async function handleFunctionCall(
  functionCall?: HTTPvoidFunctions | HTTPvoidInparameterFunctions | HTTPreturnFunctions | HTTPreturnInparameterFunctions,
  inParameter?: any
): Promise<any> {
  switch (true) {
    case isHTTPVoidFunction(functionCall): {
      const voidFunction = voidFunctionMap[functionCall];
      voidFunction();
      break;
    }
    
    case isHTTPReturnFunction(functionCall): {
      const returnFunction = returnFunctionMap[functionCall];
      return returnFunction();
    }
    
    case isHTTPVoidInparameterFunction(functionCall): {
      const voidFunctionWithInparameter = voidInparameterFunctionMap[functionCall];
      voidFunctionWithInparameter(inParameter);
      break;
    }
    
    case isHTTPReturnInparameterFunction(functionCall): {
      const returnFunctionWithInparameter = returnInparameterFunctionMap[functionCall];
      // Await the result in case it is a Promise
      return await returnFunctionWithInparameter(inParameter);
    }
    
    default:
      console.error('Invalid function type provided');
      return {
        message: 'Invalid function type provided',
        requestSuccessful: false,
      };
  }
}

/*
handleFunctionCall(HTTPvoidFunctions.Function_A)

handleFunctionCall(HTTPvoidInparameterFunctions.Function_B, true)

var test = handleFunctionCall(HTTPreturnFunctions.Function_C)

var test2 = handleFunctionCall(HTTPreturnInparameterFunctions.Function_D, 10)
*/


//endpoint();

(async () => {
  const newUser = {
    email: 'roligadagar@example.com',
    password: 'password123',
  };

  // Use `await` to handle the asynchronous call
  const message = await handleFunctionCall(HTTPreturnInparameterFunctions.REGISTER_USER, newUser);
  console.log("The message back:", message);
})();

/*(async () => {

    const newUserParameters = ['Captain', 'Rob'];

    await handleQuery(INSERTqueries.ADD_USER, newUserParameters);

})();*/

