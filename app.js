const express = require('express');
var bodyParser = require('body-parser');

var cookieParser = require('cookie-parser');
var session = require('express-session');

const app = express();

const User = require('./models/User');


app.set("port", 4000);


app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(session({

    key: 'user_sid',
    secret: "this is random stuff",
    resave: false,

    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

app.use((req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {

        res.redirect('/dashborad');
    }
    next()

})

app.use((req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.red('/dashborad');
    } else {
        next();
    }
});
app.get('/', sessionChecker, (req, res), {

    res.redirect('/login'),
});

app.route('/login').get(sessionChecker, (req, res) => {
    res.redirect('/login');
});


app.get('/signup').get(sessionChecker, (req, res) => {
        res.sendFile(__dirname + '/public/signup.html');
    })
    .post((req, res) => {
        var user = new User({

            username: req.body.user,
            email: req.body.email,
            password: req.body.password
        })
        user.save((err, docs) => {
            if (err) {
                res.redirect('/signup')
            } else {

                console.log(docs)
                req.session.user = docs
                res.redirect('/dashboard')
            }
        })
    })



app.listen(app.get('port'), () => {

    console.log("App is listening on port 4000");

});