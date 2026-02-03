import React, { useState } from 'react'
import api from '../api'

export default function AddRoom({ onAddRoom, existingRooms }) {
  const [formData, setFormData] = useState({
    roomNo: '',
    capacity: '',
    hasAC: false,
    hasAttachedWashroom: false
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [apiError, setApiError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.roomNo.trim()) {
      newErrors.roomNo = 'Room number is required'
    } else if (existingRooms.some(room => room.roomNo === formData.roomNo)) {
      newErrors.roomNo = 'Room number already exists'
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const newRoom = {
      roomNo: formData.roomNo.trim(),
      capacity: parseInt(formData.capacity),
      hasAC: formData.hasAC,
      hasAttachedWashroom: formData.hasAttachedWashroom
    }

    setSubmitting(true)
    setApiError('')

    api
      .post('/api/rooms', newRoom)
      .then((response) => {
        onAddRoom(response.data)

        setFormData({
          roomNo: '',
          capacity: '',
          hasAC: false,
          hasAttachedWashroom: false
        })

        setErrors({})
        setSuccessMessage(`Room ${response.data.roomNo} added successfully!`)
        setTimeout(() => setSuccessMessage(''), 3000)
      })
      .catch((error) => {
        const message = error.response?.data?.message || 'Failed to add room. Please try again.'
        setApiError(message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
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
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Room</h2>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          ✓ {successMessage}
        </div>
      )}

      {apiError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Room Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Room Number *
          </label>
          <input
            type="text"
            name="roomNo"
            value={formData.roomNo}
            onChange={handleChange}
            placeholder="e.g., 101, A-201"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.roomNo
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.roomNo && (
            <p className="text-red-600 text-sm mt-1">✗ {errors.roomNo}</p>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Capacity (Number of Students) *
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="e.g., 2, 4"
            min="1"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.capacity
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.capacity && (
            <p className="text-red-600 text-sm mt-1">✗ {errors.capacity}</p>
          )}
        </div>

        {/* Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasAC"
              checked={formData.hasAC}
              onChange={handleChange}
              id="hasAC"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="hasAC" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
              Air Conditioning (AC)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="hasAttachedWashroom"
              checked={formData.hasAttachedWashroom}
              onChange={handleChange}
              id="hasAttachedWashroom"
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="hasAttachedWashroom" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
              Attached Washroom
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors ${
            submitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {submitting ? 'Adding Room...' : '➕ Add Room'}
        </button>
      </form>
    </div>
  )
}
