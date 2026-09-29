document.addEventListener("DOMContentLoaded", () => {
    // 1. Data Store
    const appData = {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        periods_per_day: 8,
        bells: [],
        subjects: [],
        teachers: [],
        classes: [],
        rooms: [],
        lessons: []
    };
    
    let generatedScheduleData = null;
    let generatedScheduleMeta = null;
    let currentCategory = 'subject';
    let selectedRowIndex = -1;

    // Landing Page Logic
    const btnGetStarted = document.getElementById('btn-get-started');
    const landingPage = document.getElementById('landing-page');
    if (btnGetStarted && landingPage) {
        btnGetStarted.addEventListener('click', () => {
            landingPage.classList.add('hidden');
            setTimeout(() => {
                landingPage.remove();
            }, 800);
        });
    }

    // View Switching Logic
    const dataView = document.getElementById('data-view');
    const timetableView = document.getElementById('timetable-view');
    const navData = document.getElementById('nav-data');
    const navGrid = document.getElementById('nav-grid');
    const gridArea = document.getElementById('grid-container-area');

    navData.addEventListener('click', () => {
        dataView.style.display = 'block';
        timetableView.style.display = 'none';
        navData.classList.add('active');
        navGrid.classList.remove('active');
        renderTable();
    });

    navGrid.addEventListener('click', () => {
        dataView.style.display = 'none';
        timetableView.style.display = 'block';
        navData.classList.remove('active');
        navGrid.classList.add('active');
    });

    // Sidebar Category Switching
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentCategory = item.getAttribute('data-target');
            selectedRowIndex = -1;
            renderTable();
        });
    });

    // Render Data Table
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('table-body');
    const btnEdit = document.getElementById('btn-edit');
    const btnDelete = document.getElementById('btn-delete');

    const updateButtonStates = () => {
        if (selectedRowIndex >= 0) {
            btnEdit.classList.remove('disabled');
            btnDelete.classList.remove('disabled');
        } else {
            btnEdit.classList.add('disabled');
            btnDelete.classList.add('disabled');
        }
    };

    const renderTable = () => {
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';
        
        let headers = [];
        let items = [];

        if (currentCategory === 'subject') {
            headers = ['Name', 'Abbreviation'];
            items = appData.subjects;
        } else if (currentCategory === 'teacher') {
            headers = ['Name', 'Abbreviation'];
            items = appData.teachers;
        } else if (currentCategory === 'class') {
            headers = ['Name', 'ID', 'Student Count'];
            items = appData.classes;
        } else if (currentCategory === 'room') {
            headers = ['Name', 'Max Capacity'];
            items = appData.rooms;
        } else if (currentCategory === 'lesson') {
            headers = ['Subject', 'Teacher', 'Class', 'Periods/Week'];
            items = appData.lessons;
        } else if (currentCategory === 'bell') {
            headers = ['Period Label', 'Time Range'];
            items = appData.bells;
        }

        // Render headers
        headers.forEach(h => {
            const th = document.createElement('th');
            th.innerText = h;
            tableHead.appendChild(th);
        });

        // Render rows
        items.forEach((item, index) => {
            const tr = document.createElement('tr');
            if (index === selectedRowIndex) tr.classList.add('selected');
            
            tr.addEventListener('click', () => {
                selectedRowIndex = index;
                renderTable();
            });

            if (currentCategory === 'subject' || currentCategory === 'teacher') {
                tr.innerHTML = `<td>${item.name}</td><td>${item.id}</td>`;
            } else if (currentCategory === 'class') {
                tr.innerHTML = `<td>${item.name}</td><td>${item.id}</td><td>${item.size}</td>`;
            } else if (currentCategory === 'room') {
                tr.innerHTML = `<td>${item.name}</td><td>${item.capacity}</td>`;
            } else if (currentCategory === 'lesson') {
                const s = appData.subjects.find(x => x.id === item.subject_id)?.name || item.subject_id;
                const t = appData.teachers.find(x => x.id === item.teacher_id)?.name || item.teacher_id;
                const c = appData.classes.find(x => x.id === item.class_id)?.name || item.class_id;
                tr.innerHTML = `<td>${s}</td><td>${t}</td><td>${c}</td><td>${item.periods}</td>`;
            } else if (currentCategory === 'bell') {
                tr.innerHTML = `<td>${item.period}</td><td>${item.time}</td>`;
            }
            tableBody.appendChild(tr);
        });

        updateButtonStates();
    };

    // Modal Handling for New/Edit Items
    const modal = document.getElementById('new-item-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalForm = document.getElementById('modal-form');
    let editingIndex = -1;

    const openFormModal = (isEdit = false) => {
        editingIndex = isEdit ? selectedRowIndex : -1;
        modal.style.display = 'flex';
        
        let item = null;
        if (isEdit) {
            if (currentCategory === 'subject') item = appData.subjects[selectedRowIndex];
            else if (currentCategory === 'teacher') item = appData.teachers[selectedRowIndex];
            else if (currentCategory === 'class') item = appData.classes[selectedRowIndex];
            else if (currentCategory === 'room') item = appData.rooms[selectedRowIndex];
            else if (currentCategory === 'lesson') item = appData.lessons[selectedRowIndex];
            else if (currentCategory === 'bell') item = appData.bells[selectedRowIndex];
        }

        let html = '';
        if (currentCategory === 'subject') {
            modalTitle.innerText = isEdit ? "Edit Subject" : "New Subject";
            html = `
                <input type="text" id="inp-name" placeholder="Name (e.g. Mathematics)" autocomplete="off" value="${item ? item.name : ''}">
                <input type="text" id="inp-id" placeholder="Abbreviation (e.g. MATH)" autocomplete="off" value="${item ? item.id : ''}">
            `;
        } else if (currentCategory === 'teacher') {
            modalTitle.innerText = isEdit ? "Edit Teacher" : "New Teacher";
            html = `
                <input type="text" id="inp-name" placeholder="Name (e.g. Mr. Smith)" autocomplete="off" value="${item ? item.name : ''}">
                <input type="text" id="inp-id" placeholder="Abbreviation (e.g. T01)" autocomplete="off" value="${item ? item.id : ''}">
            `;
        } else if (currentCategory === 'class') {
            modalTitle.innerText = isEdit ? "Edit Class" : "New Class";
            html = `
                <input type="text" id="inp-name" placeholder="Name (e.g. 1A1)" autocomplete="off" value="${item ? item.name : ''}">
                <input type="text" id="inp-id" placeholder="ID (e.g. 1A1)" autocomplete="off" value="${item ? item.id : ''}">
                <input type="number" id="inp-size" placeholder="Student Count (e.g. 25)" autocomplete="off" value="${item ? item.size : ''}">
            `;
        } else if (currentCategory === 'room') {
            modalTitle.innerText = isEdit ? "Edit Room" : "New Room";
            html = `
                <input type="text" id="inp-name" placeholder="Name (e.g. Room 101)" autocomplete="off" value="${item ? item.name : ''}">
                <input type="number" id="inp-cap" placeholder="Capacity (e.g. 30)" autocomplete="off" value="${item ? item.capacity : ''}">
            `;
        } else if (currentCategory === 'lesson') {
            modalTitle.innerText = isEdit ? "Edit Lesson" : "New Lesson";
            html = `
                <select id="les-subj"><option value="">Select Subject...</option>${appData.subjects.map(s => `<option value="${s.id}" ${item && item.subject_id === s.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select>
                <select id="les-teach"><option value="">Select Teacher...</option>${appData.teachers.map(t => `<option value="${t.id}" ${item && item.teacher_id === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}</select>
                <select id="les-cls"><option value="">Select Class...</option>${appData.classes.map(c => `<option value="${c.id}" ${item && item.class_id === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
                <input type="number" id="les-periods" placeholder="Periods Per Week (e.g. 4)" value="${item ? item.periods : ''}">
            `;
        } else if (currentCategory === 'bell') {
            modalTitle.innerText = isEdit ? "Edit Bell / Time Slot" : "New Bell / Time Slot";
            html = `
                <input type="text" id="inp-period" placeholder="Period Label (e.g. 1 or Break)" value="${item ? item.period : ''}">
                <input type="text" id="inp-time" placeholder="Time Range (e.g. 7:30 - 8:30)" value="${item ? item.time : ''}">
            `;
        }
        modalForm.innerHTML = html;
    };

    document.getElementById('btn-new').addEventListener('click', () => openFormModal(false));

    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            if (selectedRowIndex >= 0 && !btnEdit.classList.contains('disabled')) {
                openFormModal(true);
            }
        });
    }

    document.getElementById('modal-cancel').addEventListener('click', () => {
        modal.style.display = 'none';
        editingIndex = -1;
    });

    document.getElementById('modal-save').addEventListener('click', () => {
        let newItem = null;
        if (currentCategory === 'subject') {
            newItem = { name: document.getElementById('inp-name').value, id: document.getElementById('inp-id').value };
        } else if (currentCategory === 'teacher') {
            newItem = { name: document.getElementById('inp-name').value, id: document.getElementById('inp-id').value };
        } else if (currentCategory === 'class') {
            newItem = { name: document.getElementById('inp-name').value, id: document.getElementById('inp-id').value, size: parseInt(document.getElementById('inp-size').value) };
        } else if (currentCategory === 'room') {
            newItem = { name: document.getElementById('inp-name').value, capacity: parseInt(document.getElementById('inp-cap').value) };
        } else if (currentCategory === 'lesson') {
            newItem = {
                subject_id: document.getElementById('les-subj').value,
                teacher_id: document.getElementById('les-teach').value,
                class_id: document.getElementById('les-cls').value,
                periods: parseInt(document.getElementById('les-periods').value)
            };
        } else if (currentCategory === 'bell') {
            newItem = { period: document.getElementById('inp-period').value, time: document.getElementById('inp-time').value };
        }

        if (editingIndex >= 0) {
            if (currentCategory === 'subject') appData.subjects[editingIndex] = newItem;
            else if (currentCategory === 'teacher') appData.teachers[editingIndex] = newItem;
            else if (currentCategory === 'class') appData.classes[editingIndex] = newItem;
            else if (currentCategory === 'room') appData.rooms[editingIndex] = newItem;
            else if (currentCategory === 'lesson') appData.lessons[editingIndex] = newItem;
            else if (currentCategory === 'bell') appData.bells[editingIndex] = newItem;
        } else {
            if (currentCategory === 'subject') appData.subjects.push(newItem);
            else if (currentCategory === 'teacher') appData.teachers.push(newItem);
            else if (currentCategory === 'class') appData.classes.push(newItem);
            else if (currentCategory === 'room') appData.rooms.push(newItem);
            else if (currentCategory === 'lesson') appData.lessons.push(newItem);
            else if (currentCategory === 'bell') appData.bells.push(newItem);
        }

        modal.style.display = 'none';
        editingIndex = -1;
        renderTable();
    });

    // Delete
    btnDelete.addEventListener('click', () => {
        if (selectedRowIndex < 0) return;
        if (currentCategory === 'subject') appData.subjects.splice(selectedRowIndex, 1);
        else if (currentCategory === 'teacher') appData.teachers.splice(selectedRowIndex, 1);
        else if (currentCategory === 'class') appData.classes.splice(selectedRowIndex, 1);
        else if (currentCategory === 'room') appData.rooms.splice(selectedRowIndex, 1);
        else if (currentCategory === 'lesson') appData.lessons.splice(selectedRowIndex, 1);
        else if (currentCategory === 'bell') appData.bells.splice(selectedRowIndex, 1);
        
        selectedRowIndex = -1;
        renderTable();
    });

    // Sample Data Loader
    document.getElementById("btn-load-sample").addEventListener("click", () => {
        appData.bells = [
            {period: "1", time: "7:30 - 8:30"},
            {period: "2", time: "8:30 - 9:30"},
            {period: "3", time: "9:30 - 10:30"},
            {period: "4", time: "11:00 - 12:00"},
            {period: "5", time: "12:00 - 13:00"},
            {period: "6", time: "14:00 - 15:00"},
            {period: "7", time: "15:00 - 16:00"},
            {period: "8", time: "16:00 - 17:00"}
        ];

        appData.subjects = [
            {id: "EDUC101", name: "Education Studies"}, {id: "CHDV101", name: "Child Development"},
            {id: "EDPS101", name: "Educational Psychology"}, {id: "PHED101", name: "Philosophy of Education"},
            {id: "PRTC101", name: "Principles of Teaching"}, {id: "INTE101", name: "Instructional Technology"},
            {id: "EDME101", name: "Educational Measurement"}, {id: "CUDE101", name: "Curriculum Development"},
            {id: "SPED101", name: "Special Education"}, {id: "CLMA101", name: "Classroom Management"},
            {id: "ENGL101", name: "English Language"}, {id: "LITR101", name: "Literature in English"},
            {id: "MATH101", name: "Mathematics"}, {id: "INSC101", name: "Integrated Science"},
            {id: "PHYS101", name: "Physics"}, {id: "CHEM101", name: "Chemistry"},
            {id: "BIOL101", name: "Biology"}, {id: "ICT101",  name: "Information Technology"},
            {id: "SOST101", name: "Social Studies"}, {id: "HIST101", name: "History"},
            {id: "GEOG101", name: "Geography"}, {id: "ECON101", name: "Economics"},
            {id: "REST101", name: "Religious Studies"}, {id: "MUSC101", name: "Music"},
            {id: "ARTD101", name: "Art and Design"}, {id: "PHED102", name: "Physical Education"},
            {id: "ECED101", name: "Early Childhood Education"}, {id: "BSMA101", name: "Basic School Management"},
            {id: "GHLA101", name: "Ghanaian Language"}, {id: "FREN101", name: "French"}
        ];

        appData.teachers = [
            {id: "T01", name: "Prof. Acheampong"}, {id: "T02", name: "Dr. Mensah"},
            {id: "T03", name: "Mr. Osei"}, {id: "T04", name: "Mrs. Appiah"},
            {id: "T05", name: "Dr. Asamoah"}, {id: "T06", name: "Mr. Yeboah"},
            {id: "T07", name: "Ms. Nkrumah"}, {id: "T08", name: "Prof. Boakye"},
            {id: "T09", name: "Dr. Owusu"}, {id: "T10", name: "Mrs. Addo"},
            {id: "T11", name: "Mr. Tetteh"}, {id: "T12", name: "Dr. Gyan"},
            {id: "T13", name: "Ms. Agyemang"}, {id: "T14", name: "Prof. Frimpong"},
            {id: "T15", name: "Mr. Boateng"}
        ];

        appData.classes = [
            {id: "L100A", name: "Level 100A", size: 45}, {id: "L100B", name: "Level 100B", size: 40},
            {id: "L100C", name: "Level 100C", size: 42}, {id: "L200A", name: "Level 200A", size: 38},
            {id: "L200B", name: "Level 200B", size: 39}, {id: "L200C", name: "Level 200C", size: 41},
            {id: "L300A", name: "Level 300A", size: 35}, {id: "L300B", name: "Level 300B", size: 36},
            {id: "L300C", name: "Level 300C", size: 34}, {id: "L400A", name: "Level 400A", size: 30},
            {id: "L400B", name: "Level 400B", size: 32}, {id: "L400C", name: "Level 400C", size: 31}
        ];

        appData.rooms = [
            {name: "Main Auditorium", capacity: 100}, // Added large room for merging
            {name: "Lecture Hall 1", capacity: 50}, {name: "Lecture Hall 2", capacity: 50},
            {name: "Lecture Hall 3", capacity: 50}, {name: "Lecture Hall 4", capacity: 50},
            {name: "Lecture Hall 5", capacity: 50}, {name: "Lecture Hall 6", capacity: 50},
            {name: "Lecture Hall 7", capacity: 50}, {name: "Lecture Hall 8", capacity: 50},
            {name: "Lecture Hall 9", capacity: 50}, {name: "Lecture Hall 10", capacity: 50},
            {name: "Lecture Hall 11", capacity: 50}, {name: "Lecture Hall 12", capacity: 50},
            {name: "Science Lab", capacity: 40}, {name: "ICT Lab", capacity: 40},
            {name: "Music Room", capacity: 35}
        ];

        appData.lessons = [
            // L100A
            {subject_id: "EDUC101", teacher_id: "T01", class_id: "L100A", periods: 4},
            {subject_id: "ENGL101", teacher_id: "T02", class_id: "L100A", periods: 4},
            {subject_id: "MATH101", teacher_id: "T03", class_id: "L100A", periods: 4},
            {subject_id: "INSC101", teacher_id: "T04", class_id: "L100A", periods: 4},
            // L100B
            {subject_id: "CHDV101", teacher_id: "T05", class_id: "L100B", periods: 4},
            {subject_id: "ENGL101", teacher_id: "T02", class_id: "L100B", periods: 4},
            {subject_id: "MATH101", teacher_id: "T03", class_id: "L100B", periods: 2},
            {subject_id: "HIST101", teacher_id: "T06", class_id: "L100B", periods: 2},
            // L100C
            {subject_id: "EDPS101", teacher_id: "T07", class_id: "L100C", periods: 2},
            {subject_id: "FREN101", teacher_id: "T08", class_id: "L100C", periods: 2},
            {subject_id: "ARTD101", teacher_id: "T09", class_id: "L100C", periods: 2},
            {subject_id: "INSC101", teacher_id: "T04", class_id: "L100C", periods: 2},
            // L200A
            {subject_id: "PHED101", teacher_id: "T10", class_id: "L200A", periods: 2},
            {subject_id: "ENGL101", teacher_id: "T02", class_id: "L200A", periods: 2},
            {subject_id: "PHYS101", teacher_id: "T11", class_id: "L200A", periods: 2},
            {subject_id: "ICT101",  teacher_id: "T12", class_id: "L200A", periods: 2},
            // L200B
            {subject_id: "PRTC101", teacher_id: "T13", class_id: "L200B", periods: 2},
            {subject_id: "CHEM101", teacher_id: "T14", class_id: "L200B", periods: 2},
            {subject_id: "BIOL101", teacher_id: "T15", class_id: "L200B", periods: 2},
            {subject_id: "ICT101",  teacher_id: "T12", class_id: "L200B", periods: 2},
            // L200C
            {subject_id: "INTE101", teacher_id: "T01", class_id: "L200C", periods: 2},
            {subject_id: "MATH101", teacher_id: "T03", class_id: "L200C", periods: 2},
            {subject_id: "SOST101", teacher_id: "T06", class_id: "L200C", periods: 2},
            {subject_id: "GEOG101", teacher_id: "T07", class_id: "L200C", periods: 2},
            // L300A
            {subject_id: "EDME101", teacher_id: "T05", class_id: "L300A", periods: 2},
            {subject_id: "ECON101", teacher_id: "T08", class_id: "L300A", periods: 2},
            {subject_id: "REST101", teacher_id: "T09", class_id: "L300A", periods: 2},
            {subject_id: "MUSC101", teacher_id: "T10", class_id: "L300A", periods: 2},
            // L300B
            {subject_id: "CUDE101", teacher_id: "T11", class_id: "L300B", periods: 2},
            {subject_id: "PHED102", teacher_id: "T12", class_id: "L300B", periods: 2},
            {subject_id: "ECED101", teacher_id: "T13", class_id: "L300B", periods: 2},
            {subject_id: "FREN101", teacher_id: "T08", class_id: "L300B", periods: 2},
            // L300C
            {subject_id: "SPED101", teacher_id: "T14", class_id: "L300C", periods: 2},
            {subject_id: "BSMA101", teacher_id: "T15", class_id: "L300C", periods: 2},
            {subject_id: "GHLA101", teacher_id: "T01", class_id: "L300C", periods: 2},
            {subject_id: "ENGL101", teacher_id: "T02", class_id: "L300C", periods: 2},
            // L400A
            {subject_id: "CLMA101", teacher_id: "T04", class_id: "L400A", periods: 2},
            {subject_id: "MATH101", teacher_id: "T03", class_id: "L400A", periods: 2},
            {subject_id: "SOST101", teacher_id: "T06", class_id: "L400A", periods: 2},
            {subject_id: "ICT101",  teacher_id: "T12", class_id: "L400A", periods: 2},
            // L400B
            {subject_id: "EDUC101", teacher_id: "T05", class_id: "L400B", periods: 2},
            {subject_id: "PHYS101", teacher_id: "T11", class_id: "L400B", periods: 2},
            {subject_id: "CHEM101", teacher_id: "T14", class_id: "L400B", periods: 2},
            {subject_id: "BIOL101", teacher_id: "T15", class_id: "L400B", periods: 2},
            // L400C
            {subject_id: "CHDV101", teacher_id: "T07", class_id: "L400C", periods: 2},
            {subject_id: "ECON101", teacher_id: "T08", class_id: "L400C", periods: 2},
            {subject_id: "ARTD101", teacher_id: "T09", class_id: "L400C", periods: 2},
            {subject_id: "MUSC101", teacher_id: "T10", class_id: "L400C", periods: 2}
        ];
        renderTable();
    });

    // 4. API Request to Generate Schedule
    document.getElementById('btn-generate-api').addEventListener('click', async () => {
        const status = document.getElementById('generate-status');
        status.innerText = "Generating timetable... this involves a lot of math!";
        
        if (appData.bells && appData.bells.length > 0) {
            appData.periods_per_day = appData.bells.length;
        }

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appData)
            });
            const result = await res.json();
            
            if (result.success) {
                status.innerText = "Success! Switching to Timetable View.";
                generatedScheduleData = result.schedule;
                generatedScheduleMeta = result.meta;
                setTimeout(() => navGrid.click(), 500);
                renderMasterGrid();
            } else {
                status.innerText = "Error: " + result.error;
            }
        } catch (e) {
            status.innerText = "Server Request failed. Make sure server.py is running! Error: " + e.message;
        }
    });

    // Initialize UI
    renderTable();

    const getSubjectColor = (subject) => {
        if (!subject) return "var(--color-default)";
        if (subject.toLowerCase().includes("math")) return "var(--color-math)";
        if (subject.toLowerCase().includes("phys")) return "var(--color-phys)";
        if (subject.toLowerCase().includes("chem")) return "var(--color-chem)";
        if (subject.toLowerCase().includes("eng")) return "var(--color-eng)";
        return "var(--color-default)";
    };

    // Modal for changing scheduled class details
    const changeRoomModal = document.getElementById('change-room-modal');
    const editSchSubject = document.getElementById('edit-sch-subject');
    const editSchTeacher = document.getElementById('edit-sch-teacher');
    const roomSelect = document.getElementById('room-select');
    const changeRoomError = document.getElementById('change-room-error');
    let currentEntryForRoomChange = null;

    const updateTeacherDropdown = (subjectName, selectedTeacherName, isInit = false) => {
        if (!editSchTeacher) return;
        
        const subjectObj = appData.subjects.find(s => s.name === subjectName);
        let validTeachers = appData.teachers;
        
        if (subjectObj) {
            const teacherIds = [...new Set(appData.lessons
                .filter(l => l.subject_id === subjectObj.id)
                .map(l => l.teacher_id))];
                
            if (teacherIds.length > 0) {
                validTeachers = appData.teachers.filter(t => teacherIds.includes(t.id));
            }
        }
        
        // Only force-keep the currently selected teacher if we are initializing the modal
        if (isInit && selectedTeacherName && !validTeachers.some(t => t.name === selectedTeacherName)) {
            const currentTeacherObj = appData.teachers.find(t => t.name === selectedTeacherName);
            if (currentTeacherObj) validTeachers.push(currentTeacherObj);
        }
        
        // If we are changing the subject and the current teacher isn't valid, reset it
        if (!isInit && selectedTeacherName && !validTeachers.some(t => t.name === selectedTeacherName)) {
            selectedTeacherName = validTeachers.length > 0 ? validTeachers[0].name : '';
        }

        editSchTeacher.innerHTML = validTeachers.map(t => `<option value="${t.name}" ${t.name === selectedTeacherName ? 'selected' : ''}>${t.name}</option>`).join('');
    };

    if (editSchSubject) {
        editSchSubject.addEventListener('change', (e) => {
            updateTeacherDropdown(e.target.value, editSchTeacher.value, false);
        });
    }

    if (changeRoomModal) {
        document.getElementById('room-modal-cancel').addEventListener('click', () => {
            changeRoomModal.style.display = 'none';
            changeRoomError.style.display = 'none';
        });

        document.getElementById('room-modal-save').addEventListener('click', () => {
            const newRoomName = roomSelect.value;
            const newSubjectName = editSchSubject.value;
            const newTeacherName = editSchTeacher.value;
            const entry = currentEntryForRoomChange;
            
            // Validation
            let roomConflict = false;
            let errorMessage = "";
            
            // 0. Teacher Validation
            const teacherOccupants = generatedScheduleData.filter(sch => 
                sch.day === entry.day && sch.period === entry.period && sch.teacher === newTeacherName && !(sch.class_id === entry.class_id && sch.day === entry.day && sch.period === entry.period)
            );
            
            if (teacherOccupants.length > 0) {
                // The new teacher is teaching somewhere else.
                // Are they teaching in the newRoomName? (Merging)
                const diffRoom = teacherOccupants.some(sch => sch.room !== newRoomName);
                if (diffRoom) {
                    roomConflict = true;
                    errorMessage = `Teacher ${newTeacherName} is already teaching in another room at this time.`;
                }
            }
            
            // 1. Calculate new room capacity and occupancy
            if (!roomConflict) {
                const newRoomObj = appData.rooms.find(r => r.name === newRoomName);
                if (!newRoomObj) return;
                
                // Check who is in that room at that time
                const occupants = generatedScheduleData.filter(sch => 
                    sch.day === entry.day && sch.period === entry.period && sch.room === newRoomName && !(sch.class_id === entry.class_id && sch.day === entry.day && sch.period === entry.period)
                );
                
                if (occupants.length > 0) {
                    // Room is occupied. Are they all taught by the SAME new teacher?
                    const diffTeacher = occupants.some(sch => sch.teacher !== newTeacherName);
                    if (diffTeacher) {
                        roomConflict = true;
                        errorMessage = "Room is already occupied by another teacher's class.";
                    }
                }
                
                if (!roomConflict) {
                    // Check capacity
                    let currentStudents = 0;
                    occupants.forEach(sch => {
                        const clsObj = appData.classes.find(c => c.id === sch.class_id);
                        if (clsObj) currentStudents += clsObj.size;
                    });
                    
                    const draggedClassObj = appData.classes.find(c => c.id === entry.class_id);
                    if (draggedClassObj) currentStudents += draggedClassObj.size;
                    
                    if (currentStudents > newRoomObj.capacity) {
                        roomConflict = true;
                        errorMessage = "Room capacity (" + newRoomObj.capacity + ") exceeded. Total students: " + currentStudents;
                    }
                }
            }
            
            if (roomConflict) {
                changeRoomError.innerText = errorMessage;
                changeRoomError.style.display = 'block';
            } else {
                // Success
                entry.room = newRoomName;
                entry.subject = newSubjectName;
                entry.teacher = newTeacherName;
                changeRoomModal.style.display = 'none';
                changeRoomError.style.display = 'none';
                renderMasterGrid();
            }
        });
    }

    const openRoomChangeModal = (entry) => {
        currentEntryForRoomChange = entry;
        if (editSchSubject) editSchSubject.innerHTML = appData.subjects.map(s => `<option value="${s.name}" ${s.name === entry.subject ? 'selected' : ''}>${s.name}</option>`).join('');
        updateTeacherDropdown(entry.subject, entry.teacher, true);
        if (roomSelect) roomSelect.innerHTML = appData.rooms.map(r => `<option value="${r.name}" ${r.name === entry.room ? 'selected' : ''}>${r.name} (Cap: ${r.capacity})</option>`).join('');
        changeRoomError.style.display = 'none';
        changeRoomModal.style.display = 'flex';
    };

    const renderMasterGrid = () => {
        if (!generatedScheduleData) {
            gridArea.innerHTML = "<p>Please add data and generate the timetable first.</p>";
            return;
        }
        gridArea.innerHTML = "";
        const container = document.createElement("div");
        container.className = "grid-container";

        const dayHeaderRow = document.createElement("div");
        dayHeaderRow.className = "grid-row grid-header-row";
        const cornerCell = document.createElement("div");
        cornerCell.className = "grid-cell label-cell";
        cornerCell.innerText = "Class";
        dayHeaderRow.appendChild(cornerCell);

        generatedScheduleMeta.days.forEach(day => {
            const dayDiv = document.createElement("div");
            dayDiv.style.display = "flex";
            dayDiv.style.flexDirection = "column";
            
            const dayLabel = document.createElement("div");
            dayLabel.className = "day-header";
            dayLabel.innerText = day;
            
            const periodsRow = document.createElement("div");
            periodsRow.className = "period-headers";
            
            const bells = generatedScheduleMeta.bells || [];
            generatedScheduleMeta.periods.forEach((period, idx) => {
                const pLabel = document.createElement("div");
                pLabel.className = "period-header";
                const bell = bells[idx];
                pLabel.innerHTML = `<strong>${bell ? bell.period : period}</strong><br><span style="font-size: 0.75rem; color: #94a3b8;">${bell ? bell.time : ''}</span>`;
                periodsRow.appendChild(pLabel);
            });
            
            dayDiv.appendChild(dayLabel);
            dayDiv.appendChild(periodsRow);
            dayHeaderRow.appendChild(dayDiv);
        });
        container.appendChild(dayHeaderRow);

        generatedScheduleMeta.classes.forEach(classId => {
            const row = document.createElement("div");
            row.className = "grid-row";
            
            const label = document.createElement("div");
            label.className = "grid-cell label-cell";
            label.innerText = classId;
            row.appendChild(label);
            
            generatedScheduleMeta.days.forEach(day => {
                generatedScheduleMeta.periods.forEach(period => {
                    const cell = document.createElement("div");
                    cell.className = "grid-cell dropzone";
                    cell.dataset.classId = classId;
                    cell.dataset.day = day;
                    cell.dataset.period = period;
                    
                    const entry = generatedScheduleData.find(e => e.class_id === classId && e.day === day && e.period === period);
                    
                    if (entry) {
                        const card = document.createElement("div");
                        card.className = "subject-card";
                        card.draggable = true;
                        card.dataset.entry = JSON.stringify(entry);
                        card.style.backgroundColor = getSubjectColor(entry.subject);
                        card.style.cursor = "grab";
                        card.innerHTML = `
                            <div class="subject-name">${entry.subject}</div>
                            <div class="teacher-name">${entry.teacher}</div>
                            <div class="room-name">${entry.room}</div>
                            <button class="edit-room-btn" style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.5); border: none; color: white; cursor: pointer; border-radius: 4px; padding: 2px 5px; font-size: 10px;">✎</button>
                        `;
                        
                        // Handle clicking the edit button specifically
                        const editBtn = card.querySelector('.edit-room-btn');
                        if (editBtn) {
                            editBtn.addEventListener('click', (e) => {
                                e.stopPropagation(); // prevent dragging from interfering
                                openRoomChangeModal(entry);
                            });
                        }
                        
                        card.addEventListener('dragstart', (e) => {
                            e.dataTransfer.setData('application/json', card.dataset.entry);
                            setTimeout(() => card.style.opacity = '0.5', 0);
                            
                            // Highlight zones
                            document.querySelectorAll('.grid-cell.dropzone').forEach(dropCell => {
                                const dClass = dropCell.dataset.classId;
                                const dDay = dropCell.dataset.day;
                                const dPeriod = parseInt(dropCell.dataset.period, 10);
                                
                                if (dClass !== classId) {
                                    dropCell.style.opacity = '0.2'; // Different class row
                                    return;
                                }
                                
                                // Check if teacher is busy in this day/period in ANY class
                                const teacherSchedulesAtTarget = generatedScheduleData.filter(sch => 
                                    sch.teacher === entry.teacher && sch.day === dDay && sch.period === dPeriod && !(sch.class_id === classId && sch.day === entry.day && sch.period === entry.period)
                                );

                                let teacherConflict = false;
                                let roomConflict = false;
                                let mergeRoom = "";

                                if (teacherSchedulesAtTarget.length > 0) {
                                    // Teacher is already teaching. We can merge if the room capacity allows it.
                                    mergeRoom = teacherSchedulesAtTarget[0].room;
                                    const roomObj = appData.rooms.find(r => r.name === mergeRoom);
                                    const roomCapacity = roomObj ? roomObj.capacity : 0;
                                    
                                    // Calculate total students currently in that room at that time
                                    let currentStudents = 0;
                                    generatedScheduleData.forEach(sch => {
                                        if (sch.day === dDay && sch.period === dPeriod && sch.room === mergeRoom && !(sch.class_id === classId && sch.day === entry.day && sch.period === entry.period)) {
                                            const clsObj = appData.classes.find(c => c.id === sch.class_id);
                                            if (clsObj) currentStudents += clsObj.size;
                                        }
                                    });
                                    
                                    // Add the size of the dragged class
                                    const draggedClassObj = appData.classes.find(c => c.id === classId);
                                    if (draggedClassObj) currentStudents += draggedClassObj.size;
                                    
                                    if (currentStudents > roomCapacity) {
                                        teacherConflict = true; // Capacity exceeded, cannot merge
                                    }
                                } else {
                                    // Not merging teachers. Find candidate room and prevent room conflicts.
                                    let tryAdjacent = false;
                                    const adjacentSchedules = generatedScheduleData.filter(sch => 
                                        sch.class_id === classId && sch.day === dDay && Math.abs(sch.period - dPeriod) === 1 && sch.subject === entry.subject && !(sch.day === entry.day && sch.period === entry.period)
                                    );
                                    
                                    if (adjacentSchedules.length > 0) {
                                        tryAdjacent = true;
                                    }

                                    const checkRoom = (roomName) => {
                                        const occ = generatedScheduleData.filter(sch => 
                                            sch.day === dDay && sch.period === dPeriod && sch.room === roomName && !(sch.class_id === classId && sch.day === entry.day && sch.period === entry.period)
                                        );
                                        return occ.length === 0;
                                    };

                                    if (tryAdjacent && checkRoom(adjacentSchedules[0].room)) {
                                        mergeRoom = adjacentSchedules[0].room; // Sync room!
                                    } else if (checkRoom(entry.room)) {
                                        mergeRoom = entry.room; // Use original room
                                    } else {
                                        roomConflict = true; // No room available!
                                    }
                                }
                                
                                // Check if cell already has a card
                                const isCellOccupied = generatedScheduleData.some(sch => 
                                    sch.class_id === classId && sch.day === dDay && sch.period === dPeriod && !(sch.day === entry.day && sch.period === entry.period)
                                );
                                
                                if (teacherConflict || roomConflict || isCellOccupied) {
                                    dropCell.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; // Red
                                    dropCell.dataset.droppable = 'false';
                                } else {
                                    dropCell.style.backgroundColor = 'rgba(34, 197, 94, 0.2)'; // Green
                                    dropCell.dataset.droppable = 'true';
                                    dropCell.dataset.mergeRoom = mergeRoom;
                                }
                            });
                        });
                        
                        card.addEventListener('dragend', (e) => {
                            card.style.opacity = '1';
                            document.querySelectorAll('.grid-cell.dropzone').forEach(dropCell => {
                                dropCell.style.opacity = '1';
                                dropCell.style.backgroundColor = '';
                                dropCell.dataset.droppable = '';
                                dropCell.dataset.mergeRoom = '';
                            });
                        });
                        
                        cell.appendChild(card);
                    }
                    
                    cell.addEventListener('dragover', (e) => {
                        if (cell.dataset.droppable === 'true') {
                            e.preventDefault(); // Allow drop
                        }
                    });
                    
                    cell.addEventListener('drop', (e) => {
                        e.preventDefault();
                        if (cell.dataset.droppable === 'true') {
                            const data = JSON.parse(e.dataTransfer.getData('application/json'));
                            // Update data
                            const targetEntry = generatedScheduleData.find(sch => 
                                sch.class_id === data.class_id && sch.day === data.day && sch.period === data.period
                            );
                            if (targetEntry) {
                                targetEntry.day = cell.dataset.day;
                                targetEntry.period = parseInt(cell.dataset.period, 10);
                                if (cell.dataset.mergeRoom) {
                                    targetEntry.room = cell.dataset.mergeRoom;
                                }
                                renderMasterGrid(); // Re-render
                            }
                        }
                    });

                    row.appendChild(cell);
                });
            });
            container.appendChild(row);
        });
        gridArea.appendChild(container);
    };

    const renderClassPreview = () => {
        if (!generatedScheduleData || generatedScheduleMeta.classes.length === 0) return;
        
        gridArea.innerHTML = `
            <div style="margin-bottom: 20px; background: white; padding: 10px; border-radius: 4px; color: black; display: flex; align-items: center; gap: 10px;">
                <label style="font-weight: 600;">Report Type:</label>
                <select id="report-type-select" style="padding: 5px; background: white; color: black; border: 1px solid #ccc; font-family: 'Inter', sans-serif;">
                    <option value="class">Class</option>
                    <option value="teacher">Teacher</option>
                </select>
                
                <label style="font-weight: 600; margin-left: 10px;">Select:</label>
                <select id="report-target-select" style="width: 200px; padding: 5px; margin: 0; background: white; color: black; border: 1px solid #ccc; font-family: 'Inter', sans-serif;">
                </select>
                
                <button id="btn-doc" style="margin-left: auto; padding: 8px 20px; background: #3b82f6; border: none; border-radius: 4px; cursor: pointer; color: white; font-weight: bold; transition: background 0.2s;">Download Doc</button>
                <button id="btn-print" style="margin-left: 10px; padding: 8px 20px; background: #e2e8f0; border: 1px solid #cbd5e1; border-radius: 4px; cursor: pointer; color: black; font-weight: bold; transition: background 0.2s;">Print</button>
            </div>
            <div id="print-area" class="print-preview-wrapper"></div>
        `;

        const typeSelect = document.getElementById("report-type-select");
        const targetSelect = document.getElementById("report-target-select");

        const updateTargetOptions = () => {
            if (typeSelect.value === 'class') {
                targetSelect.innerHTML = generatedScheduleMeta.classes.map(c => `<option value="${c}">${c}</option>`).join('');
            } else {
                targetSelect.innerHTML = appData.teachers.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
            }
        };

        const renderPaper = () => {
            const printArea = document.getElementById("print-area");
            const type = typeSelect.value;
            const targetName = targetSelect.value;
            if (!targetName) return;
            
            const bells = generatedScheduleMeta.bells || [];
            const dayMap = {"Monday": "Mo", "Tuesday": "Tu", "Wednesday": "We", "Thursday": "Th", "Friday": "Fr"};

            let html = `
                <div class="paper">
                    <div class="paper-header">
                        <span style="font-size: 12px; position: absolute; left: 0; top: 10px; font-weight: normal; color: #555;">TT Demo 2</span>
                        ${targetName}
                        <span style="font-size: 12px; position: absolute; right: 0; top: 10px; font-weight: normal; color: #555;">${targetName}</span>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; border: 2px solid black;">
                        <thead>
                            <tr>
                                <th style="border: 2px solid black; border-bottom: 2px solid black; width: 60px;"></th>
            `;
            
            generatedScheduleMeta.periods.forEach((period, idx) => {
                const timeStr = (bells[idx] && bells[idx].time) ? bells[idx].time : "00:00 - 00:00";
                const pLabel = (bells[idx] && bells[idx].period) ? bells[idx].period : period;
                html += `
                                <th style="border: 2px solid black; padding: 4px; text-align: center; font-weight: normal; min-width: 80px;">
                                    <div style="font-size: 16px; margin-bottom: 4px;">${pLabel}</div>
                                    <div style="font-size: 9px; color: #555;">${timeStr}</div>
                                </th>
                `;
            });
            html += `       </tr>
                        </thead>
                        <tbody>`;

            generatedScheduleMeta.days.forEach(day => {
                html += `<tr>`;
                const shortDay = dayMap[day] || day.substring(0, 2);
                html += `<td style="border: 2px solid black; text-align: center; font-size: 20px;">${shortDay}</td>`;
                
                let cells = [];
                generatedScheduleMeta.periods.forEach(period => {
                    if (type === 'class') {
                        const entry = generatedScheduleData.find(e => e.class_id === targetName && e.day === day && e.period === period);
                        cells.push(entry || null);
                    } else {
                        const entries = generatedScheduleData.filter(e => e.teacher === targetName && e.day === day && e.period === period);
                        if (entries.length > 0) {
                            const combinedEntry = { ...entries[0] };
                            combinedEntry.class_id = entries.map(e => e.class_id).join(", ");
                            cells.push(combinedEntry);
                        } else {
                            cells.push(null);
                        }
                    }
                });

                for (let i = 0; i < cells.length; i++) {
                    let entry = cells[i];
                    if (entry) {
                        let colspan = 1;
                        let uniqueRooms = new Set([entry.room]);
                        let uniqueBottomRight = new Set([type === 'class' ? entry.teacher : entry.class_id]);

                        while (i + 1 < cells.length && cells[i + 1] && 
                               cells[i + 1].subject === entry.subject && 
                               cells[i + 1].teacher === entry.teacher && 
                               cells[i + 1].class_id === entry.class_id) {
                            colspan++;
                            uniqueRooms.add(cells[i + 1].room);
                            uniqueBottomRight.add(type === 'class' ? cells[i + 1].teacher : cells[i + 1].class_id);
                            i++;
                        }
                        
                        const roomStr = Array.from(uniqueRooms).join(" / ");
                        const bottomRightStr = Array.from(uniqueBottomRight).join(" / ");
                        
                        html += `
                            <td ${colspan > 1 ? `colspan="${colspan}"` : ''} style="border: 2px solid black; padding: 8px; text-align: center; vertical-align: middle; height: 80px;">
                                <div style="font-size: 14px; font-weight: normal; margin-bottom: 4px;">${entry.subject}</div>
                                <div style="font-size: 10px; color: #333; margin-top: 4px;">${roomStr}</div>
                                <div style="font-size: 10px; color: #333;">${bottomRightStr}</div>
                            </td>
                        `;
                    } else {
                        html += `<td style="border: 2px solid black;"></td>`;
                    }
                }
                html += `</tr>`;
            });

            html += `
                        </tbody>
                    </table>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; margin-top: 5px; color: #555;">
                        <span>Timetable generated: ${new Date().toLocaleDateString()}</span>
                        <span>Timetable Studio</span>
                    </div>
                </div>
            `;
            printArea.innerHTML = html;
        };

        typeSelect.addEventListener("change", () => {
            updateTargetOptions();
            renderPaper();
        });

        targetSelect.addEventListener("change", renderPaper);
        
        document.getElementById("btn-print").addEventListener("click", () => {
            window.print();
        });

        document.getElementById("btn-doc").addEventListener("click", () => {
            const htmlContent = document.getElementById("print-area").innerHTML;
            const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Timetable</title><style>table, td, div { font-family: Arial, sans-serif; }</style></head><body>";
            const footer = "</body></html>";
            const sourceHTML = header + htmlContent + footer;
            
            const blob = new Blob(['\ufeff', sourceHTML], {
                type: 'application/msword'
            });
            const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
            const downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);
            
            if (navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(blob, targetSelect.value + '_Timetable.doc');
            } else {
                downloadLink.href = url;
                downloadLink.download = targetSelect.value + '_Timetable.doc';
                downloadLink.click();
            }
            document.body.removeChild(downloadLink);
        });

        updateTargetOptions();
        renderPaper();
    };

    document.getElementById('btn-master').addEventListener('click', () => {
        document.getElementById('btn-master').classList.add('active');
        document.getElementById('btn-class').classList.remove('active');
        renderMasterGrid();
    });
    
    document.getElementById('btn-class').addEventListener('click', () => {
        document.getElementById('btn-class').classList.add('active');
        document.getElementById('btn-master').classList.remove('active');
        renderClassPreview();
    });

    // Database and Excel features
    const btnSaveDb = document.getElementById("btn-save-db");
    const btnLoadDb = document.getElementById("btn-load-db");
    const btnUploadExcel = document.getElementById("btn-upload-excel");
    const excelFileInput = document.getElementById("excel-file-input");
    
    if(btnSaveDb) btnSaveDb.addEventListener('click', async () => {
        try {
            btnSaveDb.innerText = "Saving...";
            const res = await fetch('/api/save_data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(appData)
            });
            const data = await res.json();
            if (data.success) {
                alert("Data saved to database successfully!");
            } else {
                alert("Error saving data: " + data.error);
            }
        } catch (e) {
            alert("Error saving data.");
        } finally {
            btnSaveDb.innerText = "Save to DB";
        }
    });

    if(btnLoadDb) btnLoadDb.addEventListener('click', async () => {
        try {
            btnLoadDb.innerText = "Loading...";
            const res = await fetch('/api/load_data');
            const data = await res.json();
            if (data.subjects) { // basic validation
                appData = data;
                renderTable();
                alert("Data loaded from database!");
            } else {
                alert("No data found in database.");
            }
        } catch (e) {
            alert("Error loading data.");
        } finally {
            btnLoadDb.innerText = "Load from DB";
        }
    });

    if(btnUploadExcel) btnUploadExcel.addEventListener('click', () => {
        excelFileInput.click();
    });

    if(excelFileInput) excelFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, {type: 'array'});
                
                // Assuming standard sheets matching the object keys
                if(workbook.Sheets['Subjects']) appData.subjects = XLSX.utils.sheet_to_json(workbook.Sheets['Subjects']);
                if(workbook.Sheets['Teachers']) appData.teachers = XLSX.utils.sheet_to_json(workbook.Sheets['Teachers']);
                if(workbook.Sheets['Classes']) appData.classes = XLSX.utils.sheet_to_json(workbook.Sheets['Classes']).map(c => ({...c, size: parseInt(c.size)}));
                if(workbook.Sheets['Rooms']) appData.rooms = XLSX.utils.sheet_to_json(workbook.Sheets['Rooms']).map(r => ({...r, capacity: parseInt(r.capacity)}));
                if(workbook.Sheets['Lessons']) appData.lessons = XLSX.utils.sheet_to_json(workbook.Sheets['Lessons']).map(l => ({...l, periods: parseInt(l.periods)}));
                if(workbook.Sheets['Bells']) appData.bells = XLSX.utils.sheet_to_json(workbook.Sheets['Bells']);
                
                renderTable();
                alert("Excel imported successfully! Ensure your sheets are named: Subjects, Teachers, Classes, Rooms, Lessons, Bells.");
            } catch (err) {
                alert("Error parsing Excel file: " + err.message);
                console.error(err);
            }
        };
        reader.readAsArrayBuffer(file);
        // Reset so same file can be chosen again
        excelFileInput.value = '';
    });

    const btnDownloadTemplate = document.getElementById("btn-download-template");
    if(btnDownloadTemplate) btnDownloadTemplate.addEventListener('click', () => {
        if (typeof XLSX === 'undefined') {
            alert("Excel library not loaded. Please wait or check your internet connection.");
            return;
        }
        
        const wb = XLSX.utils.book_new();
        
        // Define sample data based on the schema
        const sampleSubjects = [
            { id: "S1", name: "Mathematics" },
            { id: "S2", name: "English Language" },
            { id: "S3", name: "Integrated Science" }
        ];
        
        const sampleTeachers = [
            { id: "T1", name: "Mr. Osei" },
            { id: "T2", name: "Dr. Mensah" },
            { id: "T3", name: "Mrs. Appiah" }
        ];
        
        const sampleClasses = [
            { id: "L100A", name: "Level 100A", size: 30 },
            { id: "L100B", name: "Level 100B", size: 25 }
        ];
        
        const sampleRooms = [
            { name: "Lecture Hall 1", capacity: 40 },
            { name: "Main Auditorium", capacity: 200 }
        ];
        
        const sampleLessons = [
            { subject_id: "S1", teacher_id: "T1", class_id: "L100A", periods: 4 },
            { subject_id: "S2", teacher_id: "T2", class_id: "L100B", periods: 3 },
            { subject_id: "S3", teacher_id: "T3", class_id: "L100A", periods: 2 }
        ];
        
        const sampleBells = [
            { period: 1, time: "7:30 - 8:30" },
            { period: 2, time: "8:30 - 9:30" },
            { period: 3, time: "9:30 - 10:30" }
        ];
        
        // Convert to sheets
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleSubjects), "Subjects");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleTeachers), "Teachers");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleClasses), "Classes");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleRooms), "Rooms");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleLessons), "Lessons");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sampleBells), "Bells");
        
        XLSX.writeFile(wb, "Timetable_Template.xlsx");
    });
});
