const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    }
}
export { asyncHandler}


// const asyncHandler = (fn) => {() => {}}

// const asyncHandler = async(fn) => async(req,res,next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(500).json({success:true, message:"error occure", error})
//     }
// }