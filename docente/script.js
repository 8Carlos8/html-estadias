// Global state
let sidebarOpen = true;
let showNotifications = false;

// DOM elements
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const notificationsBtn = document.getElementById('notificationsBtn');
const notificationsDropdown = document.getElementById('notificationsDropdown');
const closeNotifications = document.getElementById('closeNotifications');
const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const cancelLogout = document.getElementById('cancelLogout');
const confirmLogout = document.getElementById('confirmLogout');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    
    // Check if user is coming from login
    const urlParams = new URLSearchParams(window.location.search);
    const fromLogin = urlParams.get('from') === 'login';
    
    if (fromLogin) {
        showWelcomeMessage();
    }
});

function setupEventListeners() {
    // Sidebar toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleSidebar);
    }
    
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => setSidebarOpen(false));
    }
    
    // Notifications
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', toggleNotifications);
    }
    
    if (closeNotifications) {
        closeNotifications.addEventListener('click', () => setNotificationsOpen(false));
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => setLogoutModalOpen(true));
    }
    
    if (cancelLogout) {
        cancelLogout.addEventListener('click', () => setLogoutModalOpen(false));
    }
    
    if (confirmLogout) {
        confirmLogout.addEventListener('click', handleLogout);
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (notificationsBtn && notificationsDropdown && 
            !notificationsBtn.contains(e.target) && 
            !notificationsDropdown.contains(e.target)) {
            setNotificationsOpen(false);
        }
        
        if (logoutModal && e.target === logoutModal) {
            setLogoutModalOpen(false);
        }
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);
}

function showWelcomeMessage() {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all';
    toast.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            ¡Bienvenido al sistema docente!
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
}

function setSidebarOpen(open) {
    sidebarOpen = open;
    if (!sidebar) return;
    
    if (open) {
        sidebar.classList.remove('sidebar-closed');
        sidebar.classList.add('sidebar-open');
    } else {
        sidebar.classList.remove('sidebar-open');
        sidebar.classList.add('sidebar-closed');
    }
}

function toggleNotifications() {
    setNotificationsOpen(!showNotifications);
}

function setNotificationsOpen(open) {
    showNotifications = open;
    if (!notificationsDropdown) return;
    
    if (open) {
        notificationsDropdown.classList.remove('hidden');
    } else {
        notificationsDropdown.classList.add('hidden');
    }
}

function setLogoutModalOpen(open) {
    if (!logoutModal) return;
    
    if (open) {
        logoutModal.classList.remove('hidden');
    } else {
        logoutModal.classList.add('hidden');
    }
}

function handleLogout() {
    setLogoutModalOpen(false);
    
    // Clear session data
    localStorage.removeItem('token');
    localStorage.removeItem('idU');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('nombre');
    
    // Show logout message
    showNotification('Cerrando sesión...', 'info');
    
    setTimeout(() => {
        // Redirect to login page
        window.location.href = '../login-uth.html';
    }, 1000);
}

function handleResize() {
    if (window.innerWidth > 768) {
        setSidebarOpen(true);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: ${type === 'warning' ? '#212529' : 'white'};
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 9999;
        max-width: 350px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
        border-left: 4px solid ${getNotificationBorderColor(type)};
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#10b981';
        case 'warning': return '#f59e0b';
        case 'error': return '#ef4444';
        case 'info':
        default: return '#3b82f6';
    }
}

function getNotificationBorderColor(type) {
    switch(type) {
        case 'success': return '#059669';
        case 'warning': return '#d97706';
        case 'error': return '#dc2626';
        case 'info':
        default: return '#2563eb';
    }
}

// Document management functions (dummy implementations)
function viewDocument(id) {
    showNotification(`Visualizando documento ID: ${id}`, 'info');
}

function downloadDocument(id) {
    showNotification(`Descargando documento ID: ${id}`, 'success');
}

function approveDocument(id) {
    showNotification(`Documento ID: ${id} aprobado`, 'success');
}

function rejectDocument(id) {
    showNotification(`Documento ID: ${id} rechazado`, 'error');
}

// Student management functions (dummy implementations)
function viewStudent(id) {
    showNotification(`Visualizando estudiante ID: ${id}`, 'info');
}

function editStudent(id) {
    showNotification(`Editando estudiante ID: ${id}`, 'info');
}

// Calendar functions (dummy implementations)
function addEvent() {
    showNotification('Agregando nuevo evento al calendario', 'info');
}

function exportCalendar() {
    showNotification('Exportando calendario', 'success');
}

// Report functions (dummy implementations)
function exportAllDocuments() {
    showNotification('Exportando todos los documentos', 'info');
}

function applyFilters() {
    showNotification('Aplicando filtros', 'info');
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key to close modals and dropdowns
    if (e.key === 'Escape') {
        setLogoutModalOpen(false);
        setNotificationsOpen(false);
    }
    
    // Ctrl/Cmd + M to toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        toggleSidebar();
    }
    
    // Ctrl/Cmd + N to toggle notifications
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        toggleNotifications();
    }
});

// Simulate real-time updates
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Simulate notification badge updates
        const badge = document.getElementById('notificationBadge');
        if (badge && Math.random() > 0.8) {
            const currentCount = parseInt(badge.textContent) || 0;
            badge.textContent = currentCount + 1;
            
            // Show notification
            const messages = [
                'Nuevo documento subido',
                'Estudiante completó actividad',
                'Fecha límite próxima',
                'Documento aprobado',
                'Nueva solicitud recibida'
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showNotification(randomMessage, 'info');
        }
    }, 30000); // Every 30 seconds
}

// Start real-time updates simulation
simulateRealTimeUpdates();

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for buttons
function addLoadingState(button, duration = 2000) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Cargando...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, duration);
}

// Add click handlers for buttons that need loading states
document.addEventListener('click', function(e) {
    if (e.target.matches('button[class*="bg-green"], button[class*="bg-blue"]')) {
        addLoadingState(e.target, 1500);
    }
});

// Initialize tooltips (simple implementation)
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            tooltip.style.cssText = `
                position: absolute;
                background: #1f2937;
                color: white;
                padding: 0.5rem;
                border-radius: 0.25rem;
                font-size: 0.75rem;
                z-index: 1000;
                pointer-events: none;
                white-space: nowrap;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
            
            this.tooltipElement = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                document.body.removeChild(this.tooltipElement);
                this.tooltipElement = null;
            }
        });
    });
}

// Initialize tooltips when DOM is ready
document.addEventListener('DOMContentLoaded', initializeTooltips);