import sys
import os
import json

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

def main():
    # Expand data for a richer grid
    math_subject = Subject("Mathematics", "MATH101")
    physics_subject = Subject("Physics", "PHYS101")
    chem_subject = Subject("Chemistry", "CHEM101")
    eng_subject = Subject("English", "ENG101")

    teacher_smith = Teacher("Mr. Smith", "T01")
    teacher_jones = Teacher("Mrs. Jones", "T02")
    teacher_doe = Teacher("Mr. Doe", "T03")

    class_10a = StudentClass("Class 10A", "10A", size=25)
    class_10b = StudentClass("Class 10B", "10B", size=15)
    class_10c = StudentClass("Class 10C", "10C", size=20)

    room_101 = Room("Room 101", 30)
    room_102 = Room("Room 102", 20)
    room_103 = Room("Room 103", 25)
    
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    periods = [1, 2, 3, 4] # 4 periods a day
    time_slots = []
    for d in days:
        for p in periods:
            time_slots.append(TimeSlot(d, p))

    teacher_smith.unavalible_slot.append(time_slots[0]) # Monday 1

    rooms = [room_101, room_102, room_103]

    lessons = [
        Lesson(math_subject, teacher_smith, class_10a, periods_per_week=4),
        Lesson(physics_subject, teacher_jones, class_10a, periods_per_week=3),
        Lesson(eng_subject, teacher_doe, class_10a, periods_per_week=4),
        
        Lesson(math_subject, teacher_smith, class_10b, periods_per_week=4),
        Lesson(chem_subject, teacher_jones, class_10b, periods_per_week=3),
        Lesson(eng_subject, teacher_doe, class_10b, periods_per_week=4),
        
        Lesson(physics_subject, teacher_jones, class_10c, periods_per_week=4),
        Lesson(chem_subject, teacher_smith, class_10c, periods_per_week=3),
        Lesson(eng_subject, teacher_doe, class_10c, periods_per_week=4),
    ]

    constraints = [
        TeacherConflictConstraint(),
        ClassConflictConstraint(),
        RoomConflictConstraint(),
        TeacherAvailabilityConstraint(),
        RoomCapacityConstraint(),
        DailySubjectLimitConstraint(max_per_day=2)
    ]

    timetable = Timetable()
    scheduler = Scheduler(lessons, time_slots, rooms, constraints)

    print("Generating schedule for web UI...")
    success = scheduler.generate(timetable)

    if success:
        data = []
        for entry in timetable.entries:
            data.append({
                'day': entry['slot'].day,
                'period': entry['slot'].period,
                'class_id': entry['lesson'].student_class.class_id,
                'class_name': entry['lesson'].student_class.name,
                'subject': entry['lesson'].subject.name,
                'teacher': entry['lesson'].teacher.name,
                'room': entry['room'].name
            })
        
        metadata = {
            'days': days,
            'periods': periods,
            'classes': [c.class_id for c in [class_10a, class_10b, class_10c]]
        }
        
        js_content = f"const scheduleData = {json.dumps(data, indent=2)};\nconst scheduleMeta = {json.dumps(metadata, indent=2)};"
        
        web_dir = os.path.join(os.path.dirname(__file__), 'web')
        os.makedirs(web_dir, exist_ok=True)
        with open(os.path.join(web_dir, 'data.js'), 'w') as f:
            f.write(js_content)
            
        print(f"Data successfully generated to {web_dir}\\data.js")
    else:
        print("Could not generate a timetable that satisfies all constraints.")

if __name__ == "__main__":
    main()
