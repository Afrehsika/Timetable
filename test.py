import json
import urllib.request

data = {
    "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "periods_per_day": 8,
    "classes": [{"id": "L100A", "name": "Level 100A", "size": 45}],
    "teachers": [{"id": "T01", "name": "Prof"}],
    "rooms": [{"name": "R1", "capacity": 50}],
    "lessons": [{"subject_id": "MATH", "teacher_id": "T01", "class_id": "L100A", "periods": 8}]
}

req = urllib.request.Request('http://localhost:8080/api/generate', method='POST', headers={'Content-Type': 'application/json'}, data=json.dumps(data).encode('utf-8'))
try:
    res = urllib.request.urlopen(req)
    print(res.read().decode())
except Exception as e:
    print(e)
