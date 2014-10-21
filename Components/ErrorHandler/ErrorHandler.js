import ErrorHandler from 'errorhandler.min';
import ko from 'knockout';

var errorHandler = new ErrorHandler();

ko.components.register('error-handler', {
	viewModel: { instance: errorHandler },
	template: { require: 'text!Views/Templates/Components/ErrorHandler.html!strip' }
});

export default function () {
	return errorHandler;
}
