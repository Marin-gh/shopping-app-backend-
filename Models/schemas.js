const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    image:[{type: String, required: true}],
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[{type: Schema.Types.ObjectId, ref: 'Review'}]
});

//userSchema
const userSchema = new Schema({
    firstName:{
        type: String,
        maxlength: 40,
        required: true
    },
    lastName:{
        type: String,
        maxlength: 40,
        required: true
    },
    email:{
        type: String,
        maxlength: 100,
        required: true
    },
    products: [{type: Schema.Types.ObjectId, ref: 'Product'}],
    reviews:[{type: Schema.Types.ObjectId, ref: 'Review'}]
});

//reviewSchema
const reviewSchema = new Schema({
    body:{
        type: String,
        maxlength: 300,
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