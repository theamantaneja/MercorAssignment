import { useState, useEffect } from 'react';
import { api } from '../services/api';

function Shortlist({ shortlistedIds, onRemoveFromShortlist, onViewCandidate, onProceedToFinal }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCandidates();
  }, [shortlistedIds]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const candidatePromises = shortlistedIds.map(id => api.getCandidate(id));
      const loadedCandidates = await Promise.all(candidatePromises);
      setCandidates(loadedCandidates);
    } catch (error) {
      console.error('Error loading shortlisted candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-6xl mb-4">⭐</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No candidates shortlisted yet</h2>
        <p className="text-gray-600 mb-6">
          Browse the candidate pool and add up to 5 candidates to your shortlist.
        </p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Shortlist</h2>
          <p className="text-gray-600 mt-1">
            {candidates.length} of 5 candidates selected
          </p>
        </div>
        {candidates.length === 5 && (
          <button
            onClick={onProceedToFinal}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium flex items-center"
          >
            Proceed to Final Selection
            <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}
      </div>

      {candidates.length < 5 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                You need to select exactly 5 candidates to proceed to the final selection.
                Currently selected: <strong>{candidates.length}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates
                .sort((a, b) => b.score.totalScore - a.score.totalScore)
                .map((candidate, index) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                        <div className="text-sm text-gray-500">{candidate.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(candidate.score.totalScore)}`}>
                        {candidate.score.totalScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.work_experiences?.length || 0} positions
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.education?.highest_level || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {candidate.annual_salary_expectation?.['full-time'] || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => onViewCandidate(candidate)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onRemoveFromShortlist(candidate.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Cards */}
      <div className="grid grid-cols-1 gap-6">
        {candidates
          .sort((a, b) => b.score.totalScore - a.score.totalScore)
          .map((candidate, index) => (
            <div key={candidate.id} className="bg-white rounded-lg shadow border-2 border-blue-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600">#{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-500">{candidate.location}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                        <span>{candidate.email}</span>
                        <span>·</span>
                        <span>{candidate.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg text-2xl font-bold border-2 ${getScoreColor(candidate.score.totalScore)}`}>
                    {candidate.score.totalScore}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Experience</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {candidate.work_experiences?.length || 0} roles
                    </p>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {candidate.work_experiences?.[0]?.roleName || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Education</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {candidate.education?.highest_level || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {candidate.education?.degrees?.[0]?.subject || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Salary</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {candidate.annual_salary_expectation?.['full-time'] || 'N/A'}
                    </p>
                  </div>
                </div>

                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 6).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 6 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{candidate.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Shortlist;

