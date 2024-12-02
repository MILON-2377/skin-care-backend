import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/Products.models.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Review } from "../models/Reviews.models.js";
const {ObjectId} = mongoose.Types;


// get products
const getProducts = asyncHandler( async(req, res) => {
    const {category, priceMin, priceMax, page = 1, limit = 10} = req.query;

    const filter = {};
    if(category){
        filter.category = category;
    }

    if(priceMax || priceMin){
        filter.price = {};
        if(priceMin) filter.price.$gte = priceMin;
        if(priceMax) filter.price.$lte = priceMax;
    }

    const products = await Product.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select("-keywords")
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, products, "Products retrived successfully")
        )
});


// search products
const searchProducts = asyncHandler( async(req, res) => {
    const {query} = req.query;
    const limit = 10;

    if(!query){
        throw new ApiError(400, "Search query is required");
    }

    const products = await Product.find({
        $or:[
            {name: {$regex: query, $options:'i'}},
            {category: { $regex:query, $options: 'i'}},
            {description: {$regex: query, $options: 'i'}}
        ]
    })
    .limit(limit)


    return res
        .status(200)
        .json(
            new ApiResponse(200, products, "Search results")
        )

});




// review 
const giveReviewToProduct = asyncHandler( async(req, res) => {


    const {productId, comment, rating} = req.body;

    if([productId, comment, rating].some(i => i.trim() === "" )){
        throw new ApiError(401, "All review are required")
    }
    
    const userId = req.user?._id;

    if(comment.length < 5){
        throw new ApiError(400, "Comment must be at least 5 characters long");
    }

    const product = await Product.findOne({_id: new ObjectId(productId)});

    if(!product){
        throw new ApiError(404, "Product not found");
    }


    const existingReview = await Review.findOne({userId, productId});

    if(existingReview){
        throw new ApiError(400, "You have already reviewed this product");
    }

    const reviewProduct = await Review.create({
        userId,
        productId,
        rating,
        comment,
    });


    const updateReviewCountAndRating = await Review.aggregate([
        {
            $match:{productId: new ObjectId(productId)}
        },
        {
            $group:{
                _id: "$productId",
                totalReviews:{$sum: 1},
                averageRating: {$avg: "$rating"}
            }
        }
    ]);


    // console.log(Number(updateReviewCountAndRating[0].averageRating));


    if(updateReviewCountAndRating.length > 0){
        const {totalReviews, averageRating} = updateReviewCountAndRating[0];


        await Product.findByIdAndUpdate(
            productId,
            {
                averageRating: averageRating,
                totalReviews: totalReviews,
            },
            {
                new: true,
            }
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, reviewProduct, "Review inserted successfully")
        )

});


// display review for per product
const displayReviews = asyncHandler(async (req, res) => {
    const { productId } = req.query;

    
    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const productReviews = await Product.aggregate([
        {
            $match: { _id: new ObjectId(productId) }  
        },
        {
            $lookup: {
                from: "reviews",            
                localField: "_id",           
                foreignField: "productId",  
                as: "reviewDetails"       
            }
        },
        {
            $unwind: "$reviewDetails"        
        },
        {
            $lookup: {
                from: "users",             
                localField: "reviewDetails.userId",
                foreignField: "_id",         
                as: "reviewDetails.reviewer" 
            }
        },
        {
            $unwind: "$reviewDetails.reviewer" 
        },
        {
            $group: {                      
                _id: "$_id",              
                name:  {$first: "$name"} ,  
                reviewDetails: { $push: "$reviewDetails" }  
            }
        },
        {
            $project: {                    
                _id: 1,
                reviewDetails: {           
                    comment: 1,
                    rating: 1,
                    reviewer: {
                        userName: 1,           
                    }
                }
            }
        }
    ]);

    
    if (productReviews.length > 0) {
        return res.status(200).json(
            new ApiResponse(200, productReviews[0], "Reviews retrieved successfully")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "No reviews found")
    );
});



export {
    getProducts,
    searchProducts,
    giveReviewToProduct,
    displayReviews,
}