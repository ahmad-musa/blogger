const express = require('express');

const router =  express.Router();

const Post = require('../models/Post');

// GET 
// HOME route
router.get('', (req, res) => {

    const locals = {
        title: "NodeJS Blogger",
        description: "Simple blog created with NodeJS, Express & MongoDB."
    }

    res.render('index', { locals });
});


router.get('/about',(req, res) => {
    res.render('about');
});



function insertPostData() {
    Post.insertMany([
        {
            title: "Building a Blog",
            body: "This is the body"
        },        
        {
            title: "Go with a Blog",
            body: "This is the body"
        },
        {
            title: "Life of a Blogger",
            body: "This is the body"
        },
        {
            title: "Blogging: My daily works",
            body: "This is the body"
        },
        {
            title: "Don't make mistake in your Blog",
            body: "This is the body"
        },
        {
            title: "Lifestyle: Blog",
            body: "This is the body"
        },
        {
            title: "Journalism with Blog",
            body: "This is the body"
        },
        {
            title: "I want to leave Blog",
            body: "This is the body"
        },
    ])
}

insertPostData();



module.exports = router;
