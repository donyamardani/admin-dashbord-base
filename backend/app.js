import express from 'express'
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors';
import { catchError } from 'vanta-api';
import { exportValidationData } from './Middlewares/ExportValidation.js';
import userRouter from './Modules/User/User.js';
import authRouter from './Modules/Auth/Auth.js';
import brandRouter from './Modules/Brand/Brand.js';
import rateLimit from 'express-rate-limit';
import { swaggerSpec } from './Utils/Swagger.js';
import swaggerUi from 'swagger-ui-express';
import sliderRouter from './Modules/Slider/Slider.js';
import categoryRouter from './Modules/Category/Category.js';
import variantRouter from './Modules/Variant/Variant.js';
import productRouter from './Modules/Product/Product.js';
import productVariantRouter from './Modules/ProductVariant/ProductVariant.js';
import isLogin from './Middlewares/isLogin.js';
import addressRouter from './Modules/Address/Address.js';
// import commentRouter from './Modules/Comment/Comment.js';
import cartRouter from './Modules/Cart/Cart.js';
import uploadRouter from './Modules/Upload/Upload.js';
const limiter=rateLimit({
  windowMs:15*60*1000,
  max:100,
  message:"Too many requests from this IP, please try again after 15 minutes"
})
const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
app.use(express.json());
app.use(morgan("dev"));
app.use(cors())
app.use(limiter)
app.use('/upload',express.static(`${__dirname}/Public`))
app.use(exportValidationData)
app.use('/api/users',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/brands',brandRouter)
app.use('/api/variants',variantRouter)
app.use('/api/categories',categoryRouter)
app.use('/api/products',productRouter)
app.use('/api/upload',uploadRouter)
// app.use('/api/comments',commentRouter)
app.use('/api/addresses',isLogin,addressRouter)
app.use('/api/product-variants',productVariantRouter)
app.use('/api/sliders',sliderRouter)
app.use('/api/cart',isLogin,cartRouter)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use((req,res,next)=>{
  return res.status(404).json({
    message:'Route Not found',
    success:false
  })
})
app.use(catchError)
export default app