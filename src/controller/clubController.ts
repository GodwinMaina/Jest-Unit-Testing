import mssql from 'mssql';
import { clubInterface } from "../interface/clubInterface";
import { sqlConfig } from '../sqlConfig/clubConfig';
import { Request, Response } from "express";
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';




export const registerMember = async (req: Request, res: Response) => {
    try {
        const { cohort_no, firstName, lastName, email, password }: clubInterface = req.body;
        const id = v4();

        // Hashing password
        const hashPwd = await bcrypt.hash(password, 6);

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }

        //check if a user with similar email exist
        // async function checkIfEmailExists(email: string): Promise<boolean> {
        //     try {
        //         const pool = await mssql.connect(sqlConfig);
        //         const result = await pool.request()
        //             .input('email', mssql.VarChar, email)
        //             .query('SELECT COUNT(*) AS count FROM Members WHERE email = @email');
        
        //         return result.recordset[0].count > 0;
        //     } catch (error) {
        //         console.error('Error checking email existence:', error);
        //         throw error; 
        //     }
        // }

        // Check if email exists
        // const emailExists = await checkIfEmailExists(email);
        // if (emailExists) {
        //     return res.status(400).json({ error: 'Email is already registered' });
        // }

        // Validating email format
        const emailValidate = /^[a-zA-Z]+[.][a-zA-Z]+@thejitu\.com$/;
        if (!emailValidate.test(email)) {
            return res.status(400).json({ error: 'Invalid email format. Email must be in the format: fname.lname@thejitu.com' });
        }

        //Creating email from first name and lastname
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
        const id = req.params.id;

        const pool = await mssql.connect(sqlConfig);

        const result = await pool
            .request()
            .input("member_id", mssql.VarChar, id)
            
            .query('SELECT * FROM Members WHERE member_id = @member_id'); 

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Member not found" });
        }

        return res.json({ user: result.recordset[0] });
    } catch (error) {
        console.error("Error fetching one member:", error);
        return res.status(500).json({ error: "An error occurred while fetching one member." });
    }
};

export const deleteClubMembers = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pool = await mssql.connect(sqlConfig);
        let result = (await pool.request()
        .input("member_id", mssql.VarChar, id)
        .query('DELETE FROM Members WHERE member_id = @member_id')
        ).rowsAffected

        console.log(result[0]);
        
        if(result[0] == 0){
            return res.status(201).json({
                error: "User not found"
            })
        }else{
            return res.status(200).json({
                message: "Account deleted successfully"
            })
        }
    }

    catch (error) {
        return res.json({error})
    }
};

// updateMember function
export const updateMember = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const { cohort_no, firstName, lastName, email, password }: clubInterface = req.body;
        
        // Hashing password
        const hashPwd = await bcrypt.hash(password, 6);

        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        const pool = await mssql.connect(sqlConfig);
        const result = await pool.request()
            .input("member_id", mssql.VarChar, id)
            .input("cohort_no", mssql.VarChar, cohort_no)
            .input("firstName", mssql.VarChar, firstName)
            .input("lastName", mssql.VarChar, lastName)
            .input("email", mssql.VarChar, email)
            .input("password", mssql.VarChar, hashPwd)
            .execute('updateUser');

            console.log(result);
            
        const rowsAffected = result.rowsAffected[0];

        if (rowsAffected > 0) {
            return res.status(200).json({
                message: "User updated successfully"
            });
        } else {
            return res.status(404).json({
                error: "User not found or no changes were made"
            });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "An error occurred while updating user" });
    }
};
