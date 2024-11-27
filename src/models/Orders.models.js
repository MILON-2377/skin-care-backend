import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const ordersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    products: {
        type: [productsSchema],
        required: true,
        validate: {
            validator: function(products){
                return products.length > 0;
            },
            message:"At least one product must be included in the order",
        }
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "processed", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "bkash", "nogod", "visa_card"],
      required: true,
    },
    orderDate:{
        type: Date,
        default: Date.now,
    },
    deliveryDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value >= this.orderDate;
        },
        message: "delivery date must be after order date",
      },
    },
  },
  {
    timestamps: true,
  }
);

// middleware to calculate totalprice
ordersSchema.pre('save', function(next){
    this.totalPrice = this.products.reduce((acc, product) => acc + product.price*product.quantity, 0);
    next();
});

export const Order = mongoose.model("Order", ordersSchema);