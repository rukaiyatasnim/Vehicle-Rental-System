import  express, { Request, Response }  from 'express';
import {Pool} from "pg"
import config from './config/index.js';
import initDb from './config/db.js';
import logger from './middlewear/logger.js'
import { userRoutes } from './modules/users/user.routes.js';
import { vehicleRoutes } from './modules/vehicles/vehicles.routes.js';



const app = express();
const port = config.port

app.use(express.json())

const pool  = new Pool({
  connectionString :`${config.connectionStr}`
})

initDb()

//Users Crud
app.use("/api/v1/users" , userRoutes )

//Vehicles Crud
app.use("/api/v1/vehicles" , vehicleRoutes)


//parser
app.use(express.json())


app.get('/',logger, (req:Request, res:Response) => {
  res.send('Hello Developer!');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});