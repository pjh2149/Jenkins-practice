const express = require('express')
const app = express()
const port = 3000;


app.use(express.urlencoded({extended: false}))
app.use(express.json())



//schemas
const connect = require("./schemas");
connect();

//ejs
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//routers
const userRouter = require("./routers/index");
app.use("/api", [userRouter]);

app.get('/posting',(req,res)=>{
  res.render('posting');
})

app.get('/register', (req, res) => {
  res.render('register');
})

app.get('/', (req, res) => {
  res.render('contents');
})

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/comment', (req, res) => {
  res.render('comment');
})
app.get('/modify', (req, res) => {
  res.render('modify');
})


app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
  })