'use strict';

var calendarDetailsTemplate = '<div data-repeater="templatr">';
calendarDetailsTemplate += '     <div class="ganttChartrRow">';
calendarDetailsTemplate += '       <span class="ganttChartrRowName">{{name}}</span>';
calendarDetailsTemplate += '       <span data-repeater="templatr" class="calendarDetails1Row" datasource="{{ days }}">';
calendarDetailsTemplate += '         <span class="calendarDetails1DayName" data-dayname="{{ dayName }}" data-monthname="{{ monthName }}" data-yearname="{{ yearName }}">';
calendarDetailsTemplate += '           <span data-repeater="templatr" datasource="{{ events }}">';
calendarDetailsTemplate += '             <span class="{{ className }}" data-id="{{id}}" style="{{width}}" data-number-of-days="{{ numberOfDays }}">{{ name }}</span>';
calendarDetailsTemplate += '           </span>';
calendarDetailsTemplate += '         </span>';
calendarDetailsTemplate += '       </span>';
calendarDetailsTemplate += '     </div>';
calendarDetailsTemplate += '   </div>';