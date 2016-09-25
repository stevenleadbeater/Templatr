'use strict';

var calendarHeaderTempalte = '<div data-repeater="templatr" datasource="{{ years }}" class="calendarHeader1Layout">';
calendarHeaderTempalte += '     <span class="ganttChartrRowName"></span>';
calendarHeaderTempalte += '     <div class="calendarHeader1Layout">';
calendarHeaderTempalte += '       <div class="calendarHeader1YearName">{{ yearName }}</div>';
calendarHeaderTempalte += '       <div data-repeater="templatr" datasource="{{ months }}" class="calendarHeader1Layout">';
calendarHeaderTempalte += '       <div class="calendarHeader1Layout calendarHeader1AlignmentFix">';
calendarHeaderTempalte += '         <div class="calendarHeader1MonthName">{{ monthName }}</div>';
calendarHeaderTempalte += '           <div data-repeater="templatr" datasource="{{ days }}" class="calendarHeader1Layout">';
calendarHeaderTempalte += '             <span class="calendarHeader1DayName">{{ dayName }}</span>';
calendarHeaderTempalte += '           </div>';
calendarHeaderTempalte += '         </div>';
calendarHeaderTempalte += '       </div>';
calendarHeaderTempalte += '     </div>';
calendarHeaderTempalte += '   </div>';