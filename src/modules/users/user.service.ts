import { pool } from "../../config/db.js";

const getUser = async() =>{
    const result = await pool.query(`SELECT * FROM users`)
    return result

}

const updateUser  = async(data:any, id: string) =>{

    const {name, email ,phone, role} = data
    const result = await pool.query(`UPDATE users SET name=$1, email=$2 , phone=$3 , role=$4 WHERE id=$5 RETURNING * `, [name, email, phone, role , id] )
    return result
}

const deleteUser = async(id:string) =>{
    const result = await pool.query(`SELECT * FROM users WHERE id=$1`, [id])
    return result
}

export const userServices = {
    getUser,
    updateUser,
    deleteUser
}
