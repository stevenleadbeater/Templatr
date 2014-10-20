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
&lt;repeater id="catModelRepeater" DataSource="&lt;%# CatModel %&gt;"&gt;
<br />
    &lt;div class="cat &lt;%# class %&gt; &lt;%# name %&gt; &lt;%# color %&gt;"&gt;
<br />
        &lt;div&gt;Type of cat:&lt;/div&gt;&lt;div class="catName"&gt;&lt;%# name %&gt;&lt;/div&gt;
<br />
        &lt;div&gt;Cat colouring: &lt;/div&gt;&lt;div class="catColor"&gt;&lt;%# color %&gt;&lt;/div&gt;
<br />
        &lt;div&gt;Trips to the Vet: &lt;/div&gt;
<br />
        &lt;div style="border:1px solid black;"&gt;
<br />
        &lt;repeater id="vetTripsRepeater" DataSource="&lt;%# TripsToTheVet %&gt;"&gt;
<br />
            &lt;div class="vetTrips"&gt;
<br />
                &lt;div class="date"&gt;&lt;%# date %&gt;&lt;/div&gt;
<br />
                &lt;div class="reason"&gt;&lt;%# reason %&gt;&lt;/div&gt;
<br />
            &lt;/div&gt;
<br />
        &lt;/repeater&gt;
<br />
        &lt;/div&gt;
<br />
    &lt;/div&gt;
<br />
&lt;/repeater&gt;
<br />
