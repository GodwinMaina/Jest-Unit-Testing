import{Router} from "express";
import { deleteClubMembers, getALLMembers, getOneMember, registerMember,updateMember } from "../controller/clubController";

const clubRoute = Router();


clubRoute.post('/register', registerMember);

clubRoute.put('/update/:id', updateMember);

clubRoute.get('/members', getALLMembers);

clubRoute.get('/members/:id', getOneMember);


clubRoute.delete('/delete/:id', deleteClubMembers);

export default clubRoute;