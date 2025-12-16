
// const error = new Error("This is an Error")
// error.name = "TokenExpireError"

// console.log(error.message, error.name)


import os from 'os'
// console.log(os.networkInterfaces());

const data = os.networkInterfaces()['Wi-Fi']
let ipAddress = null
for(const el of data){
    if(el.family === "IPv4")
        ipAddress = el.address
}

console.log(ipAddress);
