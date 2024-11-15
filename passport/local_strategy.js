const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const db = require("../models");
const User = db.User;

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email", // 클라이언트에서 보낼 필드 이름
                passwordField: "password",
            },
            async (email, password, done) => {
                try {
                    // 이메일로 사용자 조회
                    const user = await User.findOne({ where: { email } });

                    // 사용자 존재 여부 확인
                    if (!user) {
                        return done(null, false, {
                            message: "이메일 또는 비밀번호가 일치하지 않습니다.",
                        });
                    }

                    // 비밀번호 확인
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        return done(null, false, {
                            message: "이메일 또는 비밀번호가 일치하지 않습니다.",
                        });
                    }

                    // 인증 성공
                    return done(null, user);
                } catch (error) {
                    console.error(error);
                    return done(error); // 서버 에러 발생 시
                }
            }
        )
    );
};