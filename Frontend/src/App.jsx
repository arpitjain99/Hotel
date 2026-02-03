import React, { useState, useEffect } from 'react'
import AddRoom from './components/AddRoom'
import RoomList from './components/RoomList'
import SearchAllocate from './components/SearchAllocate'
import api from './api'

export default function App() {
  const [rooms, setRooms] = useState([])
  const [activeTab, setActiveTab] = useState('add')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRooms = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/api/rooms')
      setRooms(response.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rooms from server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const addRoom = (newRoom) => {
    setRooms(prev => [...prev, newRoom])
  }

  const deleteRoom = async (roomNo) => {
    try {
      await api.delete(`/api/rooms/${roomNo}`)
      setRooms(prev => prev.filter(room => room.roomNo !== roomNo))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete room')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white">
            🏢 Smart Hostel Room Allocation System
          </h1>
          <p className="text-blue-100 mt-2">Intelligent room management and allocation</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'add'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ➕ Add Room
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'view'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            👀 View Rooms ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'search'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔍 Search & Allocate
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'add' && <AddRoom onAddRoom={addRoom} existingRooms={rooms} />}
          {activeTab === 'view' && (
            <>
              {loading ? (
                <p className="text-gray-600">Loading rooms...</p>
              ) : (
                <RoomList rooms={rooms} onDeleteRoom={deleteRoom} />
              )}
            </>
          )}
          {activeTab === 'search' && <SearchAllocate />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-4 mt-12">
        <p>Smart Hostel Room Allocation System v1.0 | Built with React & Tailwind CSS</p>
      </footer>
    </div>
  )
}
