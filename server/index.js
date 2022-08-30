const express= require ("express")
const cors = require ("cors")
const mongoose = require ("mongoose")
const authRoutes = require("./Routes/UserRouter")
const adminRouter = require("./Routes/AdminRouter")
const app = express()
const cookieParser = require("cookie-parser")

app.listen(4000,()=>{
    console.log("sever started on port 4000");
})

mongoose.connect("mongodb://localhost:27017/jwt",{
    useNewUrlParser:true,useUnifiedTopology:true,

}).then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err.message);
})
app.use(cors({
    origin :["http://localhost:3000"],
    method:["GET","POST"],
    credentials : true,

}))
app.use(cookieParser())
app.use(express.json())
app.use("/",authRoutes)
app.use("/admin",adminRouter)