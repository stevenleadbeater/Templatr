(function boot(global) {

    //Templatr is attached to window
    global.Templatr = global.Templatr || {};

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
    global.Templatr.bindings = {};

    /*Each element added to the DOM by templatr is assigned an ID in the format: 
    "templatr" + Templatr.currentElementId
    Templatr.currentElementId is then incremented
    */
    global.Templatr.currentElementId = 0;

    /*
    This holds a reference to the data model as it evolves. Each time a new model is passed
    the data is merged in to global.Templatr.Model creating new elements as new data is encountered
    This is not diff based currently. A full model must be passed.
    */
    global.Templatr.Model;

    /*
    This is the regex pattern used to indentify the binding statements. Change at will, 
    the start tag is <%#, the end tag is %> replace those 2 below with whatever you please.
    eg. /{{([^%>]*)}}/ for mustache style statements.
    */
    global.Templatr.Pattern = /<%#([^%>]*)%>/;

    /**
    * @public Returns a div containing the result of applying the data parameter to the template
    * @param {string} [template] HTML markup containing repeater tags and data binding statements
    * @param {string} [data] JSON object containing the properties and values which correspond with the template
    */
    global.Templatr.bind = function (template, data) {

        //We are creating a view for the first time so store the data
        global.Templatr.Model = data;

        //Templates are passed as strings to support AJAX responses. Parse to DOM objects
        var HtmlParser = document.createElement("div");
        HtmlParser.innerHTML = template;

        //Container to hold DOM content to be returned
        var returnValue = document.createDocumentFragment();

        //For each root level element in the template
        for (var i = 0, len = HtmlParser.children.length; i < len; i++) {


            if (HtmlParser.children[i].tagName == "REPEATER") {
                //bind repeater
                returnValue.appendChild(global.Templatr.bindRepeater(HtmlParser.children[i], data, ""));
            } else {
                //bind element
                returnValue.appendChild(global.Templatr.bindElement(HtmlParser.children[i], data, ""));
            }
        }
        //Document fragment with all the top level elements bound from the template
        return returnValue;
    };

    global.Templatr.bindRepeater = function (repeater, data, dataAccessor) {

        //Repeater contents as a whole are rendered inside a container
        var returnValue = document.createElement("div");

        //Number of iterations in the data repeater will go through
        var len = data.length;

        //Set the id on the repeater container
        returnValue = global.Templatr.setElementId(returnValue);

        //Create the binding reference object entry to save in global.Templatr.bindings
        var bindingLog = global.Templatr.createBindingReference(returnValue.id, "repeater", dataAccessor);
        bindingLog["len"] = len;
        bindingLog["repeater"] = repeater;

        //Save the binding reference
        global.Templatr.bindings[dataAccessor] = bindingLog;

        //The top level repeater has no starting namespace global.Templatr.bindings[""] to access it's bindings
        if (dataAccessor != "") {
            dataAccessor += "."
        }

        //For each member of the model
        for (var i = 0; i < len; i++) {

            //For each child of the repeater
            for (var j = 0, lenJ = repeater.children.length; j < lenJ; j++) {

                //Bind the child to the model
                returnValue.appendChild(global.Templatr.bindElement(repeater.children[j].cloneNode(true), data[i], dataAccessor + i.toString()));
            }
        }
        return returnValue;
    };

    global.Templatr.bindElement = function (element, data, dataAccessor) {

        //Account for containers
        var len = element.children.length;

        //Track whether anything was bound (no need for a binding reference if we miss)
        var didBind = false;

        /*Look through each attribute on the element and see if there are binding statements
        in the value*/
        for (var i = 0, attribLength = element.attributes.length; i < attribLength; i++) {

            var attrib = element.attributes[i];

            // Check for binding statements and process as applicable
            if (global.Templatr.Pattern.exec(attrib.value) != null) {
                attrib.value = global.Templatr.bindingReplacement(attrib.value, data, dataAccessor, attrib.name);
                didBind = true;
            }
        }
        if (len == 0) {

            // Check for binding statements and process as applicable
            if (element.childNodes[0] && global.Templatr.Pattern.exec(element.childNodes[0].nodeValue) != null) {
                element.childNodes[0].nodeValue = global.Templatr.bindingReplacement(element.childNodes[0].nodeValue, data, dataAccessor, "innerText");
                didBind = true;
            }
        }

        if (didBind) {

            //Set the id on the element
            element = global.Templatr.setElementId(element);

            //Create the binding reference to save in the repeaters array of references
            var bindingLog = global.Templatr.createBindingReference(element.id, "element", dataAccessor);
            bindingLog["element"] = element;

            //Save the binding reference in the repeaters array of references
            global.Templatr.bindings[dataAccessor] = global.Templatr.bindings[dataAccessor] || [];
            global.Templatr.bindings[dataAccessor].push(bindingLog);

        }

        //If this is a container (has child nodes)
        if (len > 0) {

            //For each child node
            for (var i = 0; i < len; i++) {

                //Sub repeater support
                if (element.children[i].tagName == "REPEATER") {

                    //This is the property name of an array
                    var dataSource = global.Templatr.Pattern.exec(element.children[i].getAttribute("DataSource"));

                    if (dataSource != null) {

                        //Repeater is bound
                        var repeaterResult = global.Templatr.bindRepeater(element.children[i], data[dataSource[1].replace(/^\s+|\s+$/gm, '')], dataAccessor + "." + dataSource[1].replace(/^\s+|\s+$/gm, ''));

                        //Swap the template element for the bound element
                        element.removeChild(element.children[i]);
                        element.appendChild(repeaterResult);
                    }
                } else {
                    //This is just a nested element, call my self recursively passing the child element to be bound
                    global.Templatr.bindElement(element.children[i], data, dataAccessor);
                }
            }
        }
        return element;
    };

    global.Templatr.bindingReplacement = function (stringToReplaceIn, data, dataAccessor, replacementType) {

        var propertyToBind;
        var replacements = [];

        /*stringToReplaceIn is iterated over using regex to find the first remaining match for data binding statements
        in each iteration*/
        while ((propertyToBind = global.Templatr.Pattern.exec(stringToReplaceIn)) !== null) {

            //Everything has been bound so jump out
            if (propertyToBind == null) {
                break;
            }

            /*trim - ie8 compatible allows <%# prop_name %> and <%#prop_name%> to be used interchangably and mixed
            index 1 of the regex exec return is what is found between the '<%#' and '%>'*/
            var propertyName = propertyToBind[1].replace(/^\s+|\s+$/gm, '');

            /*We have to replace the full databinding statement of '<%#', '%>' and whatever is inbetween. This
            is index 0 of the result of the regex exec*/
            var targetForReplacement = propertyToBind[0];

            //We can't bind to a property that isn't at the right level in the data. Check and error on fail
            if (data[propertyName]) {
                stringToReplaceIn = stringToReplaceIn.replace(targetForReplacement, data[propertyName]);

                var bindingLog = global.Templatr.createBindingReference("templatr" + global.Templatr.currentElementId, "bindingReplacement", dataAccessor + "." + propertyName);
                bindingLog["oldValue"] = targetForReplacement;
                bindingLog["boundValue"] = data[propertyName];
                bindingLog["replacementType"] = replacementType;

                global.Templatr.bindings[dataAccessor + "." + propertyName] = bindingLog;

            } else {
                //Log as much trace information as possible
                console.log("Throwing error because property '" + propertyName + "' was not found in data: ");
                console.log(data);
                console.log("String to replace in:");
                console.log(stringToReplaceIn);
                console.log("Target for replacement:");
                console.log(targetForReplacement);

                //Throw an error
                throw new Error('Cannot bind property ' + propertyName);
            }
        }
        return stringToReplaceIn;
    };

    global.Templatr.setElementId = function (element) {

        //Centrally manage the assignment of ids to elements        
        var att = document.createAttribute("id");
        att.value = "templatr" + global.Templatr.currentElementId;
        element.setAttributeNode(att);

        //increment after assignment
        global.Templatr.currentElementId++;

        return element;
    }

    global.Templatr.createBindingReference = function (elementId, type, dataAccessor) {

        //Base information held in every binding reference
        var bindingLog = {
            elementId: elementId,
            dataAccessor: dataAccessor,
            type: type
        }

        return bindingLog;
    }

    global.Templatr.addToRepeater = function (repeater, data, dataAccessor) {

        /*Adding to pre-existing repeaters does not require the top level binding references
        to be added. The additional binding reference objects pushed to the arrays are done 
        within bindElement*/

        //Repeater child contents as a whole are rendered inside a container
        var returnValue = document.createElement("div");

        //Set the id of the container
        returnValue = global.Templatr.setElementId(returnValue);

        //For each HTML element inside the repeater
        for (var j = 0, lenJ = repeater.children.length; j < lenJ; j++) {

            //Bind the HTML element to the data
            var element = global.Templatr.bindElement(repeater.children[j].cloneNode(true), data, dataAccessor);

            //Append the child to the container
            returnValue.appendChild(element);
        }

        return returnValue;
    };


    global.Templatr.addToTopLevelRepeater = function (repeater, data, dataAccessor) {

        /*Adding to pre-existing repeaters does not require the top level binding references
        to be added. The additional binding reference objects pushed to the arrays are done 
        within bindElement*/

        //The container exists already, make a document fragment to append instead (saves iterating the children again)
        var returnValue = document.createDocumentFragment();

        //For each HTML element inside the repeater
        for (var j = 0, lenJ = repeater.children.length; j < lenJ; j++) {

            //Bind the HTML element to the data
            var element = global.Templatr.bindElement(repeater.children[j].cloneNode(true), data, dataAccessor);

            //Append the child to the container
            returnValue.appendChild(element);
        }

        return returnValue;
    };

    global.Templatr.updateDataModel = function (newDataModel) {

        /*This function expects the entire data model to be passed. It will re-use as much of what is in the DOM
        already as possible, synchronize the bindings and model and update the UI*/

        //While there is less data in the new model that the old one
        while (global.Templatr.Model.length > newDataModel.length) {

            /*Perform top level removals - Templatr.bindings[global.Templatr.Model.length - 1] is the last array of repeater contents
            After the repeater and all the children are removed this binding entry is deleted*/
            //Rmove the UI element
            var topLevelBinding = Templatr.bindings[global.Templatr.Model.length - 1][0];
            var element = topLevelBinding.element;
            var targetAccessor = topLevelBinding.dataAccessor;

            element.parentElement.removeChild(element);

            //Remove the bindings in the repeaters array
            delete Templatr.bindings[targetAccessor];

            //Remove the bindings for the objects in the repeater
            for (var prop in Templatr.bindings) {
                if (Templatr.bindings.hasOwnProperty(prop) && prop.indexOf(targetAccessor) != -1) {
                    delete Templatr.bindings[prop];
                }
            }

            //Remove from the internal model
            global.Templatr.Model.splice(-1, 1);

        }

        //iterate over all the properties in the new model
        for (var p in newDataModel) {

            // That node exists, this is an update or a repeater. Off load to merge recursive
            if (newDataModel.hasOwnProperty(p) && typeof global.Templatr.Model[p] !== "undefined") {
                global.Templatr._mergeRecursive(newDataModel[p], global.Templatr.Model[p], p);

            } else {
                /*This should not be possible, this code was stolen (badly) from your own toolset. Think hard about this and 
                ask yourself, in all honesty, you published this on github for all to see. Do
                you want someone pointing out the fact that if a property wasn't in the data model
                when it was first bound, and there was a binding statement that should have accessed it
                and you throw an error in that situation... Who on earth is going to run updateDataModel
                and expect a sane result.*/
                global.Templatr.Model[p] = newDataModel[p];
                var binding = global.Templatr.bindings[""];
                document.getElementById(binding.elementId).appendChild(global.Templatr.addToTopLevelRepeater(binding.repeater, newDataModel[p], p));
            }
        }
    };

    global.Templatr._mergeRecursive = function (newDataModel, updateTarget, dataAccessor) {

        // Is this an array (repeater data source)?
        if (Object.prototype.toString.call(newDataModel) === '[object Array]' && Object.prototype.toString.call(updateTarget) === '[object Array]') {

            //While there is more data in the new model than the old
            while (updateTarget.length > newDataModel.length) {

                //Start removing elements from the end of the DOM at this level until our model lengths match
                for (var i = 0, len = Templatr.bindings[dataAccessor + "." + (updateTarget.length - 1)].length; i < len; i++) {

                    //Find and remove DOM element
                    var element = Templatr.bindings[dataAccessor + "." + (updateTarget.length - 1)][i].element;
                    element.parentElement.removeChild(element);

                }

                //Remove parent binding reference
                var targetAccessor = dataAccessor + "." + (updateTarget.length - 1);
                delete Templatr.bindings[targetAccessor];

                //Update model
                updateTarget.splice(-1, 1)

                //Remove any child binding references
                for (var prop in Templatr.bindings) {
                    if (Templatr.bindings.hasOwnProperty(prop) && prop.indexOf(targetAccessor) != -1) {
                        delete Templatr.bindings[prop];
                    }
                }
            }
        }

        //iterate over all the properties in the new data model at this level
        for (var p in newDataModel) {

            // Think about this again, the if statement isn't right. Seems like this is working because of what typeof returns
            if (newDataModel.hasOwnProperty(p) && typeof updateTarget[p] !== "undefined" && typeof updateTarget[p] !== "string") {
                global.Templatr._mergeRecursive(newDataModel[p], updateTarget[p], dataAccessor + "." + p);

            } else {
                //Update our model with the new value
                updateTarget[p] = newDataModel[p];

                //Find the existing binding for this point in the model
                var binding = global.Templatr.bindings[dataAccessor + "." + p];

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
                } else {
                    //We need to add to our repeater
                    var binding = global.Templatr.bindings[dataAccessor];
                    document.getElementById(binding.elementId).appendChild(global.Templatr.addToRepeater(binding.repeater, newDataModel[p], dataAccessor + "." + p));
                }
            }
        }
    };
})(window);