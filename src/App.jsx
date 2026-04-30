import { useState, useMemo, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import TuitionCard from './components/TuitionCard'
import './App.css'

const getDaysPerWeek = (dayValue) => {
  if (!dayValue) return null
  const match = String(dayValue).match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}

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

      const matchesDays = getDaysPerWeek(tuition.day) === 3

      return matchesSearch && matchesCity && matchesTeacher && matchesSalary && matchesDays
    })
  }, [tuitionData, searchTerm, salaryMin, salaryMax, teacherPreference, city, minSalary, maxSalary])

  const displayFilteredCount = loading ? '...' : filteredData.length
  const displayTotalCount = loading ? '...' : tuitionData.length
  const skeletonItems = Array.from({ length: 6 })

  const resetFilters = () => {
    setSearchTerm('')
    setSalaryMin('6000')
    setSalaryMax('')
    setTeacherPreference('male')
    setCity('all')
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
          <p className="text-gray-600">Explore {displayFilteredCount} of {displayTotalCount} available tuition opportunities</p>
          <p className="text-sm text-gray-500">Showing only tuitions with 3 days/week</p>
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
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100"
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
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100"
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
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100"
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
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100"
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
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                disabled={loading}
                className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-blue-600">{displayFilteredCount}</span> results
          </p>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skeletonItems.map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-5 animate-pulse min-h-[520px] flex flex-col"
              >
                <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-100">
                  <div className="space-y-2">
                    <div className="h-5 w-20 bg-gray-200 rounded"></div>
                    <div className="h-3 w-28 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="h-12 bg-gray-100 rounded"></div>
                  <div className="h-12 bg-gray-100 rounded"></div>
                  <div className="h-12 bg-gray-100 rounded"></div>
                  <div className="h-12 bg-gray-100 rounded"></div>
                </div>
                <div className="h-16 bg-gray-100 rounded mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                  <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="h-12 bg-gray-100 rounded"></div>
                  <div className="h-12 bg-gray-100 rounded"></div>
                  <div className="col-span-2 h-12 bg-gray-100 rounded"></div>
                </div>
                <div className="mt-auto h-10 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredData.length > 0 ? (
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
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
      <Analytics />
    </div>
  )
}

export default App
