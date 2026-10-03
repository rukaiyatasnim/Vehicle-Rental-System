import  express, { Request, Response }  from 'express';
import config from './config/index.js';
import initDb from './config/db.js';
import logger from './middlewear/logger.js'
import { userRoutes } from './modules/users/user.routes.js';
import { vehicleRoutes } from './modules/vehicles/vehicles.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';

const app = express();
const port = config.port

app.use(express.json())

initDb()


//parser
app.use(express.json())

//Users Crud
app.use("/api/v1/users" , userRoutes )

//Vehicles Crud
app.use("/api/v1/vehicles" , vehicleRoutes)

//Authentication
app.use("/api/v1/auth" , authRoutes)



app.get('/',logger, (req:Request, res:Response) => {
  res.send('Hello Developer!');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});