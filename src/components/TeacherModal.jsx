import { useEffect, useState } from 'react';

export default function TeacherModal({ teacher, onClose }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!teacher) return null;

  const isFemale = teacher.gender?.toLowerCase() === 'female';

  const handleCopy = () => {
    const text = [
      `Name: ${teacher.name || 'N/A'}`,
      `Gender: ${teacher.gender || 'N/A'}`,
      `Code: ${teacher.premiumCode || teacher.uniCode || 'N/A'}`,
      `Area: ${teacher.currentArea || 'N/A'}`,
      `Honors: ${teacher.honorsDept || 'N/A'} - ${teacher.honorsUniversity || 'N/A'} (${teacher.academicYear || 'N/A'})`,
      teacher.mastersDept ? `Masters: ${teacher.mastersDept} - ${teacher.mastersUniversity || 'N/A'}` : null,
      `HSC: ${teacher.college || 'N/A'} (${teacher.hscGroup || 'N/A'}${teacher.isResultShow && teacher.hscResult ? `, GPA ${teacher.hscResult}` : ''})`,
      `SSC: ${teacher.school || 'N/A'} (${teacher.sscGroup || 'N/A'}${teacher.isResultShow && teacher.sscResult ? `, GPA ${teacher.sscResult}` : ''})`,
      `Experience: ${teacher.experience || 'N/A'}`,
      `Favorite Subject: ${teacher.favoriteSubject || 'N/A'}`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Code and Badges (Direct from TuitionCard header) */}
        <div className="flex justify-between items-start mb-4 pb-3 border-b">
          <div>
            <h3 className="text-xl font-bold text-blue-700">
              #{teacher.premiumCode || 'TSF'} - {teacher.name || 'Registered Teacher'}
            </h3>
            <p className="text-sm text-gray-500">Gender: {teacher.gender || 'N/A'}</p>
          </div>
          <div className="flex gap-2 items-center">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                isFemale
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {teacher.gender || 'Teacher'}
            </span>
            {teacher.premiumCode ? (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                Published
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                Draft
              </span>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 font-bold px-2 py-0.5 rounded hover:bg-gray-100 text-lg leading-none cursor-pointer"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Student & Class Info block (Direct from TuitionCard 2-col color blocks) */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 p-2 rounded">
            <p className="text-xs text-gray-600">Current Area</p>
            <p className="font-semibold text-gray-800">{teacher.currentArea || 'N/A'}</p>
          </div>
          <div className="bg-purple-50 p-2 rounded">
            <p className="text-xs text-gray-600">Academic Year</p>
            <p className="font-semibold text-gray-800 capitalize">{teacher.academicYear || 'N/A'}</p>
          </div>
          <div className="bg-indigo-50 p-2 rounded">
            <p className="text-xs text-gray-600">Honors Department</p>
            <p className="font-semibold text-gray-800">{teacher.honorsDept || 'N/A'}</p>
          </div>
          <div className="bg-pink-50 p-2 rounded">
            <p className="text-xs text-gray-600">Honors Institute</p>
            <p className="font-semibold text-gray-800 text-sm">{teacher.honorsUniversity || '-'}</p>
          </div>
        </div>

        {/* Subject (Direct from TuitionCard Subject block) */}
        <div className="mb-4 p-3 bg-yellow-50 rounded">
          <p className="text-xs text-gray-600">Favorite Subject</p>
          <p className="font-semibold text-gray-800">{teacher.favoriteSubject || 'All Subjects'}</p>
        </div>

        {/* Teacher & Requirements section (Direct from TuitionCard Teacher Requirements format) */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Academic Qualifications</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Experience:</span>
              <span className="font-semibold">{teacher.experience || 'Not provided'}</span>
            </div>
            <div className="flex justify-between items-start gap-2">
              <span className="text-gray-600 shrink-0">HSC College:</span>
              <span className="font-semibold text-right">{teacher.college || 'N/A'}</span>
            </div>
            {teacher.isResultShow && teacher.hscResult && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-gray-600 shrink-0">HSC Result:</span>
                <span className="font-semibold text-right text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-xs sm:text-sm break-words">
                  GPA {teacher.hscResult} ({teacher.hscGroup || 'N/A'})
                </span>
              </div>
            )}
            <div className="flex justify-between items-start gap-2">
              <span className="text-gray-600 shrink-0">SSC School:</span>
              <span className="font-semibold text-right">{teacher.school || 'N/A'}</span>
            </div>
            {teacher.isResultShow && teacher.sscResult && (
              <div className="flex justify-between items-start gap-2">
                <span className="text-gray-600 shrink-0">SSC Result:</span>
                <span className="font-semibold text-right text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-xs sm:text-sm break-words">
                  GPA {teacher.sscResult} ({teacher.sscGroup || 'N/A'})
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Results Public:</span>
              <span className={teacher.isResultShow ? 'text-green-600 font-semibold' : 'text-gray-500'}>
                {teacher.isResultShow ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule & Salary style block (Direct from TuitionCard Schedule & Salary format) */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded">
            <p className="text-xs text-gray-600">Experience</p>
            <p className="font-semibold text-gray-800">{teacher.experience || 'N/A'}</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-xs text-gray-600">Academic Year</p>
            <p className="font-semibold text-gray-800 capitalize">{teacher.academicYear || 'N/A'}</p>
          </div>
          <div className="col-span-2 bg-orange-100 p-3 rounded border-2 border-orange-300">
            <p className="text-xs text-gray-600">Tutor Code</p>
            <p className="font-bold text-orange-700 text-lg">
              {teacher.premiumCode ? `★ ${teacher.premiumCode}` : teacher.uniCode || 'Standard Registered'}
            </p>
          </div>
        </div>

        {/* Location (Direct from TuitionCard Location block) */}
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Location</h4>
          <div className="space-y-1 text-sm">
            <p><span className="text-gray-600">Current Area:</span> {teacher.currentArea || 'N/A'}</p>
            <p><span className="text-gray-600">University Code:</span> {teacher.uniCode || 'N/A'}</p>
          </div>
        </div>

        {/* Masters block (Direct from TuitionCard Notes & Comments blue-50 border-l-4 border-blue-400 block) */}
        {teacher.mastersDept && (
          <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <h4 className="text-sm font-bold text-gray-700 mb-2">Masters Degree</h4>
            <div className="space-y-2 text-xs text-gray-700">
              <div>
                <p className="font-semibold text-blue-900">Department:</p>
                <p className="italic">{teacher.mastersDept}</p>
              </div>
              <div>
                <p className="font-semibold text-blue-900">University:</p>
                <p className="italic">{teacher.mastersUniversity || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Status & Updates block (Direct from TuitionCard Status & Updates purple-50 block) */}
        <div className="mb-4 p-3 bg-purple-50 rounded">
          <h4 className="text-sm font-bold text-gray-700 mb-2">Status & Verification</h4>
          <div className="space-y-1 text-xs text-gray-700">
            <div className="flex justify-between">
              <span className="text-gray-600">Registration Status:</span>
              <span className="font-semibold text-green-700">Public Registered</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Teacher Code:</span>
              <span className="font-semibold">{teacher.premiumCode || teacher.uniCode || 'TSF'}</span>
            </div>
            <div className="flex justify-between mt-2 pt-2 border-t border-purple-200">
              <span className="text-gray-600">University Category:</span>
              <span className="font-semibold">{teacher.uniCode || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Admin Info (Direct from TuitionCard Admin Info format) */}
        <div className="pt-3 border-t text-xs text-gray-500 space-y-1 mb-4">
          <div className="flex justify-between">
            <span>Teacher ID:</span>
            <span className="font-semibold">{teacher._id}</span>
          </div>
        </div>

        {/* Modal Action Buttons (Direct from App.jsx button styles) */}
        <div className="pt-3 border-t flex justify-end gap-3">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition text-sm cursor-pointer"
          >
            {copied ? 'Copied Details!' : 'Copy Details'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
