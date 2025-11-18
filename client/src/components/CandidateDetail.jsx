import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

function CandidateDetail({ 
  candidate, 
  isShortlisted, 
  onClose, 
  onAddToShortlist, 
  onRemoveFromShortlist 
}) {
  const score = candidate.score.totalScore;
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const radarData = [
    {
      category: 'Experience',
      value: (candidate.score.breakdown.experience / 35) * 100,
      fullMark: 100,
    },
    {
      category: 'Education',
      value: (candidate.score.breakdown.education / 25) * 100,
      fullMark: 100,
    },
    {
      category: 'Skills',
      value: (candidate.score.breakdown.skills / 20) * 100,
      fullMark: 100,
    },
    {
      category: 'Salary Fit',
      value: (candidate.score.breakdown.salary / 10) * 100,
      fullMark: 100,
    },
    {
      category: 'Availability',
      value: (candidate.score.breakdown.availability / 10) * 100,
      fullMark: 100,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
            <p className="text-sm text-gray-500">{candidate.email} · {candidate.phone}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Score Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
                <p className="text-sm text-gray-600">Automated evaluation based on multiple factors</p>
              </div>
              <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
            </div>

            {/* Score Breakdown Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">Experience</span>
                  <span className="text-gray-900">{candidate.score.breakdown.experience} / 35</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${(candidate.score.breakdown.experience / 35) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">Education</span>
                  <span className="text-gray-900">{candidate.score.breakdown.education} / 25</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${(candidate.score.breakdown.education / 25) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">Skills</span>
                  <span className="text-gray-900">{candidate.score.breakdown.skills} / 20</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-600 h-3 rounded-full"
                    style={{ width: `${(candidate.score.breakdown.skills / 20) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">Salary Fit</span>
                  <span className="text-gray-900">{candidate.score.breakdown.salary} / 10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-yellow-600 h-3 rounded-full"
                    style={{ width: `${(candidate.score.breakdown.salary / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">Availability</span>
                  <span className="text-gray-900">{candidate.score.breakdown.availability} / 10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full"
                    style={{ width: `${(candidate.score.breakdown.availability / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Visualization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-base font-medium text-gray-900">{candidate.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary Expectation</p>
                <p className="text-base font-medium text-gray-900">
                  {candidate.annual_salary_expectation?.['full-time'] || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Work Availability</p>
                <p className="text-base font-medium text-gray-900">
                  {candidate.work_availability?.join(', ') || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted At</p>
                <p className="text-base font-medium text-gray-900">
                  {new Date(candidate.submitted_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Work Experience ({candidate.work_experiences?.length || 0} positions)
            </h3>
            <div className="space-y-3">
              {candidate.work_experiences?.map((exp, index) => (
                <div key={index} className="flex items-start border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{exp.roleName}</p>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Education
            </h3>
            <div className="space-y-4">
              {candidate.education?.degrees?.map((degree, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{degree.degree} in {degree.subject}</p>
                      <p className="text-sm text-gray-600">{degree.originalSchool || degree.school}</p>
                      <p className="text-sm text-gray-500">{degree.startDate} - {degree.endDate}</p>
                      <p className="text-sm text-gray-500">{degree.gpa}</p>
                    </div>
                    {degree.isTop50 && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded font-medium">
                        Top 50
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          {candidate.skills && candidate.skills.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Skills ({candidate.skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
            >
              Close
            </button>
            {isShortlisted ? (
              <button
                onClick={() => {
                  onRemoveFromShortlist(candidate.id);
                  onClose();
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
              >
                Remove from Shortlist
              </button>
            ) : (
              <button
                onClick={() => {
                  onAddToShortlist(candidate.id);
                  onClose();
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Add to Shortlist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateDetail;

