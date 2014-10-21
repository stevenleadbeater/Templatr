(function boot(global) {

    global.Templatr = global.Templatr || {};

    global.Templatr.bind = function (template, data) {
        var HtmlParser = document.createElement("div");
        HtmlParser.innerHTML = template;
        var returnValue;

        for (var i = 0, len = HtmlParser.children.length; i < len; i++) {

            if (HtmlParser.children[i].tagName == "REPEATER") {
                returnValue = global.Templatr.bindRepeater(HtmlParser.children[i], data);
            } else {
                returnValue = global.Templatr.bindElement(HtmlParser.children[i], data);
            }
        }
        return returnValue;
    };

    global.Templatr.bindRepeater = function (repeater, data) {

        var currentNode;
        var returnValue = document.createElement("div");
        //items to bind
        for (var i = 0, len = data.length; i < len; i++) {

            for (var j = 0, lenJ = repeater.children.length; j < lenJ; j++) {
                returnValue.appendChild(global.Templatr.bindElement(repeater.children[j].cloneNode(true), data[i]));
            }
        }
        return returnValue;
    };

    global.Templatr.bindElement = function (element, data) {

        var len = element.children.length;

        for (var i = 0, attribLength = element.attributes.length; i < attribLength; i++) {
            var attrib = element.attributes[i];

            attrib.value = global.Templatr.bindingReplacement(attrib.value, data);

        }
        if (len == 0) {
            element.innerText = global.Templatr.bindingReplacement(element.innerText, data);
        }

        if (len > 0) {
            for (var i = 0; i < len; i++) {

                if (element.children[i].tagName == "REPEATER") {

                    var dataSource = /<%# ([^%>]*) %>/.exec(element.children[i].getAttribute("DataSource"));

                    if (dataSource != null) {

                        var repeaterResult = global.Templatr.bindRepeater(element.children[i], data[dataSource[1]]);
                        element.removeChild(element.children[i]);

                        for (var j = 0, lenJ = repeaterResult.children.length; j < lenJ; j++) {
                            element.appendChild(repeaterResult.children[j].cloneNode(true));
                        }
                    }
                } else {
                    global.Templatr.bindElement(element.children[i], data);
                }
            }
        }
        return element;
    };

    global.Templatr.bindingReplacement = function (stringToReplaceIn, data) {

        var propertyToBind;
        var patt = /<%#([^%>]*)%>/;

        while ((propertyToBind = patt.exec(stringToReplaceIn)) !== null) {


            if (propertyToBind == null) {
                break;
            }

            //trim - ie8 compatible
            var propertyName = propertyToBind[1].replace(/^\s+|\s+$/gm, '');

            var targetForReplacement = propertyToBind[0];

            if (data[propertyName]) {
                stringToReplaceIn = stringToReplaceIn.replace(targetForReplacement, data[propertyName]);
            } else {
                throw new Error('Cannot bind property ' + propertyName);
            }
        }
        return stringToReplaceIn;
    };

})(window);