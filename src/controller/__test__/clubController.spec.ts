
import mssql from 'mssql';
import { registerMember, getALLMembers, getOneMember, deleteClubMembers, updateMember } from '../clubController';

//TEST REGISTERMEMBER
describe("New member Registration", ()=>{
    let res: any 
    beforeEach(()=>{
        res= {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis() 
        }
    })

    it('succesfully created new Member', async () => {
        const req ={

            body:
            {
                cohort_no: "22",
                firstName: "Godwin",
                lastName: "Maina",
                email: "goddy.maina@thejitu.com",
                password:"atopwudan"
            }
        }

        const mockedInput = jest.fn().mockReturnThis() 
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] })
        const mockedRequest = {
            input: mockedInput,
            execute: mockedExecute
        }
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest)
        }

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never) 
        await registerMember(req as any, res)
        expect(res.json).toHaveBeenCalledWith({ message: "Account created successfully" })
    })
})
 

//Test GETTALLMEMBERS
describe('get all members', () => {
    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it('Successfully got all members', async () => {
        const mockedResult = [
            { member_id: '739f42f7-7174-4e2f-a4d1-edd7bd8449da', cohort_no: "22", firstName: 'Godwin', lastName: 'maina', email: 'goddy.maina@thejitu.com', password:"atopwudan" },

             {member_id: "e01c927e-1f8d-4163-a309-66490d7b96e8", cohort_no: "25", firstName: "MR.LARUSO",lastName: "MaKNON", email: "mr.laruso.maknon@thejitu.com" ,password:"atopGUY" }
        ];

        const mockedExecute = jest.fn().mockResolvedValue({ recordset: mockedResult });
        const mockedPool = {
            request: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

        await getALLMembers({} as any, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({  error: "An error occurred while fetching all members." });
    });
});




//Test forGETTING ONE MEMBER
describe('Get one member', () => {
    let req: any, res: any;

    beforeEach(() => {
        req = {
            params: {
                id: '739f42f7-7174-4e2f-a4d1-edd7bd8449da',
            },
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it('Successfully got one member', async () => {
        const mockedResult = { member_id: '739f42f7-7174-4e2f-a4d1-edd7bd8449da', cohort_no: "22", firstName: 'Godwin', lastName: 'maina', email: 'Godwin.maina@thejitu.com', password:"atopwudan" };

        const mockedExecute = jest.fn().mockResolvedValue({ recordset: [mockedResult] });
        const mockedPool = {
            request: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

        await getOneMember(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "An error occurred while fetching one member." });

    });
});



//Test FOR DELETING A MEMBER 
describe('Delete a member', () => {
    let req: any, res: any;

    beforeEach(() => {
    
        req = {
            params: {
                id: '739f42f7-7174-4e2f-a4d1-edd7bd8449da'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it('Successfully delete a member', async () => {
       
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
        const mockedPool = {
            request: jest.fn().mockReturnThis(), // Mock 
            execute: mockedExecute
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

        await deleteClubMembers(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: "Account deleted successfully" });
    });

    it('Member not found', async () => {
       
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [0] });
        const mockedPool = {
            request: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);
        await deleteClubMembers(req, res);

        //response
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: "Member not found" });
    });
});



//testing updateMember
describe('Update a member', () => {
    let req: any, res: any;

    beforeEach(() => {
        req = {
            params: {
                id: '739f42f7-7174-4e2f-a4d1-edd7bd8449da' // Assuming this ID exists in the database
            },
            body: {
                cohort_no: '22',
                firstName: 'UpdatedFirstName',
                lastName: 'UpdatedLastName',
                email: 'updated.email@example.com',
                password: 'updatedPassword'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it('Successfully update a member', async () => {
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
        const mockedPool = {
            request: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

        await updateMember(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: "User updated successfully" });
    });

    it('Error updating user', async () => {
        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [0] });
        const mockedPool = {
            request: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

        await updateMember(req, res);

        expect(res.json).toHaveBeenCalledWith({ error: "The user was not updated." });
    });
});
