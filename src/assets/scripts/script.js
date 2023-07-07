// import the third-party stylesheets directly from your JS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // needs additional webpack config!

import bootstrap5Plugin from '@fullcalendar/bootstrap5';

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    plugins: [bootstrap5Plugin],
    themeSystem: 'bootstrap5',
    windowResizeDelay: 50,
    initialView: 'dayGridMonth',
    headerToolbar: {
      center: 'multiMonthYear,dayGridMonth,dayGridWeek,dayGridDay',
    },
    firstDay: 1,
    showNonCurrentDates: false,
    weekNumbers: true,
    selectable: true,
    select: function (selectionInfo) {
      console.log(
        'selection is ',
        selectionInfo.startStr,
        ' to ',
        selectionInfo.endStr
      );
    },
    dateClick: function (info) {
      console.log('clicked on ' + info.dateStr);
    },
  });
  calendar.render();
});
