import { register } from '../controller/authController'

const router = require('express').Router()


router.post("/register", register)
export default router