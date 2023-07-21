'use strict';

// import the third-party stylesheets directly from your JS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // needs additional webpack config!

import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { dA } from '@fullcalendar/core/internal-common';
import { preventDefault } from '@fullcalendar/core/internal';

// document.addEventListener('DOMContentLoaded', function () {
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
  editable: true,
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

  eventMouseEnter: function (date) {
    // console.log(mouseEnterInfo);
    console.log(date.event.id);
    fetch(`http://localhost:8080/events?title_like=${date.event.title}`, {
      method: 'GET',
    })
      .then((resp) => resp.json())
      .then(([result]) => console.log(result.id));
    // console.log(mouseEnterInfo.el);
    // console.log(mouseEnterInfo.jsEvent);
    // console.log(mouseEnterInfo.view);
  },

  eventClick: function (data) {
    console.log(data.event.title);
    console.log(data.event.id);
    fetch(`http://localhost:8080/events/${data.event.id}`, {
      method: 'DELETE',
    })
      .then(() => data.event.remove())
      .catch((error) => console.error(error));
    // data.event.remove();
  },

  eventResize: function (date) {
    const event = {
      end: date.event.endStr,
    };

    if (
      !confirm(
        `${date.event.title} end is now ${date.event.endStr}. Is this okay?`
      )
    ) {
      date.revert();
    } else {
      fetch(`http://localhost:8080/events/${date.event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch((error) => console.error(error));
    }
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

  eventDrop: function (date) {
    const event = {
      start: date.event.startStr,
      end: date.event.endStr,
    };

    if (
      !confirm(
        `${
          date.event.title
        } was dropped on ${date.event.start.toISOString()}. Are you sure about this change?`
      )
    ) {
      date.revert();
    } else {
      fetch(`http://localhost:8080/events/${date.event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }).catch((error) => console.error(error));
    }
  },
});
calendar.render();
// });

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

  function clearVal() {
    $('#title').val('');
  }

  $('form').submit(function (e) {
    e.preventDefault();
    const event = {
      title: $('#title').val(),
      start: $('#start').val(),
      end: $('#end').val(),
      description: $('#description').val(),
    };
    if ($('#title').val()) {
      fetch('http://localhost:8080/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
        .then((response) => {
          clearVal();
          console.log(calendar);
          calendar.addEvent({
            title: event.title,
            start: event.start,
            end: event.end,
            description: event.description,
          });

          $('#dialog').dialog('close');
        })
        .catch((err) => console.error('Error', err));
    }

    // $('#dialog').dialog('close');
  });
});
