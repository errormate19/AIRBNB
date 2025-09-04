module.exports.isLoggedIn = (req, res, next) => {
  if (!req.Authenticated()) {
    req.sesion.redirectURL= req.originalURL;
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl=
(req,res,next)=>{
  if(req.session.redirectURL){
    res.locals.redirectURL= req.session.redirectURL;
  }
  next();
}
