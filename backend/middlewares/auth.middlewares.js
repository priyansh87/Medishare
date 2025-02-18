import jwt from 'jsonwebtoken';

import dotenv from 'dotenv' 
dotenv.config() ;

const authMiddleware = async (req, res, next) => {
    let token;

    // Check if the token is in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
           
            token = req.headers.authorization.split(' ')[1];  

            // Decode and verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            
            req.user = decoded;

            return next();
        } catch (error) {
            console.log("JWT Error:", error);
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
    }

    // If no token in header, check cookies (useful for persistent login across page reloads)
    if (req.cookies.token) {
        try {
            token = req.cookies.token;

            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

           
            req.user = decoded;
            console.log("user injected in req.user" , decoded)

            return next();
        } catch (error) {
            console.log("JWT Error:", error);
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }
    }

    
    return res.status(401).json({ success: false, message: 'User not logged in' });
};

export default authMiddleware;