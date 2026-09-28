const scheduleData = [
  {
    "day": "Monday",
    "period": 2,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "Mathematics",
    "teacher": "Mr. Smith",
    "room": "Room 101"
  },
  {
    "day": "Monday",
    "period": 3,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "Mathematics",
    "teacher": "Mr. Smith",
    "room": "Room 101"
  },
  {
    "day": "Tuesday",
    "period": 1,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "Mathematics",
    "teacher": "Mr. Smith",
    "room": "Room 101"
  },
  {
    "day": "Tuesday",
    "period": 2,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "Mathematics",
    "teacher": "Mr. Smith",
    "room": "Room 101"
  },
  {
    "day": "Monday",
    "period": 1,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "Physics",
    "teacher": "Mrs. Jones",
    "room": "Room 101"
  },
  {
    "day": "Monday",
    "period": 4,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "Physics",
    "teacher": "Mrs. Jones",
    "room": "Room 101"
  },
  {
    "day": "Tuesday",
    "period": 3,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "Physics",
    "teacher": "Mrs. Jones",
    "room": "Room 101"
  },
  {
    "day": "Tuesday",
    "period": 4,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 101"
  },
  {
    "day": "Wednesday",
    "period": 1,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 101"
  },
  {
    "day": "Wednesday",
    "period": 2,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 101"
  },
  {
    "day": "Thursday",
    "period": 1,
    "class_id": "10A",
    "class_name": "Class 10A",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 101"
  },
  {
    "day": "Monday",
    "period": 4,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "Mathematics",
    "teacher": "Mr. Smith",
    "room": "Room 102"
  },
  {
    "day": "Tuesday",
    "period": 3,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "Mathematics",
    "teacher": "Mr. Smith",
    "room": "Room 102"
  },
  {
    "day": "Tuesday",
    "period": 4,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "Mathematics",
    "teacher": "Mr. Smith",
    "room": "Room 102"
  },
  {
    "day": "Wednesday",
    "period": 1,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "Mathematics",
    "teacher": "Mr. Smith",
    "room": "Room 102"
  },
  {
    "day": "Monday",
    "period": 2,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "Chemistry",
    "teacher": "Mrs. Jones",
    "room": "Room 102"
  },
  {
    "day": "Monday",
    "period": 3,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "Chemistry",
    "teacher": "Mrs. Jones",
    "room": "Room 102"
  },
  {
    "day": "Tuesday",
    "period": 1,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "Chemistry",
    "teacher": "Mrs. Jones",
    "room": "Room 102"
  },
  {
    "day": "Monday",
    "period": 1,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 102"
  },
  {
    "day": "Tuesday",
    "period": 2,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 102"
  },
  {
    "day": "Wednesday",
    "period": 3,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 101"
  },
  {
    "day": "Wednesday",
    "period": 4,
    "class_id": "10B",
    "class_name": "Class 10B",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 101"
  },
  {
    "day": "Tuesday",
    "period": 2,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "Physics",
    "teacher": "Mrs. Jones",
    "room": "Room 103"
  },
  {
    "day": "Tuesday",
    "period": 4,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "Physics",
    "teacher": "Mrs. Jones",
    "room": "Room 103"
  },
  {
    "day": "Wednesday",
    "period": 1,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "Physics",
    "teacher": "Mrs. Jones",
    "room": "Room 103"
  },
  {
    "day": "Wednesday",
    "period": 2,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "Physics",
    "teacher": "Mrs. Jones",
    "room": "Room 102"
  },
  {
    "day": "Wednesday",
    "period": 3,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "Chemistry",
    "teacher": "Mr. Smith",
    "room": "Room 102"
  },
  {
    "day": "Wednesday",
    "period": 4,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "Chemistry",
    "teacher": "Mr. Smith",
    "room": "Room 102"
  },
  {
    "day": "Thursday",
    "period": 1,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "Chemistry",
    "teacher": "Mr. Smith",
    "room": "Room 102"
  },
  {
    "day": "Monday",
    "period": 2,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 103"
  },
  {
    "day": "Monday",
    "period": 3,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 103"
  },
  {
    "day": "Tuesday",
    "period": 1,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 103"
  },
  {
    "day": "Tuesday",
    "period": 3,
    "class_id": "10C",
    "class_name": "Class 10C",
    "subject": "English",
    "teacher": "Mr. Doe",
    "room": "Room 103"
  }
];
const scheduleMeta = {
  "days": [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday"
  ],
  "periods": [
    1,
    2,
    3,
    4
  ],
  "classes": [
    "10A",
    "10B",
    "10C"
  ]
};