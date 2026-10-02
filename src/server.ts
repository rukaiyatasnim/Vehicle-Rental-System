import  express, { Request, Response }  from 'express';
import {Pool} from "pg"
import dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(process.cwd() , '.env')})

const app = express();
const port = 5000;

app.use(express.json())

const pool  = new Pool({
  connectionString : `${process.env.CONNECTION_STR
  }`
})

const initDb = async() =>{
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
    CHECK (role IN ('admin', 'customer')))
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(20) NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike','van' , 'SUV')),
      registration_number VARCHAR(100) UNIQUE NOT NULL,
      daily_rent_price NUMERIC(10, 2) NOT NULL
      CHECK (daily_rent_price > 0),
      availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked')))
      `)

      await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK (rent_end_date> rent_start_date),
        total_price NUMERIC(10,2) NOT NULL CHECK (total_price >0),
        status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled' ,'returned'))
        )
        `)
}

initDb()


//Users Table
app.get("/users" , async(req:Request, res: Response) =>{

  try {
    const result = await pool.query(`SELECT * FROM users`)

    res.status(200).json({
      success:true,
      message:"All User retrived successfully",
      data: result.rows[0]
    })
    
  } catch (err:any) {
    res.status(500).json({
      success:false,
      message: err.message
    })
  }
})

app.put("/users/:id" , async(req:Request ,  res:Response) =>{

  const {name, email ,phone, role} = req.body

  try {
    const result = await pool.query(`UPDATE users SET name=$1, email=$2 , phone=$3 , role=$4 WHERE id=$5 RETURNING * `, [name, email, phone, role ,  req.params.id] )

    if(result.rows.length ===0 ){
      res.json(500).json({
        success:false,
      message: "Can;t Update"
      })
    }else{
      res.json(200).json({
      success:true,
      message: "Updated user successfully"
      })
    }

    
  } catch (err:any) {
    res.status(500).json({
      success:false,
      message: err.message
    })
  }
})

app.delete("/users/:id" , async(req:Request , res: Response) =>{
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [req.params.id])

    if(result.rowCount= 0){
      res.status(500).json({
        success:false,
      message: "Can't Delete user"
      })
    }else{
      res.status(200).json({
      success:true,
      message: "User Deleted Successfully"
      })
    }
    
  } catch (err:any) {
    res.status(500).json({
      success:false,
      message: err.message
    })
  }
})

//Vehicles Table

app.post("/vehicles" , async (req:Request, res:Response) =>{

  const {vehicle_name , type, registration_number, daily_rent_price,  availability_status  } = req.body
  try {
    const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *` , [vehicle_name, type, registration_number, daily_rent_price,availability_status])

    if(result.rows.length ===0){
      res.status(500).json({
        success:false,
        message:"Can't Post Data"
      })
    }else{
      res.status(200).json({
        success:true,
        message:"Data posted succesfully",
        data: result.rows[0]
      })
    }
    
  } catch (err:any) {
    res.status(500).json({
      success:false,
      message: err.message
    })
  }
})

app.get("/vehicles" ,  async(req:Request, res:Response) =>{
  try {
    const result = await pool.query(`SELECT * FROM vehicles`)

    if(result.rows.length ===0){
      res.status(500).json({
        status:false,
        "message":"Can't Get User"
      })
    }else{
      res.status(200).json({
        success:true,
        message:"User retrived successfully",
        data: result.rows[0]
      })
    }
    
  } catch (err:any) {
    res.status(500).json({
      status:false,
      message:err.message
    })
  }
})

app.get("/vehicles/:id" , async(req:Request, res:Response) =>{
  try {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1` , [req.params.id])

     if(result.rows.length ===0){
      res.status(500).json({
        status:false,
        "message":"Can't Get Any User"
      })
    }else{
      res.status(200).json({
        success:true,
        message:"Users retrived successfully",
        data: result.rows[0]
      })
    }

    
  } catch (err:any) {
    res.status(500).json({
      success:false,
      message:err.message
    })
  }
})

app.put("/vehicles/:id" , async(req:Request, res:Response) =>{
  const {vehicle_name, type, registration_number ,daily_rent_price, availability_status} = req.body
  try {
    const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2 , registration_number=$3 , daily_rent_price=$4 , availability_status=$5  WHERE id=$6  RETURNING *` ,[vehicle_name,type, registration_number, daily_rent_price, availability_status, req.params.id])

      if(result.rows.length ===0){
      res.status(500).json({
        status:false,
        "message":"Can't update User"
      })
    }else{
      res.status(200).json({
        success:true,
        message:"Users updated successfully",
        data: result.rows[0]
      })
    }


    
  } catch (err:any) {
    res.status(500).json({
        success:false,
        message:err.message
      })
  }
})

app.delete("/vehicles/:id" , async(req:Request , res:Response) =>{
  try {

    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [req.params.id])

    if(result.rowCount ==0){
       res.status(500).json({
        status:false,
        "message":"Can't Delete User"
      })
    }else{
      res.status(200).json({
        success:true,
        message:"Users Deleted successfully",
        data: result.rows[0]
      })
    }
    
  } catch (err:any) {
      res.status(500).json({
        success:false,
        message:err.message
      })
  }
})


//parser
app.use(express.json())


app.get('/', (req:Request, res:Response) => {
  res.send('Hello Developer!');
});

app.post("/" , (req:Request , res:Response) =>{
    console.log(req.body)
    res.status(200).json({
        sucess:true,
        message:"from post"
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});