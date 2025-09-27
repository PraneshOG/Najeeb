from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# --- Initialize Database ---
def init_db():
    conn = sqlite3.connect('transcripts.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS transcripts
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)''')
    conn.commit()
    conn.close()

# --- Routes ---
@app.route('/')
def home():
    return render_template("index.html")

@app.route('/save', methods=['POST'])
def save_transcript():
    data = request.get_json()
    text = data.get('text')
    if not text.strip():
        return jsonify({"status": "error", "message": "Empty transcript"})
    conn = sqlite3.connect('transcripts.db')
    c = conn.cursor()
    c.execute("INSERT INTO transcripts (text) VALUES (?)", (text,))
    conn.commit()
    conn.close()
    return jsonify({"status": "success", "message": "Transcript saved"})

@app.route('/get', methods=['GET'])
def get_transcripts():
    conn = sqlite3.connect('transcripts.db')
    c = conn.cursor()
    c.execute("SELECT * FROM transcripts ORDER BY id DESC")
    rows = c.fetchall()
    conn.close()
    return jsonify(rows)

if __name__ == '__main__':
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
