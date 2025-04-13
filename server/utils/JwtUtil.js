const jwt = require('jsonwebtoken');
const MyConstants = require('./MyConstants');

const JwtUtil = {
    genToken(username) {
        const token = jwt.sign(
            { username },
            MyConstants.JWT_SECRET,
            { expiresIn: MyConstants.JWT_EXPIRES }
        );
        return token;
    },

    verifyToken(token) {
        return jwt.verify(token, MyConstants.JWT_SECRET);
    },
    
    checkToken(req, res, next) {
        let token = req.headers['x-access-token'] || req.headers['authorization'];
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7);
        }
        if (token) {
            jwt.verify(token, MyConstants.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.json({
                        success: false,
                        message: 'Token is not valid'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }
    }
};

module.exports = JwtUtil;