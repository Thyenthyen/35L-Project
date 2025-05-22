import React, { useState } from 'react';
import '../style/Calendar.css';

function Calendar() {
  const [date, setDate] = useState(new Date());
  const [showEvent, setShowEvent] = useState(false);
  const [selectDate, setSelectDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ 
    title: ' ',
    date: ' '});

  const handleCreateEvent = () => {
    //alert('Create new event');
    setShowEvent(true);
    setNewEvent ({
      title: ' ',
      date: selectDate || formatDate(date)
    });
  };

  const handleDayClick = (day) => {
    alert(`Clicked day ${day}`);
    const clickDate = new Date(date.getFullYear(), date.getMonth(), day);
    setSelectDate(formatDate(clickDate));
  };

  // i need own code for this call 
  const formatDate = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  }

  const handleInputChange = (client) => {
    const {name, value} = client.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEvent = (client) => {
    client.preventDefault();
    if (newEvent.title && newEvent.date) {
      setEvents([...events, newEvent]);
      setShowEvent(false);
      setNewEvent({ title: ' ', date: ' '});
      alert(`Event "${newEvent.title}" created for ${newEvent.date}`);
    }
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
        <div className="events-list">
          <h3>UpComing Events</h3>
          {events.length > 0 ? (
            <ul>
              {events.map((event, index) => (
                <li key={index}>
                  <strong>{event.date}</strong>: {event.title}
                </li>
              ))}
            </ul>
          ) : (
            <p>No events scheduled</p>
          )}
        </div>
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


    {/* Event Creation Modal */}
    {showEvent && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Create New Event</h3>
          <form onSubmit={handleSubmitEvent}>
            <div className="form-group">
              <label>Event Title:</label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="modal-buttons">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setShowEvent(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
        </div>
    )}
  </div>
  );
}; 

export default Calendar;
