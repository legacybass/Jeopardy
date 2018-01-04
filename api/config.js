module.exports = (() => {
	return {
		host: process.env.HOST || 'mongodb://localhost/jeopardy'
	};
})();