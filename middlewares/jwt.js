const { expressjwt }  = require("express-jwt");
const secret = process.env.JWT_SECRET;

const authenticate = expressjwt({
	secret: secret,
	algorithms: ["HS256"],
	credentialsRequired: true,
	token: function getTokenFromHeader(req) {
		if (
			req.headers.authorization &&
				req.headers.authorization.split(" ")[0] === "Bearer"
		) {
			return req.headers.authorization.split(" ")[1];
		} else if (req.query && req.query.token) {
			return req.query.token;
		}
		return null;
	},
});


module.exports = authenticate;