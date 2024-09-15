import { createConnection } from 'mysql2/promise';
import bcrypt from 'bcrypt'; // incase bcrp is used
import { SELECTqueries, INSERTqueries, handleQuery } from '../demo';

  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface UserRecord {
    username: string;
    password: string; // Hashed password from the database
  }

  export type RequestAnswer = {
    message: string, 
    requestSuccessful: boolean
  };

  //Log in function

  export async function functionA(data: any): Promise<RequestAnswer> {
    try {
      // Extract values from the incoming data
      const username = data.username;
      const password = data.password;
  
      // Basic validation to check if both username and password are entered
      if (!username || !password) {
        return { 
        message: 'Username and password are required.',
        requestSuccessful: false
      };
      }

      // Query the database using the extracted username
      const dbUserRecord: UserRecord | null = await handleQuery(
        SELECTqueries.GET_USER_AND_PASSWORD, username)
  
      // Call Function B to check credentials
      const result = await functionB({ username, password }, dbUserRecord);
      return result;
    } catch (error) {
      console.error('Error in Function A:', error);
      return {
        message: 'Internal server error',
        requestSuccessful: false
      };
    }
  }
  
  // Function B: Checks if the database recordd is null and if the passwords match
  export async function functionB(loginCredentials: LoginCredentials, dbUserRecord: UserRecord | null): Promise<RequestAnswer> {

    try{
    if (!dbUserRecord) {
      return {
        message: 'Username does not exist', 
        requestSuccessful: false
      }; // Return if usre is not found
    }
  
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(loginCredentials.password, dbUserRecord.password);
  
    if (passwordMatch) {
      return {
        message: 'Credentials are correct', 
        requestSuccessful: true}; // Successsful authentication
    } else {
      return {
        message: 'Password is incorrect',
        requestSuccessful: false
      }; // Incorrect password
    }
    }catch(error){
      console.error('Error in Function B:', error);
      return {
        message: 'Internal server error',
        requestSuccessful: false
      };
    }
  }

    //Function to check if email has proper form

    export function isValidEmail(email: string): boolean {
    // Regex for valiadting an email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Test the email againsst the regex pattern
    return emailRegex.test(email);
  }


  //Function to register new user

  export async function registerUser(data: any): Promise<RequestAnswer> {
    const { email, password } = data;
  
    if (!email || !password) {
      return {
        message: 'Email and password are required.',
        requestSuccessful: false,
      };
    }
  
    // Validate meail format
    if (!isValidEmail(email)) {
      return {
        message: 'Invalid email format.',
        requestSuccessful: false,
      };
    }
  
    try {
  
      // Check if the email already exists
      const [existingUser] = await handleQuery(SELECTqueries.GET_USER_EMAIL, email);
  
      if ((existingUser as any).length > 0) {
        return {
          message: 'Email already registered.',
          requestSuccessful: false,
        };
      }
  
      // Encrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Save the new user to the daatbase
      const payload = [email, hashedPassword];
      await handleQuery(INSERTqueries.ADD_USER, payload);
  
      return {
        message: 'User registered successfully.',
        requestSuccessful: true,
      };
    } catch (error) {
      console.error(error);
      return {
        message: 'An error occurred during registration.',
        requestSuccessful: false,
      };
    }
  }