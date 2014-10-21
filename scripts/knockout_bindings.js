import ko from 'knockout';

ko.bindingHandlers.foreach_row = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var child = ko.virtualElements.firstChild(element),
			children = [],
			value = valueAccessor();

		while(child) {
			if(child.tagName != undefined)
				children.push(child);
			child = ko.virtualElements.nextSibling(child);
		}

		
	},
	update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

	}
}