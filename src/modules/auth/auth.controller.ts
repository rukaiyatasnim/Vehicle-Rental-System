import { Request, Response } from "express";
import { authServices } from "./auth.service.js";

const createUser = async(req:Request, res:Response) =>{

    try {

        const result = await authServices.createUser(req.body)

    

        if(result.rows.length=== 0){
            res.status(500).json({
                success:false,
                message:"Can't Create any user"
            })
        }else{
            res.status(201).json({
                success:true,
                message:"User Registered Successfully",
                data: result.rows[0]
            })
        }
        
    } catch (err:any) {
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

const loginUser = async(req:Request, res:Response) =>{
    try {
        
    const result = await authServices.loginUser(req.body )


    res.status(200).json({
        success:true,
        message:"User Logged in successfully",
        data:result
    })

        
    } catch (err:any) {
        res.json(500).json({
        success:false,
        message: err.message})
    }
}

export const authController = {
    createUser,
    loginUser
}