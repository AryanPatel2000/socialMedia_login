const passport = require('passport');
require('dotenv').config();

const GoogleStrategy = require('passport-google-oauth2').Strategy;
const facebookStrategy = require('passport-facebook').Strategy;

// used to serialize the user for the session
passport.serializeUser(function (user, done){ 
    done(null, user);
});
// used to deserialize the user
passport.deserializeUser(function (user, done) {
    done(null, user);
});

//Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
    
    }, (request, accessToken, refereshToken, profile, done) => {
        console.log(profile)
         done(null, profile)
    }
))