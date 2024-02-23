

import express,  {NextFunction, Request, Response, json} from 'express'
import clubRoute from './route/clubRoute';


const app = express()

app.use(json())

 app.use(express.urlencoded({ extended: true }));

app.use( clubRoute)

app.use((error: Error, req: Request, res: Response, next: NextFunction)=>{
    res.json({
        message: error.message
    })
    next()
})


let port = 3100;

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`); 
})