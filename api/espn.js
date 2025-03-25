
export default async (req, res) => {
    const ESPN_API_URL = "https://hs-consumer-api.espncricinfo.com/v1/pages/matches/current";
    
    try {
        const response = await fetch(ESPN_API_URL);
        const data = await response.json();
        
        // Cache for 30 seconds
        res.setHeader("Cache-Control", "s-maxage=30");
        res.status(200).json(data);
    } catch (error) {
        console.error("ESPN API Error:", error);
        res.status(500).json({ error: "Failed to fetch matches" });
    }
};
