'use strict';

var catArrayTemplate = '<div data-repeater="templatr">';
catArrayTemplate += '    <div class="cat {{ class }} {{ name }} {{ color }}">';
catArrayTemplate += '      <div>Type of cat:</div><div class="catName">{{ name }}</div>';
catArrayTemplate += '      <div>Cat colouring: </div><div class="catColor">{{ color }}</div>';
catArrayTemplate += '      <div>Trips to the Vet: </div>';
catArrayTemplate += '      <div class="vetTrips" style="border:1px solid black;" data-repeater="templatr" DataSource="{{ TripsToTheVet }}">';
catArrayTemplate += '        <div class="date">{{ date }}</div>';
catArrayTemplate += '        <div class="reason">{{ reason }}</div>';
catArrayTemplate += '      </div>';
catArrayTemplate += '    </div>';
catArrayTemplate += '  </div>';