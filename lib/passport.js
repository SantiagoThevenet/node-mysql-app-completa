const passport = require("passport")
const {pool} = require('../database.js')
const LocalStrategy = require("passport-local").Strategy
const helpers = require("./helpers.js")


passport.use("local.signup", new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname, Email } = req.body
    const newUser = {
        username,
        password,
        Email,
        fullname
    }
    newUser.password = await helpers.encryptPassword(password)
    const [result] = await pool.query('INSERT INTO users SET ?', [newUser]) 
    newUser.id = result.insertId
    return done(null, newUser)
}
))


passport.serializeUser((user,done) => {
    done(null, user.id)
})


passport.deserializeUser(async (id,done) => {
   const [rows] = await pool.query("SELECT * FROM users WHERE id ? ?", [id])
   done(null, rows[0])
})