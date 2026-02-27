import { catchAsync } from "vanta-api";
import User from "../User/UserMd.js";
import { sendAuthCode, verifyCode } from "../../Utils/smsHandler.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Cart from "../Cart/CartMd.js";
export const auth = catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  let user = await User.findOne({ phoneNumber });
  if (!user || !user?.password) {
    const resultSms = sendAuthCode(phoneNumber);
    if (!resultSms) {
      return res.status(500).json({
        success: false,
        message: resultSms.message,
      });
    }
  }
  return res.status(200).json({
    success: true,
    message: !user || !user?.password ? "Otp Code sent" : "Login With Password",
    data: {
      userExist: user ? true : false,
      passwordExist: user?.password ? true : false,
    },
  });
});

export const loginWithPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;
  // complete populate cartId ?
  let user = await User.findOne({ phoneNumber }).populate('cartId');
  if (!user || !user?.password) {
    return next(new HandleERROR("invalid phone number or password", 401));
  }
  const isMatch = bcryptjs.compareSync(password, user.password);
  if (!isMatch) {
    return next(new HandleERROR("invalid phone number or password", 401));
  }
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
  return res.status(200).json({
    success:true,
    message:"login successfully",
    data:{
      token,
      user:{
        _id:user._id,
        role:user.role,
        fullName:user.fullName,
        phoneNumber:user.phoneNumber,
        cartId:user.cartId
      }
    }
  })
});


export const loginWithOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber, code } = req.body;
  const resultVerify = await verifyCode(phoneNumber, code);
  if (!resultVerify.success) {
    return next(new HandleERROR("invalid code", 401));
  }

  let user = await User.findOne({ phoneNumber }).populate('cartId');
  let newUser;
  if(!user){
    user=await User.create({phoneNumber});
    const cart=await Cart.create({userId:user._id});
    user.cartId=cart._id;
    newUser=await user.save();
  }else{
    newUser=user;
  }
  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
  return res.status(200).json({
    success:true,
    message:"login successfully",
    data:{
      token,
      user:{
        _id:newUser._id,
        role:newUser.role,
        fullName:newUser.fullName,
        phoneNumber:newUser.phoneNumber,
        cartId:newUser.cartId
      }
    }
  })
});
export const resendCode= catchAsync(async (req, res, next) => {
  const { phoneNumber } = req.body;
  const resultSms = sendAuthCode(phoneNumber);
  if (!resultSms) {
    return res.status(500).json({
      success: false,
      message: 'sms sending failed',
    });
  }
  return res.status(200).json({
    success: true,
    message: "Otp Code sent",
  });
})
export const forgetPassword= catchAsync(async (req, res, next) => {
  const {phoneNumber,code,newPassword} = req.body;
  const resultVerify = await verifyCode(phoneNumber, code);
  if(!resultVerify.success){
    return next(new HandleERROR("invalid code", 401));
  }
  const user=await User.findOne({phoneNumber});
  if(!user){
    return next(new HandleERROR("user not found",404));
  }
  const hashedPassword=bcryptjs.hashSync(newPassword,10);
  user.password=hashedPassword;
  await user.save();
  return res.status(200).json({
    success:true,
    message:"password changed successfully"
  })
})