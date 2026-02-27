import app,{__dirname} from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config()
const port=process.env.PORT || 5001
mongoose.connect(process.env.DATA_BASE).then(()=>{
    console.log('DATA BASE IS CONNECT')
})
app.listen(port,()=>{
    console.log(`server is running ${port}`)
})