const { Product, Review } = require('./Models/schemas.js');

function isLoggedIn(req, res, next){
    console.log(req.user);
    if(req.isAuthenticated()){
        next();
    }else{
        res.json("You are not logged in");
    }
}

async function isProductAuthor(req, res, next){
    //dobivam id od product-a kojeg editiram/delete-am
    const { id } = req.params;
    const product = await Product.findById(id);
    const authorId = product.author._id;
    if(req.user._id === authorId){
        next();
    }else{
        res.json("You are not an author of that product");
    }
}

async function isReviewAuthor(req, res, next){
    //dobivam id review-a kojeg editiram/delete-am
    const { id } = req.params;
    const review = await Review.findById(id);
    const authorId = review.author._id;
    if(req.user._id === authorId){
        next();
    }else{
        res.json("You are not an author of that review");
    }
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.isProductAuthor = isProductAuthor;
module.exports.isReviewAuthor = isReviewAuthor;