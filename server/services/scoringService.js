// Scoring algorithm for candidate evaluation
// Total score: 100 points distributed across 5 categories

const RELEVANT_TECH_ROLES = [
  'full stack developer',
  'software engineer',
  'software developer',
  'backend developer',
  'frontend developer',
  'web developer',
  'engineer'
];

const LEADERSHIP_ROLES = [
  'project manager',
  'product manager',
  'team lead',
  'tech lead',
  'engineering manager'
];

const RELEVANT_SUBJECTS = [
  'computer science',
  'software engineering',
  'computer engineering',
  'information technology',
  'information systems'
];

const HIGH_VALUE_SKILLS = [
  'react', 'node', 'javascript', 'typescript', 'python', 'java',
  'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'cloud',
  'microservices', 'api', 'rest', 'graphql', 'sql', 'nosql',
  'mongodb', 'postgresql', 'git', 'ci/cd', 'devops'
];

// Calculate experience score (35 points max)
function calculateExperienceScore(workExperiences) {
  if (!workExperiences || workExperiences.length === 0) return 0;

  let score = 0;
  let techRoleCount = 0;
  let leadershipRoleCount = 0;

  workExperiences.forEach(exp => {
    const roleLower = exp.roleName?.toLowerCase() || '';
    
    // Count relevant tech roles
    if (RELEVANT_TECH_ROLES.some(role => roleLower.includes(role))) {
      techRoleCount++;
    }
    
    // Count leadership roles
    if (LEADERSHIP_ROLES.some(role => roleLower.includes(role))) {
      leadershipRoleCount++;
    }
  });

  // Base score from number of tech roles (up to 20 points)
  score += Math.min(techRoleCount * 4, 20);

  // Bonus for leadership experience (up to 5 points)
  score += Math.min(leadershipRoleCount * 2.5, 5);

  // Bonus for total experience diversity (up to 10 points)
  score += Math.min(workExperiences.length * 1.5, 10);

  return Math.min(score, 35);
}

// Calculate education score (25 points max)
function calculateEducationScore(education) {
  if (!education || !education.degrees || education.degrees.length === 0) return 0;

  let score = 0;
  const degrees = education.degrees;

  // Highest degree level (up to 10 points)
  const highestLevel = education.highest_level?.toLowerCase() || '';
  if (highestLevel.includes('phd') || highestLevel.includes('doctorate')) {
    score += 10;
  } else if (highestLevel.includes('master')) {
    score += 8;
  } else if (highestLevel.includes('bachelor')) {
    score += 6;
  }

  // Relevant subjects (up to 8 points)
  const hasRelevantDegree = degrees.some(deg => {
    const subject = deg.subject?.toLowerCase() || '';
    return RELEVANT_SUBJECTS.some(rel => subject.includes(rel));
  });
  if (hasRelevantDegree) score += 8;

  // GPA consideration (up to 4 points)
  const hasHighGPA = degrees.some(deg => {
    const gpa = deg.gpa?.toLowerCase() || '';
    return gpa.includes('3.5') || gpa.includes('3.6') || gpa.includes('3.7') || 
           gpa.includes('3.8') || gpa.includes('3.9') || gpa.includes('4.0');
  });
  if (hasHighGPA) score += 4;

  // Top 50 school bonus (2 points)
  const hasTop50 = degrees.some(deg => deg.isTop50 === true);
  if (hasTop50) score += 2;

  // Multiple degrees bonus (1 point)
  if (degrees.length > 1) score += 1;

  return Math.min(score, 25);
}

// Calculate skills score (20 points max)
function calculateSkillsScore(skills) {
  if (!skills || skills.length === 0) return 0;

  let score = 0;
  
  // Base score from number of skills (up to 10 points)
  score += Math.min(skills.length * 1, 10);

  // Bonus for high-value skills (up to 10 points)
  const highValueCount = skills.filter(skill => 
    HIGH_VALUE_SKILLS.some(hvs => skill.toLowerCase().includes(hvs))
  ).length;
  score += Math.min(highValueCount * 2, 10);

  return Math.min(score, 20);
}

// Calculate salary fit score (10 points max)
function calculateSalaryScore(salaryExpectation) {
  if (!salaryExpectation || !salaryExpectation['full-time']) return 5; // neutral score

  const salaryStr = salaryExpectation['full-time'].replace(/[$,]/g, '');
  const salary = parseInt(salaryStr);

  if (isNaN(salary)) return 5;

  // Ideal range: $80k - $130k
  const minBudget = 80000;
  const maxBudget = 130000;
  const idealMin = 90000;
  const idealMax = 120000;

  if (salary >= idealMin && salary <= idealMax) {
    return 10; // Perfect fit
  } else if (salary >= minBudget && salary <= maxBudget) {
    return 8; // Good fit
  } else if (salary < minBudget) {
    return 6; // Below range (might leave for better offer)
  } else if (salary <= maxBudget * 1.2) {
    return 4; // Slightly above budget
  } else {
    return 2; // Too expensive
  }
}

// Calculate availability score (10 points max)
function calculateAvailabilityScore(workAvailability) {
  if (!workAvailability || workAvailability.length === 0) return 5;

  const hasFullTime = workAvailability.includes('full-time');
  const hasPartTime = workAvailability.includes('part-time');

  if (hasFullTime && hasPartTime) {
    return 10; // Flexible - best option
  } else if (hasFullTime) {
    return 9; // Full-time only
  } else if (hasPartTime) {
    return 5; // Part-time only
  }
  
  return 5;
}

// Main scoring function
export function scoreCandidate(candidate) {
  const experienceScore = calculateExperienceScore(candidate.work_experiences);
  const educationScore = calculateEducationScore(candidate.education);
  const skillsScore = calculateSkillsScore(candidate.skills);
  const salaryScore = calculateSalaryScore(candidate.annual_salary_expectation);
  const availabilityScore = calculateAvailabilityScore(candidate.work_availability);

  const totalScore = experienceScore + educationScore + skillsScore + salaryScore + availabilityScore;

  return {
    totalScore: Math.round(totalScore * 10) / 10,
    breakdown: {
      experience: Math.round(experienceScore * 10) / 10,
      education: Math.round(educationScore * 10) / 10,
      skills: Math.round(skillsScore * 10) / 10,
      salary: Math.round(salaryScore * 10) / 10,
      availability: Math.round(availabilityScore * 10) / 10
    }
  };
}

// Score all candidates
export function scoreAllCandidates(candidates) {
  return candidates.map((candidate, index) => ({
    ...candidate,
    id: index,
    score: scoreCandidate(candidate)
  }));
}

