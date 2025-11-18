function CandidateCard({ 
  candidate, 
  isShortlisted, 
  onAddToShortlist, 
  onRemoveFromShortlist,
  onViewDetails 
}) {
  const score = candidate.score.totalScore;
  
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Below Average';
  };

  const salary = candidate.annual_salary_expectation?.['full-time'] || 'N/A';
  const topSkills = candidate.skills?.slice(0, 3) || [];
  const experienceCount = candidate.work_experiences?.length || 0;
  const topRole = candidate.work_experiences?.[0]?.roleName || 'N/A';

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {candidate.name}
            </h3>
            <p className="text-sm text-gray-500">{candidate.location}</p>
          </div>
          <div className={`ml-4 px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
        </div>

        {/* Score Badge */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getScoreColor(score)}`}>
            {getScoreBadge(score)}
          </span>
        </div>

        {/* Score Breakdown */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Experience</span>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(candidate.score.breakdown.experience / 35) * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-900 font-medium w-8 text-right">
                {candidate.score.breakdown.experience}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Education</span>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${(candidate.score.breakdown.education / 25) * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-900 font-medium w-8 text-right">
                {candidate.score.breakdown.education}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Skills</span>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${(candidate.score.breakdown.skills / 20) * 100}%` }}
                ></div>
              </div>
              <span className="text-gray-900 font-medium w-8 text-right">
                {candidate.score.breakdown.skills}
              </span>
            </div>
          </div>
        </div>

        {/* Key Info */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{experienceCount} positions · Latest: {topRole}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-gray-900">{salary}</span>
          </div>
        </div>

        {/* Skills */}
        {topSkills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {topSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                  +{candidate.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(candidate)}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
          >
            View Details
          </button>
          {isShortlisted ? (
            <button
              onClick={() => onRemoveFromShortlist(candidate.id)}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={() => onAddToShortlist(candidate.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Shortlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CandidateCard;

