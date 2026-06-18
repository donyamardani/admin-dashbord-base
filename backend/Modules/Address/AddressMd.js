import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
{
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
    index:true
  },

  title:{
    type:String,
    required:[true,"title is required"]
  },

  description:{
    type:String,
    required:[true,"description is required"]
  },

  province:{
    type:String,
    required:[true,"province is required"]
  },

  city:{
    type:String,
    required:[true,"city is required"]
  },

  postalCode:{
    type:String,
    match:[/^\d{5}-?\d{5}$/,"invalid postal code"],
    required:[true,"postalCode is required"]
  },

  receiverFullName:{
    type:String,
    required:[true,"receiverFullName is required"]
  },

  receiverPhoneNumber:{
    type:String,
    required:[true,"receiverPhoneNumber is required"],
    match:[/^(?:\+98|0)?9\d{9}$/,"invalid phone number"]
  },

  buildingNo:{
    type:String,
    required:[true,"building number is required"]
  },

  floor:{
    type:String
  },

  units:{
    type:String
  },

  lat:{
    type:Number,
    required:true
  },

  lng:{
    type:Number,
    required:true
  }

},
{timestamps:true}
)

const Address = mongoose.model("Address",addressSchema)

export default Address
