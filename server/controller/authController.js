import myModel from "../model/User.js";
import bcrypt from 'bcrypt'
import { generatAccessToken, generatRefershToken } from "../utils/jwt.js";




export const register = async(req, res)=>{
    try{
        const {name, email, password, contact, } = req.body
    // check if the user is register 
    const userData = await myModel.findOne({email})

    if(!userData){
        const passwordHash = await bcrypt.hash(password, 12)

        const data = {name, email, contact, passwordHash}
        const newUser = await myModel.create(data)
        res.status(201).json({
            message: "success",
            data: newUser
        })
    
}else{
    res.status(400).json({
        message:"you are already register, please login"
    })
}
    }catch(error){
        res.status(500).json({
            message: error.message
        })

    }
   

}




export const login = async(req, res) => {
    try{



    const {email, password} = req.body
    const user = await myModel.findOne({email})
    if (!user) {
      return res.status(400).json({ message: "User not found, please Register" });
    }

    const ispassword = await bcrypt.compare(password, user.passwordHash)
    if(!ispassword){
        res.status(400).json({
            message: "Wrong password"
        })
    }else{
    const accessToken = generatAccessToken({name: user.name, email: user.email, role:user.role, id: user._id})
    const refreshToken = generatRefershToken({name: user.name, email: user.email, role:user.role, id: user._id})

    user.refreshToken = refreshToken
    user.refreshTokenExpireTime = new Date(Date.now()+ 7*24*60*60*1000);
    user.lastlogin = Date.now();
    await user.save()
    
    res.status(200).json({
        message:"success",
        data: user,
        accessToken,
        refreshToken

    })
}


    }catch(error){
        res.status(500).json({
            message: error.message
        })

    }

}