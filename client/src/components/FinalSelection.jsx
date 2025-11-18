import { useState, useEffect } from 'react';
import { api } from '../services/api';

function FinalSelection({ shortlistedIds }) {
  const [candidates, setCandidates] = useState([]);
  const [justifications, setJustifications] = useState({});
  const [overallJustification, setOverallJustification] = useState('');
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, [shortlistedIds]);

  const loadCandidates = async () => {
    setLoading(true);
    try {
      const candidatePromises = shortlistedIds.map(id => api.getCandidate(id));
      const loadedCandidates = await Promise.all(candidatePromises);
      setCandidates(loadedCandidates.sort((a, b) => b.score.totalScore - a.score.totalScore));
      
      // Initialize empty justifications
      const initialJustifications = {};
      loadedCandidates.forEach(c => {
        initialJustifications[c.id] = '';
      });
      setJustifications(initialJustifications);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.saveSelection(candidates, { individual: justifications, overall: overallJustification });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving selection:', error);
      alert('Failed to save selection');
    }
  };

  const handleExport = () => {
    const report = {
      selectionDate: new Date().toISOString(),
      selectedCandidates: candidates.map((c, idx) => ({
        rank: idx + 1,
        name: c.name,
        email: c.email,
        phone: c.phone,
        location: c.location,
        score: c.score.totalScore,
        scoreBreakdown: c.score.breakdown,
        salary: c.annual_salary_expectation?.['full-time'],
        experienceCount: c.work_experiences?.length,
        education: c.education?.highest_level,
        skills: c.skills,
        justification: justifications[c.id]
      })),
      overallJustification
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hiring-selection-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-blue-100 text-blue-800';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow p-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">🎯 Final Selection</h2>
            <p className="text-gray-700">
              You've selected 5 candidates. Add your justifications and reasoning for each selection.
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">5/5</div>
            <div className="text-sm text-gray-600">Candidates</div>
          </div>
        </div>
      </div>

      {/* Overall Justification */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Overall Selection Strategy
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Explain your overall approach to selecting these 5 candidates. Consider team composition, skill diversity, 
          budget constraints, and how they complement each other.
        </p>
        <textarea
          value={overallJustification}
          onChange={(e) => setOverallJustification(e.target.value)}
          placeholder="e.g., I selected these candidates to build a well-rounded team with diverse technical expertise. The selection balances senior leadership experience with strong technical skills, ensuring we have both strategic vision and hands-on implementation capabilities..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
          rows="5"
        />
      </div>

      {/* Individual Candidates */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Individual Justifications</h3>
        
        {candidates.map((candidate, index) => (
          <div key={candidate.id} className="bg-white rounded-lg shadow border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <div className="p-6">
              {/* Candidate Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex flex-col items-center justify-center text-white">
                      <span className="text-xs font-medium">Rank</span>
                      <span className="text-2xl font-bold">#{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900">{candidate.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{candidate.email}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-sm text-gray-500">📍 {candidate.location}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(candidate.score.totalScore)}`}>
                        Score: {candidate.score.totalScore}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Experience</p>
                  <p className="text-lg font-bold text-blue-600">
                    {candidate.score.breakdown.experience}
                  </p>
                  <p className="text-xs text-gray-500">{candidate.work_experiences?.length || 0} roles</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Education</p>
                  <p className="text-lg font-bold text-green-600">
                    {candidate.score.breakdown.education}
                  </p>
                  <p className="text-xs text-gray-500">{candidate.education?.highest_level}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Skills</p>
                  <p className="text-lg font-bold text-purple-600">
                    {candidate.score.breakdown.skills}
                  </p>
                  <p className="text-xs text-gray-500">{candidate.skills?.length || 0} skills</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Salary Fit</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {candidate.score.breakdown.salary}
                  </p>
                  <p className="text-xs text-gray-500">{candidate.annual_salary_expectation?.['full-time']}</p>
                </div>
              </div>

              {/* Top Skills */}
              {candidate.skills && candidate.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Key Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Justification Input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why did you choose this candidate?
                </label>
                <textarea
                  value={justifications[candidate.id] || ''}
                  onChange={(e) => setJustifications({ ...justifications, [candidate.id]: e.target.value })}
                  placeholder={`e.g., ${candidate.name} brings ${candidate.work_experiences?.length || 0} years of diverse experience with strong ${candidate.education?.degrees?.[0]?.subject || 'technical'} background. Their ${candidate.skills?.[0] || 'technical'} skills will be crucial for...`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  rows="4"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Average Score</p>
            <p className="text-2xl font-bold text-gray-900">
              {(candidates.reduce((sum, c) => sum + c.score.totalScore, 0) / candidates.length).toFixed(1)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Experience</p>
            <p className="text-2xl font-bold text-gray-900">
              {candidates.reduce((sum, c) => sum + (c.work_experiences?.length || 0), 0)} roles
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Unique Skills</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(candidates.flatMap(c => c.skills || [])).size}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Avg Salary</p>
            <p className="text-2xl font-bold text-gray-900">
              ${(candidates.reduce((sum, c) => {
                const sal = parseInt(c.annual_salary_expectation?.['full-time']?.replace(/[$,]/g, '') || 0);
                return sum + sal;
              }, 0) / candidates.length / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white rounded-lg shadow p-6">
        <div>
          {saved && (
            <div className="flex items-center text-green-600">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Selection saved successfully!</span>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExport}
            className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 font-medium flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Selection
          </button>
        </div>
      </div>

      {/* Demo Tips */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">💡 Demo Tips</h3>
        <ul className="space-y-2 text-sm text-purple-800">
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Emphasize the <strong>transparent scoring system</strong> that shows exactly why each candidate was ranked</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Highlight the <strong>team composition</strong> - diverse skills, complementary experiences</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Mention <strong>budget alignment</strong> - salary expectations fit within reasonable range</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">✓</span>
            <span>Point out the <strong>hybrid approach</strong> - automated scoring plus human judgment</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default FinalSelection;

