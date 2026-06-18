import mongoose from "mongoose";

const discountCodeSchema = new mongoose.Schema(
{
  code:{
    type:String,
    required:[true,"code is required"],
    unique:true,
    trim:true,
    uppercase:true
  },

  type:{
    type:String,
    enum:["percent","amount"],
    required:[true,"type is required"]
  },

  value:{
    type:Number,
    required:[true,"value is required"],
    min:0
  },

  minPrice:{
    type:Number,
    default:0
  },

  maxPrice:{
    type:Number
  },

  startDate:{
    type:Date
  },

  endDate:{
    type:Date,
    validate:{
      validator:function(end){
        if(!end || !this.startDate) return true
        return end >= this.startDate
      },
      message:"invalid end date"
    }
  },

  maxUsedCount:{
    type:Number,
    default:1
  },

  usedCount:{
    type:Number,
    default:0
  },

  userIdsUsed:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  ],

  freeShipping:{
    type:Boolean,
    default:false
  },

  isPublished:{
    type:Boolean,
    default:true
  }

},
{timestamps:true}
)

const DiscountCode = mongoose.model("DiscountCode",discountCodeSchema)

export default DiscountCode
