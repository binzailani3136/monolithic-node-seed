var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Promise = require('bluebird');
Promise.promisifyAll(bcrypt);
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new mongoose.Schema({
	username: { type: String, unique: true, lowercase: true },
	email: { type: String, unique: true, lowercase: true },
	password: { type: String, required: true },
});

userSchema.pre('save', function (next) {
	bcrypt.hash(this.password, 10, function (err, hash) {
		/* istanbul ignore if */
		if (err) throw new Error(err);
		else {
			this.password = hash;
			next();
		};
	}.bind(this));
});

userSchema.plugin(uniqueValidator);

userSchema.methods.validPassword = function (password) {
	return bcrypt
	.compareAsync(password, this.password)
	.then((result, err) => {
		/* istanbul ignore if */
		if (err) throw new Error(err);
		return result;
	});
};

module.exports = mongoose.model('User', userSchema);
