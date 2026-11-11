export default function TeacherCard({ teacher, onSelect }) {
  const isFemale = teacher.gender?.toLowerCase() === 'female';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 p-5 flex flex-col justify-between">
      <div>
        {/* Header with Name/Code and Badges */}
        <div className="flex justify-between items-start mb-4 pb-3 border-b">
          <div>
            <h3 className="text-xl font-bold text-blue-700">
              {teacher.name || 'Registered Teacher'}
            </h3>
            <p className="text-sm text-gray-500">
              {teacher.premiumCode ? `Code: #${teacher.premiumCode}` : 'TSF Teacher'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                isFemale
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {teacher.gender || 'Teacher'}
            </span>
            {teacher.premiumCode && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                ★ Premium
              </span>
            )}
            {teacher.experience && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">
                {teacher.experience}
              </span>
            )}
          </div>
        </div>

        {/* Academic & Area Info Grid (matching TuitionCard 2-col color blocks) */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-xs text-gray-600">Current Area</p>
            <p className="font-semibold text-gray-800 text-sm truncate">
              {teacher.currentArea ? teacher.currentArea.trim() : 'N/A'}
            </p>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <p className="text-xs text-gray-600">Academic Year</p>
            <p className="font-semibold text-gray-800 text-sm capitalize truncate">
              {teacher.academicYear || 'N/A'}
            </p>
          </div>
          <div className="bg-indigo-50 p-2 rounded">
            <p className="text-xs text-gray-600">Honors Dept</p>
            <p className="font-semibold text-gray-800 text-sm truncate">
              {teacher.honorsDept ? teacher.honorsDept.trim() : 'N/A'}
            </p>
          </div>
          <div className="bg-pink-50 p-2 rounded">
            <p className="text-xs text-gray-600">University / College</p>
            <p className="font-semibold text-gray-800 text-sm truncate">
              {teacher.honorsUniversity ? teacher.honorsUniversity.trim() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Subject Highlight (matching TuitionCard yellow-50 block) */}
        <div className="mb-4 p-3 bg-yellow-50 rounded">
          <p className="text-xs text-gray-600">Favorite Subject</p>
          <p className="font-semibold text-gray-800">
            {teacher.favoriteSubject ? teacher.favoriteSubject.trim() : 'All Subjects'}
          </p>
        </div>

        {/* Qualifications Details (matching TuitionCard Teacher Requirements section) */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Qualifications</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Experience:</span>
              <span className="font-semibold">{teacher.experience || 'Not specified'}</span>
            </div>

            <div className="flex justify-between items-start gap-2">
              <span className="text-gray-600 shrink-0">College (HSC):</span>
              <span className="font-semibold text-right truncate">
                {teacher.college ? teacher.college.trim() : 'N/A'}
              </span>
            </div>

            {teacher.isResultShow && teacher.hscResult && (
              <div className="flex justify-between">
                <span className="text-gray-600">HSC GPA:</span>
                <span className="font-semibold text-green-700">
                  {teacher.hscResult} ({teacher.hscGroup || 'N/A'})
                </span>
              </div>
            )}

            {teacher.mastersDept && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-gray-600 shrink-0">Masters:</span>
                <span className="font-semibold text-right text-indigo-700 truncate">
                  {teacher.mastersDept.trim()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Location & Institution Block (matching TuitionCard Location block) */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Location & Category</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-gray-600">Area:</span>{' '}
              {teacher.currentArea ? teacher.currentArea.trim() : 'N/A'}
            </p>
            <p>
              <span className="text-gray-600">University Code:</span>{' '}
              {teacher.uniCode ? teacher.uniCode.trim() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-3 border-t">
        <button
          onClick={() => onSelect(teacher)}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm cursor-pointer shadow-xs"
        >
          View Full Profile
        </button>
      </div>
    </div>
  );
}
