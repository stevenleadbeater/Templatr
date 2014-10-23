(function boot(global) {

    global.Templatr = global.Templatr || {};

    global.Templatr.bindings = {};

    global.Templatr.currentElementId = 0;

    global.Templatr.Model;

    global.Templatr.bind = function (template, data) {
        global.Templatr.Model = data;
        var HtmlParser = document.createElement("div");
        HtmlParser.innerHTML = template;
        var returnValue;

        for (var i = 0, len = HtmlParser.children.length; i < len; i++) {

            if (HtmlParser.children[i].tagName == "REPEATER") {
                returnValue = global.Templatr.bindRepeater(HtmlParser.children[i], data, "");
            } else {
                returnValue = global.Templatr.bindElement(HtmlParser.children[i], data, "");
            }
        }
        console.log(global.Templatr.bindings);
        return returnValue;
    };

    global.Templatr.bindRepeater = function (repeater, data, dataAccessor) {

        var currentNode;
        var returnValue = document.createElement("div");
        var len = data.length;


        var elementId = "templatr" + global.Templatr.currentElementId;

        global.Templatr.currentElementId++;

        var att = document.createAttribute("id");
        att.value = elementId;
        returnValue.setAttributeNode(att);

        var bindingLog = {
            elementId: elementId,
            dataAccessor: dataAccessor,
            type: "repeater",
            children: len,
            repeater: repeater
        }

        global.Templatr.bindings[dataAccessor] = bindingLog;

        //items to bind
        if (dataAccessor != "") {
            dataAccessor += "."
        }
        for (var i = 0; i < len; i++) {

            for (var j = 0, lenJ = repeater.children.length; j < lenJ; j++) {
                returnValue.appendChild(global.Templatr.bindElement(repeater.children[j].cloneNode(true), data[i], dataAccessor + i.toString()));
            }
        }
        return returnValue;
    };

    global.Templatr.bindElement = function (element, data, dataAccessor) {

        var len = element.children.length;
        var didBind = false;

        for (var i = 0, attribLength = element.attributes.length; i < attribLength; i++) {
            var attrib = element.attributes[i];

            attrib.value = global.Templatr.bindingReplacement(attrib.value, data, dataAccessor, attrib.name);
            didBind = true;
        }
        if (len == 0) {
            element.innerText = global.Templatr.bindingReplacement(element.innerText, data, dataAccessor, "innerText");
            didBind = true;
        }

        if (didBind) {

            var att = document.createAttribute("id");
            var elementId = "templatr" + global.Templatr.currentElementId;
            att.value = elementId;
            element.setAttributeNode(att);

            var bindingLog = {
                elementId: elementId,
                dataAccessor: dataAccessor,
                type: "element",
                element: element
            }

            global.Templatr.bindings[dataAccessor] = global.Templatr.bindings[dataAccessor] || [];
            global.Templatr.bindings[dataAccessor].push(bindingLog);

            global.Templatr.currentElementId++;
        }

        if (len > 0) {

            for (var i = 0; i < len; i++) {

                if (element.children[i].tagName == "REPEATER") {

                    var dataSource = /<%# ([^%>]*) %>/.exec(element.children[i].getAttribute("DataSource"));

                    if (dataSource != null) {

                        var repeaterResult = global.Templatr.bindRepeater(element.children[i], data[dataSource[1]], dataAccessor + "." + dataSource[1]);
                        element.removeChild(element.children[i]);

                        element.appendChild(repeaterResult);

                        /*for (var j = 0, lenJ = repeaterResult.children.length; j < lenJ; j++) {
                        element.appendChild(repeaterResult.children[j].cloneNode(true));
                        }*/
                    }
                } else {
                    global.Templatr.bindElement(element.children[i], data, dataAccessor);
                }
            }
        }
        return element;
    };

    global.Templatr.bindingReplacement = function (stringToReplaceIn, data, dataAccessor, replacementType) {

        var propertyToBind;
        var patt = /<%#([^%>]*)%>/;
        var replacements = [];

        while ((propertyToBind = patt.exec(stringToReplaceIn)) !== null) {


            if (propertyToBind == null) {
                break;
            }

            //trim - ie8 compatible
            var propertyName = propertyToBind[1].replace(/^\s+|\s+$/gm, '');

            var targetForReplacement = propertyToBind[0];

            if (data[propertyName]) {
                stringToReplaceIn = stringToReplaceIn.replace(targetForReplacement, data[propertyName]);
                var elementId = global.Templatr.currentElementId;

                var bindingLog = {
                    elementId: "templatr" + elementId,
                    dataAccessor: dataAccessor + "." + propertyName,
                    type: "bindingReplacement",
                    oldValue: targetForReplacement,
                    newValue: data[propertyName],
                    replacementType: replacementType
                }

                global.Templatr.bindings[dataAccessor + "." + propertyName] = bindingLog;

            } else {
                throw new Error('Cannot bind property ' + propertyName);
            }
        }
        return stringToReplaceIn;
    };


    global.Templatr.addToRepeater = function (repeater, data, dataAccessor) {

        var currentNode;
        var returnValue = document.createElement("div");

        var elementId = "templatr" + global.Templatr.currentElementId;

        global.Templatr.currentElementId++;

        var att = document.createAttribute("id");
        att.value = elementId;
        returnValue.setAttributeNode(att);

        for (var j = 0, lenJ = repeater.children.length; j < lenJ; j++) {

            var element = global.Templatr.bindElement(repeater.children[j].cloneNode(true), data, dataAccessor);

            returnValue.appendChild(element);
        }

        return returnValue;
    };

    
    global.Templatr.addToTopLevelRepeater = function (repeater, data, dataAccessor) {

        var currentNode;
        var returnValue = document.createDocumentFragment();

        for (var j = 0, lenJ = repeater.children.length; j < lenJ; j++) {

            var element = global.Templatr.bindElement(repeater.children[j].cloneNode(true), data, dataAccessor);

            returnValue.appendChild(element);
        }

        return returnValue;
    };


    /**
    * @private Adds all the properties from the obj2 parameter to the obj1 parameter and returns obj1
    * @param {string} [obj1] passed by reference, the object which will be populated with the new properties
    * @param {string} [targetValue] The object which holds all the properties which are to be merged
    */
    global.Templatr.updateDataModel = function (newDataModel) {

        //Perform top level removals
        while (global.Templatr.Model.length > newDataModel.length) {

            for (var i = 0, len = Templatr.bindings[global.Templatr.Model.length - 1].length; i < len; i++) {
                var topLevelBinding = Templatr.bindings[global.Templatr.Model.length - 1][i];
                var element = topLevelBinding.element;
                var targetAccessor = topLevelBinding.dataAccessor;

                element.parentElement.removeChild(element);

            }
            
            delete Templatr.bindings[targetAccessor];
                
            for (var prop in Templatr.bindings) {
                if (Templatr.bindings.hasOwnProperty(prop) && prop.indexOf(targetAccessor) != -1) {
                    delete Templatr.bindings[prop];
                }
            }
            
            global.Templatr.Model.splice(-1, 1);

            //break;
        }

        //iterate over all the properties in the object which is being consumed
        for (var p in newDataModel) {
            // Property in destination object set; update its value.
            if (newDataModel.hasOwnProperty(p) && typeof global.Templatr.Model[p] !== "undefined") {
                global.Templatr._mergeRecursive(newDataModel[p], global.Templatr.Model[p], p);

            } else {
                //We don't have that level in the heirarchy so add it
                global.Templatr.Model[p] = newDataModel[p];
                var binding = global.Templatr.bindings[""];
                document.getElementById(binding.elementId).appendChild(global.Templatr.addToTopLevelRepeater(binding.repeater, newDataModel[p], p));
            }
        }
    };

    global.Templatr._mergeRecursive = function (newDataModel, updateTarget, dataAccessor) {

        if (Object.prototype.toString.call(newDataModel) === '[object Array]' && Object.prototype.toString.call(updateTarget) === '[object Array]') {
            //Perform removals
            while (updateTarget.length > newDataModel.length) {

                for (var i = 0, len = Templatr.bindings[dataAccessor + "." + (updateTarget.length - 1)].length; i < len; i++) {

                    var element = Templatr.bindings[dataAccessor + "." + (updateTarget.length - 1)][i].element;

                    element.parentElement.removeChild(element);

                }
                var targetAccessor = dataAccessor + "." + (updateTarget.length - 1);
                delete Templatr.bindings[targetAccessor];
                updateTarget.splice(-1, 1)
                for (var prop in Templatr.bindings) {
                    if (Templatr.bindings.hasOwnProperty(prop) && prop.indexOf(targetAccessor) != -1) {
                        delete Templatr.bindings[prop];
                    }
                }
                //break;
            }
        }

        //iterate over all the properties in the object which is being consumed
        for (var p in newDataModel) {
            // Property in destination object set; update its value.
            if (newDataModel.hasOwnProperty(p) && typeof updateTarget[p] !== "undefined" && typeof updateTarget[p] !== "string") {
                global.Templatr._mergeRecursive(newDataModel[p], updateTarget[p], dataAccessor + "." + p);

            } else {
                //We don't have that level in the heirarchy so add it
                updateTarget[p] = newDataModel[p];
                var binding = global.Templatr.bindings[dataAccessor + "." + p];
                if (binding && binding.type == "bindingReplacement") {
                    var elem = document.getElementById(binding.elementId);

                    if (binding.replacementType == "innerText" && binding.newValue != newDataModel[p]) {
                        elem.innerText = elem.innerText.replace(binding.newValue, newDataModel[p]);
                    } else if (binding.newValue != newDataModel[p]) {
                        elem.attributes[binding.replacementType].value = elem.attributes[binding.replacementType].value.replace(binding.newValue, newDataModel[p]);
                    }
                } else {
                    var binding = global.Templatr.bindings[dataAccessor];
                    document.getElementById(binding.elementId).appendChild(global.Templatr.addToRepeater(binding.repeater, newDataModel[p], dataAccessor + "." + p));
                }
            }
        }
    }
})(window);