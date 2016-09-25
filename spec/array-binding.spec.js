'use strict';

function bindTemplate(namespace, templateName, template, model){

    var templatr = new Templatr(namespace);
    templatr.addView(templateName, template);
    var view = templatr.bind(templateName, JSON.parse(JSON.stringify(model)));
    var target = document.createElement("div");
    target.id = namespace;
    target.appendChild(view);
    document.body.appendChild(target);
    return templatr;
}

describe('Top level array binding', function() {

    bindTemplate("test1", "catTemplate", catArrayTemplate, catModel1);

    var templatr2 = bindTemplate("test2", "catTemplate", catArrayTemplate, catModel1);
    templatr2.updateDataModel(JSON.parse(JSON.stringify(catModel3)));

    var templatr3 = bindTemplate("test3", "catTemplate", catArrayTemplate, catModel1);
    templatr3.updateDataModel(JSON.parse(JSON.stringify(catModel3)));
    templatr3.updateDataModel(JSON.parse(JSON.stringify(catModel1)));

    describe('intital', function() {

        describe('repeater', catModel_Repeater.bind(this, document.getElementById('test1').firstChild, catModel1));
    });

    describe('update', function() {

        describe('repeater', catModel_Repeater.bind(this, document.getElementById('test2').firstChild, catModel3));
    });

    describe('update back to original', function() {

        describe('repeater', catModel_Repeater.bind(this, document.getElementById('test3').firstChild, catModel1));
    });
});

describe('Top level object binding', function() {

    bindTemplate("test4", "catTemplate", catObjectTemplate, catObjectModel1);

    var templatr2 = bindTemplate("test5", "catTemplate", catObjectTemplate, catObjectModel1);
    templatr2.updateDataModel(JSON.parse(JSON.stringify(catObjectModel2)));

    var templatr3 = bindTemplate("test6", "catTemplate", catObjectTemplate, catObjectModel1);
    templatr3.updateDataModel(JSON.parse(JSON.stringify(catObjectModel2)));
    templatr3.updateDataModel(JSON.parse(JSON.stringify(catObjectModel1)));

    it('has the right number of top level elements', function() {
        expect(document.getElementById('test4').children.length).toEqual(1);
    });

    describe('initial', catModel_Repeater_Item.bind(this, document.getElementById('test4'), 0, [catObjectModel1]));

    describe('update', catModel_Repeater_Item.bind(this, document.getElementById('test5'), 0, [catObjectModel2]));

    describe('update back to original', catModel_Repeater_Item.bind(this, document.getElementById('test6'), 0, [catObjectModel1]));
});

describe('View binding', function() {
    var templatr = new Templatr("test7");
    templatr.addView("calendar", calendarGridTemplate);
    templatr.addView("header", calendarHeaderTempalte);
    templatr.addView("detail", calendarDetailsTemplate);
    var view = templatr.bind("calendar", JSON.parse(JSON.stringify(calendarGanttData)));
    var target = document.createElement("div");
    target.id = "test7";
    target.appendChild(view);
    document.body.appendChild(target);
});