import sys
import os

# Adjusting path so we can import modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.scrollview import ScrollView
from kivy.uix.gridlayout import GridLayout

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

class TimetableApp(App):
    def build(self):
        self.title = 'Timetable Generator'
        self.root = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        self.header = Label(text="Click generate to create the timetable", size_hint_y=0.1, font_size=20)
        self.root.add_widget(self.header)
        
        self.generate_btn = Button(text="Generate Timetable", size_hint_y=0.1)
        self.generate_btn.bind(on_press=self.generate_timetable)
        self.root.add_widget(self.generate_btn)
        
        self.scroll = ScrollView(size_hint_y=0.8)
        self.result_grid = GridLayout(cols=1, size_hint_y=None, spacing=5)
        self.result_grid.bind(minimum_height=self.result_grid.setter('height'))
        self.scroll.add_widget(self.result_grid)
        
        self.root.add_widget(self.scroll)
        
        return self.root

    def generate_timetable(self, instance):
        self.result_grid.clear_widgets()
        self.header.text = "Generating..."
        
        # 1. Setup Data
        math_subject = Subject("Mathematics", "MATH101")
        physics_subject = Subject("Physics", "PHYS101")

        teacher_smith = Teacher("Mr. Smith", "T01")
        teacher_jones = Teacher("Mrs. Jones", "T02")

        class_10a = StudentClass("Class 10A", "10A", size=25)
        class_10b = StudentClass("Class 10B", "10B", size=15)

        # Increased capacity to 50 so it can hold both Class 10A (25) and 10B (15)
        room_101 = Room("Room 101", 50)
        room_102 = Room("Room 102", 20)
        
        time_slots = [
            TimeSlot("Monday", 1),
            TimeSlot("Monday", 2),
            TimeSlot("Tuesday", 1),
            TimeSlot("Tuesday", 2),
        ]

        # Mr. Smith cannot teach on Monday Period 1
        teacher_smith.unavalible_slot.append(time_slots[0])

        rooms = [room_101, room_102]

        lesson1 = Lesson(math_subject, teacher_smith, class_10a, periods_per_week=2)
        lesson2 = Lesson(physics_subject, teacher_jones, class_10b, periods_per_week=2)
        lesson3 = Lesson(math_subject, teacher_smith, class_10b, periods_per_week=1)
        
        lessons = [lesson1, lesson2, lesson3]

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

        success = scheduler.generate(timetable)

        if success:
            self.header.text = "Timetable Generated Successfully"
            
            # Display sorted schedule in the UI
            for entry in timetable.sort_entries():
                lesson = entry['lesson']
                slot = entry['slot']
                room = entry['room']
                
                text = (f"{slot.day} Period {slot.period} | "
                        f"{lesson.student_class.name} - {lesson.subject.name} "
                        f"(Teacher: {lesson.teacher.name}) in {room.name}")
                
                lbl = Label(text=text, size_hint_y=None, height=40, halign="left")
                lbl.bind(size=lbl.setter('text_size')) 
                self.result_grid.add_widget(lbl)
        else:
            self.header.text = "Failed to generate timetable. Constraints not met."

if __name__ == "__main__":
    TimetableApp().run()
