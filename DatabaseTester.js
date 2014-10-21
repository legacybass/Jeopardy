var mongoose = require('mongoose'),
	CategorySchema = require('./Schemas/Category'),
	fs = require('fs');

mongoose.connect('mongodb://localhost/jeopardy-dev');
mongoose.connection.on('open', function() {

	var model = mongoose.model('Category', CategorySchema);

	model.find({ 'User': '543c57ea8523dc98517f4f77' })
	// model.find({ _id: '544028a35c075d586beaef05'})
		.exec(function (err, results) {
			// var stream = fs.createWriteStream("results.txt", { flags: 'w+' });

			if(err)
			{
				// stream.write("Error occurred.\n");
				// stream.end(err);
				console.log("Error occured");
				console.log(err);
			}
			else {
				// stream.write("Results: ");
				// stream.end(results);
				console.log("Results:", results);
			}

		});

})
