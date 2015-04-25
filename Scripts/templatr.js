function Templatr(namespace) {

    this.namespace = namespace;
    /*This object will hold a list of all the bindings made. The namespace of the data used 
    for binding (using array indexes as namespaces too) is the key under which each binding reference 
    is saved.
    
    Repeaters create 2 seperate entries:
    1. an array of each of the elements created under the index 
    2. an object specifying:
    i. the number of children
    ii. the container id
    iii. dataAccessor (fully namespaced index using array indexes as namespaces too)
    iv. the repeater element used for the binding
    v. type property which is set to "repeater"

    Elements create a single entry as an object with properties:
    1. dataAccessor (fully namespaced index using array indexes as namespaces too)
    2. element used for the binding (from template)
    3. elementId of the target which was added to the DOM
    4. type property which is set to "element"
    */
    this.bindings = {};

    /*Each element added to the DOM by templatr is assigned an ID in the format: 
    this.namespace + Templatr.currentElementId
    Templatr.currentElementId is then incremented
    */
    this.currentElementId = 0;

    /*
    This holds a reference to the data model as it evolves. Each time a new model is passed
    the data is merged in to Templatr.Model creating new elements as new data is encountered
    This is not diff based currently. A full model must be passed.
    */
    this.Model = {};

    /*
    The list of views in this template
    */

    this.views = {};

    /*
    This is the regex pattern used to indentify the binding statements. Change at will, 
    the start tag is <%#, the end tag is %> replace those 2 below with whatever you please.
    eg. /{{([^%>]*)}}/ for mustache style statements.
    */
    this.Pattern = /<%#([^%>]*)%>/;

    this.parentOfTopLevel = null;

};


/**
* @public Returns a div containing the result of applying the data parameter to the template
* @param {string} [template] HTML markup containing repeater tags and data binding statements
* @param {string} [data] JSON object containing the properties and values which correspond with the template
*/
Templatr.prototype.bind = function (template, data) {

    if (Object.prototype.toString.call(data) === "[object Object]") {

        this.Model = {};
    } else if (Object.prototype.toString.call(data) === "[object Array]") {

        this.Model = [];
    } else {
        throw "error: cannot clone non array / object";
    }

    //We are creating a view for the first time so store the data
    this._cloneObject(this.Model, data);

    return this.bindTemplate(template, data, "");
};

Templatr.prototype.bindTemplate = function (template, data, dataAccessor) {


    //Templates are passed as strings to support AJAX responses. Parse to DOM objects
    var HtmlParser = document.createElement("div");
    HtmlParser.innerHTML = this.views[template];

    //Container to hold DOM content to be returned
    var returnValue = document.createDocumentFragment();

    //For each root level element in the template
    for (var i = 0, len = HtmlParser.children.length; i < len; i++) {

        var child = HtmlParser.children[i];
        if (child.tagName == "REPEATER" || child.tagName == "SELECT" || child.tagName == "UL" || child.tagName == "TR" || child.tagName == "TBODY") {
            //bind repeater
            returnValue.appendChild(this.bindRepeater(child, data, dataAccessor));
        } else {
            //bind element
            returnValue.appendChild(this.bindElement(child, data, dataAccessor));
        }
    }
    //Document fragment with all the top level elements bound from the template
    return returnValue;
};

Templatr.prototype.addView = function (name, view) {

    if (typeof this.views[name] !== "undefined") {
        throw name + " already exists";
    }

    this.views[name] = view;
};

Templatr.prototype.copyAttributes = function (elementTo, elementFrom) {
    for (var i = 0, len = elementFrom.attributes.length; i < len; i++) {

        if (elementFrom.attributes[i].name.toLowerCase() !== "datasource") {
            elementTo.setAttribute(elementFrom.attributes[i].name, elementFrom.attributes[i].value);
        }
    }
};

Templatr.prototype.bindRepeater = function (repeater, data, dataAccessor) {

    //Repeater contents as a whole are rendered inside a container
    var returnValue,
        makeLog = false;

    switch (repeater.tagName) {
        case "SELECT":
        case "select":
            returnValue = document.createElement("select");
            this.copyAttributes(returnValue, repeater);
            makeLog = true;
            break;
        case "UL":
        case "ul":
            returnValue = document.createElement("ul");
            this.copyAttributes(returnValue, repeater);
            makeLog = true;
            break;
        case "TR":
        case "tr":
            returnValue = document.createElement("tr");
            this.copyAttributes(returnValue, repeater);
            makeLog = true;
            break;
        case "TBODY":
        case "tbody":
            returnValue = document.createElement("tbody");
            this.copyAttributes(returnValue, repeater);
            makeLog = true;
            break;
        case "REPEATER":
        case "repeater":
            returnValue = document.createElement("div");
            this.copyAttributes(returnValue, repeater);
            makeLog = true;
            break;
        default:
            returnValue = document.createDocumentFragment();
            break;
    }

    //Number of iterations in the data repeater will go through
    var len = data.length;

    //if (makeLog) {
    //Set the id on the repeater container
    if (repeater.id === "" || /^[0-9.]+/.exec(dataAccessor) !== null) {
        returnValue = this.setElementId(returnValue);
    } else {
        returnValue.id = repeater.id;
    }

    //Create the binding reference object entry to save in this.bindings
    var bindingLog = this.createBindingReference(returnValue.id, "repeater", dataAccessor);
    bindingLog["len"] = len;
    bindingLog["repeater"] = repeater;
    bindingLog["element"] = returnValue;

    //Save the binding reference in the repeaters array of references
    this.bindings[dataAccessor] = this.bindings[dataAccessor] || [];
    this.bindings[dataAccessor].push(bindingLog);
    //}
    //The top level repeater has no starting namespace this.bindings[""] to access it's bindings
    if (dataAccessor != "") {
        dataAccessor += "."
    }

    //For each member of the model
    for (var i = 0; i < len; i++) {

        //For each child of the repeater
        var children = repeater.children;
        for (var j = 0, lenJ = children.length; j < lenJ; j++) {

            //Bind the child to the model
            if (children[j].tagName == "REPEATER" || children[j].tagName == "SELECT" || children[j].tagName == "UL" || children[j].tagName == "TR" || children[j].tagName == "TBODY") {

                //This is the property name of an array
                var dataSource = this.Pattern.exec(children[j].getAttribute("DataSource"));

                if (dataSource != null) {

                    //Repeater is bound
                    dataSource = dataSource[1].replace(/^\s+|\s+$/gm, "");
                    returnValue.appendChild(this.bindRepeater(children[j], data[i][dataSource], dataAccessor + i.toString() + "." + dataSource));
                } else {
                    //Repeater is bound
                    returnValue.appendChild(this.bindRepeater(children[j], data[i], dataAccessor + i.toString()));
                }
            } else {
                //bind element
                returnValue.appendChild(this.bindElement(children[j].cloneNode(true), data[i], dataAccessor + i.toString()));
            }


            //returnValue.appendChild(this.bindElement(children[j].cloneNode(true), data[i], dataAccessor + i.toString()));
        }
    }
    return returnValue;
};

Templatr.prototype.bindElement = function (element, data, dataAccessor) {

    //Account for containers
    var len = element.children.length;

    //Track whether anything was bound (no need for a binding reference if we miss)
    var didBind = false;

    /*Look through each attribute on the element and see if there are binding statements
    in the value*/
    var attributes = element.attributes;
    for (var i = 0, attribLength = attributes.length; i < attribLength; i++) {

        var attrib = attributes[i];
        var propertyToBind = this.Pattern.exec(attrib.value);

        // Check for binding statements and process as applicable
        if (propertyToBind != null) {

            var viewIdAttribute = element.getAttribute("data-templatr-view-id");
            if (typeof viewIdAttribute !== "undefined"
                &&
                attrib.name === "datasource") {

                /*trim - ie8 compatible allows <%# prop_name %> and <%#prop_name%> to be used interchangably and mixed
                index 1 of the regex exec return is what is found between the '<%#' and '%>'*/
                var propertyName = propertyToBind[1].replace(/^\s+|\s+$/gm, "");

                element.appendChild(this.bindTemplate(viewIdAttribute, data[propertyName], dataAccessor + "." + propertyName));
            } else {
                var temp = attrib.value;
                attrib.value = this.bindingReplacement(attrib.value, data, dataAccessor, attrib.name);
                didBind = true;

                //ie fix for select options display text
                if (attrib.name === "value" && element.childNodes.length === 0) {
                    element.appendChild(this.bindingReplacementNodeValue(temp, data, dataAccessor, "innerText"));
                }
            }
        }
    }
    if (len == 0) {

        // Check for binding statements and process as applicable            
        var textNode = element.childNodes[0];
        if (textNode && this.Pattern.exec(textNode.nodeValue) != null) {
            var nodeValue = textNode.nodeValue;
            element.removeChild(element.childNodes[0]);
            element.appendChild(this.bindingReplacementNodeValue(nodeValue, data, dataAccessor, "innerText"));
            didBind = true;
            //The else condition is a hack to make IE work (it strips the default binding pattern from the text content / node value and every other property besides text)
        } else if (textNode && typeof textNode.text !== "undefined" && this.Pattern.exec(textNode.text) != null) {
            var nodeValue = textNode.text;
            element.removeChild(element.childNodes[0]);
            element.appendChild(this.bindingReplacementNodeValue(nodeValue, data, dataAccessor, "innerText"));
            didBind = true;
        }
    }

    //if (didBind) {

    //Set the id on the element
    element = this.setElementId(element);

    //Create the binding reference to save in the repeaters array of references
    var bindingLog = this.createBindingReference(element.id, "element", dataAccessor);
    bindingLog["element"] = element;

    //Save the binding reference in the repeaters array of references
    this.bindings[dataAccessor] = this.bindings[dataAccessor] || [];
    this.bindings[dataAccessor].push(bindingLog);

    //}

    //If this is a container (has child nodes)
    if (len > 0) {

        //For each child node
        for (var i = 0; i < len; i++) {

            //Sub repeater support
            var child = element.children[i];
            if (child.tagName == "REPEATER" || child.tagName == "SELECT" || child.tagName == "UL" || child.tagName == "TR" || child.tagName == "TBODY") {

                //This is the property name of an array
                var dataSource = this.Pattern.exec(child.getAttribute("DataSource"));

                if (dataSource != null) {

                    //Repeater is bound
                    dataSource = dataSource[1].replace(/^\s+|\s+$/gm, "");
                    var repeaterResult = this.bindRepeater(child, data[dataSource], dataAccessor + "." + dataSource);

                    //Swap the template element for the bound element
                    element.removeChild(child);
                    element.appendChild(repeaterResult);
                } else if (Object.prototype.toString.call(data) === "[object Array]") {
                    var topLevelRepeaterResult = this.bindRepeater(child, data, dataAccessor);

                    //Swap the template element for the bound element
                    element.replaceChild(topLevelRepeaterResult, child);
                    return element;
                }
            } else {
                //This is just a nested element, call my self recursively passing the child element to be bound
                this.bindElement(child, data, dataAccessor);
            }
        }
    }
    return element;
};

Templatr.prototype.bindingReplacement = function (stringToReplaceIn, data, dataAccessor, replacementType) {

    var propertyToBind;
    var replacements = [];

    /*stringToReplaceIn is iterated over using regex to find the first remaining match for data binding statements
    in each iteration*/
    while ((propertyToBind = this.Pattern.exec(stringToReplaceIn)) !== null) {

        //Everything has been bound so jump out
        if (propertyToBind == null) {
            break;
        }

        /*trim - ie8 compatible allows <%# prop_name %> and <%#prop_name%> to be used interchangably and mixed
        index 1 of the regex exec return is what is found between the '<%#' and '%>'*/
        var propertyName = propertyToBind[1].replace(/^\s+|\s+$/gm, "");

        /*We have to replace the full databinding statement of '<%#', '%>' and whatever is inbetween. This
        is index 0 of the result of the regex exec*/
        var targetForReplacement = propertyToBind[0];

        //We can't bind to a property that isn't at the right level in the data. Check and error on fail
        var sourceData = data[propertyName].toString();
        if (sourceData) {

            stringToReplaceIn = stringToReplaceIn.replace(targetForReplacement, sourceData);

            var bindingLog = this.createBindingReference(this.namespace + this.currentElementId, "bindingReplacement", dataAccessor + "." + propertyName);
            bindingLog["oldValue"] = targetForReplacement;
            bindingLog["boundValue"] = sourceData;
            bindingLog["replacementType"] = replacementType;

            this.bindings[dataAccessor + "." + propertyName] = bindingLog;

        } else {
            //Log as much trace information as possible
            //console.log("Throwing error because property '" + propertyName + "' was not found in data: ");
            //console.log(data);
            //console.log("String to replace in:");
            //console.log(stringToReplaceIn);
            //console.log("Target for replacement:");
            //console.log(targetForReplacement);

            //Throw an error
            //throw new Error('Cannot bind property ' + propertyName);
            stringToReplaceIn = "";

            var bindingLog = this.createBindingReference(this.namespace + this.currentElementId, "bindingReplacement", dataAccessor + "." + propertyName);
            bindingLog["oldValue"] = targetForReplacement;
            bindingLog["boundValue"] = "";
            bindingLog["replacementType"] = replacementType;

            this.bindings[dataAccessor + "." + propertyName] = bindingLog;
        }
    }
    return stringToReplaceIn;
};

Templatr.prototype.bindingReplacementNodeValue = function (stringToReplaceIn, data, dataAccessor, replacementType) {

    var returnValue = document.createDocumentFragment();
    var propertyToBind;
    var replacements = [];

    /*stringToReplaceIn is iterated over using regex to find the first remaining match for data binding statements
    in each iteration*/
    while ((propertyToBind = this.Pattern.exec(stringToReplaceIn)) !== null) {

        //Everything has been bound so jump out
        if (propertyToBind == null) {
            break;
        }

        /*trim - ie8 compatible allows <%# prop_name %> and <%#prop_name%> to be used interchangably and mixed
        index 1 of the regex exec return is what is found between the '<%#' and '%>'*/
        var propertyName = propertyToBind[1].replace(/^\s+|\s+$/gm, "");

        /*We have to replace the full databinding statement of '<%#', '%>' and whatever is inbetween. This
        is index 0 of the result of the regex exec*/
        var targetForReplacement = propertyToBind[0];

        //We can't bind to a property that isn't at the right level in the data. Check and error on fail
        var sourceData = data[propertyName];
        if (typeof sourceData !== "undefined") {

            //Account for line breaks
            if (typeof sourceData === "string" && sourceData.indexOf("<br") != -1) {
                var paragraphs = sourceData.split(/<br([^%>]*)\/>/),
                    length = paragraphs.length;
                for (var index = 0; index < length; index++) {

                    //account for middle value from regex split
                    if (paragraphs[index] == " ") {
                        continue;
                    }

                    returnValue.appendChild(document.createTextNode(paragraphs[index]));
                    if (index < (length - 1)) {
                        returnValue.appendChild(document.createElement("br"));
                    }
                }
                //TODO: address this hack to stop the loop
                stringToReplaceIn = "";
            } else {
                stringToReplaceIn = stringToReplaceIn.replace(targetForReplacement, sourceData);
                returnValue.appendChild(document.createTextNode(stringToReplaceIn));
            }

            var bindingLog = this.createBindingReference(this.namespace + this.currentElementId, "bindingReplacement", dataAccessor + "." + propertyName);
            bindingLog["oldValue"] = targetForReplacement;
            bindingLog["boundValue"] = sourceData;
            bindingLog["replacementType"] = replacementType;

            this.bindings[dataAccessor + "." + propertyName] = bindingLog;

        } else {
            //Log as much trace information as possible
            //console.log("Throwing error because property '" + propertyName + "' was not found in data: ");
            //console.log(data);
            //console.log("String to replace in:");
            //console.log(stringToReplaceIn);
            //console.log("Target for replacement:");
            //console.log(targetForReplacement);

            //Throw an error
            //throw new Error('Cannot bind property ' + propertyName);
            stringToReplaceIn = "";

            var bindingLog = this.createBindingReference(this.namespace + this.currentElementId, "bindingReplacement", dataAccessor + "." + propertyName);
            bindingLog["oldValue"] = targetForReplacement;
            bindingLog["boundValue"] = "";
            bindingLog["replacementType"] = replacementType;

            this.bindings[dataAccessor + "." + propertyName] = bindingLog;
        }
    }
    return returnValue;
};

Templatr.prototype.setElementId = function (element) {

    //Centrally manage the assignment of ids to elements        
    var att = document.createAttribute("id");
    att.value = this.namespace + this.currentElementId;
    element.setAttributeNode(att);

    //increment after assignment
    this.currentElementId++;

    return element;
}

Templatr.prototype.createBindingReference = function (elementId, type, dataAccessor) {

    //Base information held in every binding reference
    var bindingLog = {
        elementId: elementId,
        dataAccessor: dataAccessor,
        type: type
    }

    return bindingLog;
}

Templatr.prototype.addToRepeater = function (repeater, data, dataAccessor) {

    /*Adding to pre-existing repeaters does not require the top level binding references
    to be added. The additional binding reference objects pushed to the arrays are done 
    within bindElement*/

    //Repeater child contents as a whole are rendered inside a container
    var returnValue = document.createDocumentFragment();

    //For each HTML element inside the repeater
    var children = repeater.children;
    for (var j = 0, lenJ = children.length; j < lenJ; j++) {

        var element;
        if (children[j].tagName === "REPEATER" || children[j].tagName === "SELECT" || children[j].tagName === "UL" || children[j].tagName === "TR" || children[j].tagName === "TBODY") {

            element = this.bindRepeater(children[j].cloneNode(true), data, dataAccessor);
        } else {
            //Bind the HTML element to the data
            element = this.bindElement(children[j].cloneNode(true), data, dataAccessor);
        }
        //Append the child to the container
        returnValue.appendChild(element);
    }

    return returnValue;
};

Templatr.prototype.addToTopLevelRepeater = function (repeater, data, dataAccessor) {

    /*Adding to pre-existing repeaters does not require the top level binding references
    to be added. The additional binding reference objects pushed to the arrays are done 
    within bindElement*/

    //The container exists already, make a document fragment to append instead (saves iterating the children again)
    var returnValue = document.createDocumentFragment();

    //For each HTML element inside the repeater
    var children = repeater.children;
    for (var j = 0, lenJ = children.length; j < lenJ; j++) {

        //Bind the HTML element to the data
        var element = this.bindElement(children[j].cloneNode(true), data, dataAccessor);

        //Append the child to the container
        returnValue.appendChild(element);
    }

    return returnValue;
};

Templatr.prototype.updateDataModel = function (newDataModelParameter) {

    /*This function expects the entire data model to be passed. It will re-use as much of what is in the DOM
    already as possible, synchronize the bindings and model and update the UI*/

    //While there is less data in the new model that the old one
    var newDataModel;
    if (Object.prototype.toString.call(newDataModelParameter) === "[object Object]") {

        newDataModel = {};
    } else if (Object.prototype.toString.call(newDataModelParameter) === "[object Array]") {

        newDataModel = [];
    } else {
        throw "error: cannot clone non array / object";
    }

    this._cloneObject(newDataModel, newDataModelParameter);

    while (this.Model.length > newDataModel.length) {

        /*Perform top level removals - this.bindings[this.Model.length - 1] is the last array of repeater contents
        After the repeater and all the children are removed this binding entry is deleted*/
        //Rmove the UI element
        var topLevelBinding = this.bindings[this.Model.length - 1][0];
        var element = topLevelBinding.element;
        var targetAccessor = topLevelBinding.dataAccessor;

        element.parentElement.removeChild(element);

        //Remove the bindings in the repeaters array
        delete this.bindings[targetAccessor];

        //Remove the bindings for the objects in the repeater
        for (var prop in this.bindings) {
            if (this.bindings.hasOwnProperty(prop) && prop.indexOf(targetAccessor) != -1) {
                delete this.bindings[prop];
            }
        }

        //Remove from the internal model
        this.Model.splice(-1, 1);

    }

    //iterate over all the properties in the new model
    for (var p in newDataModel) {

        // That node exists, this is an update or a repeater. Off load to merge recursive
        if (newDataModel.hasOwnProperty(p) && typeof this.Model[p] !== "undefined") {
            this._mergeRecursive(newDataModel[p], this.Model[p], p);

        } else {

            this.Model[p] = newDataModel[p];

            var binding = this.bindings[""];

            if (Object.prototype.toString.call(binding) === "[object Array]") {
                //We need to add to our repeater

                var repElem;
                for (var index = 0; index < binding.length; index++) {
                    if (typeof binding[index].repeater !== "undefined") {
                        repElem = document.getElementById(binding[index].elementId);
                        repElem.appendChild(this.addToTopLevelRepeater(binding[index].repeater, newDataModel[p], p));
                        break;
                    }
                }
            } else {

                if (this.parentOfTopLevel === null) {

                    this.parentOfTopLevel = document.getElementById(binding.elementId);
                }

                this.parentOfTopLevel.appendChild(this.addToTopLevelRepeater(binding.repeater, newDataModel[p], p));
            }
        }
    }
};

Templatr.prototype._mergeRecursive = function (newDataModel, updateTarget, dataAccessor) {

    // Is this an array (repeater data source)?
    if (Object.prototype.toString.call(newDataModel) === "[object Array]" && Object.prototype.toString.call(updateTarget) === "[object Array]") {

        //While there is more data in the old model than the new
        while (updateTarget.length > newDataModel.length) {

            //Start removing elements from the end of the DOM at this level until our model lengths match
            var targetAccessor = dataAccessor + "." + (updateTarget.length - 1);
            var currentBinding = typeof this.bindings[targetAccessor] !== "undefined" ? this.bindings[targetAccessor] : this.bindings["." + targetAccessor];
            var element;

            if (Object.prototype.toString.call(currentBinding) === "[object Array]") {
                for (var i = 0, len = currentBinding.length; i < len; i++) {

                    //Find and remove DOM element
                    element = currentBinding[i].element;
                    element.parentElement.removeChild(element);

                }
            } else if (Object.prototype.toString.call(currentBinding) === "[object Object]" && currentBinding.type === "repeater") {
                element = document.getElementById(currentBinding.elementId);
                element.parentElement.removeChild(element);
            }

            //Remove parent binding reference                
            delete this.bindings[targetAccessor];

            //Update model
            updateTarget.splice(-1, 1);

            //Remove any child binding references
            for (var prop in this.bindings) {
                if (this.bindings.hasOwnProperty(prop) && prop.indexOf(targetAccessor) != -1) {
                    delete this.bindings[prop];
                }
            }
        }
    }

    //TODO: review this, it could be an array in which case this is not particularly quick
    //iterate over all the properties in the new data model at this level
    for (var p in newDataModel) {

        // Think about this again, the if statement isn't right. Seems like this is working because of what typeof returns
        if (newDataModel.hasOwnProperty(p) && typeof updateTarget[p] !== "undefined" && typeof updateTarget[p] !== "string" &&
            (Object.prototype.toString.call(newDataModel[p]) === "[object Array]" || Object.prototype.toString.call(newDataModel[p]) === "[object Object]")) {
            this._mergeRecursive(newDataModel[p], updateTarget[p], dataAccessor + "." + p);

        } else {
            //Update our model with the new value
            updateTarget[p] = newDataModel[p];

            //Find the existing binding for this point in the model
            var binding = typeof this.bindings[dataAccessor + "." + p] !== "undefined" ? this.bindings[dataAccessor + "." + p] : this.bindings["." + dataAccessor + "." + p];

            //Is this a binding statement
            if (binding && binding.type == "bindingReplacement") {

                //Found it and it's a binding statement, get the element
                var elem = document.getElementById(binding.elementId);

                //Make sure this value is actually different before attacking the DOM
                if (binding.replacementType == "innerText" && binding.boundValue != newDataModel[p]) {
                    //Elements value
                    elem.childNodes[0].nodeValue = elem.childNodes[0].nodeValue.replace(binding.boundValue, newDataModel[p]);
                    binding.boundValue = newDataModel[p];
                } else if (binding.boundValue != newDataModel[p]) {
                    //attributes value or part of
                    elem.attributes[binding.replacementType].value = elem.attributes[binding.replacementType].value.replace(binding.boundValue, newDataModel[p]);
                    binding.boundValue = newDataModel[p];
                }
            } else if (typeof (binding = this.bindings[dataAccessor]) !== "undefined" && typeof binding.repeater !== "undefined") {
                //We need to add to our repeater
                document.getElementById(binding.elementId).appendChild(this.addToRepeater(binding.repeater, newDataModel[p], dataAccessor + "." + p));
            } else if (typeof (binding = this.bindings["." + dataAccessor]) !== "undefined" && binding.type == "bindingReplacement") {

                //Found it and it's a binding statement, get the element
                var elem = document.getElementById(binding.elementId);

                //Make sure this value is actually different before attacking the DOM
                if (binding.replacementType === "innerText" && binding.boundValue != newDataModel) {
                    //Elements value
                    elem.childNodes[0].nodeValue = elem.childNodes[0].nodeValue.replace(binding.boundValue, newDataModel);
                    binding.boundValue = newDataModel;
                } else if (binding.boundValue != newDataModel) {
                    //attributes value or part of
                    elem.attributes[binding.replacementType].value = elem.attributes[binding.replacementType].value.replace(binding.boundValue, newDataModel);
                    binding.boundValue = newDataModel;
                }
            } else if (typeof (binding = this.bindings["." + dataAccessor + "." + p]) !== "undefined" && binding.type === "bindingReplacement") {

                //Found it and it's a binding statement, get the element
                var elem = document.getElementById(binding.elementId);

                //Make sure this value is actually different before attacking the DOM
                if (binding.replacementType == "innerText" && binding.boundValue != newDataModel[p]) {
                    //Elements value
                    elem.childNodes[0].nodeValue = elem.childNodes[0].nodeValue.replace(binding.boundValue, newDataModel[p]);
                    binding.boundValue = newDataModel[p];
                } else if (binding.boundValue != newDataModel[p]) {
                    //attributes value or part of
                    elem.attributes[binding.replacementType].value = elem.attributes[binding.replacementType].value.replace(binding.boundValue, newDataModel[p]);
                    binding.boundValue = newDataModel[p];
                }
            } else if (typeof (binding = this.bindings["." + dataAccessor]) !== "undefined" && binding.type == "repeater") {
                //We need to add to our repeater
                var repElem = document.getElementById(binding.elementId);
                repElem.appendChild(this.addToRepeater(binding.repeater, newDataModel[p], "." + dataAccessor + "." + p));
            } else if (typeof (binding = this.bindings["." + dataAccessor]) !== "undefined" && Object.prototype.toString.call(binding) === "[object Array]") {
                //We need to add to our repeater

                var repElem;
                for (var index = 0; index < binding.length; index++) {
                    if (typeof binding[index].repeater !== "undefined") {
                        repElem = document.getElementById(binding[index].elementId);
                        repElem.appendChild(this.addToRepeater(binding[index].repeater, newDataModel[p], "." + dataAccessor + "." + p));
                        break;
                    }
                }
            }
        }
    }
};


/**
 * @private Adds all the properties from the obj2 parameter to the obj1 parameter and returns obj1
 * @param {string} [obj1] passed by reference, the object which will be populated with the new properties
 * @param {string} [obj2] The object which holds all the properties which are to be merged
 */
Templatr.prototype._cloneObject = function (obj1, obj2) {

    //iterate over all the properties in the object which is being consumed
    for (var p in obj2) {
        // Property in destination object set; update its value.
        if (obj2.hasOwnProperty(p) && typeof obj1[p] !== "undefined") {
            this._cloneObject(obj1[p], obj2[p]);

        } else {
            //We don't have that level in the heirarchy so add it

            if (Object.prototype.toString.call(obj2[p]) === "[object Array]") {
                obj1[p] = [];
                this._cloneObject(obj1[p], obj2[p]);
            } else if (Object.prototype.toString.call(obj2[p]) === "[object Object]") {
                obj1[p] = {};
                this._cloneObject(obj1[p], obj2[p]);
            } else {
                obj1[p] = obj2[p];
            }
        }
    }
}