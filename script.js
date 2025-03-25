document.addEventListener("DOMContentLoaded", function() {
    const API_ENDPOINT = "/api/scores";
    const REFRESH_INTERVAL = 30000; // 30 seconds
    
    // DOM Elements
    const elements = {
        loading: document.getElementById("loading"),
        liveMatches: document.getElementById("live-matches"),
        upcomingMatches: document.getElementById("upcoming-matches"),
        lastUpdated: document.getElementById("last-updated"),
        container: document.getElementById("scores-container")
    };
    
    // Initialize
    fetchScores();
    setInterval(fetchScores, REFRESH_INTERVAL);
    
    async function fetchScores() {
        try {
            showLoading();
            
            const response = await fetch(API_ENDPOINT);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data || data.length === 0) {
                throw new Error("No match data available");
            }
            
            renderMatches(data);
        } catch (error) {
            console.error("Failed to fetch scores:", error);
            showError(error.message);
        } finally {
            hideLoading();
            updateTimestamp();
        }
    }
    
    function renderMatches(matches) {
        const now = new Date();
        let liveHtml = '';
        let upcomingHtml = '';
        
        matches.forEach(match => {
            const card = `
                <div class="match-card">
                    <div class="match-teams">${match.team1 || 'TBD'} vs ${match.team2 || 'TBD'}</div>
                    <div class="match-status ${getStatusClass(match.status)}">${match.status}</div>
                    <div class="match-score">${match.score || 'Match not started'}</div>
                    <div class="match-venue">${match.venue || 'Venue TBD'}</div>
                </div>
            `;
            
            if (match.status === "Live") {
                liveHtml += card;
            } else {
                upcomingHtml += card;
            }
        });
        
        elements.liveMatches.innerHTML = liveHtml || '<div class="no-matches">No live matches currently</div>';
        elements.upcomingMatches.innerHTML = upcomingHtml || '<div class="no-matches">No upcoming matches scheduled</div>';
    }
    
    function getStatusClass(status) {
        return status === "Live" ? "status-live" : "status-upcoming";
    }
    
    function showLoading() {
        elements.loading.style.display = "block";
        elements.liveMatches.innerHTML = "";
        elements.upcomingMatches.innerHTML = "";
    }
    
    function hideLoading() {
        elements.loading.style.display = "none";
    }
    
    function updateTimestamp() {
        elements.lastUpdated.textContent = new Date().toLocaleTimeString();
    }
    
    function showError(message) {
        elements.container.innerHTML = `
            <div class="error">
                <p>⚠️ ${message}</p>
                <button class="retry-btn" onclick="window.location.reload()">Retry</button>
                <p>If this persists, please try again later</p>
            </div>
        `;
    }
    
    // Make fetchScores available globally
    window.fetchScores = fetchScores;
});
