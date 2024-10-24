import React from 'react';

const Calendar = ({ habitIndex, toggleDayCompletion, completedDays = [] }) => {
  const daysInMonth = new Date().getDate(); // Number of days in the current month
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  // Ensure completedDays is always an array
  const safeCompletedDays = Array.isArray(completedDays) ? completedDays : [];

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendar">
      <h4>{currentMonth}</h4>
      <div className="calendar-grid">
        {daysArray.map((day) => (
          <div
            key={day}
            className={`calendar-day ${safeCompletedDays.includes(day) ? 'completed' : ''}`}
            onClick={() => toggleDayCompletion(habitIndex, day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
