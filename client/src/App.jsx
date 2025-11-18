import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CandidateList from './components/CandidateList';
import CandidateDetail from './components/CandidateDetail';
import Shortlist from './components/Shortlist';
import FinalSelection from './components/FinalSelection';
import { api } from './services/api';

function App() {
  const [view, setView] = useState('dashboard'); // dashboard, list, shortlist, final
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [shortlistedIds, setShortlistedIds] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    minScore: '',
    maxScore: '',
    minSalary: '',
    maxSalary: '',
    location: 'all',
    sortBy: 'score',
    sortOrder: 'desc'
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleAddToShortlist = (candidateId) => {
    if (shortlistedIds.length >= 5) {
      alert('You can only shortlist up to 5 candidates');
      return;
    }
    if (!shortlistedIds.includes(candidateId)) {
      setShortlistedIds([...shortlistedIds, candidateId]);
    }
  };

  const handleRemoveFromShortlist = (candidateId) => {
    setShortlistedIds(shortlistedIds.filter(id => id !== candidateId));
  };

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseDetail = () => {
    setSelectedCandidate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">100B Jobs</h1>
                <p className="text-sm text-gray-500">Hiring Decision Support System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Shortlisted: {shortlistedIds.length}/5
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setView('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                view === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setView('list')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                view === 'list'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 All Candidates
            </button>
            <button
              onClick={() => setView('shortlist')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                view === 'shortlist'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⭐ Shortlist ({shortlistedIds.length})
            </button>
            <button
              onClick={() => setView('final')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                view === 'final'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              disabled={shortlistedIds.length !== 5}
            >
              ✅ Final Selection
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            onViewCandidates={() => setView('list')}
            filters={filters}
            setFilters={setFilters}
          />
        )}
        
        {view === 'list' && (
          <CandidateList
            filters={filters}
            setFilters={setFilters}
            shortlistedIds={shortlistedIds}
            onAddToShortlist={handleAddToShortlist}
            onRemoveFromShortlist={handleRemoveFromShortlist}
            onViewCandidate={handleViewCandidate}
          />
        )}
        
        {view === 'shortlist' && (
          <Shortlist
            shortlistedIds={shortlistedIds}
            onRemoveFromShortlist={handleRemoveFromShortlist}
            onViewCandidate={handleViewCandidate}
            onProceedToFinal={() => setView('final')}
          />
        )}
        
        {view === 'final' && (
          <FinalSelection
            shortlistedIds={shortlistedIds}
          />
        )}
      </main>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetail
          candidate={selectedCandidate}
          isShortlisted={shortlistedIds.includes(selectedCandidate.id)}
          onClose={handleCloseDetail}
          onAddToShortlist={handleAddToShortlist}
          onRemoveFromShortlist={handleRemoveFromShortlist}
        />
      )}
    </div>
  );
}

export default App;

