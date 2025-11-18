# 100B Jobs - Hiring Decision Support Application

A full-stack web application designed to help startup founders make data-driven hiring decisions by analyzing and scoring hundreds of job applicants.

## Overview

This application analyzes 975 candidate applications using a sophisticated scoring algorithm and provides an intuitive interface for:
- Reviewing candidate profiles with automated scoring
- Filtering and sorting candidates by multiple criteria
- Comparing candidates side-by-side
- Selecting and justifying the top 5 hires

## Architecture

**Stack:**
- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express
- **Styling:** Tailwind CSS
- **Charts:** Recharts

## Scoring Algorithm

The application uses a transparent 100-point scoring system across 5 categories:

### 1. Experience Score (35 points)
- Number of relevant tech positions (Full Stack Developer, Software Engineer, etc.)
- Leadership experience (Project Manager, Team Lead, etc.)
- Total work experience diversity

### 2. Education Score (25 points)
- Degree level (PhD > Master's > Bachelor's)
- Relevant subjects (Computer Science, Software Engineering, etc.)
- GPA (3.5+ preferred)
- Top 50 institution bonus
- Multiple degrees bonus

### 3. Skills Score (20 points)
- Number of technical skills
- High-value skills (React, Node.js, Docker, AWS, etc.)

### 4. Salary Fit Score (10 points)
- Alignment with budget ($80k-$130k range)
- Ideal range: $90k-$120k

### 5. Availability Score (10 points)
- Full-time availability preferred
- Flexibility bonus (both full-time and part-time)

## Features

### Dashboard
- Overview statistics (total candidates, average scores, distributions)
- Interactive charts (score distribution, top locations)
- Quick filters

### Candidate List
- Card-based layout with key information
- Real-time filtering and sorting
- Score breakdown visualizations
- Pagination support

### Candidate Details
- Complete profile information
- Radar chart visualization of score breakdown
- Work experience and education history
- Skills inventory

### Shortlist
- Side-by-side comparison of up to 5 candidates
- Comparison table with key metrics
- Detailed candidate cards

### Final Selection
- Individual justifications for each candidate
- Overall selection strategy
- Team composition overview
- Export selection report (JSON)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install all project dependencies:
```bash
npm run install-all
```

Or install manually:
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### Running the Application

**Option 1: Run both servers concurrently (recommended)**
```bash
npm run dev
```

**Option 2: Run servers separately**

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run client
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001

## 📁 Project Structure

```
/
├── server/
│   ├── index.js                 # Express server entry point
│   ├── routes/
│   │   └── candidates.js        # API routes
│   ├── services/
│   │   └── scoringService.js    # Scoring algorithm
│   └── package.json
├── client/
│   ├── src/
│   │   ├── App.jsx              # Main application component
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CandidateList.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── CandidateDetail.jsx
│   │   │   ├── Filters.jsx
│   │   │   ├── Shortlist.jsx
│   │   │   └── FinalSelection.jsx
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   └── index.css
│   └── package.json
├── example.json                 # Candidate data (975 candidates)
├── package.json                 # Root package.json
└── README.md
```


## API Endpoints

### GET `/api/candidates`
Get paginated list of candidates with filtering and sorting.

**Query Parameters:**
- `search` - Search by name, email, skills, company
- `minScore`, `maxScore` - Score range filter
- `minSalary`, `maxSalary` - Salary range filter
- `sortBy` - Sort field (score, name, salary, experience)
- `sortOrder` - Sort direction (asc, desc)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

### GET `/api/candidates/stats`
Get aggregate statistics about all candidates.

### GET `/api/candidates/:id`
Get detailed information about a specific candidate.

### POST `/api/candidates/selection`
Save final selection with justifications.

**Body:**
```json
{
  "selectedCandidates": [...],
  "justifications": {
    "individual": {...},
    "overall": "..."
  }
}
```

## 🔧 Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Express.js** - Backend API server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library for data visualization
- **Node.js** - JavaScript runtime