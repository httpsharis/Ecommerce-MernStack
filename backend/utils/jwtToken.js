// Creating Token and saving in Cookie 
const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    // Make sure COOKIES_EXPIRE is a number
    const cookieExpireDays = Number(process.env.COOKIES_EXPIRE);

    // Options for Cookie
    const options = {
        expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode)
       .cookie("token", token, options)
       .json({
           success: true,
           user,
           token,
       });
};

module.exports = sendToken;
