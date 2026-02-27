import { catchAsync } from "vanta-api";
import {HandleERROR} from "vanta-api";
import fs from "fs";
import { __dirname } from "../../app.js";
export const uploadCn=catchAsync(async (req,res,next) => {
    const file=req.file
    return res.status(201).json({
      data:file.filename,
      success:true,
      message:'file upload successfully'
    })
})
export const uploadMulti=catchAsync(async (req,res,next) => {
    const files=req.files
    const fileNames=files.map(item=>item.filename)
    return res.status(201).json({
      data:fileNames,
      success:true,
      message:'file upload successfully'
    })
})
export const deleteFile=catchAsync(async (req,res,next) => {
  const {filename=null}=req.body
  if(!filename){
    return next(new HandleERROR('filename is required',400))
  }
  const currentName=filename.split('/')?.at(-1)
  if(fs.existsSync(`${__dirname}/Public/${currentName}`)){
    fs.unlinkSync(`${__dirname}/Public/${currentName}`)
  }
  return res.status(200).json({
    success:true,
    message:'file deleted'
  })
})
