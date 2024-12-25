const User = require('../models/user');

module.exports.renderSignupForm = (req,res)=>{
    res.render("user/signUp.ejs");
};

module.exports.signUp = async (req,res)=>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({username, email});
        let regUser = await User.register(newUser, password);
        //console.log(regUser);
        req.login(regUser, (err)=>{
            if(err) return next(err);
            req.flash("success", "Welcome to Wanderlust");
            return res.redirect("/listings");
        })
    } catch(e){
        req.flash("error", e.message);
        return res.redirect("/signUp"); 
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs");
};

module.exports.Login = (req,res)=>{
    req.flash("success", "Welcome back to wanderlust!");
    if(res.locals.url){
        res.redirect(res.locals.url);
    } else{
        res.redirect("/listings");
    }
};

module.exports.Logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "LoggedOut successfully!");
        res.redirect('/listings');
    })
};