var express = require('express');
var router = express.Router();
var passwordHash = require('password-hash');
var jsonWebToken = require('jsonwebtoken');

var User = require('../models/user');

// Handles the saving of a new user
router.post('/', function(req, res, next) {
	var user = new User({
		firstName: req.body.firstName,
    	lastName: req.body.lastName,
    	password: passwordHash.generate(req.body.password),
    	email: req.body.email
	});
	user.save(function(err, result) {
		if (err) {
			return res.status(404).json({
				title: 'An error occurred',
				error: err
			});
		}
		res.status(201).json({
			message: 'Saved user',
			obj: result
		});
	});
});

// Handles signin functionality of a user
// If user does not exist or password is incorrect, this post method will handle those errors
router.post('/signin', function(req, res, next) {
	User.findOne({email: req.body.email}, function(err, doc) {
		if (err) {
			return res.status(404).json({
				title: 'An error occurred',
				error: err
			});
		}
		// 'doc' here refers to the user in the database
		if (!doc) {
			return res.status(404).json({
				title: 'No user found',
				error: {message: 'User could not be found'}
			});
		}
		// passwordHash is used here to decrypt the password in the server to verify if the password was correct
		if (!passwordHash.verify(req.body.password, doc.password)) {
			return res.status(404).json({
				title: 'Could not sign you in',
				error: {message: 'Invalid password'}
			});
		}
		var token = jsonWebToken.sign({user: doc}, 'secret', {expiresIn: 7200});
		res.status(200).json({
			message: 'Success',
			token: token,
			userId: doc._id
		});
	});
});

module.exports = router;