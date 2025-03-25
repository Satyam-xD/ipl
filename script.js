// API Config
const API_ENDPOINT = "/api/scores"; // Vercel serverless function
const REFRESH_INTERVAL = 30000; // 30 seconds

// DOM Elements
const elements = {
    matchesContainer: document.getElementById("matches-container"),
    upcomingContainer: document.getElementById("upcoming-container"),
    updateTime: document.getElementById("update-time")
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    fetchScores();
    setInterval(fetchScores, REFRESH_INTERVAL);
});

// Fetch Scores with Error Handling
async function fetchScores() {
    try {
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) throw new Error("API Error");
        
        const data = await response.json();
        updateUI(data);
    } catch (error) {
        console.error("Failed to fetch scores:", error);
        showError();
    }
}

// Update UI with Live & Upcoming Matches
function updateUI(matches) {
    if (!matches || matches.length === 0) {
        elements.matchesContainer.innerHTML = `<div class="empty-state">No matches available</div>`;
        return;
    }

    const now = new Date();
    const liveMatches = matches.filter(match => match.status === "Live");
    const upcomingMatches = matches.filter(match => new Date(match.start_date) > now);

    // Render Live Matches
    elements.matchesContainer.innerHTML = liveMatches.length > 0
        ? liveMatches.map(createMatchCard).join("")
        : `<div class="empty-state">No live matches right now</div>`;

    // Render Upcoming Matches
    elements.upcomingContainer.innerHTML = upcomingMatches.length > 0
        ? upcomingMatches.map(createMatchCard).join("")
        : `<div class="empty-state">No upcoming matches</div>`;

    // Update Timestamp
    elements.updateTime.textContent = new Date().toLocaleTimeString();
}

// Create Match Card HTML
function createMatchCard(match) {
    return `
        <div class="match-card">
            <div class="match-teams">${match.teams[0]} vs ${match.teams[1]}</div>
            <div class="match-status ${getStatusClass(match.status)}">${match.status}</div>
            <div class="match-score">${match.score || "Match starting soon"}</div>
            <div class="match-details">
                <span>🏟️ ${match.venue}</span>
                <span>⏰ ${new Date(match.start_date).toLocaleString()}</span>
            </div>
        </div>
    `;
}

// Helper Functions
function getStatusClass(status) {
    return status === "Live" ? "status-live" :
           status.includes("Complete") ? "status-completed" : "status-upcoming";
}

function showError() {
    elements.matchesContainer.innerHTML = `
        <div class="error-state">
            <p>⚠️ Failed to load scores</p>
            <button onclick="window.location.reload()">Retry</button>
        </div>
    `;
}

// Manual Refresh Option
window.refreshScores = fetchScores;
