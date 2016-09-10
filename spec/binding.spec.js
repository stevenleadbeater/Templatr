'use strict';

describe('Top level array binding', function() {

    var templatr = new Templatr("test");
    templatr.addView("catTemplate", catArrayTemplate);
    var view = templatr.bind("catTemplate", JSON.parse(JSON.stringify(catModel1)));
    document.body.appendChild(view);

    var inSituView = document.body.getElementsByTagName('div')[0];

    describe('intital', function() {
        
        describe('first repeater item', function() {

            it('has the right number of top level elements', function() {
                expect(inSituView.children.length).toEqual(3);
            });

            it('has copied the class from the template correctly', function() {
                expect(inSituView.children[0].classList).toContain('cat');
            });

            it('has copied the single item string data values from the model to classes correctly', function() {
                expect(inSituView.children[0].classList).toContain(catModel1[0].class);
                expect(inSituView.children[0].classList).toContain(catModel1[0].name);
            });

            it('has copied the multiple item string data values from the model to classes correctly', function() {
                var arrayOfClasses = catModel1[0].color.split(' ');

                for (var i = 0; i < arrayOfClasses.length; i++) {
                    expect(inSituView.children[0].classList).toContain(arrayOfClasses[i]);
                }
            });

            describe('sub repeater', function() {

                var subRepeater = inSituView.children[0].children[5];

                it('has the right number of top level elements', function() {
                    expect(subRepeater.children.length).toEqual(4);
                });

                it('has copied the in-line style from the template correctly', function() {
                    expect(subRepeater.attributes['style'].value).toEqual('border:1px solid black;');
                });

                it('has copied the class declaration from the template correctly', function() {
                    expect(subRepeater.attributes['class'].value).toEqual('vetTrips');
                });

                describe('first repeater item', function() {
                    var subRepeaterFirstItemSection1 = subRepeater.children[0];
                    var subRepeaterFirstItemSection2 = subRepeater.children[1];
                
                    it('section 1 has copied the class declaration from the template correctly', function() {
                        expect(subRepeaterFirstItemSection1.attributes['class'].value).toEqual('date');
                    });

                    it('section 1 has copied the node value from the model correctly', function() {
                        expect(subRepeaterFirstItemSection1.innerText).toEqual(catModel1[0].TripsToTheVet[0].date);
                    });

                    it('section 2 has copied the class declaration from the template correctly', function() {
                        expect(subRepeaterFirstItemSection2.attributes['class'].value).toEqual('reason');
                    });

                    it('section 2 has copied the node value from the model correctly', function() {
                        expect(subRepeaterFirstItemSection2.innerText).toEqual(catModel1[0].TripsToTheVet[0].reason);
                    });
                });

                describe('second repeater item', function() {
                    var subRepeaterFirstItemSection1 = subRepeater.children[2];
                    var subRepeaterFirstItemSection2 = subRepeater.children[3];
                
                    it('section 1 has copied the class declaration from the template correctly', function() {
                        expect(subRepeaterFirstItemSection1.attributes['class'].value).toEqual('date');
                    });

                    it('section 1 has copied the node value from the model correctly', function() {
                        expect(subRepeaterFirstItemSection1.innerText).toEqual(catModel1[0].TripsToTheVet[1].date);
                    });

                    it('section 2 has copied the class declaration from the template correctly', function() {
                        expect(subRepeaterFirstItemSection2.attributes['class'].value).toEqual('reason');
                    });

                    it('section 2 has copied the node value from the model correctly', function() {
                        expect(subRepeaterFirstItemSection2.innerText).toEqual(catModel1[0].TripsToTheVet[1].reason);
                    });
                });
            });
        });
    });

    describe('update', function() {
        
        beforeAll(function() {
            templatr.updateDataModel(JSON.parse(JSON.stringify(catModel3)));
        });

        it('has the right number of top level elements', function() {
            expect(inSituView.children.length).toEqual(24);
        });

        it('has copied the class from the template correctly', function() {
            expect(inSituView.children[0].classList).toContain('cat');
        });

        it('has copied the single item string data values from the model to classes correctly', function() {
            expect(inSituView.children[0].classList).toContain(catModel3[0].class);
            expect(inSituView.children[0].classList).toContain(catModel3[0].name);
        });

        it('has copied the multiple item string data values from the model to classes correctly', function() {
            var arrayOfClasses = catModel3[0].color.split(' ');

            for (var i = 0; i < arrayOfClasses.length; i++) {
                expect(inSituView.children[0].classList).toContain(arrayOfClasses[i]);
            }
        });

        describe('sub repeater', function() {

            var subRepeater = inSituView.children[0].children[5];

            it('has the right number of top level elements', function() {
                expect(subRepeater.children.length).toEqual(2);
            });

            it('has copied the in-line style from the template correctly', function() {
                expect(subRepeater.attributes['style'].value).toEqual('border:1px solid black;');
            });

            it('has copied the class declaration from the template correctly', function() {
                expect(subRepeater.attributes['class'].value).toEqual('vetTrips');
            });

            describe('first repeater item', function() {
                var subRepeaterFirstItemSection1 = subRepeater.children[0];
                var subRepeaterFirstItemSection2 = subRepeater.children[1];
            
                it('section 1 has copied the class declaration from the template correctly', function() {
                    expect(subRepeaterFirstItemSection1.attributes['class'].value).toEqual('date');
                });

                it('section 1 has copied the node value from the model correctly', function() {
                    expect(subRepeaterFirstItemSection1.innerText).toEqual(catModel3[0].TripsToTheVet[0].date);
                });

                it('section 2 has copied the class declaration from the template correctly', function() {
                    expect(subRepeaterFirstItemSection2.attributes['class'].value).toEqual('reason');
                });

                it('section 2 has copied the node value from the model correctly', function() {
                    expect(subRepeaterFirstItemSection2.innerText).toEqual(catModel3[0].TripsToTheVet[0].reason);
                });
            });
        });
    });

    describe('update back to original', function() {
        
        beforeAll(function() {
            templatr.updateDataModel(JSON.parse(JSON.stringify(catModel1)));
        });

        describe('first repeater item', function() {

            it('has the right number of top level elements', function() {
                expect(inSituView.children.length).toEqual(3);
            });

            it('has copied the class from the template correctly', function() {
                expect(inSituView.children[0].classList).toContain('cat');
            });

            it('has copied the single item string data values from the model to classes correctly', function() {
                expect(inSituView.children[0].classList).toContain(catModel1[0].class);
                expect(inSituView.children[0].classList).toContain(catModel1[0].name);
            });

            it('has copied the multiple item string data values from the model to classes correctly', function() {
                var arrayOfClasses = catModel1[0].color.split(' ');

                for (var i = 0; i < arrayOfClasses.length; i++) {
                    expect(inSituView.children[0].classList).toContain(arrayOfClasses[i]);
                }
            });

            describe('sub repeater', function() {

                var subRepeater = inSituView.children[0].children[5];

                it('has the right number of top level elements', function() {
                    expect(subRepeater.children.length).toEqual(4);
                });

                it('has copied the in-line style from the template correctly', function() {
                    expect(subRepeater.attributes['style'].value).toEqual('border:1px solid black;');
                });

                it('has copied the class declaration from the template correctly', function() {
                    expect(subRepeater.attributes['class'].value).toEqual('vetTrips');
                });

                describe('first repeater item', function() {
                    var subRepeaterFirstItemSection1 = subRepeater.children[0];
                    var subRepeaterFirstItemSection2 = subRepeater.children[1];
                
                    it('section 1 has copied the class declaration from the template correctly', function() {
                        expect(subRepeaterFirstItemSection1.attributes['class'].value).toEqual('date');
                    });

                    it('section 1 has copied the node value from the model correctly', function() {
                        expect(subRepeaterFirstItemSection1.innerText).toEqual(catModel1[0].TripsToTheVet[0].date);
                    });

                    it('section 2 has copied the class declaration from the template correctly', function() {
                        expect(subRepeaterFirstItemSection2.attributes['class'].value).toEqual('reason');
                    });

                    it('section 2 has copied the node value from the model correctly', function() {
                        expect(subRepeaterFirstItemSection2.innerText).toEqual(catModel1[0].TripsToTheVet[0].reason);
                    });
                });

                describe('second repeater item', function() {
                    var subRepeaterFirstItemSection1 = subRepeater.children[2];
                    var subRepeaterFirstItemSection2 = subRepeater.children[3];
                
                    it('section 1 has copied the class declaration from the template correctly', function() {
                        expect(subRepeaterFirstItemSection1.attributes['class'].value).toEqual('date');
                    });

                    it('section 1 has copied the node value from the model correctly', function() {
                        expect(subRepeaterFirstItemSection1.innerText).toEqual(catModel1[0].TripsToTheVet[1].date);
                    });

                    it('section 2 has copied the class declaration from the template correctly', function() {
                        expect(subRepeaterFirstItemSection2.attributes['class'].value).toEqual('reason');
                    });

                    it('section 2 has copied the node value from the model correctly', function() {
                        expect(subRepeaterFirstItemSection2.innerText).toEqual(catModel1[0].TripsToTheVet[1].reason);
                    });
                });
            });
        });
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