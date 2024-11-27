import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  altText: {
    type: String,
    required: false,
    trim: true,
  },
});

const productsSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    images: {
      type: [imageSchema],
      required: true,
      validate:{
        validator: function(images){
            return images.length >= 3;
        },
        message:"At least 3 images are required",
      }
    },
    stock: {
      type: Number,
      required: true,
      min:0,
      validate:{
        validator: Number.isInteger,
        message:"Stock must be an integer",
      }
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (value) => Number(value.toFixed(2)),
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    keywords:{
        type: [String],
        default:[],
        index: true,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for commonly queried fields
productsSchema.index({price:1});
productsSchema.index({averageRating:-1});


// Middleware to generate keywords before saving
productsSchema.pre('save', (next) => {
    const keywordSet = new set();

    // add terms from productName, category, and brand
    keywordSet.add(this.productName.toLowerCase());
    if(this.category) keywordSet.add(this.category.toLowerCase());
    if(this.brand) keywordSet.add(this.brand.toLowerCase());

    // optionally split and add individual words
    this.productName.split(" ").forEach((w) => keywordSet.add(w.toLowerCase()) );
    this.category.split(" ").forEach((w) => keywordSet.add(w.toLowerCase()));

    if(this.brand){
        this.brand.split(" ").forEach((w) => keywordSet.add(w.toLowerCase()) );
    }

    this.keywords = Array.from(keywordSet);
    next();
})

export const Product = mongoose.model("Product", productsSchema);
