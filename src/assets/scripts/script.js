// import the third-party stylesheets directly from your JS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // needs additional webpack config!

import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { dA } from '@fullcalendar/core/internal-common';
import { preventDefault } from '@fullcalendar/core/internal';

document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    eventSources: [
      {
        events: function (info, successCallback, failureCallback) {
          fetch('http://localhost:8080/events')
            .then((response) => response.json())
            .then((result) => {
              successCallback(result);
            });
        },
        // color: 'rgb(25, 10, 226)', // an option!
        // textColor: 'white', // an option!
      },
    ],
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

    eventClick: function (data) {
      console.log(data.event.title);
      console.log(data.event.id);
    },

    select: function (selectionInfo) {
      $('#dialog').dialog('open');
      $('#start').val(selectionInfo.startStr);
      $('#end').val(selectionInfo.endStr);
      console.log(
        'selection is ',
        selectionInfo.startStr,
        ' to ',
        selectionInfo.endStr
      );
    },
    dateClick: function (date) {
      // console.log(date);
      const clickDate = date.dateStr;
      console.log('clicked on ' + clickDate);
      $('#dialog').dialog('open');
      $('#start').val(clickDate);
    },
  });
  calendar.render();
});
$(function () {
  $('#dialog').dialog({
    autoOpen: false,
    show: {
      effect: 'fold',
    },
    hide: {
      effect: 'fold',
    },
  });

  $('.datepicker').datepicker({
    dateFormat: 'yy-mm-dd',
  });

  $('form').submit(function (e) {
    e.preventDefault();
    console.log(e.target);
  });
});
