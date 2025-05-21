import React, { useState } from 'react';
import '../style/Calendar.css';

function Calendar() {
  const [date, setDate] = useState(new Date());

  const handleCreateEvent = () => {
    alert('Create new event');
  };

  const handleDayClick = (day) => {
    alert(`Clicked day ${day}`);
  };

  const currentMonthName = date.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const changeMonth = (offset) => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + offset, 1);
    setDate(newDate);
  };

  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar-container">
      <div className="sidebar">
        <h2>Calendar</h2>
        <button onClick={handleCreateEvent}>+ Create Event</button>
      </div>
      <div className="main-calendar">
        <div className="calendar-header">
          <h1 className="month-title">{currentMonthName}</h1>
          <div className="month-buttons">
            <button onClick={() => changeMonth(-1)}>&lt;</button>
            <button onClick={() => changeMonth(1)}>&gt;</button>
          </div>
        </div>

        <div className="calendar-grid-container">
          <div className="weekdays">
            {weekDays.map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
          {
            // Add empty divs for offset
            [...Array(new Date(date.getFullYear(), date.getMonth(), 1).getDay())].map((_, i) => (
              <div key={`empty-${i}`} className="empty"></div>
            ))
          }
          {
            // Render each actual day
            [...Array(daysInMonth)].map((_, index) => (
              <div
                key={index}
                className="day"
                onClick={() => handleDayClick(index + 1)}
              >
                <strong>{index + 1}</strong>
              </div>
            ))
          }
        </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
