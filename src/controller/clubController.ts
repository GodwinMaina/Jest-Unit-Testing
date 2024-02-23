import mssql from 'mssql';
import { clubInterface } from "../interface/clubInterface";
import { sqlConfig } from '../sqlConfig/clubConfig';
import { Request, Response } from "express";
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

// Function to check if email exists
async function checkIfEmailExists(email: string): Promise<boolean> {
    const pool = await mssql.connect(sqlConfig);
    const result = await pool
        .request()
        .input('email', mssql.VarChar, email)
        .query('SELECT COUNT(*) AS count FROM Members WHERE email = @email');
    return result.recordset[0].count > 0;
}

export const registerMember = async (req: Request, res: Response) => {
    try {
        const { cohort_no, firstName, lastName, email, password }: clubInterface = req.body;
        const id = v4();

        // Hashing password
        const hashPwd = await bcrypt.hash(password, 6);

        // Check if password is provided
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        // Check if email exists
        const emailExists = await checkIfEmailExists(email);
        if (emailExists) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Validating email format
        const emailValidate = /^[a-zA-Z]+[.][a-zA-Z]+@thejitu\.com$/;
        if (!emailValidate.test(email)) {
            return res.status(400).json({ error: 'Invalid email format. Email must be in the format: fname.lname@thejitu.com' });
        }

        // Creating email from first name and last name
        const memberEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@thejitu.com`;

        const pool = await mssql.connect(sqlConfig);
        const newMember = (await pool.request()
            .input("member_id", mssql.VarChar, id)
            .input("cohort_no", mssql.VarChar, cohort_no)
            .input("firstName", mssql.VarChar, firstName)
            .input("lastName", mssql.VarChar, lastName)
            .input("email", mssql.VarChar, memberEmail)
            .input("password", mssql.VarChar, hashPwd)
            .execute('registerMember')
        ).rowsAffected;

        if (newMember) {
            return res.json({ message: "Account created successfully" });
        } else {
            return res.json({ error: "An error occurred while creating Account." });
        }
    } catch (error) {
        console.error("Error creating user:", error);
        return res.json({ error: "The user account was not created." });
    }
};

export const getALLMembers = async (req: Request, res: Response) => {
    try {
        const pool = await mssql.connect(sqlConfig);
        const result = await pool.request().query('SELECT * FROM Members');
        res.json({ users: result.recordset });
    } catch (error) {
        console.error("Error fetching all members:", error);
        return res.status(500).json({ error: "An error occurred while fetching all members." });
    }
};

export const getOneMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await mssql.connect(sqlConfig);
        const result = await pool.request()
            .input("member_id", mssql.VarChar, id)
            .execute('getOneMember');
        if (result.recordset.length > 0) {
            return res.json({ user: result.recordset[0] });
        } else {
            return res.status(404).json({ error: "Member not found" });
        }
    } catch (error) {
        console.error("Error fetching one member:", error);
        return res.status(500).json({ error: "An error occurred while fetching one member." });
    }
};

export const deleteClubMembers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await mssql.connect(sqlConfig);
        const result = await pool.request()
            .input("member_id", mssql.VarChar, id)
            .execute('deleteMember');
        if (result.rowsAffected[0] > 0) {
            return res.json({ message: "Account deleted successfully" });
        } else {
            return res.status(404).json({ error: "Member not found" });
        }
    } catch (error) {
        console.error("Error deleting member:", error);
        return res.status(500).json({ error: "An error occurred while deleting member." });
    }
};

// updateMember function
export const updateMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { cohort_no, firstName, lastName, email, password }: clubInterface = req.body;
        
        // Hash password if provided
        const hashPwd = password ? await bcrypt.hash(password, 10) : null; // Use a higher saltRounds for stronger security
        
        const pool = await mssql.connect(sqlConfig);
        const updated = await pool.request()
            .input("member_id", mssql.VarChar, id)
            .input("cohort_no", mssql.VarChar, cohort_no)
            .input("firstName", mssql.VarChar, firstName)
            .input("lastName", mssql.VarChar, lastName)
            .input("email", mssql.VarChar, email)
            .input("password", mssql.VarChar, hashPwd)
            .execute('updateUser');

        if (updated.rowsAffected[0] > 0) {
            return res.json({ message: "User updated successfully" });
        } else {
            return res.json({ error: "The user was not updated." });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return res.json({ error: "The user was not updated." });
    }
};