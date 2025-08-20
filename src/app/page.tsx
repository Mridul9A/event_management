'use client';

import { useState } from 'react';
import { Trash2, Calendar, Plus, Search } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  date: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [errors, setErrors] = useState<{ name?: string; date?: string }>({});


  useState(() => {
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }
    }
  });


  const saveToLocalStorage = (newEvents: Event[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(newEvents));
    }
  };

  const validateForm = () => {
    const newErrors: { name?: string; date?: string } = {};

    if (!eventName.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!eventDate) {
      newErrors.date = 'Event date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      name: eventName.trim(),
      date: eventDate,
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveToLocalStorage(updatedEvents);


    setEventName('');
    setEventDate('');
    setErrors({});
  };

  const handleDelete = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    saveToLocalStorage(updatedEvents);
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Manager</h1>
          <p className="text-gray-600">Organize and manage your events</p>
        </div>


        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Event
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                Event Name *
              </label>
              <input
                type="text"
                id="eventName"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="Enter event name"
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
              />

              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          </form>
        </div>

        {/* Search Box */}
        {events.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

            </div>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-md">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {events.length === 0 ? 'No events yet' : 'No events found'}
              </h3>
              <p className="text-gray-500">
                {events.length === 0
                  ? 'Add your first event using the form above'
                  : 'Try adjusting your search query'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              <div className="p-4 bg-gray-50 rounded-t-lg">
                <h3 className="text-lg font-medium text-gray-900">
                  Upcoming Events ({filteredEvents.length})
                </h3>
              </div>
              {filteredEvents
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((event) => (
                  <div key={event.id} className="p-4 hover:bg-gray-50 transition duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">{event.name}</h4>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(event.date)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition duration-200"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Events are automatically saved to your browser's local storage
        </div>
      </div>
    </div>
  );
}