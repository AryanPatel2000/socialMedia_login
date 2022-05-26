const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session')
const app = express();
require('./passport-setup')
app.set("view engine", "ejs")

//setting up cookies
app.use(cookieSession({
    name: 'session',
    keys : ['key1', 'key2']
}))

//Logged in middleware

const isLoggedIn = (req, res, next) => {
    if(req.user)
    {
        next();
    }
    else{
        res.sendStatus(401);
  
    }
}

//Passport initialized
app.use(passport.initialize())

//setting up sessiom
app.use(passport.session());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('pages/index')
});

app.get('/failed', (req, res) => res.send('You Failed to log in!'))

app.get('/good', isLoggedIn, (req, res) => {
    console.log(req.user._json)
    res.render('pages/profile.ejs',{
        name : req.user.displayName,
        pic : req.user._json.picture,
        email : req.user.emails[0].value,
        profile : "google"
    })
})

app.use('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/google/callback', 
    passport.authenticate('google', 
    {failureRedirect: '/failed'}),
    (req, res) => {
        res.redirect('/profile');
    })

app.get('/profile',isLoggedIn,  (req,res) => {
        console.log("----->",req.user)
        res.render('pages/profile', {
            profile: "google",
            name:req.user.displayName,
            pic:req.user.photos[0].value,
            email:req.user.emails[0].value // get the user out of session and pass to template
        });
    })

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})
