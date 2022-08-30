const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const { checkUser } = require("../Middlewares/UserMiddlewares");
const ApplicationModel = require("../Models/ApplicationModel");

const maxAge = 3 * 24 * 60 * 60

const createToken =(id)=>{
    return jwt.sign({id},"mubashir ali super secret key",{
        expiresIn:maxAge,
    })
}

const CheckUser=(token) =>{
  return jwt.verify(token,'mubashir ali super secret key',async(err,decodedToken)=>{
    return await UserModel.findById(decodedToken.id)
});
}

const handleErrors =(err) =>{
    let errors = {email:"", password:""}

    if (err.message=== "incorrect Email")
    errors.email = "that email is not registered"

    if (err.message=== "incorrect password")
    errors.email = "that Password is not registered"

    if(err.code===11000){
        errors.email="email is already registered";
        return errors;
    }
    if(err.message.includes("users validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

module.exports.register = async (req,res,next) => {
    try{
        console.log("aaaaaaaaaaaaaaaa");
        console.log(req.body);
        console.log("jjjjjjjjj");
        
        const {email,password} =req.body;
        console.log({email,password});
        const user = await UserModel.create({email,password})
        const token= createToken(user.id)

        res.cookie("jwt",token,{
            withCrdentials:true,
            httpOnly:false,
            maxAge:maxAge * 1000,
        })
        res.status(201).json({user:user._id, created:true})
    }catch(err){
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created:false})
    }
};

module.exports.login = async (req,res,next) =>{
    try{
        console.log(req.body,"0000000000000000");

        const {email,password} =req.body;
        const user = await UserModel.login(email,password)
        const token= createToken(user.id)
        console.log(token);
        console.log("Userr",user._id);

        res.cookie("jwt",token,{
            withCrdentials:true,
            httpOnly:false,
            maxAge:maxAge * 1000,
        })
        res.status(200).json({user:user._id, created:true})
    }catch(err){
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created:false})
    }
};

module.exports.userApplication=async(req,res,next)=>{
    
    try{

        const userId=req.body.userId.id

  
  
      const {
        name,
        email,
        address,
        city,
        state,
        phoneNo,
        companyName,
        team,
        product,
        problem,
        solution,
        proposition,
        competators,
        revenue,
        market,
        plan,
        type,
        proposal,
   
        } = req.body;
      const application=await ApplicationModel.create({name,
        email,
        address,
        city,
        state,
        phoneNo,
        companyName,
        team,
        product,
        problem,
        solution,
        proposition,
        competators,
        revenue,
        market,
        plan,
        type,
        proposal,
        // status: "PENDING",
        userId,
        bookingStatus: false,
        // slotCode: "null",
      })
      
      res.status(201).json({ name: application.name, created: true });
  
    } catch(err){
      console.log(err);
      const errors = handleErrors(err);
      console.log("mmmm",errors);
      res.json({ errors, created: false });
    }
  }

  module.exports.getstatus=async(req,res,next)=>{
    try{
      // console.log("ldkjs");
      const user=await CheckUser(req.params.id)
        const userId=user._id
        console.log(userId);
      const getstatus=await ApplicationModel.findOne({userId:userId})
      // console.log(getstatus);+
      if(!getstatus){
        res.json({status:false})
      }
      res.json({status:true,data:getstatus.status,id:getstatus._id})
    }catch(err){
  
    }
  }

  module.exports.Viewapplication = async (req, res, next) => {
    try {
      console.log(req.params.id);
      const id=req.params.id
      const data=await ApplicationModel.findById({_id:id})
      console.log(data);
      res.json({data, status: true });
    } catch (err) {}
  };