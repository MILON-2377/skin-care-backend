# Wellness Care Backend
## Overview
the **Wellness Care Backend** is a Node.js-based REST API...

## Features
- **User Management**: Signup, login, dashboard access....
- **Product Management**: Add, update, delete, and retrive products
- **Cart System**: Add/remove items, view cart details.

- **Order Processing**: Place orders, track order status, and manage order history

- **wishlist**: Save favourite products.

- **Review and Returns**: Users can review products and process returns

- **Data Aggregation and Anaylyties**: Dashboard and reporting features

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: Firebase (if application)
- **Deployment**: Vercel

## Installation
1. Clone the repository:
 ````bash
 git clone .....


## API Endpoints
### User Routes
- `POST /user/singup` -Register a new user.
- `POST/user/login` -Authentication user
- `GET/user/profile` -Retrive user profile

### Product Routes
- `GET/products` - Get all products
- `POST/products` - Add a new products(Admin only)

###Cart Routes
- `POST/cart/add` -Add item to cart
- `DELETE/cart/remove/:id` -Remove item from cart

###Order Routes
- `POST/order/place` - Place a new order
- `GET/order/history` - Retrive order history

###Wishlist Routes
- `POST/wishlist/add` -Add to wishlist
- `DELETE/wishlist/remove/:id` -Remove from wishlist


## Contribution
Feel free to fork the repository....
