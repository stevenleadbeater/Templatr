Templatr
========

JavaScript logic-less templating as DOM based as possible. I can't believe someone already had YAM for this exact same solution. Anyway, using ASP.net style data binding statements.
<br />
This is a skeleton implementation so far. 
<br />
Supports:
<br />
1. loops
<br />
Repeater tags are used in html and digested by templatr. The DataSource property on a repeater must be set to the property name of a JSON object which holds an array:
<br />
var CatModel = {
<br />
    CatModel: [
<br />
            {
<br />
                name: "tabby",
<br />
                class: "test1",
<br />
                color: "striped black and brown",
<br />
                TripsToTheVet: [
<br />
                    {
<br />
                        date: "12/12/2014",
<br />
                        reason: "heaped piles"
<br />
                    },
<br />
                    {
<br />
                        date: "24/12/2014",
<br />
                        reason: "explosive diahorrea"
<br />
                    }
<br />
                ]
<br />
            },
<br />
            {
<br />
                name: "black",
<br />
                class: "test2",
<br />
                color: "black",
<br />
                TripsToTheVet: [
<br />
                    {
<br />
                        date: "11/05/2014",
<br />
                        reason: "got bit by a slug"
<br />
                    },
<br />
                    {
<br />
                        date: "12/05/2014",
<br />
                        reason: "sat in paint and had to be shaved"
<br />
                    }
<br />
                ]
<br />
            }
<br />
        ]
<br />
};
<br />

Sub repeaters are supported, the above JSON can be digested by this template:
<br />
<repeater id="catModelRepeater" DataSource="<%# CatModel %>">
<br />
    <div class="cat <%# class %> <%# name %> <%# color %>">
<br />
        <div>Type of cat:</div><div class="catName"><%# name %></div>
<br />
        <div>Cat colouring: </div><div class="catColor"><%# color %></div>
<br />
        <div>Trips to the Vet: </div>
<br />
        <div style="border:1px solid black;">
<br />
        <repeater id="vetTripsRepeater" DataSource="<%# TripsToTheVet %>">
<br />
            <div class="vetTrips">
<br />
                <div class="date"><%# date %></div>
<br />
                <div class="reason"><%# reason %></div>
<br />
            </div>
<br />
        </repeater>
<br />
        </div>
<br />
    </div>
<br />
</repeater>
<br />
