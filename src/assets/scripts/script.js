'use strict';

// import the third-party stylesheets directly from your JS
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // needs additional webpack config!

import bootstrap5Plugin from '@fullcalendar/bootstrap5';

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
  dayMaxEventRows: true,
  initialView: 'dayGridMonth',
  headerToolbar: {
    center: 'multiMonthYear,dayGridMonth,dayGridWeek,dayGridDay',
  },
  firstDay: 1,
  // showNonCurrentDates: false,
  weekNumbers: true,
  selectable: true,

  eventDidMount: function (date) {
    tippy(date.el, {
      content: date.event.extendedProps.description,
    });
  },

  eventClick: function (data) {
    fetch(`http://localhost:8080/events/${data.event.id}`, {
      method: 'DELETE',
    })
      .then(() => data.event.remove())
      .catch((error) => console.error(error));
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

  eventBackgroundColor: 'red',

  select: function (selectionInfo) {
    $('#dialog').dialog('open');
    $('#start').val(selectionInfo.startStr);
    $('#end').val(selectionInfo.endStr);
  },
  dateClick: function (date) {
    const clickDate = date.dateStr;

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
        `${date.event.title} was dropped on ${date.event.startStr}. Are you sure about this change?`
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
    $('#description').val('');
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
        .then((resp) => {
          clearVal();

          // calendar.addEvent({
          //   title: event.title,
          //   start: event.start,
          //   end: event.end,
          //   description: event.description,
          // });
          calendar.refetchEvents();

          $('#dialog').dialog('close');
        })
        .catch((err) => console.error('Error', err));
    }
  });
});
