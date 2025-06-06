import React, { useState, useEffect } from 'react';
import '../style/Calendar.css';

function Calendar({user}) {
  const [date, setDate] = useState(new Date());
  const [showEvent, setShowEvent] = useState(false);
  const [selectDate, setSelectDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ 
    title: '',
    date: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user && user._id) {
      fetch(`/api/events?userId=${user._id}`, {
        credentials: 'include'
      })
        .then((res) => res.json())
        .then((data) => { setEvents(data);
                          setAllEvents(data)}) // add new state var for allEvents to store all not filtered
        .catch((err) => console.error('Error fetching events:', err));
    }
  }, [user]);

  //Search functonality 
  useEffect(() => {
    if (searchTerm.trim() === ''){
      setEvents(allEvents);
    }else{
      const filtered = allEvents.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        event.date.includes(searchTerm)
      );
      setEvents(filtered);
    }
  }, [searchTerm, allEvents]);

  const handleCreateEvent = () => {
    //alert('Create new event');
    setShowEvent(true);
    setNewEvent ({
      title: '',
      date: selectDate || formatDate(date)
    });
  };

  const handleDayClick = (day) => {
    //alert(`Clicked day ${day}`);
    const clickDate = new Date(date.getFullYear(), date.getMonth(), day);
    setSelectDate(formatDate(clickDate));
    setShowEvent(true);
    setNewEvent ({
      title: '',
      date: formatDate(clickDate)
    });
  };

  // i need own code for this call 
  const formatDate = (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date) {
      fetch('/api/events', {
        method: 'POST',
        credentials: 'include', // Add this
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newEvent.title, 
          date: newEvent.date 
    //...newEvent, userId: user._id <- rm userID here
        })
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Server error ${res.status}`);
          return res.json();
        })
        .then((savedEvent) => { // fixed for search feature
          const updatedEvents = [...allEvents, savedEvent]; 
          setEvents(updatedEvents);
          setAllEvents(updatedEvents);
          setShowEvent(false);
          setNewEvent({ title: '', date: '' });
          alert(`Event "${savedEvent.title}" created for ${savedEvent.date}`);
        })
        .catch((error) => {
          console.error('Failed to save event:', error);
          alert('Failed to save event. See console for details.');
        });
    }
  }; 

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure to delete this event?')){
      try {
        const response = await fetch(`/api/events/${eventId}`,{
          method: 'DELETE',
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json'}
        });
        
        // First check if response is HTML
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Server returned: ${text.substring(0, 100)}...`);
        }

        const result = await response.json(); // Always parse JSON first

        if (!response.ok) {
          // Show detailed error from server
        alert(`Delete failed: ${result.error || 'Unknown error'}`);
        return;
        }
        //Update both event states
        setAllEvents(allEvents.filter(event => event._id !== eventId));
        setEvents(events.filter(event => event._id !== eventId));

        alert('Event deleted successfully');
      }
      catch (error) {
        // Network errors or JSON parsing errors
      alert(`Delete failed: ${error.message}`);
      }
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

        {/*Search bar feature*/}
        <div className="search-container">
          <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="events-list">
          <h3>UpComing Events</h3>
          {events.length > 0 ? (
            <ul>
              {events.map((event) => (
                <li key={event._id}>
                  <strong>{event.date}</strong>: {event.title}
                </li>
              ))}
            </ul>
          ) : (
            //*fixed to opt no event after search*/
            <p>{searchTerm ? 'No matching events found' : ' No evnts scheduled'}</p>
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
                {/*Showed event indicators on calendar days */}
                {allEvents.filter(event =>
                  event.date === formatDate(new Date(date.getFullYear(), date.getMonth(), index +1))
                ).length > 0 && (
                  <div className="event-indicator"></div>
                )}
              </div>
        ))}
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
                value={newEvent.title || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={newEvent.date || ''}
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
