import { Router } from "express";
import { bankCallBack, checkPayment, getAll, getOne, payment, update } from "./OrderCn.js";
import isLogin from "../../Middlewares/isLogin.js";
import isAdmin from "../../Middlewares/isAdmin.js";
const orderRouter=Router()
orderRouter.route('/').get(isLogin,getAll).post(isLogin,payment)
orderRouter.route('/zarinpal/callback').get(bankCallBack)
orderRouter.route('/check-payment').post(isLogin,checkPayment)
orderRouter.route('/:id').get(isLogin,getOne).patch(isAdmin,update)
export default orderRouter