const userModel = require("../models/user.model");

// Controller to create a new user
module.exports.createUser = async ({ firstname, lastname, email, password }) => {
    if (!firstname || !email || !password) {
        throw new Error("Firstname, email, and password are required");
    }

    const user = userModel.create({
        fullname: { firstname, lastname },
        email,
        password
    });
    
    return user;
}