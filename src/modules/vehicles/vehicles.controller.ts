import { Request, Response } from "express"
import { vehicleServices } from "./vehicles.service.js"

const getVehicles =  async(req:Request, res:Response) =>{
  try {
    const result = await vehicleServices.getVehicles()

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
}

const postVehicles = async (req:Request, res:Response) =>{

  try {
    const result = await vehicleServices.postVehicles(req.body)
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
}

const getSingleVehicle = async(req:Request, res:Response) =>{
  try {
    const result = await vehicleServices.getSingleVehicle(req.params.id as string)

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
}

const updateVehicle =  async(req:Request, res:Response) =>{
  try {
    const result = await vehicleServices.updateVehicle(req.body , req.params.id as string)

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
}


const deleteVehicle = async(req:Request , res:Response) =>{
  try {

    const result = await vehicleServices.deleteUser(req.params.id as string)

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
}

export const vehicleController = {
    getVehicles,
    postVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}