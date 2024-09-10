const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()

// Nastavení EJS jako šablonovacího systému (templating engine)
app.set('view engine', 'ejs');
// Nastavení middleware, které zajistí parsování těla požadavku
app.use(bodyParser.urlencoded({ extended: true}))
// Nastavení složky se statickými soubory (přílohy - jpg, css)
app.use(express.static('public'))

// Routa - domovská stránka webu
app.get('/', function (req, res) {
  res.render('index');
  // res.send('<h2>Hello World</h2>')
})

// Routa - localhost:3000/about - o autorovi
app.get('/about', function (req, res) {
    res.render('about')
})

// Routa - localhost:3000/about - o autorovi
app.get('/joke', function (req, res) {
  res.send('<p>Vtip???</p>')
})

app.post('/submit', function(req, res) {
  console.log(req.body)
  let message = {
    author: req.body.author,
    message: req.body.message,
    timestamp: new Date().toISOString(),
    ip: req.ip.split(':').pop()
  }
  fs.readFile('messages.json', (err, data) => {
    if (err) throw err; 
    let messages = JSON.parse(data);
    messages.push(message);
    fs.writeFile('messages.json', JSON.stringify(messages), function (err) {
      if (err) throw err;
      console.log('Saved!');
      res.send('<h1>Zpráva byla uložena</h1>')
    });
  
  })
})


app.get('/messages/json', (req, res) =>{
  fs.readFile('messages.json', (err, data) => {
    if (err){
      res.send('stala se chyba')
    }
    if (data) {
      res.json(JSON.parse(data))
}})})



app.get('/messages', (req, res) =>{
  fs.readFile('messages.json', (err, data) => {
    if (err){
      res.send('stala se chyba')
    }
    if (data) {
      const messages = JSON.parse(data);
      res.render('messages', {zpravy: messages})
    }})})

// Webserver naslouchá na portu 3000
app.listen(3000)