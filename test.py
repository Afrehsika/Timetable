import urllib.request
import json
import urllib.parse

# Get the JSON data from app.js using node
import subprocess
node_script = """
const fs = require('fs'); 
const code = fs.readFileSync('web/app.js', 'utf8'); 
const regex = /appData\.bells = (\[[\s\S]*?\]);\s*appData\.subjects = (\[[\s\S]*?\]);\s*appData\.teachers = (\[[\s\S]*?\]);\s*appData\.classes = (\[[\s\S]*?\]);\s*appData\.rooms = (\[[\s\S]*?\]);\s*appData\.lessons = (\[[\s\S]*?\]);/g; 
const match = regex.exec(code); 
const data = { bells: eval(match[1]), subjects: eval(match[2]), teachers: eval(match[3]), classes: eval(match[4]), rooms: eval(match[5]), lessons: eval(match[6]), periods_per_day: eval(match[1]).length, days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] }; 
console.log(JSON.stringify(data));
"""
result = subprocess.run(['node', '-e', node_script], capture_output=True, text=True)
data = json.loads(result.stdout)

req = urllib.request.Request('http://localhost:8080/api/generate', data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    response = urllib.request.urlopen(req)
    res_data = json.loads(response.read().decode('utf-8'))
    schedule = res_data.get('schedule', [])
    
    # Check for teacher conflicts
    conflicts = []
    seen = {}
    for entry in schedule:
        key = (entry['day'], entry['period'], entry['teacher'])
        if key in seen:
            conflicts.append((key, seen[key], entry))
        seen[key] = entry
        
    print(f"Generated {len(schedule)} lessons")
    print(f"Conflicts found: {len(conflicts)}")
    if conflicts:
        for c in conflicts:
            print(f"CONFLICT: {c[0]} -> {c[1]['class_name']} vs {c[2]['class_name']}")
except Exception as e:
    print(f"Error: {e}")
