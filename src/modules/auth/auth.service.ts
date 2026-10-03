import { pool } from "../../config/db.js"
import bcrypt from "bcryptjs";
import jwt  from 'jsonwebtoken';



const createUser = async(data:any) =>{

    const {name, email, password, phone, } = data

    const hashedPassword = await bcrypt.hash(password,10)

    const result = await pool.query(`INSERT INTO users(name, email, password, phone) VALUES($1, $2, $3 , $4) RETURNING *`, [name, email,hashedPassword,phone])
    return result
}

const loginUser = async(data:any) =>{

    const {email, password} = data

    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email])
    return result

    if(result.rows.length ===0){
        return null
    }

    const user = result.rows[0]

    const isMatched = await bcrypt.compare(password, user.password);

    if(!isMatched){
        return
    }

    const secret = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"

    const token = jwt.sign({name: user.name, email: user.email , role: user.role}, secret, {
        expiresIn: "7d"
    } )

    return {token ,user}

}



export const authServices = {
    createUser,
    loginUser
}