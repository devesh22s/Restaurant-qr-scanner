
export const register =()=>{
    const {StudentName, StudentEmail, StudentPassword, StudentFee} = req.body
    const record =  new myModel({
        name: StudentName,
        email: StudentEmail,
        password:StudentPassword,
        fee: StudentFee
    })
    record.save();
    res.redirect("/StudentLogin")

}