(function boot(global) {

    global.Templatr = global.Templatr || {};

    global.Templatr.HtmlParser = document.createElement("div");

    global.Templatr.bind = function (template, data) {
        global.Templatr.HtmlParser.innerHTML = template;
        var returnValue;

        for (var i = 0, len = global.Templatr.HtmlParser.children.length; i < len; i++) {

            var dataSource = /<%# ([^%>]*) %>/.exec(global.Templatr.HtmlParser.children[i].getAttribute("DataSource"));

            if (global.Templatr.HtmlParser.children[i].tagName == "REPEATER") {
                if (dataSource != null) {
                    returnValue = global.Templatr.bindRepeater(global.Templatr.HtmlParser.children[i], data[dataSource[1]]);
                }
            } else {
                returnValue = global.Templatr.bindElement(global.Templatr.HtmlParser.children[i], data);
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

            //trim - fucking ie8, get bill gates in hyar!
            var propertyName = propertyToBind[1].replace(/^\s+|\s+$/gm, '');

            var targetForReplacement = propertyToBind[0];

            if (data[propertyName]) {
                stringToReplaceIn = stringToReplaceIn.replace(targetForReplacement, data[propertyName]);
            }
        }
        return stringToReplaceIn;
    };

})(window);

//simple XHR request in pure JavaScript
function load(url, callback) {
    var xhr;

    if (typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
    else {
        var versions = ["MSXML2.XmlHttp.5.0",
			 	"MSXML2.XmlHttp.4.0",
			 	"MSXML2.XmlHttp.3.0",
			 	"MSXML2.XmlHttp.2.0",
			 	"Microsoft.XmlHttp"]

        for (var i = 0, len = versions.length; i < len; i++) {
            try {
                xhr = new ActiveXObject(versions[i]);
                break;
            }
            catch (e) { }
        } // end for
    }

    xhr.onreadystatechange = ensureReadiness;

    function ensureReadiness() {
        if (xhr.readyState < 4) {
            return;
        }

        if (xhr.status !== 200) {
            return;
        }

        // all is well	
        if (xhr.readyState === 4) {
            callback(xhr);
        }
    }

    xhr.open('GET', url, true);
    xhr.send('');
}