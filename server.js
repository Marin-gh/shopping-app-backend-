const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { Product, User, Review } = require('./Models/schemas.js');

//connecting to db
async function connectDB(){
    try{
        await mongoose.connect('mongodb://localhost:27017/shoppingCartDB');
        console.log("Successfully connected to database!");
    }catch(e){
        console.log(`Error connecting to database: ${e}`);
    }
}
connectDB();


//allowing requests from listed origin(s)
app.use(cors({
    origin: 'http://localhost:3000'
}));
//middleware for parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//dohvati iz baze sve products
app.get("/products", async(req,res)=>{
    try{
        const data = await Product.find({});
        res.json(data);
    }catch{
        res.json("error with fetching data from db");
    }
});

//dohvati iz baze product s dobivenim id-om (kao parametrom)
app.get("/products/:id", async(req,res)=>{
    try{
        const { id } = req.params;
        const data = await Product.findById(id);
        //console.log(data);
        res.json(data);
    }catch{
        res.json("error with fetching data from db");
    }
});

//route for adding new product (if is logged in)
//isLoggedIn callback middleware function (to protect adding new product on server side if user is not logged in)
app.post("/products", /*isLoggedIn,*/ async(req,res)=>{
    try{
        //console.log(req.body);
        const data = req.body;
        const newProduct = await Product.create(data);
        res.json(newProduct);
    }catch{
        res.json("error with inserting new product to db");
    }
});

//route for editing product (if is author) with id given as params
//isAuthor callback middleware function (to protect editing product on server side if user is not author)
app.put("/products/:id", /*isAuthor,*/ async(req,res)=>{
    try{
        console.log(req.body);
        const { id } = req.params;
        const data = req.body;
        const updatedProduct = await Product.findOneAndUpdate({_id: id}, data, {new: true});
        //console.log(updatedProduct);
        res.json(updatedProduct);
    }catch{
        res.json("error with editing product");
    }
});

//route for deleting product (if is author) with id given as params
//isAuthor callback middleware function (to protect deleting product on server side if user is not author)
app.delete("/products/:id", /*isAuthor,*/ async(req,res)=>{
    try{
        const { id } = req.params;
        const deletedProduct = await Product.findOneAndDelete({_id: id});
        //console.log(deletedProduct);
        res.json(deletedProduct);
    }catch{
        res.json("error with deleting product");
    }
});

//dohvati iz baze sve reviews koji se odnose na product s dobivenom id-om (kao parametrom)
app.get("/reviews/:prodId", async(req,res)=>{
    try{
        const id = req.params.prodId;
        const data = await Review.find({product: id});
        //console.log(data);
        res.json(data);
    }catch{
        res.json("error with fetching data from db");
    }
});

//route for adding new review (if is logged in)
//isLoggedIn callback middleware function (to protect adding new review on server side if user is not logged in)
app.post("/reviews", /*isLoggedIn,*/ async(req,res)=>{
    try{
        //console.log(req.body);
        const data = req.body;
        const newProduct = await Review.create(data);
        res.json(newProduct);
    }catch{
        res.json("error with inserting new review to db");
    }
});

//route for editing review (if is author) with id given as params
//isAuthor callback middleware function (to protect editing review on server side if user is not author)
app.put("/reviews/:id", /*isAuthor,*/ async(req,res)=>{
    try{
        //console.log(req.body);
        const { id } = req.params;
        const data = req.body;
        const updatedReview = await Review.findOneAndUpdate({_id: id}, data, {new: true});
        //console.log(updatedReview);
        res.json(updatedReview);
    }catch{
        res.json("error with editing review");
    }
});

//route for deleting review (if is author) with id given as params
//isAuthor callback middleware function (to protect deleting review on server side if user is not author)
app.delete("/reviews/:id", /*isAuthor,*/ async(req,res)=>{
    try{
        const { id } = req.params;
        const deletedReview = await Review.findOneAndDelete({_id: id});
        //console.log(deletedReview);
        res.json(deletedReview);
    }catch{
        res.json("error with deleting product");
    }
});


//route for login (and save to locale storage podatke o logiranom useru)
//route for register (and login and save to locale storage podatke o logiranom useru)


//listening od port 8080
app.listen(8080, ()=>{
    console.log("Listening on port 8080");
});