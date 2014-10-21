export default function Bootstrap (router) {
	router.get('/', function (req, res, next) {
		res.render('Home/Index', { });
	});

	router.get('/Contestant', function (req, res, next) {
		res.render('/Contestant', { });
	})
}