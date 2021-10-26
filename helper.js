const { Product, Review } = require('./Models/schemas.js');

function isLoggedIn(req, res, next){
    //console.log(req.user);
    if(req.isAuthenticated()){
        next();
    }else{
        res.json("You are not logged in");
    }
}

async function isProductAuthor(req, res, next){
    //dobivam id (as params) od product-a kojeg editiram/delete-am
    const { id } = req.params;
    const product = await Product.findById(id);
    const authorId = product.author;
    const { _id } = req.user;
    if(_id.equals(authorId)){
        next();
    }else{
        res.json("You are not an author of that product");
    }
}

async function isReviewAuthor(req, res, next){
    //dobivam id (as params) review-a kojeg editiram/delete-am
    const { id } = req.params;
    const review = await Review.findById(id);
    const authorId = review.author;
    const { _id } = req.user;
    if(_id.equals(authorId)){
        next();
    }else{
        res.json("You are not an author of that review");
    }
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.isProductAuthor = isProductAuthor;
module.exports.isReviewAuthor = isReviewAuthor;