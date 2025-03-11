const express = require("express")
const app = express()
const getAllApis = require("./controllers/api.controller")

app.get(`/api`, getAllApis)

module.exports = app