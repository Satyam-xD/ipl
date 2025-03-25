export default async (req, res) => {
    const API_KEY = process.env.CRICKET_API_KEY; // Set in Vercel Dashboard
    const API_URL = `https://api.cricketdata.org/v1/matches?key=${API_KEY}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Filter only IPL matches
        const iplMatches = data.filter(match => 
            match.tournament?.name.includes("IPL")
        );

        // Cache for 30 seconds
        res.setHeader("Cache-Control", "s-maxage=30");
        res.status(200).json(iplMatches);
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Failed to fetch scores" });
    }
};
