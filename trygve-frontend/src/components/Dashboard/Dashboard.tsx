import React, { useState } from 'react';
import { Calendar, Clock, User, Settings, Bell, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      time: '10:00 AM',
      date: '2024-01-15',
      status: 'upcoming'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatologist',
      time: '2:30 PM',
      date: '2024-01-16',
      status: 'upcoming'
    },
    {
      id: 3,
      doctor: 'Dr. Emma Wilson',
      specialty: 'General Practitioner',
      time: '9:15 AM',
      date: '2024-01-18',
      status: 'upcoming'
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const hasAppointment = (date: Date) => {
    return appointments.some(apt => 
      new Date(apt.date).toDateString() === date.toDateString()
    );
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', fontFamily: 'Audiowide, cursive' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/logo.png" alt="Trygve Logo" style={{
                width: '40px',
                height: '40px',
                marginRight: '0.75rem',
                objectFit: 'contain'
              }} />
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                color: '#111827',
                fontFamily: 'Audiowide, cursive'
              }}>
                Trygve Dashboard
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button style={{
                padding: '0.5rem',
                color: '#6B7280',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <Bell style={{ width: '20px', height: '20px' }} />
              </button>
              <button style={{
                padding: '0.5rem',
                color: '#6B7280',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <Settings style={{ width: '20px', height: '20px' }} />
              </button>
              <div style={{
                background: '#2563EB',
                borderRadius: '50%',
                padding: '0.5rem'
              }}>
                <User style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => (
                  <div key={index} className="aspect-square">
                    {date && (
                      <button
                        onClick={() => setSelectedDate(date)}
                        className={`w-full h-full flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 relative ${
                          isToday(date)
                            ? 'bg-blue-600 text-white'
                            : isSameDay(date, selectedDate)
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {date.getDate()}
                        {hasAppointment(date) && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                        <p className="text-sm text-gray-600 mb-2">{appointment.specialty}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {appointment.time}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-blue-700">Schedule Appointment</span>
                  </button>
                  <button className="flex items-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <User className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-green-700">Find Doctor</span>
                  </button>
                  <button className="flex items-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <Clock className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-purple-700">Medical History</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;