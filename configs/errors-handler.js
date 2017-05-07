'use strict';

const errorhandler = require('errorhandler');

module.exports = function(app) {
	/** Error Handler */
	app.use(function(req, res, next) {
	    let err = new Error('Not Found');
	    err.status = 404;
        next(err);
	});
	app.use(errorhandler());
	// if (process.env.ENV === 'development') {
	// 	app.use(errorhandler());
 //        // app.use((err, req, res, next) => {
 //        //     console.log(err);
 //        //     err.string = err.toString();
 //        //     res.send(err);
 //        // });
	// }
	// app.use((err, req, res, next) => {
	// 	console.log(err);
	//     res.status(err.status || 500);
	//     res.send('<h2>Vui lòng thử lại</h1>');
	// });
};