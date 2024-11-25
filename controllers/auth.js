const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const db = require("../models");
const User = db.User;

exports.join = async (req, res, next) => {
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
        return res.status(201).json(
            {
                message : "User created successfully",
                user : {
                    id : new_user.user_id,
                    email : new_user.email,
                    nick : new_user.nick,
                },
            }
    );
    } catch(error) {
        console.error(error);
        return res.status(500).json({ message : "Internal server error", error : error.message});
    }
};

exports.login = async (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return res.status(500).json({ message : "Internal server error" });
        }
        
        if (!user) {
            return res.status(401).json({ message : info.message }); // 인증 실패 시
        }

        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return res.status(500).json({ message : "Failed to log in" });
            }
            console.log("로그인 성공");

            // JWT 토근 생성
            const token = jwt.sign(
                {
                    'user_id' : user.user_id
                },
                process.env.JWT_SECRET,
                { expiresIn : process.env.JWT_EXPIRES_IN }
            );
            
            // 로그인 성공 시 JSON 응답
            return res.status(200).json({
                'token' : token,
                message : "Login successful",
            });
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout((error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message : "Failed to log out" });
        }
        req.session.destory((error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message : "Failed to destory session" });
            }
            return res.status(200).json({ message : "Logout successful" });
        })
    })
}