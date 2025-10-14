// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Global state
let appointments = [];
let currentEditingId = null;
let authToken = localStorage.getItem('auth_token') || '1|cu15pM6AFYCcgSFXSfstFZlHTZSXGcwF3jrO4cNv0a727c5c';

// Utility functions
function showLoading() {
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    const content = document.getElementById('messageContent');
    const text = document.getElementById('messageText');
    
    container.classList.remove('hidden');
    content.className = `p-4 rounded-md message-${type}`;
    text.textContent = message;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        container.classList.add('hidden');
    }, 5000);
}

function hideMessage() {
    document.getElementById('messageContainer').classList.add('hidden');
}

function showModalError(modalId, message) {
    const errorDiv = document.getElementById(`${modalId}Error`);
    const errorText = document.getElementById(`${modalId}ErrorText`);
    
    if (errorDiv && errorText) {
        errorDiv.classList.remove('hidden');
        errorText.textContent = message;
    }
}

function hideModalError(modalId) {
    const errorDiv = document.getElementById(`${modalId}Error`);
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
}

function formatDateTime(fecha, hora) {
    try {
        const date = new Date(`${fecha}T${hora}`);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return `${fecha} ${hora}`;
    }
}

function getStatusBadge(status = 'pendiente') {
    const statusConfig = {
        confirmada: { class: 'status-confirmada', label: 'Confirmada' },
        pendiente: { class: 'status-pendiente', label: 'Pendiente' },
        por_confirmar: { class: 'status-por_confirmar', label: 'Por confirmar' },
        cancelada: { class: 'status-cancelada', label: 'Cancelada' },
    };

    const config = statusConfig[status] || statusConfig.pendiente;
    return `<span class="px-2 py-1 ${config.class} text-xs rounded-full font-medium">${config.label}</span>`;
}

function getTypeLabel(type = '') {
    const typeLabels = {
        revision: 'Revisión de avances',
        evaluacion: 'Evaluación parcial',
        final: 'Evaluación final',
        otro: 'Otro',
    };
    return typeLabels[type] || type || 'Sin definir';
}

// API functions
async function makeApiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

async function logoutUser() {
    try {
        const response = await makeApiRequest('/usuarios/logout', {
            method: 'POST',
            body: JSON.stringify({ token: authToken }),
        });

        // Clear local storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        // Redirect to login page or show success message
        showMessage('Sesión cerrada exitosamente', 'success');
        
        // In a real app, redirect to login
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
        
        return response;
    } catch (error) {
        throw new Error('Error al cerrar sesión: ' + error.message);
    }
}

async function fetchAppointments() {
    try {
        const response = await makeApiRequest('/visita/listaVisitas', {
            method: 'POST',
            body: JSON.stringify({ token: authToken }),
        });

        // Transform API data to match our interface
        appointments = response.data?.map((apt) => ({
            id: apt.id,
            estadia_id: apt.estadia_id,
            user_id: apt.user_id,
            fecha: apt.fecha,
            hora: apt.hora,
            title: apt.title || 'Cita de visita',
            type: apt.type || 'revision',
            location: apt.location || 'Por definir',
            description: apt.description || '',
            status: apt.status || 'pendiente',
        })) || [];

        renderAppointments();
        renderUpcomingAppointments();
        return appointments;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        showMessage('Error al cargar las citas: ' + error.message, 'error');
        return [];
    }
}

async function createAppointment(appointmentData) {
    try {
        const response = await makeApiRequest('/visita/register', {
            method: 'POST',
            body: JSON.stringify({
                token: authToken,
                estadia_id: 4, // Fixed value as per your example
                user_id: 2,    // Fixed value as per your example
                fecha: appointmentData.fecha,
                hora: appointmentData.hora,
            }),
        });

        await fetchAppointments(); // Refresh the list
        showMessage('Cita creada exitosamente', 'success');
        return { success: true, data: response };
    } catch (error) {
        const errorMessage = 'Error al crear la cita: ' + error.message;
        showMessage(errorMessage, 'error');
        return { success: false, error: errorMessage };
    }
}

async function updateAppointment(appointmentData) {
    try {
        const response = await makeApiRequest('/visita/update', {
            method: 'PUT',
            body: JSON.stringify({
                token: authToken,
                id: appointmentData.id,
                estadia_id: 4, // Fixed value as per your example
                user_id: 2,    // Fixed value as per your example
                fecha: appointmentData.fecha,
                hora: appointmentData.hora,
            }),
        });

        await fetchAppointments(); // Refresh the list
        showMessage('Cita actualizada exitosamente', 'success');
        return { success: true, data: response };
    } catch (error) {
        const errorMessage = 'Error al actualizar la cita: ' + error.message;
        showMessage(errorMessage, 'error');
        return { success: false, error: errorMessage };
    }
}

async function deleteAppointment(id) {
    try {
        const response = await makeApiRequest('/visita/delete', {
            method: 'DELETE',
            body: JSON.stringify({
                token: authToken,
                id: id,
            }),
        });

        await fetchAppointments(); // Refresh the list
        showMessage('Cita cancelada exitosamente', 'success');
        return { success: true, data: response };
    } catch (error) {
        const errorMessage = 'Error al cancelar la cita: ' + error.message;
        showMessage(errorMessage, 'error');
        return { success: false, error: errorMessage };
    }
}

// Render functions
function renderAppointments() {
    const tbody = document.getElementById('appointmentsTableBody');
    
    if (appointments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                    <div class="empty-state">
                        <i class="fas fa-calendar-alt"></i>
                        <p>No tienes citas programadas</p>
                        <p class="text-sm">Haz clic en "Nueva Cita" para agendar una visita</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = appointments.map(appointment => `
        <tr class="table-row">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${appointment.title || 'Cita de visita'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDateTime(appointment.fecha, appointment.hora)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${getTypeLabel(appointment.type)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${appointment.location || 'Por definir'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getStatusBadge(appointment.status)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="editAppointment(${appointment.id})" class="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center">
                    <i class="fas fa-edit mr-1"></i>Editar
                </button>
                <button onclick="confirmDeleteAppointment(${appointment.id}, '${appointment.title || 'Cita de visita'}')" class="text-red-600 hover:text-red-900 inline-flex items-center">
                    <i class="fas fa-trash mr-1"></i>Cancelar
                </button>
            </td>
        </tr>
    `).join('');
}

function renderUpcomingAppointments() {
    const container = document.getElementById('upcomingAppointments');
    const countElement = document.getElementById('upcomingCount');
    
    const upcomingAppointments = appointments
        .filter(apt => {
            const aptDate = new Date(`${apt.fecha}T${apt.hora}`);
            const now = new Date();
            return aptDate > now && apt.status !== 'cancelada';
        })
        .sort((a, b) => {
            const dateA = new Date(`${a.fecha}T${a.hora}`);
            const dateB = new Date(`${b.fecha}T${b.hora}`);
            return dateA.getTime() - dateB.getTime();
        })
        .slice(0, 3);

    countElement.textContent = `${upcomingAppointments.length} citas`;

    if (upcomingAppointments.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-calendar-check text-4xl text-gray-300 mb-3"></i>
                <p>No tienes citas próximas</p>
                <p class="text-sm">Las nuevas citas aparecerán aquí</p>
            </div>
        `;
        return;
    }

    container.innerHTML = upcomingAppointments.map(appointment => {
        const statusConfig = {
            confirmada: { icon: 'fas fa-calendar-check', bg: 'bg-green-100', color: 'text-green-600' },
            pendiente: { icon: 'fas fa-clock', bg: 'bg-yellow-100', color: 'text-yellow-600' },
            por_confirmar: { icon: 'fas fa-clock', bg: 'bg-gray-100', color: 'text-gray-600' },
        };
        
        const config = statusConfig[appointment.status] || statusConfig.pendiente;
        
        return `
            <div class="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="${config.bg} p-2 rounded-full mr-3">
                    <i class="${config.icon} ${config.color}"></i>
                </div>
                <div class="flex-1">
                    <h4 class="text-sm font-medium text-gray-800">
                        ${appointment.title || 'Cita de visita'}
                    </h4>
                    <p class="text-xs text-gray-600 mt-1 flex items-center">
                        <i class="fas fa-clock mr-1"></i>
                        ${formatDateTime(appointment.fecha, appointment.hora)}
                    </p>
                    <p class="text-xs text-gray-600 mt-1 flex items-center">
                        <i class="fas fa-map-marker-alt mr-1"></i>
                        ${appointment.location || 'Por definir'}
                    </p>
                </div>
                <button class="text-blue-600 hover:text-blue-800 text-sm">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `;
    }).join('');
}

// Modal functions
function openAppointmentModal(isEdit = false, appointment = null) {
    const modal = document.getElementById('appointmentModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('appointmentForm');
    
    hideModalError('modal');
    
    if (isEdit && appointment) {
        title.textContent = 'Editar Cita de Visita';
        document.getElementById('editAppointmentId').value = appointment.id;
        document.getElementById('appointmentTitle').value = appointment.title || '';
        document.getElementById('appointmentType').value = appointment.type || '';
        document.getElementById('appointmentLocation').value = appointment.location || '';
        document.getElementById('appointmentDescription').value = appointment.description || '';
        
        // Set date and time for flatpickr
        const dateTime = `${appointment.fecha} ${appointment.hora}`;
        document.getElementById('appointmentDate')._flatpickr.setDate(dateTime);
        
        currentEditingId = appointment.id;
    } else {
        title.textContent = 'Nueva Cita de Visita';
        form.reset();
        document.getElementById('editAppointmentId').value = '';
        currentEditingId = null;
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('modal-enter');
}

function closeAppointmentModal() {
    const modal = document.getElementById('appointmentModal');
    modal.classList.add('hidden');
    modal.classList.remove('modal-enter');
    hideModalError('modal');
    currentEditingId = null;
}

function editAppointment(id) {
    const appointment = appointments.find(apt => apt.id === id);
    if (appointment) {
        openAppointmentModal(true, appointment);
    }
}

function confirmDeleteAppointment(id, title) {
    const modal = document.getElementById('deleteAppointmentModal');
    const titleElement = document.getElementById('appointmentToDeleteTitle');
    const idInput = document.getElementById('appointmentToDeleteId');
    
    hideModalError('delete');
    titleElement.textContent = `"${title}"`;
    idInput.value = id;
    modal.classList.remove('hidden');
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteAppointmentModal');
    modal.classList.add('hidden');
    hideModalError('delete');
}

function openLogoutModal() {
    const modal = document.getElementById('logoutModal');
    hideModalError('logout');
    modal.classList.remove('hidden');
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    modal.classList.add('hidden');
    hideModalError('logout');
}

// Event handlers
async function handleAppointmentSubmit(event) {
    event.preventDefault();
    
    const saveButton = document.getElementById('saveAppointmentBtn');
    const saveButtonText = document.getElementById('saveButtonText');
    const originalText = saveButtonText.textContent;
    
    // Show loading state
    saveButton.disabled = true;
    saveButton.classList.add('btn-loading');
    saveButtonText.textContent = 'Guardando...';
    
    hideModalError('modal');
    
    try {
        const formData = new FormData(event.target);
        const appointmentDate = document.getElementById('appointmentDate').value;
        
        // Parse date and time
        const [datePart, timePart] = appointmentDate.split(' ');
        const [day, month, year] = datePart.split('-');
        const fecha = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const hora = timePart;
        
        const appointmentData = {
            fecha,
            hora,
            title: formData.get('appointmentTitle'),
            type: formData.get('appointmentType'),
            location: formData.get('appointmentLocation'),
            description: formData.get('appointmentDescription'),
        };
        
        let result;
        if (currentEditingId) {
            appointmentData.id = currentEditingId;
            result = await updateAppointment(appointmentData);
        } else {
            result = await createAppointment(appointmentData);
        }
        
        if (result.success) {
            closeAppointmentModal();
        } else {
            showModalError('modal', result.error);
        }
    } catch (error) {
        showModalError('modal', 'Error inesperado: ' + error.message);
    } finally {
        // Reset button state
        saveButton.disabled = false;
        saveButton.classList.remove('btn-loading');
        saveButtonText.textContent = originalText;
    }
}

async function handleLogout() {
    const logoutButton = document.getElementById('confirmLogout');
    const logoutButtonText = document.getElementById('logoutButtonText');
    const originalText = logoutButtonText.textContent;
    
    // Show loading state
    logoutButton.disabled = true;
    logoutButton.classList.add('btn-loading');
    logoutButtonText.textContent = 'Cerrando...';
    
    hideModalError('logout');
    
    try {
        await logoutUser();
        closeLogoutModal();
    } catch (error) {
        showModalError('logout', error.message);
    } finally {
        // Reset button state
        logoutButton.disabled = false;
        logoutButton.classList.remove('btn-loading');
        logoutButtonText.textContent = originalText;
    }
}

async function handleDeleteAppointment() {
    const deleteButton = document.getElementById('confirmDeleteBtn');
    const deleteButtonText = document.getElementById('deleteButtonText');
    const originalText = deleteButtonText.textContent;
    const appointmentId = parseInt(document.getElementById('appointmentToDeleteId').value);
    
    // Show loading state
    deleteButton.disabled = true;
    deleteButton.classList.add('btn-loading');
    deleteButtonText.textContent = 'Cancelando...';
    
    hideModalError('delete');
    
    try {
        const result = await deleteAppointment(appointmentId);
        if (result.success) {
            closeDeleteModal();
        } else {
            showModalError('delete', result.error);
        }
    } catch (error) {
        showModalError('delete', 'Error inesperado: ' + error.message);
    } finally {
        // Reset button state
        deleteButton.disabled = false;
        deleteButton.classList.remove('btn-loading');
        deleteButtonText.textContent = originalText;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set auth token if not present
    if (!authToken) {
        authToken = '1|cu15pM6AFYCcgSFXSfstFZlHTZSXGcwF3jrO4cNv0a727c5c';
        localStorage.setItem('auth_token', authToken);
    }
    
    // Initialize flatpickr for date/time selection
    flatpickr("#appointmentDate", {
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        minDate: "today",
        locale: "es",
        time_24hr: true
    });

    // Set today's date
    const today = new Date();
    const todayString = today.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
    document.getElementById('todayDate').textContent = `Hoy - ${todayString}`;

    // Sidebar functionality
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-closed');
        sidebar.classList.toggle('sidebar-open');
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.add('sidebar-closed');
        sidebar.classList.remove('sidebar-open');
    });

    // Notifications functionality
    const notificationsBtn = document.getElementById('notificationsBtn');
    const notificationsDropdown = document.getElementById('notificationsDropdown');
    const closeNotifications = document.getElementById('closeNotifications');

    notificationsBtn.addEventListener('click', () => {
        notificationsDropdown.classList.toggle('hidden');
        if (!notificationsDropdown.classList.contains('hidden')) {
            notificationsDropdown.classList.add('show');
        }
    });

    closeNotifications.addEventListener('click', () => {
        notificationsDropdown.classList.add('hidden');
        notificationsDropdown.classList.remove('show');
    });

    // Close notifications when clicking outside
    document.addEventListener('click', (event) => {
        if (!notificationsBtn.contains(event.target) && !notificationsDropdown.contains(event.target)) {
            notificationsDropdown.classList.add('hidden');
            notificationsDropdown.classList.remove('show');
        }
    });

    // Modal event listeners
    document.getElementById('newAppointmentBtn').addEventListener('click', () => {
        openAppointmentModal(false);
    });

    document.getElementById('closeModalBtn').addEventListener('click', closeAppointmentModal);
    document.getElementById('cancelAppointmentBtn').addEventListener('click', closeAppointmentModal);

    document.getElementById('logoutBtn').addEventListener('click', openLogoutModal);
    document.getElementById('cancelLogout').addEventListener('click', closeLogoutModal);
    document.getElementById('confirmLogout').addEventListener('click', handleLogout);

    document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDeleteBtn').addEventListener('click', handleDeleteAppointment);

    // Form submission
    document.getElementById('appointmentForm').addEventListener('submit', handleAppointmentSubmit);

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', async () => {
        showLoading();
        await fetchAppointments();
        hideLoading();
    });

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        const modals = ['appointmentModal', 'logoutModal', 'deleteAppointmentModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (event.target === modal) {
                modal.classList.add('hidden');
                if (modalId === 'appointmentModal') {
                    hideModalError('modal');
                    currentEditingId = null;
                } else if (modalId === 'logoutModal') {
                    hideModalError('logout');
                } else if (modalId === 'deleteAppointmentModal') {
                    hideModalError('delete');
                }
            }
        });
    });

    // Initial data load
    showLoading();
    fetchAppointments().finally(() => {
        hideLoading();
    });
});

// Make functions globally available
window.editAppointment = editAppointment;
window.confirmDeleteAppointment = confirmDeleteAppointment;