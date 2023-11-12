const emailController = require("../controller/email");

const express = require("express");
const emailRoute = express.Router()


emailRoute.post("/",emailController.sendEmail)

module.exports = emailRoute