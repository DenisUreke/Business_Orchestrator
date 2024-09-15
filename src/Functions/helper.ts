import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcrypt'; // incase bcrp is used
import { SELECTqueries, INSERTqueries, DELETEqueries, handleQuery } from '../demo';
import { Console } from 'console';

// used for when validating log-in, sent from outside
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  // used for when validating log-in, databse qquery ends up here
  export interface UserRecord {
    username: string;
    password: string; // Hashed password from the database
  }

  // The return made to the caller, bool for success or not and a message : string
  export type RequestAnswer = {
    message: string, 
    requestSuccessful: boolean
  };

  //##################################################################
  //##################################################################
  //##################################################################

  //Log in function

  export async function loginUser(data: any): Promise<RequestAnswer> {
    try {
      // Extract values from the incoming data
      const email = data.username; // Assuming 'username' is actually 'email'
      const password = data.password;
  
      // Basic validation to check if both email and password are entered
      if (!email || !password) {
        return { 
          message: 'Email and password are required.',
          requestSuccessful: false
        };
      }
  
      // Query the database using the extracted email
      const dbUserRecords = await handleQuery(
        SELECTqueries.GET_USER_AND_PASSWORD, [email] // Pass 'email' as array
      );
  
      // Check if dbUserRecords is an array and has at least one result
      if (!Array.isArray(dbUserRecords) || dbUserRecords.length === 0) {
        return {
          message: 'Email does not exist',
          requestSuccessful: false
        };
      }
  
      const dbUserRecord = dbUserRecords[0] as UserRecord;
  
      // Check if the user record has a valid password
      if (!dbUserRecord.password) {
        return {
          message: 'Invalid user data received from the database',
          requestSuccessful: false
        };
      }
  
      // Call helper function to check credentials
      const result = await loginUserHelper({ username: email, password }, dbUserRecord);
      return result;
    } catch (error) {
      console.error('Error in Function A:', error);
      return {
        message: 'Internal server error',
        requestSuccessful: false
      };
    }
  }

  //##################################################################
  //##################################################################
  //##################################################################
  
  // Function B: Checks if the database recordd is null and if the passwords match
  export async function loginUserHelper(loginCredentials: LoginCredentials, dbUserRecord: UserRecord | null): Promise<RequestAnswer> {

    try {
      if (!dbUserRecord || !dbUserRecord.password) {
        return {
          message: 'User does not exist or invalid data', 
          requestSuccessful: false
        }; // Return if user is not found or data is invalid
      }
  
      if (!loginCredentials.password) {
        return {
          message: 'Password is required for comparison', 
          requestSuccessful: false
        };
      }
  
      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(loginCredentials.password, dbUserRecord.password);
  
      if (passwordMatch) {
        return {
          message: 'Credentials are correct', 
          requestSuccessful: true
        }; // Successful authentication
      } else {
        return {
          message: 'Password is incorrect',
          requestSuccessful: false
        }; // Incorrect password
      }
    } catch (error) {
      console.error('Error in Function B:', error);
      return {
        message: 'Internal server error',
        requestSuccessful: false
      };
    }
  }

  //##################################################################
  //##################################################################
  //##################################################################

    //Function to check if email has proper form

    export function isValidEmail(email: string): boolean {
    // Regex for valiadting an email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Test the email againsst the regex pattern
    return emailRegex.test(email);
  }

  //##################################################################
  //##################################################################
  //##################################################################

  //Function to register new user

  export async function registerUser(data: any): Promise<RequestAnswer> {
    const { email, password } = data;
  
    // Check if email and password are provided
    if (!email || !password) {
      return {
        message: 'Email and password are required.',
        requestSuccessful: false,
      };
    }
  
    // Validate email format
    if (!isValidEmail(email)) {
      return {
        message: 'Invalid email format.',
        requestSuccessful: false,
      };
    }
  
    try {
      // Check if the email already exists
      const existingUsers = await handleQuery(SELECTqueries.GET_USER_EMAIL, [email]); // Correctly handle result
  
      // Ensure existingUsers is defined and is an array before checking length
      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return {
          message: 'Email already registered.',
          requestSuccessful: false,
        };
      }
  
      // Encrypt password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Save the new user to the database
      const payload = [email, hashedPassword];
      await handleQuery(INSERTqueries.ADD_USER, payload);
  
      return {
        message: 'User registered successfully.',
        requestSuccessful: true,
      };
    } catch (error) {
      console.error('Error in registerUser Function:', error);
      return {
        message: 'An error occurred during registration.',
        requestSuccessful: false,
      };
    }
  }

  //##################################################################
  //##################################################################
  //##################################################################

  // Function to delete a user by username
  export async function deleteUser(data: any): Promise<RequestAnswer> {
    const { username } = data;
  
    // Validate that a usrename was passed
    if (!username) {
      return {
        message: 'Username is required.',
        requestSuccessful: false,
      };
    }
  
    try {
      // Retireve user ID by username (email)
      const userIdResult: any = await handleQuery(
        SELECTqueries.GET_USER_ID_BY_USERNAME,
        [username] 
      );
  
      // Check if the user ID was found
      if (!userIdResult || userIdResult.length === 0) {
        return {
          message: 'User does not exist.',
          requestSuccessful: false,
        };
      }
  
      // Extract user ID from the result
      const userId = userIdResult[0].id;
  
      // If user ID exists, delete the user
      await handleQuery(DELETEqueries.DELETE_USER_BY_ID, [userId]);
  
      return {
        message: 'User deleted successfully.',
        requestSuccessful: true,
      };
    } catch (error) {
      console.error('Error in deleteUser Function:', error);
      return {
        message: 'An error occurred while deleting the user.',
        requestSuccessful: false,
      };
    }
  }
  //##################################################################
  //##################################################################
  //##################################################################


async function testRegisterUser() {
  console.log('Testing registerUser...');
  const newUser = {
    email: 'testuser@example.com',
    password: 'password123',
  };

  const result = await registerUser(newUser);
  console.log('Register User Result:', result);
}

async function testLoginUser() {
  console.log('Testing loginUser...');
  const credentials = {
    username: 'testuser@example.com', // Assuming username is the email
    password: 'password123',
  };

  const result = await loginUser(credentials);
  console.log('Login User Result:', result);
}

async function testDeleteUser() {
  console.log('Testing deleteUser...');
  const userToDelete = {
    username: 'testuser@example.com', // Assuming username is the email
  };

  const result = await deleteUser(userToDelete);
  console.log('Delete User Result:', result);
}

// Run all tests sequentially
async function runTests() {
  //await testRegisterUser();
  //await testLoginUser();
  //await testDeleteUser();
}

runTests().catch((error) => console.error('Error during testing:', error));