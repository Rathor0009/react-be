// import {express} from 'express';
const express=require("express")
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
// import {mongoose} from 'mongoose';
const  cors =require('cors');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors())
const itemRoutes =require('./routes/items.js');
app.use('/items',itemRoutes)
app.get('/',(req,res)=>{
res.send('Hello')
})
const mongodb = "mongodb://localhost:27017/react-image-upload";
const PORT = process.env.PORT || 5000;
mongoose.connect(mongodb,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>app.listen(PORT,console.log(`Server running on ${PORT}`))).catch(err=>console.log(err));