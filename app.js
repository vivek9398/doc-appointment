// Doctor OP Scheduling System - Main JavaScript

// Initialize data storage
let doctors = [
    { id: 'D001', name: 'Dr. John Smith', specialization: 'Cardiology', contact: '555-1234', email: 'john.smith@example.com' },
    { id: 'D002', name: 'Dr. Sarah Johnson', specialization: 'Neurology', contact: '555-5678', email: 'sarah.johnson@example.com' }
];

let nurses = [
    { id: 'N001', name: 'Jane Wilson', doctorId: 'D001', contact: '555-9876', email: 'jane.wilson@example.com' },
    { id: 'N002', name: 'Robert Davis', doctorId: 'D002', contact: '555-4321', email: 'robert.davis@example.com' }
];

let appointments = [
    { id: 'A001', patient: 'Michael Brown', doctorId: 'D001', type: 'checkup', date: '2023-06-15', time: '10:00', status: 'confirmed', notes: '' },
    { id: 'A002', patient: 'Emily Wilson', doctorId: 'D002', type: 'operation', date: '2023-06-16', time: '09:30', status: 'pending', notes: 'Pre-op consultation required' }
];

let tasks = [
    { id: 'T001', type: 'medication', patient: 'Michael Brown', nurseId: 'N001', date: '2023-06-15', time: '12:00', status: 'pending', instructions: 'Administer 10mg medication after lunch' },
    { id: 'T002', type: 'vitals', patient: 'Emily Wilson', nurseId: 'N002', date: '2023-06-15', time: '14:30', status: 'pending', instructions: 'Check blood pressure and temperature' }
];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    showSection('dashboard');
    
    // Add event listeners for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(section);
        });
    });
    
    // Add event listeners to appointment buttons
    document.querySelectorAll('#appointmentsList button').forEach(button => {
        if (button.textContent === 'Details') {
            const row = button.closest('tr');
            const appointmentId = row.cells[0].textContent;
            button.onclick = () => viewAppointmentDetails(appointmentId);
        } else if (button.textContent === 'Reschedule') {
            const row = button.closest('tr');
            const appointmentId = row.cells[0].textContent;
            button.onclick = () => rescheduleAppointment(appointmentId);
        }
    });
    
    // Add event listeners for form submissions
    document.getElementById('saveDoctorBtn').addEventListener('click', saveDoctor);
    document.getElementById('saveNurseBtn').addEventListener('click', saveNurse);
    document.getElementById('saveAppointmentBtn').addEventListener('click', saveAppointment);
    document.getElementById('saveTaskBtn').addEventListener('click', saveTask);
    
    // Add event listeners to existing buttons in the tables
    document.querySelectorAll('#doctorsList button').forEach(button => {
        if (button.textContent === 'View Schedule') {
            const row = button.closest('tr');
            const doctorId = row.cells[0].textContent;
            button.onclick = () => viewDoctorSchedule(doctorId);
        } else if (button.textContent === 'Edit') {
            const row = button.closest('tr');
            const doctorId = row.cells[0].textContent;
            button.onclick = () => editDoctor(doctorId);
        }
    });
    
    // Add event listeners to existing nurse buttons
    document.querySelectorAll('#nursesList button').forEach(button => {
        if (button.textContent === 'View Tasks') {
            const row = button.closest('tr');
            const nurseId = row.cells[0].textContent;
            button.onclick = () => viewNurseTasks(nurseId);
        } else if (button.textContent === 'Edit') {
            const row = button.closest('tr');
            const nurseId = row.cells[0].textContent;
            button.onclick = () => editNurse(nurseId);
        }
    });
    
    // Add event listener for appointment type filter
    document.getElementById('appointmentType').addEventListener('change', filterAppointments);
});

// Function to show the selected section and hide others
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    
    // Highlight the active navigation link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });
}

// Function to save a new doctor
function saveDoctor() {
    const name = document.getElementById('doctorName').value;
    const specialization = document.getElementById('doctorSpecialization').value;
    const contact = document.getElementById('doctorContact').value;
    const email = document.getElementById('doctorEmail').value;
    
    if (!name || !specialization || !contact || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newId = 'D' + String(doctors.length + 1).padStart(3, '0');
    const newDoctor = {
        id: newId,
        name: name,
        specialization: specialization,
        contact: contact,
        email: email
    };
    
    doctors.push(newDoctor);
    addDoctorToTable(newDoctor);
    
    // Reset form and close modal
    document.getElementById('addDoctorForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addDoctorModal'));
    modal.hide();
    
    // Update doctor dropdown in nurse form
    updateDoctorDropdowns();
}

// Function to add a doctor to the table
function addDoctorToTable(doctor) {
    const tbody = document.getElementById('doctorsList');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${doctor.id}</td>
        <td>${doctor.name}</td>
        <td>${doctor.specialization}</td>
        <td>${doctor.contact}</td>
        <td>
            <button class="btn btn-sm btn-info" onclick="viewDoctorSchedule('${doctor.id}')">View Schedule</button>
            <button class="btn btn-sm btn-warning" onclick="editDoctor('${doctor.id}')">Edit</button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// Function to save a new nurse
function saveNurse() {
    const name = document.getElementById('nurseName').value;
    const doctorId = document.getElementById('nurseDoctor').value;
    const contact = document.getElementById('nurseContact').value;
    const email = document.getElementById('nurseEmail').value;
    
    if (!name || !doctorId || !contact || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newId = 'N' + String(nurses.length + 1).padStart(3, '0');
    const newNurse = {
        id: newId,
        name: name,
        doctorId: doctorId,
        contact: contact,
        email: email
    };
    
    nurses.push(newNurse);
    addNurseToTable(newNurse);
    
    // Reset form and close modal
    document.getElementById('addNurseForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addNurseModal'));
    modal.hide();
    
    // Update nurse dropdown in task form
    updateNurseDropdowns();
}

// Function to add a nurse to the table
function addNurseToTable(nurse) {
    const tbody = document.getElementById('nursesList');
    const row = document.createElement('tr');
    
    // Find the doctor name
    const doctor = doctors.find(d => d.id === nurse.doctorId);
    const doctorName = doctor ? doctor.name : 'Unknown';
    
    row.innerHTML = `
        <td>${nurse.id}</td>
        <td>${nurse.name}</td>
        <td>${doctorName}</td>
        <td>${nurse.contact}</td>
        <td>
            <button class="btn btn-sm btn-info" onclick="viewNurseTasks('${nurse.id}')">View Tasks</button>
            <button class="btn btn-sm btn-warning" onclick="editNurse('${nurse.id}')">Edit</button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// Function to save a new appointment
function saveAppointment() {
    const patient = document.getElementById('appointmentPatient').value;
    const doctorId = document.getElementById('appointmentDoctor').value;
    const type = document.getElementById('appointmentTypeSelect').value;
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const notes = document.getElementById('appointmentNotes').value;
    
    if (!patient || !doctorId || !type || !date || !time) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newId = 'A' + String(appointments.length + 1).padStart(3, '0');
    const newAppointment = {
        id: newId,
        patient: patient,
        doctorId: doctorId,
        type: type,
        date: date,
        time: time,
        status: 'pending',
        notes: notes
    };
    
    appointments.push(newAppointment);
    addAppointmentToTable(newAppointment);
    
    // Reset form and close modal
    document.getElementById('addAppointmentForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addAppointmentModal'));
    modal.hide();
}

// Function to add an appointment to the table
function addAppointmentToTable(appointment) {
    const tbody = document.getElementById('appointmentsList');
    const row = document.createElement('tr');
    
    // Find the doctor name
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    const doctorName = doctor ? doctor.name : 'Unknown';
    
    // Format date and time
    const dateTime = `${appointment.date} ${appointment.time}`;
    
    // Format type for display
    const typeDisplay = appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1);
    
    row.innerHTML = `
        <td>${appointment.id}</td>
        <td>${appointment.patient}</td>
        <td>${doctorName}</td>
        <td>${typeDisplay}</td>
        <td>${dateTime}</td>
        <td><span class="badge bg-warning">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span></td>
        <td>
            <button class="btn btn-sm btn-info" onclick="viewAppointmentDetails('${appointment.id}')">Details</button>
            <button class="btn btn-sm btn-warning" onclick="rescheduleAppointment('${appointment.id}')">Reschedule</button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// Function to save a new task
function saveTask() {
    const type = document.getElementById('taskType').value;
    const patient = document.getElementById('taskPatient').value;
    const nurseId = document.getElementById('taskNurse').value;
    const date = document.getElementById('taskDate').value;
    const time = document.getElementById('taskTime').value;
    const instructions = document.getElementById('taskNotes').value;
    
    if (!type || !patient || !nurseId || !date || !time) {
        alert('Please fill in all required fields');
        return;
    }
    
    const newId = 'T' + String(tasks.length + 1).padStart(3, '0');
    const newTask = {
        id: newId,
        type: type,
        patient: patient,
        nurseId: nurseId,
        date: date,
        time: time,
        status: 'pending',
        instructions: instructions
    };
    
    tasks.push(newTask);
    addTaskToTable(newTask);
    
    // Reset form and close modal
    document.getElementById('addTaskForm').reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'));
    modal.hide();
}

// Function to add a task to the table
function addTaskToTable(task) {
    const tbody = document.getElementById('tasksList');
    const row = document.createElement('tr');
    
    // Find the nurse name
    const nurse = nurses.find(n => n.id === task.nurseId);
    const nurseName = nurse ? nurse.name : 'Unknown';
    
    // Format date and time
    const dateTime = `${task.date} ${task.time}`;
    
    // Format task type for display
    let taskDisplay;
    switch(task.type) {
        case 'medication':
            taskDisplay = 'Administer Medication';
            break;
        case 'vitals':
            taskDisplay = 'Check Vitals';
            break;
        case 'injection':
            taskDisplay = 'Give Injection';
            break;
        case 'saline':
            taskDisplay = 'Check Saline';
            break;
        default:
            taskDisplay = task.type;
    }
    
    row.innerHTML = `
        <td>${task.id}</td>
        <td>${taskDisplay}</td>
        <td>${task.patient}</td>
        <td>${nurseName}</td>
        <td>${dateTime}</td>
        <td><span class="badge bg-warning">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span></td>
        <td>
            <button class="btn btn-sm btn-success">Complete</button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// Function to filter appointments by type
function filterAppointments() {
    const filterType = document.getElementById('appointmentType').value;
    const rows = document.querySelectorAll('#appointmentsList tr');
    
    rows.forEach(row => {
        const type = row.cells[3].textContent.toLowerCase();
        if (filterType === 'all' || type === filterType) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Function to update doctor dropdowns
function updateDoctorDropdowns() {
    const doctorSelects = document.querySelectorAll('#nurseDoctor, #appointmentDoctor');
    
    doctorSelects.forEach(select => {
        // Clear existing options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Add doctor options
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            select.appendChild(option);
        });
    });
}

// Function to update nurse dropdowns
function updateNurseDropdowns() {
    const nurseSelect = document.getElementById('taskNurse');
    
    // Clear existing options except the first one
    while (nurseSelect.options.length > 1) {
        nurseSelect.remove(1);
    }
    
    // Add nurse options
    nurses.forEach(nurse => {
        const option = document.createElement('option');
        option.value = nurse.id;
        option.textContent = nurse.name;
        nurseSelect.appendChild(option);
    });
}

// Function to send notifications to nurses
function notifyNurse(nurseId, message) {
    // In a real application, this would connect to a notification system
    console.log(`Notification to nurse ${nurseId}: ${message}`);
    
    // For demonstration purposes, we'll show an alert
    const nurse = nurses.find(n => n.id === nurseId);
    if (nurse) {
        alert(`Notification sent to ${nurse.name}: ${message}`);
    }
}

// Function to mark a task as complete
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('btn-success') && e.target.textContent === 'Complete') {
        const row = e.target.closest('tr');
        const taskId = row.cells[0].textContent;
        
        // Update task status
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = 'completed';
            row.cells[5].innerHTML = '<span class="badge bg-success">Completed</span>';
            e.target.disabled = true;
        }
    }
});

// Function to view doctor schedule
function viewDoctorSchedule(doctorId) {
    // Filter appointments for this doctor
    const doctorAppointments = appointments.filter(a => a.doctorId === doctorId);
    const doctor = doctors.find(d => d.id === doctorId);
    
    // Create modal for viewing schedule
    const modalHtml = `
    <div class="modal fade" id="viewScheduleModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Schedule for ${doctor ? doctor.name : 'Doctor'}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <h6>Upcoming Appointments</h6>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date & Time</th>
                                    <th>Patient</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="scheduleList">
                                ${doctorAppointments.map(app => `
                                    <tr>
                                        <td>${app.date} ${app.time}</td>
                                        <td>${app.patient}</td>
                                        <td>${app.type.charAt(0).toUpperCase() + app.type.slice(1)}</td>
                                        <td><span class="badge bg-${app.status === 'confirmed' ? 'success' : 'warning'}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-success" onclick="updateAppointmentStatus('${app.id}', 'confirmed')">Confirm</button>
                                            <button class="btn btn-sm btn-danger" onclick="updateAppointmentStatus('${app.id}', 'cancelled')">Cancel</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        ${doctorAppointments.length === 0 ? '<p>No appointments scheduled</p>' : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="addAppointmentForDoctor('${doctorId}')">Add Appointment</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Remove any existing modal
    const existingModal = document.getElementById('viewScheduleModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewScheduleModal'));
    modal.show();
}

// Function to update appointment status
function updateAppointmentStatus(appointmentId, status) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
        appointment.status = status;
        
        // Update in the schedule modal
        const scheduleRow = document.querySelector(`#scheduleList tr`);
        if (scheduleRow) {
            // Find the row that contains the appointment ID
            const rows = document.querySelectorAll('#scheduleList tr');
            rows.forEach(row => {
                const buttons = row.querySelectorAll('button');
                buttons.forEach(button => {
                    if (button.getAttribute('onclick') && button.getAttribute('onclick').includes(appointmentId)) {
                        const statusCell = row.cells[3];
                        statusCell.innerHTML = `<span class="badge bg-${status === 'confirmed' ? 'success' : status === 'cancelled' ? 'danger' : 'warning'}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
                    }
                });
            });
        }
        
        // Update in the main appointments table
        const rows = document.querySelectorAll('#appointmentsList tr');
        rows.forEach(row => {
            if (row.cells[0] && row.cells[0].textContent === appointmentId) {
                const statusCell = row.cells[5];
                statusCell.innerHTML = `<span class="badge bg-${status === 'confirmed' ? 'success' : status === 'cancelled' ? 'danger' : 'warning'}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
            }
        });
        
        // If appointment is confirmed and has a nurse assigned, notify the nurse
        if (status === 'confirmed' && appointment.nurseId) {
            notifyNurse(appointment.nurseId, `Appointment for ${appointment.patient} has been confirmed for ${appointment.date} at ${appointment.time}`);
        }
    }
}

// Function to add appointment for specific doctor
function addAppointmentForDoctor(doctorId) {
    // Close the schedule modal
    const scheduleModal = bootstrap.Modal.getInstance(document.getElementById('viewScheduleModal'));
    scheduleModal.hide();
    
    // Open the appointment modal
    const appointmentModal = new bootstrap.Modal(document.getElementById('addAppointmentModal'));
    
    // Pre-select the doctor
    document.getElementById('appointmentDoctor').value = doctorId;
    
    appointmentModal.show();
}

// Function to edit doctor
function editDoctor(doctorId) {
    const doctor = doctors.find(d => d.id === doctorId);
    if (!doctor) return;
    
    // Create modal for editing doctor
    const modalHtml = `
    <div class="modal fade" id="editDoctorModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Doctor</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editDoctorForm">
                        <input type="hidden" id="editDoctorId" value="${doctor.id}">
                        <div class="mb-3">
                            <label for="editDoctorName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="editDoctorName" value="${doctor.name}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editDoctorSpecialization" class="form-label">Specialization</label>
                            <input type="text" class="form-control" id="editDoctorSpecialization" value="${doctor.specialization}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editDoctorContact" class="form-label">Contact</label>
                            <input type="text" class="form-control" id="editDoctorContact" value="${doctor.contact}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editDoctorEmail" class="form-label">Email</label>
                            <input type="email" class="form-control" id="editDoctorEmail" value="${doctor.email}" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="updateDoctor()">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Remove any existing modal
    const existingModal = document.getElementById('editDoctorModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editDoctorModal'));
    modal.show();
}

// Function to update doctor
function updateDoctor() {
    const doctorId = document.getElementById('editDoctorId').value;
    const name = document.getElementById('editDoctorName').value;
    const specialization = document.getElementById('editDoctorSpecialization').value;
    const contact = document.getElementById('editDoctorContact').value;
    const email = document.getElementById('editDoctorEmail').value;
    
    if (!name || !specialization || !contact || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Find doctor and update
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
        doctor.name = name;
        doctor.specialization = specialization;
        doctor.contact = contact;
        doctor.email = email;
        
        // Update in the table
        const rows = document.querySelectorAll('#doctorsList tr');
        rows.forEach(row => {
            const buttons = row.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.getAttribute('onclick') && button.getAttribute('onclick').includes(doctorId)) {
                    row.cells[1].textContent = name;
                    row.cells[2].textContent = specialization;
                    row.cells[3].textContent = contact;
                }
            });
        });
        
        // Update doctor dropdowns
        updateDoctorDropdowns();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editDoctorModal'));
        modal.hide();
    }
}
// Function to view nurse tasks
function viewNurseTasks(nurseId) {
    // Filter tasks for this nurse
    const nurseTasks = tasks.filter(t => t.nurseId === nurseId);
    const nurse = nurses.find(n => n.id === nurseId);
    
    // Create modal for viewing tasks
    const modalHtml = `
    <div class="modal fade" id="viewTasksModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Tasks for ${nurse ? nurse.name : 'Nurse'}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <h6>Assigned Tasks</h6>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Due Date & Time</th>
                                    <th>Task</th>
                                    <th>Patient</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="nurseTasksList">
                                ${nurseTasks.map(task => {
                                    // Format task type for display
                                    let taskDisplay;
                                    switch(task.type) {
                                        case 'medication':
                                            taskDisplay = 'Administer Medication';
                                            break;
                                        case 'vitals':
                                            taskDisplay = 'Check Vitals';
                                            break;
                                        case 'injection':
                                            taskDisplay = 'Give Injection';
                                            break;
                                        case 'saline':
                                            taskDisplay = 'Check Saline';
                                            break;
                                        default:
                                            taskDisplay = task.type;
                                    }
                                    
                                    return `
                                    <tr>
                                        <td>${task.date} ${task.time}</td>
                                        <td>${taskDisplay}</td>
                                        <td>${task.patient}</td>
                                        <td><span class="badge bg-${task.status === 'completed' ? 'success' : 'warning'}">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span></td>
                                        <td>
                                            ${task.status !== 'completed' ? 
                                                `<button class="btn btn-sm btn-success" onclick="completeTask('${task.id}')">Complete</button>` : 
                                                `<button class="btn btn-sm btn-success" disabled>Completed</button>`
                                            }
                                        </td>
                                    </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                        ${nurseTasks.length === 0 ? '<p>No tasks assigned</p>' : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="assignTaskToNurse('${nurseId}')">Assign New Task</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Remove any existing modal
    const existingModal = document.getElementById('viewTasksModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewTasksModal'));
    modal.show();
}

// Function to complete a task
function completeTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'completed';
        
        // Update in the nurse tasks modal
        const nurseTaskRows = document.querySelectorAll('#nurseTasksList tr');
        nurseTaskRows.forEach(row => {
            const buttons = row.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.getAttribute('onclick') && button.getAttribute('onclick').includes(taskId)) {
                    const statusCell = row.cells[3];
                    statusCell.innerHTML = '<span class="badge bg-success">Completed</span>';
                    
                    const actionCell = row.cells[4];
                    actionCell.innerHTML = '<button class="btn btn-sm btn-success" disabled>Completed</button>';
                }
            });
        });
        
        // Update in the main tasks table
        const mainTaskRows = document.querySelectorAll('#tasksList tr');
        mainTaskRows.forEach(row => {
            if (row.cells[0] && row.cells[0].textContent === taskId) {
                const statusCell = row.cells[5];
                statusCell.innerHTML = '<span class="badge bg-success">Completed</span>';
                
                const actionCell = row.cells[6];
                const completeBtn = actionCell.querySelector('button');
                if (completeBtn) {
                    completeBtn.disabled = true;
                }
            }
        });
    }
}

// Function to assign task to specific nurse
function assignTaskToNurse(nurseId) {
    // Close the tasks modal
    const tasksModal = bootstrap.Modal.getInstance(document.getElementById('viewTasksModal'));
    tasksModal.hide();
    
    // Open the task modal
    const taskModal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    
    // Pre-select the nurse
    document.getElementById('taskNurse').value = nurseId;
    
    taskModal.show();
}

// Function to edit nurse
function editNurse(nurseId) {
    const nurse = nurses.find(n => n.id === nurseId);
    if (!nurse) return;
    
    // Create modal for editing nurse
    const modalHtml = `
    <div class="modal fade" id="editNurseModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Nurse</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="editNurseForm">
                        <input type="hidden" id="editNurseId" value="${nurse.id}">
                        <div class="mb-3">
                            <label for="editNurseName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="editNurseName" value="${nurse.name}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editNurseDoctor" class="form-label">Assign to Doctor</label>
                            <select class="form-select" id="editNurseDoctor" required>
                                <option value="">Select Doctor</option>
                                ${doctors.map(doctor => `
                                    <option value="${doctor.id}" ${doctor.id === nurse.doctorId ? 'selected' : ''}>${doctor.name}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="editNurseContact" class="form-label">Contact</label>
                            <input type="text" class="form-control" id="editNurseContact" value="${nurse.contact}" required>
                        </div>
                        <div class="mb-3">
                            <label for="editNurseEmail" class="form-label">Email</label>
                            <input type="email" class="form-control" id="editNurseEmail" value="${nurse.email}" required>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="updateNurse()">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Remove any existing modal
    const existingModal = document.getElementById('editNurseModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editNurseModal'));
    modal.show();
}

// Function to update nurse
function updateNurse() {
    const nurseId = document.getElementById('editNurseId').value;
    const name = document.getElementById('editNurseName').value;
    const doctorId = document.getElementById('editNurseDoctor').value;
    const contact = document.getElementById('editNurseContact').value;
    const email = document.getElementById('editNurseEmail').value;
    
    if (!name || !doctorId || !contact || !email) {
        alert('Please fill in all required fields');
        return;
    }
    
    // Find nurse and update
    const nurse = nurses.find(n => n.id === nurseId);
    if (nurse) {
        nurse.name = name;
        nurse.doctorId = doctorId;
        nurse.contact = contact;
        nurse.email = email;
        
        // Find the doctor name
        const doctor = doctors.find(d => d.id === doctorId);
        const doctorName = doctor ? doctor.name : 'Unknown';
        
        // Update in the table
        const rows = document.querySelectorAll('#nursesList tr');
        rows.forEach(row => {
            const buttons = row.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.getAttribute('onclick') && button.getAttribute('onclick').includes(nurseId)) {
                    row.cells[1].textContent = name;
                    row.cells[2].textContent = doctorName;
                    row.cells[3].textContent = contact;
                }
            });
        });
        
        // Update nurse dropdowns
        updateNurseDropdowns();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editNurseModal'));
        modal.hide();
    }
}
// Function to view appointment details
function viewAppointmentDetails(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;
    
    // Find the doctor name
    const doctor = doctors.find(d => d.id === appointment.doctorId);
    const doctorName = doctor ? doctor.name : 'Unknown';
    
    // Create modal for viewing appointment details
    const modalHtml = `
    <div class="modal fade" id="viewAppointmentModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Appointment Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="appointment-details">
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <img src="https://img.freepik.com/free-vector/appointment-booking-with-calendar_23-2148553008.jpg" class="img-fluid rounded" alt="Appointment">
                            </div>
                            <div class="col-md-8">
                                <h4>${appointment.patient}</h4>
                                <p class="text-muted">Appointment ID: ${appointment.id}</p>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Doctor:</div>
                                    <div class="col-md-8">${doctorName}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Type:</div>
                                    <div class="col-md-8">${appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Date:</div>
                                    <div class="col-md-8">${appointment.date}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Time:</div>
                                    <div class="col-md-8">${appointment.time}</div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Status:</div>
                                    <div class="col-md-8">
                                        <span class="badge bg-${appointment.status === 'confirmed' ? 'success' : appointment.status === 'cancelled' ? 'danger' : 'warning'}">
                                            ${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div class="row mb-2">
                                    <div class="col-md-4 fw-bold">Notes:</div>
                                    <div class="col-md-8">${appointment.notes || 'No notes available'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-warning" onclick="rescheduleAppointment('${appointmentId}')">Reschedule</button>
                    <button type="button" class="btn btn-${appointment.status === 'confirmed' ? 'danger' : 'success'}" 
                            onclick="updateAppointmentStatus('${appointmentId}', '${appointment.status === 'confirmed' ? 'cancelled' : 'confirmed'}')">
                            ${appointment.status === 'confirmed' ? 'Cancel' : 'Confirm'} Appointment
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Remove any existing modal
    const existingModal = document.getElementById('viewAppointmentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('viewAppointmentModal'));
    modal.show();
}

// Function to reschedule appointment
function rescheduleAppointment(appointmentId) {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;
    
    // Close any existing appointment details modal
    const detailsModal = document.getElementById('viewAppointmentModal');
    if (detailsModal) {
        const bsModal = bootstrap.Modal.getInstance(detailsModal);
        if (bsModal) bsModal.hide();
    }
    
    // Create modal for rescheduling
    const modalHtml = `
    <div class="modal fade" id="rescheduleAppointmentModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Reschedule Appointment</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <img src="https://img.freepik.com/free-vector/calendar-icon-date-reminder-graphic-illustration_53876-8586.jpg" class="img-fluid rounded" alt="Reschedule">
                        </div>
                        <div class="col-md-8">
                            <h4>Reschedule for ${appointment.patient}</h4>
                            <p class="text-muted">Current appointment: ${appointment.date} at ${appointment.time}</p>
                        </div>
                    </div>
                    <form id="rescheduleForm">
                        <input type="hidden" id="rescheduleAppointmentId" value="${appointmentId}">
                        <div class="mb-3">
                            <label for="rescheduleDate" class="form-label">New Date</label>
                            <input type="date" class="form-control" id="rescheduleDate" value="${appointment.date}" required>
                        </div>
                        <div class="mb-3">
                            <label for="rescheduleTime" class="form-label">New Time</label>
                            <input type="time" class="form-control" id="rescheduleTime" value="${appointment.time}" required>
                        </div>
                        <div class="mb-3">
                            <label for="rescheduleReason" class="form-label">Reason for Rescheduling</label>
                            <textarea class="form-control" id="rescheduleReason" rows="3"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveReschedule()">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    // Remove any existing modal
    const existingModal = document.getElementById('rescheduleAppointmentModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('rescheduleAppointmentModal'));
    modal.show();
}

// Function to save rescheduled appointment
function saveReschedule() {
    const appointmentId = document.getElementById('rescheduleAppointmentId').value;
    const newDate = document.getElementById('rescheduleDate').value;
    const newTime = document.getElementById('rescheduleTime').value;
    const reason = document.getElementById('rescheduleReason').value;
    
    if (!newDate || !newTime) {
        alert('Please select a new date and time');
        return;
    }
    
    // Find and update the appointment
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
        // Store old values for notification
        const oldDate = appointment.date;
        const oldTime = appointment.time;
        
        // Update appointment
        appointment.date = newDate;
        appointment.time = newTime;
        if (reason) {
            appointment.notes = appointment.notes ? `${appointment.notes}\nRescheduled: ${reason}` : `Rescheduled: ${reason}`;
        }
        
        // Update in the appointments table
        const rows = document.querySelectorAll('#appointmentsList tr');
        rows.forEach(row => {
            if (row.cells[0] && row.cells[0].textContent === appointmentId) {
                row.cells[4].textContent = `${newDate} ${newTime}`;
            }
        });
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('rescheduleAppointmentModal'));
        modal.hide();
        
        // Show confirmation
        alert(`Appointment for ${appointment.patient} has been rescheduled from ${oldDate} ${oldTime} to ${newDate} ${newTime}`);
    }
}