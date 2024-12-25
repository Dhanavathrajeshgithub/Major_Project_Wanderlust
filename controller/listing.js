const Listing = require('../models/listing');

module.exports.index = async(req,res)=>{
    const allList = await Listing.find({});
    // let msg = req.flash("success");
    res.render("./listings/index.ejs",{allList});
};

module.exports.show = async(req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('owner');
    if(!list){
        req.flash("error","Listing you are searching for doesn't exists!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{list});
};

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list){
        req.flash("error","Listing you are searching for doesn't exists!");
        return res.redirect(`/listings`);
    }
    let reducedImageUrl = list.image.url;
    reducedImageUrl = reducedImageUrl.replace("/upload", "/upload/h_80,w_80");
    res.render("./listings/edit.ejs",{list, reducedImageUrl});
};

module.exports.update = async(req,res)=>{
    let {id} = req.params;
    //console.log(req.body);
    let newList = await Listing.findByIdAndUpdate(id,{...req.body.list});
    if(!req.body.list.category){
        newList.category = null;
    }
    //console.log(newList);
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        newList.image = {url, filename};
    }
    await newList.save();
    req.flash("success", "listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.Delete = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted successfully!");
    res.redirect("/listings");
};

module.exports.renderNewForm = (req,res)=>{
    //console.log(req.user);
    res.render("./listings/new.ejs");
};

module.exports.addNewList = async (req,res,next)=>{
        let url = req.file.path;
        let filename = req.file.filename;
        let newList = new Listing(req.body.list);
        newList.image = {url, filename};
        newList.owner = req.user._id;
        //console.log(newList);

        await newList.save();
        //console.log(req.body);
        req.flash("success", "new listing created successfully!");
        res.redirect("/listings");
    
};