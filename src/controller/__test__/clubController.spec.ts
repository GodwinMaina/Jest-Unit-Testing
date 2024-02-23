
import mssql from 'mssql';
import { registerMember, getALLMembers, getOneMember } from '../clubController';



describe("Member created successfully", () => {
    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it('Successfully create member', async () => {
        const req = {
            body: {
                cohort_no: '22',
                firstName: "Godwin",
                lastName: "maina",
                email: "godwin.maina@thejitu.com",
                password: "atopwudan"
            }
        };

        const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
        const mockedPool = {
            request: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

        await registerMember(req as any, res);

        expect(res.json).toHaveBeenCalledWith({ message: "Account created successfully" });
    });
});

describe('get all members', () => {
    let res: any;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
    });

    it('Successfully get all members', async () => {
        const mockedResult = [
            { id: '353545-43495835-458347575', firstName: 'Godwin', lastName: 'maina', email: 'goddy.maina@thejitu.com', cohort_no: 22 }
        ];

        const mockedExecute = jest.fn().mockResolvedValue({ recordset: mockedResult });
        const mockedPool = {
            request: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

        await getALLMembers({} as any, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ users: mockedResult });
    });
});

describe('Gets one member', () => {
    let req: any, res: any;

    beforeEach(() => {
        req = {
            params: {
                id: 'd7600561-c633-4bfa-8c79-fcfcaef76800',
            },
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    it('Successful got a single member', async () => {
        const mockedResult = { id: 'd7600561-c633-4bfa-8c79-fcfcaef76800', firstName: 'Godwin', lastName: 'maina', email: 'Godwin.maina@thejitu.com', cohort_no: 22 };

        const mockedExecute = jest.fn().mockResolvedValue({ recordset: [mockedResult] });
        const mockedPool = {
            request: jest.fn().mockReturnThis(),
            execute: mockedExecute
        };

        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool as never);

        await getOneMember(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ users: mockedResult });
    });
});
