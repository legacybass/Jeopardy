define(['knockout'], function ($__0) {
    "use strict";
    if (!$__0 || !$__0.__esModule) $__0 = {
    default:
        $__0
    };
    var ko = $__0.
default;
    ko.bindingHandlers.foreach_row = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var child = ko.virtualElements.firstChild(element),
                children = [],
                value = valueAccessor();
            while (child) {
                if (child.tagName != undefined) children.push(child);
                child = ko.virtualElements.nextSibling(child);
            }
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {}
    };
    return {};
});