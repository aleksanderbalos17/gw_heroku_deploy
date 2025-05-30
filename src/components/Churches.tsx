import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Pencil, Trash2, ChevronDown, ChevronUp, MapPin, Users } from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  role: string;
}

interface EventLocation {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface Church {
  id: string;
  name: string;
  photo: string;
  denomination: string;
  speakers: Speaker[];
  address: string;
  latitude: number;
  longitude: number;
  eventLocations: EventLocation[];
  created_at: string;
  updated_at: string | null;
}

interface DeleteLocationModalProps {
  churchName: string;
  location: EventLocation;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteLocationModal({ churchName, location, onClose, onConfirm }: DeleteLocationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Event Location</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this event location from {churchName}?
          <br />
          <span className="text-sm font-medium mt-2 block">{location.address}</span>
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function Churches() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChurch, setExpandedChurch] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ church: Church; location: EventLocation } | null>(null);
  
  const [churches, setChurches] = useState<Church[]>(
    Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Church ${i + 1}`,
      photo: `https://images.pexels.com/photos/208736/pexels-photo-208736.jpeg?auto=compress&cs=tinysrgb&w=300`,
      denomination: ['Anglican', 'Catholic', 'Methodist', 'Baptist'][i % 4],
      speakers: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
        id: `${i}-${j}`,
        name: `Speaker ${j + 1}`,
        role: ['Pastor', 'Minister', 'Reverend', 'Priest'][j % 4]
      })),
      address: `${100 + i} Main Street, ${['London', 'Manchester', 'Birmingham'][i % 3]}, UK`,
      latitude: 51.5074 + (Math.random() * 0.1),
      longitude: -0.1278 + (Math.random() * 0.1),
      eventLocations: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
        id: `${i}-${j}`,
        address: `${123 + j} Church Street, ${['Leeds', 'Bristol', 'Liverpool'][j % 3]}, UK`,
        latitude: 51.5074 + (Math.random() * 0.1),
        longitude: -0.1278 + (Math.random() * 0.1),
      })),
      created_at: '2024-03-21 14:30:00',
      updated_at: i % 3 === 0 ? '2024-03-22 09:15:00' : null
    }))
  );

  const handleDeleteLocation = (church: Church, location: EventLocation) => {
    setSelectedLocation({ church, location });
  };

  const handleDeleteLocationConfirm = () => {
    if (selectedLocation) {
      const { church, location } = selectedLocation;
      setChurches(churches.map(c => {
        if (c.id === church.id) {
          return {
            ...c,
            eventLocations: c.eventLocations.filter(l => l.id !== location.id)
          };
        }
        return c;
      }));
      setSelectedLocation(null);
    }
  };

  const itemsPerPage = 10;
  const filteredChurches = churches.filter(church => 
    church.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    church.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    church.denomination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    church.eventLocations.some(loc => loc.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const totalPages = Math.ceil(filteredChurches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedChurches = filteredChurches.slice(startIndex, startIndex + itemsPerPage);

  const toggleExpand = (churchId: string) => {
    setExpandedChurch(expandedChurch === churchId ? null : churchId);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Churches</h1>
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search churches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-6 py-3"></th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speakers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Locations</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedChurches.map((church) => (
              <React.Fragment key={church.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleExpand(church.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {expandedChurch === church.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={church.photo} 
                      alt={church.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{church.name}</div>
                    <div className="text-sm text-gray-500">{church.denomination}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-900">
                        {church.speakers.map((speaker, index) => (
                          <div key={speaker.id}>
                            {speaker.name}
                            <span className="text-gray-500"> • {speaker.role}</span>
                            {index < church.speakers.length - 1 && <br />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{church.address}</div>
                    <div className="text-sm text-gray-500">
                      {church.latitude.toFixed(6)}, {church.longitude.toFixed(6)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{church.eventLocations.length} location(s)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {}}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {}}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedChurch === church.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Event Locations</h4>
                        {church.eventLocations.map((location) => (
                          <div key={location.id} className="flex items-start justify-between p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-start space-x-4">
                              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{location.address}</div>
                                <div className="text-sm text-gray-500">
                                  Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteLocation(church, location)}
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredChurches.length)}
                </span>{' '}
                of <span className="font-medium">{filteredChurches.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {selectedLocation && (
        <DeleteLocationModal
          churchName={selectedLocation.church.name}
          location={selectedLocation.location}
          onClose={() => setSelectedLocation(null)}
          onConfirm={handleDeleteLocationConfirm}
        />
      )}
    </div>
  );
}