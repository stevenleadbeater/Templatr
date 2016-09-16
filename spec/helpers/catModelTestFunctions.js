function catModel_Repeater(inSituView, model) {

    it('has the right number of top level elements', function() {
        expect(inSituView.children.length).toEqual(model.length);
    });

    for (var i = 0; i < model.length; i++) {

        var text = 'child ' + (i + 1);
        describe(text, catModel_Repeater_Item.bind(this, inSituView, i, model));
    }
}

function catModel_Repeater_Item(inSituView, index, model) {

    it('has copied the class from the template correctly', function() {
        expect(inSituView.children[index].classList).toContain('cat');
    });

    it('has copied the single item string data values from the model to classes correctly', function() {
        if (model[index].class.indexOf(' ') !== -1) {
            var arrayOfClasses = model[index].class.split(' ');

            for (var i = 0; i < arrayOfClasses.length; i++) {
                expect(inSituView.children[index].classList).toContain(arrayOfClasses[i]);
            }
        } else {
            expect(inSituView.children[index].classList).toContain(model[index].class);    
        }

        if (model[index].name.indexOf(' ') !== -1) {
            var arrayOfClasses = model[index].name.split(' ');

            for (var i = 0; i < arrayOfClasses.length; i++) {
                expect(inSituView.children[index].classList).toContain(arrayOfClasses[i]);
            }
        } else {
            expect(inSituView.children[index].classList).toContain(model[index].name);    
        }
    });

    it('has copied the multiple item string data values from the model to classes correctly', function() {
        var arrayOfClasses = model[index].color.split(' ');

        for (var i = 0; i < arrayOfClasses.length; i++) {
            expect(inSituView.children[index].classList).toContain(arrayOfClasses[i]);
        }
    });

    describe('sub repeater', catModel_SubRepeater.bind(this, inSituView, index, model));
}

function catModel_SubRepeater(inSituView, index, model) {

    var subRepeater = inSituView.children[index].children[5];

    it('has the right number of top level elements', function() {
        expect(subRepeater.children.length).toEqual(model[index].TripsToTheVet.length * 2);
    });

    it('has copied the in-line style from the template correctly', function() {
        expect(subRepeater.attributes['style'].value).toEqual('border:1px solid black;');
    });

    it('has copied the class declaration from the template correctly', function() {
        expect(subRepeater.attributes['class'].value).toEqual('vetTrips');
    });

    for (var i = 0; i < model[index].TripsToTheVet.length; i++) {
        describe('repeater item ' + i, catModel_SubRepeater_Item.bind(this, subRepeater, index, i, model));
    }
}

function catModel_SubRepeater_Item(subRepeater, index, itemNumber, model) {
    var offSet = itemNumber * 2;

    it('section 1 has copied the class declaration from the template correctly', function() {
        expect(subRepeater.children[offSet].attributes['class'].value).toEqual('date');
    });

    it('section 1 has copied the node value from the model correctly', function() {
        expect(subRepeater.children[offSet].innerText).toEqual(model[index].TripsToTheVet[itemNumber].date);
    });

    it('section 2 has copied the class declaration from the template correctly', function() {
        expect(subRepeater.children[offSet + 1].attributes['class'].value).toEqual('reason');
    });

    it('section 2 has copied the node value from the model correctly', function() {
        expect(subRepeater.children[offSet + 1].innerText).toEqual(model[index].TripsToTheVet[itemNumber].reason);
    });
}