class Timetable:
    def __init__(self):
        self.entries = []

    def sort_entries(self):
        day_order = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7}
        return sorted(self.entries, key=lambda e: (day_order.get(e['slot'].day, 8), e['slot'].period))

    def print_general_timetable(self):
        print("=== General Timetable ===")
        for entry in self.sort_entries():
            lesson = entry['lesson']
            slot = entry['slot']
            room = entry['room']
            print(f"{slot.day} Period {slot.period}: "
                  f"{lesson.student_class.name} - {lesson.subject.name} "
                  f"(Teacher: {lesson.teacher.name}) in {room.name}")
        print("=========================\n")

    def print_class_timetable(self, student_class):
        print(f"=== Timetable for {student_class.name} ===")
        found = False
        for entry in self.sort_entries():
            if entry['lesson'].student_class == student_class:
                found = True
                lesson = entry['lesson']
                slot = entry['slot']
                room = entry['room']
                print(f"{slot.day} Period {slot.period}: "
                      f"{lesson.subject.name} "
                      f"(Teacher: {lesson.teacher.name}) in {room.name}")
        if not found:
            print("No lessons scheduled.")
        print("=========================\n")

    def print_teacher_timetable(self, teacher):
        print(f"=== Timetable for {teacher.name} ===")
        found = False
        for entry in self.sort_entries():
            if entry['lesson'].teacher == teacher:
                found = True
                lesson = entry['lesson']
                slot = entry['slot']
                room = entry['room']
                print(f"{slot.day} Period {slot.period}: "
                      f"{lesson.subject.name} "
                      f"({lesson.student_class.name}) in {room.name}")
        if not found:
            print("No lessons scheduled.")
        print("=========================\n")