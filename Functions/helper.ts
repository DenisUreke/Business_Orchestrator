import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { SELECTqueries, handleQuery } from '../src/demo';

interface LoginCredentials {
    username: string;
    password: string;
  }
  
  interface UserRecord {
    username: string;
    password: string; // Hashed password from the database
  }


  async function functionA(data: any): Promise<string> {
    try {
      // Extract values from the incoming data
      const username = data.username;
      const password = data.password;
  
      // Basic validation to check if both username and password are present
      if (!username || !password) {
        return 'Username and password are required.';
      }

      // Query the database using the extracted username
      const dbUserRecord: UserRecord | null = await handleQuery(
        SELECTqueries.GET_USER_AND_PASSWORD, username)
  
      // Call Function B to check credentials
      const result = await functionB({ username, password }, dbUserRecord);
      return result;
    } catch (error) {
      console.error('Error in Function A:', error);
      return 'Internal server error';
    }
  }
  
  // Function B: Checks if the database record is null and if the passwords match
  async function functionB(loginCredentials: LoginCredentials, dbUserRecord: UserRecord | null): Promise<string> {

    if (!dbUserRecord) {
      return 'Invalid credentials'; // Return if user is not found
    }
  
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(loginCredentials.password, dbUserRecord.password);
  
    if (passwordMatch) {
      return 'Credentials are correct'; // Successful authentication
    } else {
      return 'Invalid credentials'; // Incorrect password
    }
  }