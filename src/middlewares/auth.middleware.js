const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
    try {

        let token;
        //  Cookie get token 
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // token not find
        if (!token) {
            return next(new ApiError(401, "Not authorized, no token"));
        }

        //  Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //  User find 
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return next(new ApiError(401, "User not found"));
        }

        //  req  user attach 
        req.user = user;

        next();

    } catch (error) {
        return next(new ApiError(401, "Not authorized, token failed"));
    }
};

// const authorizeRoles = (...roles) => {
//     return (req, res, next) => {

//         if (!roles.includes(req.user.role)) {
//             return next(
//                 new ApiError(403, "Access denied")
//             );
//         }

//         next();
//     };
// };

// module.exports = authorizeRoles;

module.exports = protect;