const express = require('express');

const router =  express.Router();

const Post = require('../models/Post');

// GET 
// HOME route
router.get('', async (req, res) => {


    try {

        const locals = {
            title: "NodeJS Blogger",
            description: "Simple blog created with NodeJS, Express & MongoDB."
        }

        let perPage = 5;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort : { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        
        res.render('index', { 
            locals, 
            data,
            current: page,
            nextPage : hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error) {
        console.log(error);
    }

});


// Without Pagination

// router.get('', async (req, res) => {

//     const locals = {
//         title: "NodeJS Blogger",
//         description: "Simple blog created with NodeJS, Express & MongoDB."
//     }

//     try {
//         const data = await Post.find();
        
//         res.render('index', { locals, data });

//     } catch (error) {
//         console.log(error);
//     }

// });



// GET 
// Search :id route
router.post('/search', async (req, res) => {

    try {
        
        const locals = {
            title: "Search",
            description: "Simple blog created with NodeJS, Express & MongoDB."
        }
        
        let searchTerm = req.body.searchTerm;
        // console.log(searchTerm);
        
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
        
        const data = await Post.find({
            $or: [
                { title : {$regex: new RegExp(searchNoSpecialChar, 'i')}},
                { body : {$regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        });

        res.render('search', { 
            data,
            locals,
            currentRoute: '/' 
        });
        // res.send(searchTerm);

    } catch (error) {
        console.log(error);
    }

});



// GET 
// Post :id route
router.get('/post/:id', async (req, res) => {

    try {
        let slug = req.params.id;

        const data = await Post.findById({_id: slug});

        const locals = {
            title: data.title,
            description: "Simple blog created with NodeJS, Express & MongoDB.",
        }

        
        res.render('post', { 
            locals, 
            data, 
            currentRoute: `/post/${slug}`
        });

    } catch (error) {
        console.log(error);
    }

});





router.get('/about',(req, res) => {
    res.render('about',{
        currentRoute: '/about'
    });
});


router.get('/contact',(req, res) => {
    res.render('contact',{
        currentRoute: '/contact'
    });
});



// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "Building a Blog",
//             body: "This is the body"
//         },        
//         {
//             title: "Go with a Blog",
//             body: "This is the body"
//         },
//         {
//             title: "Life of a Blogger",
//             body: "This is the body"
//         },
//         {
//             title: "Blogging: My daily works",
//             body: "This is the body"
//         },
//         {
//             title: "Don't make mistake in your Blog",
//             body: "This is the body"
//         },
//         {
//             title: "Lifestyle: Blog",
//             body: "This is the body"
//         },
//         {
//             title: "Journalism with Blog",
//             body: "This is the body"
//         },
//         {
//             title: "I want to leave Blog",
//             body: "This is the body"
//         },
//     ])
// }

// insertPostData();



module.exports = router;
