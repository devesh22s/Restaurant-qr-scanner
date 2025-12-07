
const checkRole = (role) => {
  return (req, res, next)=>{
    if(role.includes(req.user.role)){
        next()
    }else{
        res.status(403).json({
            message: `This resource is not availabel for ${req.user.role}`
        })
    }
    console.log("this is the console of checkrole middleware", req.user);
    
  }
}

export default checkRole