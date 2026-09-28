class Lesson:
    def __init__(self, subject, teacher, student_class, periods_per_week):
        self.subject = subject
        self.teacher = teacher
        self.student_class = student_class
        self.periods_per_week = periods_per_week
        self.assigned_slots = []