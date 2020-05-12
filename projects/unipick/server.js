const util = require('util')
const fs = require('fs')
const readFile = util.promisify(fs.readFile)
const express = require('express')
const cors = require('cors')

var app = express()
app.use(cors()) // enable cors
app.use(express.static('.'))

app.get('/', function(req, res){
  readFile("data/IPEDS_data_extended.json")
  .then(raw  => {
    let jsonData = JSON.parse(raw)
    res.send(jsonData)
  })
  .catch( e => { console.log(e) })
})

app.post

app.listen(8080, function() {
  console.log("Final Project Data Server is running at localhost: 8080")
})
