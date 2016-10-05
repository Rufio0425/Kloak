var express = require('express');
var router = express.Router();
var jsonWebToken = require('jsonwebtoken');

var Message = require('../models/message');
var User = require('../models/user');

router.get('/', function(req, res, next) {
	// 'exec' means don't execute 'find' immediately, this helps with combined queries
	Message.find()
		.populate('user', 'firstName')
		.exec(function(err, docs) {
			if (err) {
				return res.status(404).json({
					title: 'An error occurred',
					error: err
				});
			}
			res.status(200).json({
				message: 'Success',
				obj: docs
			});
		});
});

// Middleware to handle Creating, Updating, or Deleting messages if not logged in
router.use('/', function(req, res, next) {
	jsonWebToken.verify(req.query.token, 'secret', function(err, decoded) {
		if (err) {
			return res.status(401).json({
				title: 'Authentication failed',
				error: err
			});
		}
		next();
	});
});

router.post('/', function(req, res, next) {
	var decoded = jsonWebToken.decode(req.query.token);
	User.findById(decoded.user._id, function(err, doc) {
		if (err) {
			return res.status(404).json({
				title: 'An error occurred',
				error: err
			});
		}
		var message = new Message({
			content: req.body.content,
			user: doc
		});
		message.save(function(err, result) {
			if (err) {
				return res.status(404).json({
					title: 'An error occurred',
					error: err
				});
			}
			doc.messages.push(result);
			doc.save();
			res.status(201).json({
				message: 'Saved message',
				obj: result
			});
		});
	});
});

// patch updates parts of a resource or data on a server
router.patch('/:id', function(req, res, next) {
	var decoded = jsonWebToken.decode(req.query.token);
	Message.findById(req.params.id, function(err, doc) {
		if (err) {
			return res.status(404).json({
				title: 'An error occurred',
				error: err
			});
		}
		if (!doc) {
			return res.status(404).json({
				title: 'No message found',
				error: {message: 'Message could not be found'}
			});
		}
		if (doc.user != decoded.user._id) {
			return res.status(401).json({
				title: 'Not Authorized',
				error: {message: 'Message created by other user'}
			});
		}
		doc.content = req.body.content;
		// NOTE: Mongoose knows here not to create a new message on .save()
		doc.save(function(err, result) {
			if (err) {
				return res.status(404).json({
					title: 'An error occurred',
					error: err
				});
			}
			res.status(200).json({
				message: 'Success',
				obj: result
			});
		});
	});
});

router.delete('/:id', function(req, res, next) {
	var decoded = jsonWebToken.decode(req.query.token);
	Message.findById(req.params.id, function(err, doc) {
		if (err) {
			return res.status(404).json({
				title: 'An error occurred',
				error: err
			});
		}
		if (!doc) {
			return res.status(404).json({
				title: 'No message found',
				error: {message: 'Message could not be found'}
			});
		}
		if (doc.user != decoded.user._id) {
			return res.status(401).json({
				title: 'Not Authorized',
				error: {message: 'Message created by other user'}
			});
		}
		doc.remove(function(err, result) {
			if (err) {
				return res.status(404).json({
					title: 'An error occurred',
					error: err
				});
			}
			res.status(200).json({
				message: 'Success',
				obj: result
			});
		});
	});
});

module.exports = router;