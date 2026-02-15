const jwt = require("jsonwebtoken");

exports.createToken = (user) => {
  if (!user) throw new Error("User data is required to create token");

  const payload = { id: user._id, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "365d" });
};
