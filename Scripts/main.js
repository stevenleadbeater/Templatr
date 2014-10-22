var CatModel = [
    {
        name: "tabby",
        class: "test1",
        color: "striped black and brown",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped piles"
            },
            {
                date: "24/12/2014",
                reason: "explosive diahorrea"
            }
        ]
    },
    {
        name: "black",
        class: "test2",
        color: "black",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a slug"
            },
            {
                date: "12/05/2014",
                reason: "sat in paint and had to be shaved"
            }
        ]
    }
];

var CatModel2 = [
    {
        name: "black",
        class: "test2",
        color: "black",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a slug"
            },
            {
                date: "12/05/2014",
                reason: "sat in paint and had to be shaved"
            }
        ]
    },
    {
        name: "tabby update",
        class: "test1",
        color: "striped black and brown",
        TripsToTheVet: [
            {
                date: "12/12/2014",
                reason: "heaped piles update"
            },
            {
                date: "24/12/2014",
                reason: "explosive diahorrea"
            },
            {
                date: "21/01/2015",
                reason: "implosive diahorrea"
            }
        ]
    },
    {
        name: "whitey",
        class: "test3",
        color: "white",
        TripsToTheVet: [
            {
                date: "11/05/2014",
                reason: "got bit by a cucumber"
            },
            {
                date: "12/05/2014",
                reason: "sat in tar and had to be shaved"
            }
        ]
    }
];

var catTemplate = '<repeater id="catModelRepeater" DataSource="<%# CatModel %>">';
catTemplate += '    <div class="cat <%# class %> <%# name %> <%# color %>" data-list="true" data-value="cat">';
catTemplate += '        <div>Type of cat:</div><div class="catName" data-target="name"><%# name %></div>';
catTemplate += '        <div>Cat colouring: </div><div class="catColor" data-target="color"><%# color %></div>';
catTemplate += '        <div>Trips to the Vet: </div>';
catTemplate += '        <div style="border:1px solid black;">';
catTemplate += '        <repeater id="vetTripsRepeater" DataSource="<%# TripsToTheVet %>">';
catTemplate += '            <div class="vetTrips">';
catTemplate += '                <div class="date"><%# date %></div>';
catTemplate += '                <div class="reason"><%# reason %></div>';
catTemplate += '            </div>';
catTemplate += '        </repeater>';
catTemplate += '        </div>';
catTemplate += '    </div>';
catTemplate += '</repeater>';


    var t1 = window.performance.now();

    var view = Templatr.bind(catTemplate, CatModel);
    document.body.appendChild(view);

    var t2 = window.performance.now();
    console.log("First render: " + (t2 - t1)); // Number of milliseconds passed

    t1 = window.performance.now();

    Templatr.updateDataModel(CatModel2);

    t2 = window.performance.now();
    console.log("Update model: " + (t2 - t1)); // Number of milliseconds passed