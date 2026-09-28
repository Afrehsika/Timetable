import random

class Scheduler:
    def __init__(self, lessons, time_slots, rooms, constraints):
        self.lessons = lessons
        self.time_slots = time_slots
        self.rooms = rooms
        self.constraints = constraints

    def is_valid(self, timetable, lesson, slot, room):
        for constraint in self.constraints:
            if not constraint.check(timetable, lesson, slot, room):
                return False
        return True

    def generate(self, timetable):
        # Flatten the required lessons into individual periods
        unassigned = []
        for lesson in self.lessons:
            periods_needed = lesson.periods_per_week - len(lesson.assigned_slots)
            for _ in range(periods_needed):
                unassigned.append(lesson)
        
        return self._backtrack(timetable, unassigned)

    def _backtrack(self, timetable, unassigned):
        if not unassigned:
            return True # All scheduled successfully

        lesson = unassigned[0]

        slots = list(self.time_slots)
        random.shuffle(slots)
        
        rooms_list = list(self.rooms)
        random.shuffle(rooms_list)

        with open('debug_shuffle.txt', 'a') as f:
            f.write(f"First slot: {slots[0].day} {slots[0].period}\n")

        for slot in slots:
            for room in rooms_list:
                if self.is_valid(timetable, lesson, slot, room):
                    # Assign the slot and room
                    entry = {'lesson': lesson, 'slot': slot, 'room': room}
                    timetable.entries.append(entry)
                    lesson.assigned_slots.append(slot)

                    # Recursively assign the rest
                    if self._backtrack(timetable, unassigned[1:]):
                        return True

                    # Backtrack if the above didn't work out
                    timetable.entries.pop()
                    lesson.assigned_slots.pop()

        return False # No valid slot/room found for this lesson (trigger backtracking)
