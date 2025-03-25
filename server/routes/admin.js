const express = require("express");

const router = express.Router();

// adding Models for mongoDB

const Post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;




// 
// Admin : Check Login cookies route

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json( { message : 'Unauthorized'});
        // res.render('error404');
    }

    try {
        const decoded =  jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json( { message : 'Unauthorized'});
    }
}




// GET
// Admin : Login route

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple blog created with NodeJS, Express & MongoDB.",
    };

    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});


// POST
// Admin : Check Login route

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne( { username } );

    if(!user){
        return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const isPasswordValid = await bcrypt.compare( password, user.password );

    if(!isPasswordValid){
        return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const token = jwt.sign( { userid: user._id }, jwtSecret)
    res.cookie('token',token, { httpOnly:true });

    res.redirect('/dashboard');


  } catch (error) {
    console.log(error);
  }
});



// GET
// Admin: |> Dashboard route

router.get("/dashboard", authMiddleware,  async (req, res) => {
    
    try {
        const locals = {
            title: "Dashboard",
            description: "Simple blog created with NodeJS, Express & MongoDB.",
          };

        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data
        });

    } catch (error) {
        
    }
    
    
    
    
    

});

// router.post("/admin", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (req.body.username === "admin" && req.body.password === "password") {
//       res.send('You are logged in');
//     } else {
//         res.send('Wrong username or password');
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });




// POST
// Admin : Register route

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User Created', user });
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({ message: 'User already in use' });
        }
        res.status(500).json({ message : 'Internal server error' })
    }

  } catch (error) { 
    console.log(error);
  }
});

module.exports = router;
