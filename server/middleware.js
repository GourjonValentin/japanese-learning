const jwt = require("jsonwebtoken");

function verifyToken(token, secretKey) {
    if (!token) {
        return ({ status: 400, message: "Invalid format"});
    }

    return jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return ({ status: 401, message: "Invalid Token"});
        }
        return ({ status: 200, message: "Valid Token", payload: decoded});
    });
}

module.exports = verifyToken;

