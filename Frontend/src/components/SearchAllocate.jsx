import React, { useState } from 'react'
import api from '../api'

export default function SearchAllocate() {
  const [searchCriteria, setSearchCriteria] = useState({
    studentCount: '',
    needsAC: false,
    needsWashroom: false,
    studentName: '',
    studentId: ''
  })

  const [filteredRooms, setFilteredRooms] = useState([])
  const [allocatedRoom, setAllocatedRoom] = useState(null)
  const [studentAllocation, setStudentAllocation] = useState(null)
  const [errors, setErrors] = useState({})
  const [searched, setSearched] = useState(false)
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()

    const newErrors = {}

    if (!searchCriteria.studentCount || searchCriteria.studentCount <= 0) {
      newErrors.studentCount = 'Student count must be a positive number'
    }

    // Additional validation for student information based allocation
    if (!searchCriteria.studentName.trim()) {
      newErrors.studentName = 'Student name is required for allocation'
    }

    if (!searchCriteria.studentId.trim()) {
      newErrors.studentId = 'Student ID / Roll No is required for allocation'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    const students = parseInt(searchCriteria.studentCount)

    setLoading(true)
    setApiError('')

    try {
      const [searchResponse, allocateResponse] = await Promise.all([
        api.get('/api/rooms/search', {
          params: {
            capacity: students,
            hasAC: searchCriteria.needsAC,
            hasAttachedWashroom: searchCriteria.needsWashroom
          }
        }),
        api.post('/api/rooms/allocate', {
          students,
          needsAC: searchCriteria.needsAC,
          needsWashroom: searchCriteria.needsWashroom
        })
      ])

      const filtered = searchResponse.data || []
      setFilteredRooms(filtered)

      if (allocateResponse.data && allocateResponse.data.message === 'No room available') {
        setAllocatedRoom(null)
        setStudentAllocation(null)
      } else {
        const allocated = allocateResponse.data || null
        setAllocatedRoom(allocated)

        const allocationWithStudentInfo = allocated
          ? {
              room: allocated,
              studentName: searchCriteria.studentName.trim(),
              studentId: searchCriteria.studentId.trim(),
              studentCount: students
            }
          : null

        setStudentAllocation(allocationWithStudentInfo)
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to search or allocate rooms'
      setApiError(message)
      setFilteredRooms([])
      setAllocatedRoom(null)
      setStudentAllocation(null)
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }

  const handleCriteriaChange = (e) => {
    const { name, value, type, checked } = e.target
    setSearchCriteria(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🔍 Search & Smart Allocation</h2>

      {/* Search Form */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {apiError}
          </div>
        )}
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Student Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Students *
            </label>
            <input
              type="number"
              name="studentCount"
              value={searchCriteria.studentCount}
              onChange={handleCriteriaChange}
              placeholder="e.g., 2, 3"
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.studentCount
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.studentCount && (
              <p className="text-red-600 text-sm mt-1">✗ {errors.studentCount}</p>
            )}
          </div>

          {/* Student Information (New Functional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                name="studentName"
                value={searchCriteria.studentName}
                onChange={handleCriteriaChange}
                placeholder="e.g., John Doe"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.studentName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.studentName && (
                <p className="text-red-600 text-sm mt-1">✗ {errors.studentName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Student ID / Roll No *
              </label>
              <input
                type="text"
                name="studentId"
                value={searchCriteria.studentId}
                onChange={handleCriteriaChange}
                placeholder="e.g., 22CSE038"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.studentId
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.studentId && (
                <p className="text-red-600 text-sm mt-1">✗ {errors.studentId}</p>
              )}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="needsAC"
                checked={searchCriteria.needsAC}
                onChange={handleCriteriaChange}
                id="needsAC"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="needsAC" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                Requires Air Conditioning (AC)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="needsWashroom"
                checked={searchCriteria.needsWashroom}
                onChange={handleCriteriaChange}
                id="needsWashroom"
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="needsWashroom" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                Requires Attached Washroom
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {loading ? 'Searching...' : '🔍 Search Rooms'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      {searched && (
        <div className="space-y-8">
          {/* Allocation Result */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border-2 border-purple-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Smart Allocation Result</h3>
            {allocatedRoom ? (
              <div className="bg-white rounded-lg p-4 border-2 border-green-500">
                <div className="flex items-center mb-3">
                  <span className="text-3xl mr-3">✅</span>
                  <div>
                    <p className="text-sm text-gray-600">Allocated Room:</p>
                    <p className="text-2xl font-bold text-green-600">#{allocatedRoom.roomNo}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Capacity:</span> {allocatedRoom.capacity} students
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">AC:</span>{' '}
                    <span className={allocatedRoom.hasAC ? 'text-blue-600 font-semibold' : 'text-gray-600'}>
                      {allocatedRoom.hasAC ? '✓ Available' : '✗ Not Available'}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Attached Washroom:</span>{' '}
                    <span className={allocatedRoom.hasAttachedWashroom ? 'text-green-600 font-semibold' : 'text-gray-600'}>
                      {allocatedRoom.hasAttachedWashroom ? '✓ Available' : '✗ Not Available'}
                    </span>
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  This is the smallest room that meets all your requirements.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 border-2 border-red-500">
                <div className="flex items-center">
                  <span className="text-3xl mr-3">❌</span>
                  <div>
                    <p className="text-red-600 font-bold">No Room Available</p>
                    <p className="text-sm text-gray-600 mt-1">
                      No suitable room found matching your requirements.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Student Allocation Details (New Functional) */}
          {studentAllocation && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">🧑‍🎓 Student Allocation Details</h3>
              <div className="bg-white rounded-lg p-4 border border-green-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Student Name:</span> {studentAllocation.studentName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Student ID / Roll No:</span> {studentAllocation.studentId}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Number of Students:</span> {studentAllocation.studentCount}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Allocated Room:</span> #{studentAllocation.room.roomNo}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Available Rooms List */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              📋 All Matching Rooms ({filteredRooms.length})
            </h3>
            {filteredRooms.length > 0 ? (
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-300">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Room No</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Capacity</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">AC</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Attached Washroom</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map((room, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-200 transition ${
                          allocatedRoom?.roomNo === room.roomNo
                            ? 'bg-green-50 hover:bg-green-100'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 font-semibold text-gray-800">#{room.roomNo}</td>
                        <td className="px-6 py-4 text-gray-700">{room.capacity} students</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            room.hasAC
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {room.hasAC ? '✓ Yes' : '✗ No'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            room.hasAttachedWashroom
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {room.hasAttachedWashroom ? '✓ Yes' : '✗ No'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {allocatedRoom?.roomNo === room.roomNo ? (
                            <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                              ✓ Allocated
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-300 text-gray-800 rounded-full text-sm font-semibold">
                              Available
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-600">No matching rooms found.</p>
              </div>
            )}

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 transition ${
                      allocatedRoom?.roomNo === room.roomNo
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-gray-800">Room #{room.roomNo}</h4>
                      {allocatedRoom?.roomNo === room.roomNo && (
                        <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-bold">
                          ✓ Allocated
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <span className="font-semibold">Capacity:</span> {room.capacity} students
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">AC:</span>{' '}
                        <span className={room.hasAC ? 'text-blue-600' : 'text-gray-600'}>
                          {room.hasAC ? '✓ Yes' : '✗ No'}
                        </span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Attached Washroom:</span>{' '}
                        <span className={room.hasAttachedWashroom ? 'text-green-600' : 'text-gray-600'}>
                          {room.hasAttachedWashroom ? '✓ Yes' : '✗ No'}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600">No matching rooms found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!searched && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-gray-600 font-medium">
            Enter search criteria and click "Search Rooms" to find the best available room.
          </p>
        </div>
      )}
    </div>
  )
}
