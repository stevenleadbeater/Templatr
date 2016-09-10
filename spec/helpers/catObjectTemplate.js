'use strict';

var catObjectTemplate = '<div class="cat {{ class }} {{ name }} {{ color }}">';
catObjectTemplate += '     <div>Type of cat:</div><div class="catName">{{ name }}</div>';
catObjectTemplate += '       <div>Cat colouring: </div><div class="catColor">{{ color }}</div>';
catObjectTemplate += '       <div>Trips to the Vet: </div>';
catObjectTemplate += '       <div style="border:1px solid black;">';
catObjectTemplate += '       <div data-repeater="templatr" id="vetTripsRepeater" DataSource="{{ TripsToTheVet }}">';
catObjectTemplate += '         <div class="vetTrips">';
catObjectTemplate += '           <div class="date">{{ date }}</div>';
catObjectTemplate += '           <div class="reason">{{ reason }}</div>';
catObjectTemplate += '         </div>';
catObjectTemplate += '       </div>';
catObjectTemplate += '     </div>';
catObjectTemplate += '   </div>';