import sys
import os

# Adjusting path so we can import modules
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
    # 1. Setup Data
    math_subject = Subject("Mathematics", "MATH101")
    physics_subject = Subject("Physics", "PHYS101")

    teacher_smith = Teacher("Mr. Smith", "T01")
    teacher_jones = Teacher("Mrs. Jones", "T02")

    class_10a = StudentClass("Class 10A", "10A", size=25)
    class_10b = StudentClass("Class 10B", "10B", size=15)

    room_101 = Room("Room 101", 30)
    room_102 = Room("Room 102", 20) # 10A cannot fit here now
    
    # 2. Define Time Slots (e.g., 2 days, 2 periods per day)
    time_slots = [
        TimeSlot("Monday", 1),
        TimeSlot("Monday", 2),
        TimeSlot("Tuesday", 1),
        TimeSlot("Tuesday", 2),
    ]

    # Add unavailability (Mr. Smith can't teach on Monday Period 1)
    teacher_smith.unavalible_slot.append(time_slots[0])

    rooms = [room_101, room_102]

    # 3. Create Lessons
    lesson1 = Lesson(math_subject, teacher_smith, class_10a, periods_per_week=2)
    lesson2 = Lesson(physics_subject, teacher_jones, class_10b, periods_per_week=2)
    lesson3 = Lesson(math_subject, teacher_smith, class_10b, periods_per_week=1) # Smith teaches 10B too
    
    lessons = [lesson1, lesson2, lesson3]

    # 4. Setup Constraints
    constraints = [
        TeacherConflictConstraint(),
        ClassConflictConstraint(),
        RoomConflictConstraint(),
        TeacherAvailabilityConstraint(),
        RoomCapacityConstraint(),
        DailySubjectLimitConstraint(max_per_day=2)
    ]

    # 5. Initialize Timetable and Scheduler
    timetable = Timetable()
    scheduler = Scheduler(lessons, time_slots, rooms, constraints)

    # 6. Generate Schedule
    success = scheduler.generate(timetable)

    if success:
        print("Timetable generation successful!\n")
        
        # 1. Print General Timetable
        timetable.print_general_timetable()
        
        # 2. Print Teacher Timetable
        timetable.print_teacher_timetable(teacher_smith)
        
        # 3. Print Class Timetable
        timetable.print_class_timetable(class_10b)
    else:
        print("Could not generate a timetable that satisfies all constraints.")

if __name__ == "__main__":
    main()
