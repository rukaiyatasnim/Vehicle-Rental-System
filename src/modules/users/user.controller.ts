import { Request, Response } from "express";
import { userServices } from "./user.service.js";

const getUser =  async(req:Request, res: Response) =>{
  try {

    const result = await userServices.getUser();

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
}

const updateUser =  async(req:Request ,  res:Response) =>{

    
  try {

     if(req?.user?.role !=="admin" && req?.user?.role !== Number(req.params.id)){
      res.status(403).json({
        success:false,
        message:" You can only update your own profile"
      })
    }

    const result = await userServices.updateUser(req.body, req.params.id as string)

    if(result.rows.length ===0 ){
      res.status(500).json({
        success:false,
      message: "Can;t Update"
      })
    }else{
      res.status(200).json({
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
}

const deletUser =  async(req:Request , res: Response) =>{
  try {
    const result = await userServices.deleteUser(req.params.id as string)

    if(result.rowCount=== 0){
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
}

export const userController  = {
    getUser,
    updateUser,
    deletUser
}