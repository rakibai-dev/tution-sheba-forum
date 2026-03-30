import { useState, useMemo, useEffect } from 'react'
import TuitionCard from './components/TuitionCard'
import './App.css'

function App() {
  const [tuitionData, setTuitionData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [salaryMin, setSalaryMin] = useState('6000')
  const [salaryMax, setSalaryMax] = useState('')
  const [teacherPreference, setTeacherPreference] = useState('male')
  const [city, setCity] = useState('all')

  // Fetch data from API
  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('https://tuition-seba-backend-1.onrender.com/api/tuition/available')
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        setTuitionData(Array.isArray(data) ? data : data.data || [])
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch tuitions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTuitions()
  }, [])

  // Extract unique cities and salary values for filtering
  const cities = ['all', ...new Set(tuitionData.map(t => t.city?.toLowerCase()).filter(Boolean))]
  
  // Extract min/max salary for reference (parsing numeric values from salary strings)
  const salaryValues = tuitionData
    .map(t => {
      const match = t.salary?.match(/\d+/)
      return match ? parseInt(match[0]) : 0
    })
    .filter(v => v > 0)
    .sort((a, b) => a - b)

  const minSalary = 6000
  const maxSalary = Math.max(minSalary, salaryValues[salaryValues.length - 1] || 50000)

  // Filter logic
  const filteredData = useMemo(() => {
    return tuitionData.filter(tuition => {
      // Search term filter (class, subject, city, area)
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm || 
        tuition.class?.toLowerCase().includes(searchLower) ||
        tuition.subject?.toLowerCase().includes(searchLower) ||
        tuition.city?.toLowerCase().includes(searchLower) ||
        tuition.area?.toLowerCase().includes(searchLower) ||
        tuition.tuitionCode?.includes(searchTerm)

      // City filter
      const matchesCity = city === 'all' || tuition.city?.toLowerCase() === city

      // Teacher preference filter
      const wantedTeacher = tuition.wantedTeacher || ''
      const hasMale = /\bmale\b/i.test(wantedTeacher)
      const hasFemale = /\bfemale\b/i.test(wantedTeacher)
      const matchesTeacher = teacherPreference === 'all' ||
        (teacherPreference === 'male' && hasMale) ||
        (teacherPreference === 'female' && hasFemale)

      // Salary range filter
      const salaryMatch = tuition.salary?.match(/\d+/)
      const tuitionSalary = salaryMatch ? parseInt(salaryMatch[0]) : 0
      const minSalaryNum = salaryMin ? parseInt(salaryMin) : minSalary
      const maxSalaryNum = salaryMax ? parseInt(salaryMax) : maxSalary
      const matchesSalary = tuitionSalary >= minSalaryNum && tuitionSalary <= maxSalaryNum

      return matchesSearch && matchesCity && matchesTeacher && matchesSalary
    })
  }, [tuitionData, searchTerm, salaryMin, salaryMax, teacherPreference, city, minSalary, maxSalary])

  const resetFilters = () => {
    setSearchTerm('')
    setSalaryMin('6000')
    setSalaryMax('')
    setTeacherPreference('male')
    setCity('all')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading tuition opportunities...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tuition Forum</h1>
          <p className="text-gray-600">Explore {filteredData.length} of {tuitionData.length} available tuition opportunities</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Search & Filter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Search Term */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search by Class, Subject, City, Area
              </label>
              <input
                type="text"
                placeholder="e.g., Class 4, English, Chittagong..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {cities.map(c => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Cities' : c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Teacher Preference */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teacher Preference
              </label>
              <select
                value={teacherPreference}
                onChange={(e) => setTeacherPreference(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Salary (৳)
              </label>
              <input
                type="number"
                min={6000}
                placeholder={`Min (${minSalary})`}
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maximum Salary (৳)
              </label>
              <input
                type="number"
                placeholder={`Max (${maxSalary})`}
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-blue-600">{filteredData.length}</span> results
          </p>
        </div>

        {/* Cards Grid */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(tuition => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Results Found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
