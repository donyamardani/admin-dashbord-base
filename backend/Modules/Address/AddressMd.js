import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: [true, "title  is required"],
  },
  description: {
    type: String,
    required: [true, "description  is required"],
  },
  city: {
    type: String,
    required: [true, "city  is required"],
  },
  postalCode: {
    type: String,
    match: [/^\d{5}-?\d{5}$/, "invalid postal code"],
    required: [true, "postalCode  is required"],
  },
  receiverPhoneNumber: {
    type: String,
    match: [/^(?:\+98|0)?9\d{9}$/, "invalid Phone number"],
  },
  receiverFullName: {
    type: String,
  },
  province: {
    type: String,
    required: [true, "province  is required"],
  },
  NO: {
    type: String,
    required: [true, "NO is required"],
  },
  lat: {
    type: String,
    required: [true, "lat is required"],
  },
  lng: {
    type: String,
    required: [true, "lng is required"],
  },
  floor: {
    type: String,
  },
  units: {
    type: String,
  },
},{timestamps:true});
const Address=mongoose.model('Address',addressSchema)
export default Address