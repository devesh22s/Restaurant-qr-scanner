const checkGuestAndUser = async(req, res, next) => {
  try{ 
        if(req.headers.authorization){
            const token = req.headers.authorization.split(' ')[1];
            // console.log(token);
            const decoded = jwt.verify(token, "0ba6a542a7b643cb19b58ee54ee53f2063c99b59b14ecb21a2ba48f0e7de5d39")
            console.log(decoded);

            
            // req.user = decoded    // here we make a request key with name of user, through which we check role in next middleware

            const userData = await myModel.findById(decoded.id).select('-passwordHash')  // password not visbile here
            // console.log(userData);

            req.user = userData
            next()

        }else{
            next()
        }
    } catch (error) {
        resizeBy.status(500).json({
            message: error.message
        })
    
  }
}

export default checkGuestAndUser