// Free API from CricketData.org
const API_KEY = 'b79fa81e-03e4-4e63-9e91-dc4257be197e'; // Get from https://cricketdata.org/
const API_URL = `https://api.cricketdata.org/v1/matches?key=${API_KEY}`;

// DOM Elements
const matchesContainer = document.getElementById('matches-container');
const upcomingContainer = document.getElementById('upcoming-container');
const updateTimeElement = document.getElementById('update-time');

// Fetch matches data
async function fetchMatches() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching matches:', error);
        matchesContainer.innerHTML = `
            <div class="error-message">
                <p>Failed to load matches. Please try again later.</p>
                <button onclick="fetchMatches()">Retry</button>
            </div>
        `;
        return null;
    }
}

// Filter IPL matches
function filterIPLMatches(matches) {
    return matches.filter(match => 
        match.tournament && 
        match.tournament.name.toLowerCase().includes('ipl')
    );
}

// Display matches
function displayMatches(matches) {
    if (!matches || matches.length === 0) {
        matchesContainer.innerHTML = '<div class="no-matches">No matches currently. Check back later!</div>';
        return;
    }

    // Separate live and upcoming matches
    const liveMatches = matches.filter(match => match.status.toLowerCase() === 'live');
    const upcomingMatches = matches.filter(match => match.status.toLowerCase() !== 'live');

    // Display live matches
    if (liveMatches.length > 0) {
        matchesContainer.innerHTML = liveMatches.map(match => createMatchCard(match)).join('');
    } else {
        matchesContainer.innerHTML = '<div class="no-matches">No live matches currently.</div>';
    }

    // Display upcoming matches
    if (upcomingMatches.length > 0) {
        upcomingContainer.innerHTML = upcomingMatches.map(match => createMatchCard(match)).join('');
    } else {
        upcomingContainer.innerHTML = '<div class="no-matches">No upcoming matches scheduled.</div>';
    }

    // Update timestamp
    updateTimeElement.textContent = new Date().toLocaleTimeString();
}

// Create match card HTML
function createMatchCard(match) {
    const team1 = match.teams[0].name;
    const team2 = match.teams[1].name;
    const status = match.status;
    const score = match.score || 'Match not started';
    const venue = match.venue || 'Venue not specified';
    const date = match.start_date ? new Date(match.start_date).toLocaleString() : 'Date not specified';

    let statusClass = 'status-upcoming';
    if (status.toLowerCase() === 'live') {
        statusClass = 'status-live';
    } else if (status.toLowerCase().includes('completed')) {
        statusClass = 'status-completed';
    }

    return `
        <div class="match-card">
            <div class="match-teams">${team1} vs ${team2}</div>
            <div class="match-status ${statusClass}">${status}</div>
            <div class="match-score">${score}</div>
            <div class="match-venue">${venue}</div>
            <div class="match-date">${date}</div>
        </div>
    `;
}

// Initialize the app
async function init() {
    const matches = await fetchMatches();
    if (matches) {
        const iplMatches = filterIPLMatches(matches);
        displayMatches(iplMatches);
    }
}

// Refresh data every 30 seconds
init();
setInterval(init, 30000);

// Service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
