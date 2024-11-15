const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.User;

exports.join = async(req, res, next) => {
    const { email, nick, password, phone_number, name, gender, address, payment } = req.body;
    try {
        // Validate input datas.
        if (!email || !password || !phone_number || !name) {
            return res.status(400).json({
                message : "Required fields are missing: email, password, phone_number, or name"
            });
        }

        // Check duplicate.
        const existed_user = await User.findOne({ where: {email}});
        if (existed_user) {
            return res.status(409).json({ message : "Email already exists"});
        };

        // Hash the password.
        const hashed_password = await bcrypt.hash(password, 12);

        // Create new user.
        const new_user = await User.create({
            email,
            nick : nick || "noname",
            password : hashed_password,
            phone_number,
            name,
            gender : gender || "Other",
            address : address || null,
            payment : payment || null,
        });

        // Return successful response.
        return res.status(201).json({
            message : "User created successfully",
            user : {
                id : new_user.user_id,
                email : new_user.email,
                nick : new_user.nick,
            },
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({ message : "Internal server error", error : error.message});
    }
};