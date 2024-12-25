const express = require('express');
const router = express.Router({mergeParams: true});
const mongoose = require('mongoose');
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require('passport');
const {saveUrl, isAuthenticated} = require("../middleware.js");
const {renderSignupForm, signUp, renderLoginForm, Login, Logout} = require('../controller/user.js');

router.route("/signUp")
    .get(renderSignupForm)
    .post(signUp);

router.route("/login")
    .get(renderLoginForm)
    .post(saveUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}) , Login);

router.get("/logout", Logout);
module.exports = router; 