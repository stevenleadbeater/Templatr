Templatr
========

JavaScript logic-less templating as DOM based as possible. I can't believe someone already had YAM for this exact same solution. Anyway, using ASP.net style data binding statements.

This is a skeleton implementation so far. 

Supports:

1. loops
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

Sub repeaters are supported, the above JSON can be digested by this template:

<repeater id="catModelRepeater" DataSource="<%# CatModel %>">
    <div class="cat <%# class %> <%# name %> <%# color %>">
        <div>Type of cat:</div><div class="catName"><%# name %></div>
        <div>Cat colouring: </div><div class="catColor"><%# color %></div>
        <div>Trips to the Vet: </div>
        <div style="border:1px solid black;">
        <repeater id="vetTripsRepeater" DataSource="<%# TripsToTheVet %>">
            <div class="vetTrips">
                <div class="date"><%# date %></div>
                <div class="reason"><%# reason %></div>
            </div>
        </repeater>
        </div>
    </div>
</repeater>
