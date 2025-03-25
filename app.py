from flask import Flask, jsonify, render_template
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

# Function to scrape live IPL scores
def get_ipl_scores():
    url = "https://www.cricbuzz.com/"
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        matches = soup.find_all('div', class_='cb-col cb-col-100 cb-ltst-wgt-hdr')
        
        scores = []
        for match in matches:
            try:
                match_name = match.find('div', class_='cb-col cb-col-75 cb-ltst-wgt-hdr').text.strip()
                score = match.find('div', class_='cb-col cb-col-25 cb-ltst-wgt-score').text.strip()
                status = match.find('div', class_='cb-col cb-col-100 cb-ltst-wgt-status').text.strip()

                scores.append({
                    'match_name': match_name,
                    'score': score,
                    'status': status
                })
            except AttributeError:
                continue
        
        return scores
    else:
        return []

# Route to fetch live scores
@app.route('/api/live-scores')
def live_scores():
    scores = get_ipl_scores()
    return jsonify(scores)

# Route for the website frontend
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
