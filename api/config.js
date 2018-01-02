module.exports = (() => {
	return {
		host: process.env.HOST || 'mongodb://localhost:27017/jeopardy'
	};
})();