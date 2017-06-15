var express = require('express')
var app = express()

app.get('/show',function (req, res) {
  res.sendFile(__dirname + '/show.mp4')
})

app.use(express.static('./dist'))

app.listen(4001, function (err) {
  if (err) {
    console.log(err)
  }
  console.log('server is running at localhost:4001')
})
