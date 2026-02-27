import { catchAsync, HandleERROR } from "vanta-api";

const isLogin=catchAsync(async(req,res,next)=>{
    if(!req.role){
       return next(new HandleERROR("you don't have a permission",401))
    }
    return next()
})
export default isLogin