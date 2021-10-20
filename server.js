const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { Product, User, Review } = require('./Models/schemas.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
//const cookieParser = require('cookie-parser');
const { isLoggedIn, isProductAuthor, isReviewAuthor } = require('./helper.js');

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
    origin: 'http://localhost:3000',
    credentials: true
}));

//middleware for parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//middleware for cookie parser
//app.use(cookieParser("thisisnotagoodsecret"));
//middleware for session
app.use(session({secret:"thisisnotagoodsecret", resave: false, saveUninitialized: true}));

//middleware for initializing passport
app.use(passport.initialize());
app.use(passport.session());
//za našu local strategy će authenticate() method biti na User modelu (koji ima tu metodu jer smo dodali onaj .plugin)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//dohvati iz baze sve products
app.get("/products", async(req,res)=>{
    try{
        const data = await Product.find({}).populate('author','username');
        res.json(data);
    }catch(e){
        res.json(`error: ${e}`);
    }
});

//dohvati iz baze product s dobivenim id-om (kao parametrom)
app.get("/products/:id", async(req,res)=>{
    try{
        const { id } = req.params;
        const data = await Product.findById(id).populate('author','username');
        res.json(data);
    }catch(e){
        res.json(`error: ${e}`);
    }
});

//route for adding new product (if is logged in)
//isLoggedIn callback middleware function (to protect adding new product on server side if user is not logged in)
app.post("/products", isLoggedIn, async(req,res)=>{
    try{
        const data = req.body;
        //dobivam _id od logiranog usera
        const { _id } = req.user;
        //create a new (and save) product with req.body and .author property with _id of logged user
        const newProduct = await Product.create({...data, author: _id});
        res.json(newProduct);
    }catch(e){
        res.json(`error: ${e}`);
    }
});

//route for editing product (if is author) with id given as params
//isAuthor callback middleware function (to protect editing product on server side if user is not author)
app.put("/products/:id", /*isLoggedIn, isProductAuthor,*/ async(req,res)=>{
    try{
        console.log(req.body);
        const { id } = req.params;
        const data = req.body;
        const updatedProduct = await Product.findOneAndUpdate({_id: id}, data, {new: true});
        //console.log(updatedProduct);
        res.json(updatedProduct);
    }catch(e){
        res.json(`error: ${e}`);
    }
});

//route for deleting product (if is author) with id given as params
//isAuthor callback middleware function (to protect deleting product on server side if user is not author)
app.delete("/products/:id", /*isLoggedIn, isProductAuthor,*/ async(req,res)=>{
    try{
        const { id } = req.params;
        const deletedProduct = await Product.findOneAndDelete({_id: id});
        //console.log(deletedProduct);
        res.json(deletedProduct);
    }catch(e){
        res.json(`error: ${e}`);
    }
});

//dohvati iz baze sve reviews koji se odnose na product s dobivenom id-om (kao parametrom)
app.get("/reviews/:prodId", async(req,res)=>{
    try{
        const id = req.params.prodId;
        const data = await Review.find({product: id});
        //console.log(data);
        res.json(data);
    }catch(e){
        res.json(`error: ${e}`);
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
    }catch(e){
        res.json(`error: ${e}`);
    }
});

//route for editing review (if is author) with id given as params
//isAuthor callback middleware function (to protect editing review on server side if user is not author)
app.put("/reviews/:id", /*isLoggedIn, isReviewAuthor,*/ async(req,res)=>{
    try{
        //console.log(req.body);
        const { id } = req.params;
        const data = req.body;
        const updatedReview = await Review.findOneAndUpdate({_id: id}, data, {new: true});
        //console.log(updatedReview);
        res.json(updatedReview);
    }catch(e){
        res.json(`error: ${e}`);
    }
});

//route for deleting review (if is author) with id given as params
//isAuthor callback middleware function (to protect deleting review on server side if user is not author)
app.delete("/reviews/:id", /*isLoggedIn, isReviewAuthor,*/ async(req,res)=>{
    try{
        const { id } = req.params;
        const deletedReview = await Review.findOneAndDelete({_id: id});
        //console.log(deletedReview);
        res.json(deletedReview);
    }catch(e){
        res.json(`error: ${e}`);
    }
});


//route for register (i vrati samo username i email na client stranu pa ćemo tamo spremiti u session da je logiran korisnik s tim i tim podatcima)
app.post('/register', async(req,res)=>{
    try{
        //console.log(req.body);
        const {username, password, email} = req.body;
        const registeredUser = await User.register(new User({username, email}), password);
        //console.log(registeredUser);
        req.login(registeredUser, (err) =>{
            if(err){
                res.json(`error: ${err}`);
            }else{
                //console.log(req.user);
                res.json({username: username, email: email});
            }
        });
    }catch(e){
        res.json(`error: ${e}`);
    }
});

//route for login (i vrati samo username i email na client stranu pa ćemo tamo spremiti u session da je logiran korisnik s tim i tim podatcima)
app.post('/login', passport.authenticate('local'), async(req,res)=>{
    try{
        //console.log(req.user);
        const { username, email } = req.user;
        res.json({username: username, email: email});
    }catch(e){
        res.json(`error: ${e}`);
    }
});

//route for logout
app.get('/logout', (req,res)=>{
    try{
        if(req.isAuthenticated()){
            //console.log(req.user);
            const { username, email } = req.user;
            //sad ćemo odlogirati korisnika (to znači da će req.user sad biti null, a req.isAuthenticated() vraća false)
            req.logout();
            //vraćam podatke o odlogiranom user-u
            res.json({username: username, email: email});
        }else{
            res.json("User is not logged in..");
        }
    }catch(e){
        res.json(`error: ${e}`);
    }
});


//listening od port 8080
app.listen(8080, ()=>{
    console.log("Listening on port 8080");
});