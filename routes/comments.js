var express     = require("express");
var router      = express.Router({mergeParams: true});
var Campground  =  require("../models/campground");
var Comment     =  require("../models/comment");

//NEW - show form to create a new comment
router.get("/new", isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if(err) {
      console.log(err);
    }
    else {
      res.render("comments/new", {campground: campground});
    }
  });
});

//CREATE - create a comment
router.post("/", isLoggedIn, function(req, res) {
  //Look up campground using id
    Campground.findById(req.params.id, function(err, campground) {
      if(err) {
        console.log(err);
        res.redirect("/campgrounds");
      }
      else {
        Comment.create(req.body.comment, function(err, comment) {
          if(err) {
            console.log(err);
          }
          else {
            //Add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            //Save commment
            comment.save();
            campground.comments.push(comment);
            campground.save();
            res.redirect("/campgrounds/" + campground._id);
          }
        });
      }
    });
});

//EDIT - show form to edit a comment
router.get("/:comment_id/edit", function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if(err) {
      console.log(err);
      res.redirect("back");
    }
    else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

//UPDATE - update a a comment
router.put("/:comment_id", function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if(err) {
      res.redirect("back");
    }
    else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DESTROY - delete a comment
router.delete("/:comment_id", function(req, res) {
  //Remove the comment
  Comment.findByIdAndRemove(req.params.comment_id, function(err) {
    if(err) {
      res.redirect("back");
    }
    else {
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

//Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
