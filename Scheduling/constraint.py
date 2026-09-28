class Constraint:
    def check(self, timetable, lesson, slot, room=None):
        return True

class TeacherConflictConstraint(Constraint):

    def check(self, timetable, lesson, slot, room=None):
        # check whether teacher is already teaching at this slot
        for entry in timetable.entries:
            if entry['slot'].day == slot.day and entry['slot'].period == slot.period:
                if entry['lesson'].teacher == lesson.teacher:
                    return False
        return True

class ClassConflictConstraint(Constraint):

    def check(self, timetable, lesson, slot, room=None):
        # check whether class already has a lesson at this slot
        for entry in timetable.entries:
            if entry['slot'].day == slot.day and entry['slot'].period == slot.period:
                if entry['lesson'].student_class == lesson.student_class:
                    return False
        return True

class RoomConflictConstraint(Constraint):

    def check(self, timetable, lesson, slot, room=None):
        # check whether room is already occupied
        if room is None:
            return True
        for entry in timetable.entries:
            if entry['slot'].day == slot.day and entry['slot'].period == slot.period:
                if entry['room'] == room:
                    return False
        return True

class TeacherAvailabilityConstraint(Constraint):
    def check(self, timetable, lesson, slot, room=None):
        for unavail in lesson.teacher.unavalible_slot:
            if unavail.day == slot.day and unavail.period == slot.period:
                return False
        return True

class RoomCapacityConstraint(Constraint):
    def check(self, timetable, lesson, slot, room=None):
        if room is None:
            return True
        return lesson.student_class.size <= room.capacity

class DailySubjectLimitConstraint(Constraint):
    def __init__(self, max_per_day=2):
        self.max_per_day = max_per_day

    def check(self, timetable, lesson, slot, room=None):
        count = 0
        for entry in timetable.entries:
            if entry['slot'].day == slot.day:
                if entry['lesson'].student_class == lesson.student_class and \
                   entry['lesson'].subject == lesson.subject:
                    count += 1
        if count >= self.max_per_day:
            return False
        return True
