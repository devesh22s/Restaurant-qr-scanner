
const error = new Error("This is an Error")
error.name = "TokenExpireError"

console.log(error.message, error.name)