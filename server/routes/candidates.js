import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scoreAllCandidates } from '../services/scoringService.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load and cache candidates data
let candidatesCache = null;

function loadCandidates() {
  if (candidatesCache) return candidatesCache;
  
  const dataPath = path.join(__dirname, '../../example.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const candidates = JSON.parse(rawData);
  
  // Score all candidates
  candidatesCache = scoreAllCandidates(candidates);
  
  return candidatesCache;
}

// GET /api/candidates - List candidates with filtering, sorting, pagination
router.get('/', (req, res) => {
  try {
    let candidates = loadCandidates();
    
    // Apply filters
    const { 
      search, 
      minScore, 
      maxScore, 
      minSalary, 
      maxSalary, 
      location,
      sortBy = 'score',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      candidates = candidates.filter(c => 
        c.name?.toLowerCase().includes(searchLower) ||
        c.email?.toLowerCase().includes(searchLower) ||
        c.location?.toLowerCase().includes(searchLower) ||
        c.skills?.some(s => s.toLowerCase().includes(searchLower)) ||
        c.work_experiences?.some(we => 
          we.company?.toLowerCase().includes(searchLower) ||
          we.roleName?.toLowerCase().includes(searchLower)
        )
      );
    }

    // Score filter
    if (minScore) {
      candidates = candidates.filter(c => c.score.totalScore >= parseFloat(minScore));
    }
    if (maxScore) {
      candidates = candidates.filter(c => c.score.totalScore <= parseFloat(maxScore));
    }

    // Salary filter
    if (minSalary || maxSalary) {
      candidates = candidates.filter(c => {
        const salaryStr = c.annual_salary_expectation?.['full-time']?.replace(/[$,]/g, '');
        const salary = parseInt(salaryStr);
        if (isNaN(salary)) return false;
        if (minSalary && salary < parseInt(minSalary)) return false;
        if (maxSalary && salary > parseInt(maxSalary)) return false;
        return true;
      });
    }

    // Location filter
    if (location && location !== 'all') {
      candidates = candidates.filter(c => 
        c.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Sorting
    candidates.sort((a, b) => {
      let aVal, bVal;
      
      switch(sortBy) {
        case 'score':
          aVal = a.score.totalScore;
          bVal = b.score.totalScore;
          break;
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'salary':
          aVal = parseInt(a.annual_salary_expectation?.['full-time']?.replace(/[$,]/g, '') || 0);
          bVal = parseInt(b.annual_salary_expectation?.['full-time']?.replace(/[$,]/g, '') || 0);
          break;
        case 'experience':
          aVal = a.work_experiences?.length || 0;
          bVal = b.work_experiences?.length || 0;
          break;
        default:
          aVal = a.score.totalScore;
          bVal = b.score.totalScore;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Pagination
    const total = candidates.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIdx = (pageNum - 1) * limitNum;
    const endIdx = startIdx + limitNum;
    const paginatedCandidates = candidates.slice(startIdx, endIdx);

    res.json({
      candidates: paginatedCandidates,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// GET /api/candidates/stats - Get statistics
router.get('/stats', (req, res) => {
  try {
    const candidates = loadCandidates();
    
    const scores = candidates.map(c => c.score.totalScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    
    // Score distribution
    const excellent = candidates.filter(c => c.score.totalScore >= 80).length;
    const good = candidates.filter(c => c.score.totalScore >= 60 && c.score.totalScore < 80).length;
    const average = candidates.filter(c => c.score.totalScore >= 40 && c.score.totalScore < 60).length;
    const below = candidates.filter(c => c.score.totalScore < 40).length;

    // Top locations
    const locationCounts = {};
    candidates.forEach(c => {
      const loc = c.location || 'Unknown';
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });
    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([location, count]) => ({ location, count }));

    // Salary stats
    const salaries = candidates
      .map(c => parseInt(c.annual_salary_expectation?.['full-time']?.replace(/[$,]/g, '') || 0))
      .filter(s => s > 0);
    const avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;

    res.json({
      total: candidates.length,
      avgScore: Math.round(avgScore * 10) / 10,
      maxScore,
      minScore,
      distribution: {
        excellent,
        good,
        average,
        below
      },
      topLocations,
      avgSalary: Math.round(avgSalary)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// GET /api/candidates/:id - Get single candidate
router.get('/:id', (req, res) => {
  try {
    const candidates = loadCandidates();
    const id = parseInt(req.params.id);
    const candidate = candidates.find(c => c.id === id);
    
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
});

// POST /api/candidates/selection - Save final selection
let savedSelection = null;

router.post('/selection', (req, res) => {
  try {
    const { selectedCandidates, justifications } = req.body;
    
    savedSelection = {
      selectedCandidates,
      justifications,
      timestamp: new Date().toISOString()
    };
    
    res.json({ success: true, selection: savedSelection });
  } catch (error) {
    console.error('Error saving selection:', error);
    res.status(500).json({ error: 'Failed to save selection' });
  }
});

router.get('/selection/current', (req, res) => {
  res.json(savedSelection || { selectedCandidates: [], justifications: {} });
});

export default router;

