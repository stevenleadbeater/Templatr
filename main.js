var CatModel = {
    CatModel: [
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
        ]
};

load("/catTemplate.htm", function (response) {

    console.log(response);
    var t1 = window.performance.now();

    var view = Templatr.bind(response.response, CatModel);
    document.body.appendChild(view);

    var t2 = window.performance.now();
    console.log(t2 - t1); // Number of milliseconds passed
});