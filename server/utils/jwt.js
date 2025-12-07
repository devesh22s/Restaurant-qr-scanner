import jwt from "jsonwebtoken";

export const generatAccessToken = (payload) => {
  try {
    return jwt.sign(
      payload,
      "0ba6a542a7b643cb19b58ee54ee53f2063c99b59b14ecb21a2ba48f0e7de5d39",
      { expiresIn: "1hr" } // Access token 15 min valid
    );
  } catch (err) {
    console.log("Access Token Error:", err.message);
  }
};

export const generatRefershToken = (payload) => {
  try {
    return jwt.sign(
      payload,
      "0ba6a542a7b643cb19b58ee54ee53f2063c99b59b14ecb21a2ba48f0e7de5d39",
      { expiresIn: "7d" } // Refresh token 7 days valid
    );
  } catch (err) {
    console.log("Refresh Token Error:", err.message);
  }
};

