const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose');

//productSchema
const productSchema = new Schema({
    title:{
        type: String,
        maxlength: 20,
        required: true
    },
    description:{
        type: String,
        maxlength: 150,
        required: true
    },
    price:{
        type: Number,
        min: 0,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    //zasad će to biti niz url-ova
    images: [{url: {type: String, required: true}, filename: {type: String, required: true}}],
    avgRating:{
        type: Number,
        min: 0,
        max: 5
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[{type: Schema.Types.ObjectId, ref: 'Review'}]
});

//userSchema
const userSchema = new Schema({
    /*username:{
        type: String,
        maxlength: 40,
        required: true,
        unique: true
    },*/
    email:{
        type: String,
        maxlength: 100,
        required: true,
        unique: true
    },
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}],
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
});
userSchema.plugin(passportLocalMongoose);

//reviewSchema
const reviewSchema = new Schema({
    body:{
        type: String,
        maxlength: 300,
        required: true
    },
    rating:{
        type: Number,
        max: 5,
        min: 1,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product:{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
});

const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Review = mongoose.model('Review', reviewSchema);

module.exports.Product = Product;
module.exports.User = User;
module.exports.Review = Review;