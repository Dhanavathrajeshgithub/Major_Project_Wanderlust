if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();

const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
app.use(express.static(path.join(__dirname,"public")));
app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
const Listing = require('./models/listing.js');
const mongoose = require('mongoose');
/* passport */
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
 const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const wrapAsync = require('./utils/wrapAsync.js');

const dbUrl = process.env.ATLASDB_URL;
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}
const ExpressError = require("./utils/ExpressError.js");
/* express-session */
const session = require('express-session');
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET, 
    },
    touchAfter: 24*60*60
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET, 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const flash = require("connect-flash");
app.use(flash());

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})
// app.get("/",(req,res)=>{
//     res.send("I'm root");
// });

// app.get("/demoUser", async (req,res)=>{
//     let fakeUser = new User({
//         email: 'abc@gmail.com',
//         username: 'Raj'
//     });
    
//     let newUser = await User.register(fakeUser,"password");
//     res.send(newUser);
// })

app.use((req,res,next)=>{
    res.locals.msg = req.flash("success");
    res.locals.error = req.flash("error");
    //console.log(req.user);
    res.locals.currUser = req.user;
    next();
});

/* search */
app.get('/search',wrapAsync(async (req,res)=>{
    let {country, minPrice} = req.query;
    const allList = await Listing.find({});
    res.render('./listings/search.ejs', {country, minPrice, allList});
}));

/* Restructuring Router */
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

app.get('/filter/:filter', wrapAsync(async (req,res)=>{
    let {filter} = req.params;
    const allList = await Listing.find({});
    res.render("./listings/filter.ejs", {filter, allList});
}));

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!"));
})

/* ERROR HANDLING */
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"} = err;
    res.status(status).render("./listings/error.ejs",{message});
})




// app.get("/testListing",async(req,res)=>{
//     let loc1 = new Listing({
//         title: "My new Villa",
//         description: "by the Beach",
//         price: 1500,
//         location: "Hyderabad, Goa",
//         country: "India"
//     })
//     await loc1.save();
//     res.send("success");
// })