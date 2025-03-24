const express = require('express');

const router =  express.Router();


const Post = require('../models/Post');

const adminLayout = '../views/layouts/admin';


// GET 
// Admin : Login route
router.get('/admin', async (req, res) => {

    try {
        const locals = {
            title: "Admin",
            description: "Simple blog created with NodeJS, Express & MongoDB."
        }
        
        res.render('admin/index', {locals, layout: adminLayout});
    } catch (error) {
        console.log(error);
    }

});



// POST 
// Admin : Check Login route
router.post('/admin', async (req, res) => {

    try {
        const { username, password } = req.body;
        console.log(req.body);

        res.redirect('/admin');
        
    } catch (error) {
        console.log(error);
    }

});



module.exports = router;