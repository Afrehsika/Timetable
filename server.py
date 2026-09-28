import sys
import os
import json
from http.server import SimpleHTTPRequestHandler, HTTPServer

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from Academic.lesson import Lesson
from Academic.subjects import Subject
from People.studentClass import StudentClass
from People.teacher import Teacher
from Resources.room import Room
from Scheduling.time import TimeSlot
from Scheduling.timetable import Timetable
from Scheduling.constraint import (TeacherConflictConstraint, ClassConflictConstraint, RoomConflictConstraint,
                                   TeacherAvailabilityConstraint, RoomCapacityConstraint, DailySubjectLimitConstraint)
from Scheduling.scheduler import Scheduler

class TimetableHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve the web directory statically for HTML/CSS/JS
        super().__init__(*args, directory=os.path.join(os.path.dirname(__file__), 'web'), **kwargs)

    def do_POST(self):
        # Handle the API request to generate a timetable
        if self.path == '/api/generate':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                result = self.run_scheduler(data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def run_scheduler(self, data):
        # 1. Generate Days and Periods from User Config
        days = data.get('days', ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"])
        num_periods = int(data.get('periods_per_day', 4))
        periods = list(range(1, num_periods + 1))
        
        time_slots = []
        for d in days:
            for p in periods:
                time_slots.append(TimeSlot(d, p))
                
        # 2. Reconstruct Python Objects from JSON Data
        subjects_dict = {}
        for s in data.get('subjects', []):
            subjects_dict[s['id']] = Subject(s['name'], s['id'])
            
        teachers_dict = {}
        for t in data.get('teachers', []):
            teachers_dict[t['id']] = Teacher(t['name'], t['id'])
            
        classes_dict = {}
        for c in data.get('classes', []):
            classes_dict[c['id']] = StudentClass(c['name'], c['id'], size=int(c.get('size', 20)))
            
        rooms_list = []
        for r in data.get('rooms', []):
            rooms_list.append(Room(r['name'], int(r.get('capacity', 30))))
            
        lessons_list = []
        for l in data.get('lessons', []):
            subj = subjects_dict.get(l['subject_id'])
            tch = teachers_dict.get(l['teacher_id'])
            cls = classes_dict.get(l['class_id'])
            if subj and tch and cls:
                lessons_list.append(Lesson(subj, tch, cls, periods_per_week=int(l['periods'])))

        # 3. Apply Constraints
        constraints = [
            TeacherConflictConstraint(),
            ClassConflictConstraint(),
            RoomConflictConstraint(),
            TeacherAvailabilityConstraint(),
            RoomCapacityConstraint(),
            DailySubjectLimitConstraint(max_per_day=2)
        ]

        # 4. Schedule!
        timetable = Timetable()
        scheduler = Scheduler(lessons_list, time_slots, rooms_list, constraints)
        success = scheduler.generate(timetable)

        # 5. Build JSON Response
        if success:
            schedule_data = []
            for entry in timetable.entries:
                schedule_data.append({
                    'day': entry['slot'].day,
                    'period': entry['slot'].period,
                    'class_id': entry['lesson'].student_class.class_id,
                    'class_name': entry['lesson'].student_class.name,
                    'subject': entry['lesson'].subject.name,
                    'teacher': entry['lesson'].teacher.name,
                    'room': entry['room'].name
                })
            return {
                'success': True,
                'schedule': schedule_data,
                'meta': {
                    'days': days,
                    'periods': periods,
                    'classes': [c['id'] for c in data.get('classes', [])],
                    'bells': data.get('bells', [])
                }
            }
        else:
            return {'success': False, 'error': 'Could not satisfy all constraints with the provided data.'}

def run(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, TimetableHandler)
    print(f"Server successfully started! Go to http://localhost:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()

if __name__ == '__main__':
    run()
