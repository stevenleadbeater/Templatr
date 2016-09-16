'use strict';

describe('Top level array binding', function() {

    var templatr1 = new Templatr("test1");
    templatr1.addView("catTemplate", catArrayTemplate);
    var view1 = templatr1.bind("catTemplate", JSON.parse(JSON.stringify(catModel1)));
    var target1 = document.createElement("div");
    target1.id = "target1";
    target1.appendChild(view1);
    document.body.appendChild(target1);

    var templatr2 = new Templatr("test2");
    templatr2.addView("catTemplate", catArrayTemplate);
    var view2 = templatr2.bind("catTemplate", JSON.parse(JSON.stringify(catModel1)));
    var target2 = document.createElement("div");
    target2.id = "target2";
    target2.appendChild(view2);
    document.body.appendChild(target2);
    templatr2.updateDataModel(JSON.parse(JSON.stringify(catModel3)));

    var templatr3 = new Templatr("test3");
    templatr3.addView("catTemplate", catArrayTemplate);
    var view3 = templatr3.bind("catTemplate", JSON.parse(JSON.stringify(catModel1)));
    var target3 = document.createElement("div");
    target3.id = "target3";
    target3.appendChild(view3);
    document.body.appendChild(target3);
    templatr3.updateDataModel(JSON.parse(JSON.stringify(catModel3)));
    templatr3.updateDataModel(JSON.parse(JSON.stringify(catModel1)));

    describe('intital', function() {

        describe('repeater', catModel_Repeater.bind(this, document.getElementById('target1').firstChild, catModel1));
    });

    describe('update', function() {

        describe('repeater', catModel_Repeater.bind(this, document.getElementById('target2').firstChild, catModel3));
    });

    describe('update back to original', function() {

        describe('repeater', catModel_Repeater.bind(this, document.getElementById('target3').firstChild, catModel1));
    });
});

describe('Top level object binding', function() {
    var templatr = new Templatr("test");
    templatr.addView("catTemplate", catObjectTemplate);
    var view = templatr.bind("catTemplate", catObjectModel1);

    it('has the right number of top level elements', function() {
        expect(view.children.length).toEqual(1);
    });

    it('has copied the class from the template correctly', function() {
        expect(view.children[0].classList).toContain('cat');
    });

    it('has copied the single item string data values from the model to classes correctly', function() {
        expect(view.children[0].classList).toContain(catObjectModel1.class);
        expect(view.children[0].classList).toContain(catObjectModel1.name);
    });

    it('has copied the multiple item string data values from the model to classes correctly', function() {
        var arrayOfClasses = catObjectModel1.color.split(' ');

        for (var i = 0; i < arrayOfClasses.length; i++) {
            expect(view.children[0].classList).toContain(arrayOfClasses[i]);
        }
    });
});