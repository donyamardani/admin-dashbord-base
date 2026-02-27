import { catchAsync, HandleERROR } from "vanta-api";

const isAdmin=catchAsync(async(req,res,next)=>{
    if(req.role!='admin' &&req.role!='superAdmin'){
       return next(new HandleERROR("you don't have a permission",401))
    }
    return next()
})
export default isAdmin