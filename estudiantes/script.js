// Global state
let activeSection = 'inicio';
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
const mainContent = document.getElementById('mainContent');
const navBtns = document.querySelectorAll('.nav-btn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    
    if (!token) {
        // No token found, redirect to login
        window.location.href = '../login-uth.html';
        return;
    }
    
    if (tipoUsuario && tipoUsuario !== 'estudiante') {
        // Wrong user type, redirect to appropriate dashboard
        if (tipoUsuario === 'docente') {
            window.location.href = '../docente/inicio.html';
        } else if (tipoUsuario === 'admin') {
            window.location.href = '../administracion/index.html';
        }
        return;
    }
    
    // Check if user is coming from login
    const urlParams = new URLSearchParams(window.location.search);
    const fromLogin = urlParams.get('from') === 'login';
    
    if (fromLogin) {
        // Show welcome message
        showWelcomeMessage();
    }
    
    // Load initial content
    loadContent(activeSection);
    
    // Update user name if available
    const userName = localStorage.getItem('nombre');
    if (userName) {
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }
    }
    
    // Set up event listeners
    setupEventListeners();
});

function setupEventListeners() {
    // Sidebar toggle
    menuToggle.addEventListener('click', toggleSidebar);
    closeSidebarBtn.addEventListener('click', () => setSidebarOpen(false));
    
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            setActiveSection(section);
        });
    });
    
    // Notifications
    notificationsBtn.addEventListener('click', toggleNotifications);
    closeNotifications.addEventListener('click', () => setNotificationsOpen(false));
    
    // Logout
    logoutBtn.addEventListener('click', () => setLogoutModalOpen(true));
    cancelLogout.addEventListener('click', () => setLogoutModalOpen(false));
    confirmLogout.addEventListener('click', handleLogout);
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationsBtn.contains(e.target) && !notificationsDropdown.contains(e.target)) {
            setNotificationsOpen(false);
        }
        
        if (!logoutModal.contains(e.target) && e.target === logoutModal) {
            setLogoutModalOpen(false);
        }
    });
}

function showWelcomeMessage() {
    // Create and show a welcome toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all';
    toast.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            ¡Bienvenido al sistema de estadías!
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function toggleSidebar() {
    setSidebarOpen(!sidebarOpen);
}

function setSidebarOpen(open) {
    sidebarOpen = open;
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
    if (open) {
        notificationsDropdown.classList.remove('hidden');
    } else {
        notificationsDropdown.classList.add('hidden');
    }
}

function setLogoutModalOpen(open) {
    if (open) {
        logoutModal.classList.remove('hidden');
    } else {
        logoutModal.classList.add('hidden');
    }
}

function setActiveSection(section) {
    activeSection = section;
    
    // Update navigation buttons
    navBtns.forEach(btn => {
        if (btn.dataset.section === section) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Load content for the section
    loadContent(section);
}

function loadContent(section) {
    let content = '';
    
    switch (section) {
        case 'documentos':
            content = getDocumentosContent();
            break;
        case 'mi-estadia':
            content = getMiEstadiaContent();
            break;
        case 'cronograma':
            content = getCronogramaContent();
            break;
        case 'seguimiento':
            content = getSeguimientoContent();
            break;
        default:
            content = getInicioContent();
    }
    
    mainContent.innerHTML = content;
    
    // Set up event listeners for the new content
    setupContentEventListeners(section);
}

function getInicioContent() {
    return `
        <div class="max-w-4xl">
            <!-- Page Header -->
            <div class="flex items-center mb-6">
                <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h1 class="text-xl font-medium text-gray-800">Resumen de Estadía</h1>
            </div>
            </div>
        </div>
    `;
}

const apiUrl = "http://127.0.0.1:8000";
const token = localStorage.getItem('token');
const idU = localStorage.getItem('idU'); // ID del usuario
let idEstadia = null; // Se llenará dinámicamente

function getDocumentosContent() {
    return `
        <div class="max-w-4xl">
            <!-- Page Header -->
            <div class="flex items-center mb-6">
                <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5L12 5H5a2 2 0 00-2 2z"></path>
                </svg>
                <h1 class="text-xl font-medium text-gray-800">Documentos importantes</h1>
            </div>

            <!-- Upload Section -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">Gestión de Documentos</h3>
                    <button id="toggleUploadBtn" class="px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Subir documento
                    </button>
                </div>
                
                <div id="uploadSection" class="hidden">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Subir nuevo documento</h3>
                
                <div id="fileDropArea" class="file-drop-area border-2 border-dashed rounded-lg p-8 text-center mb-4">
                    <svg class="w-16 h-16 text-gray-400 mb-3 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p class="text-gray-600 mb-2">Arrastra y suelta tus archivos aquí</p>
                    <p class="text-sm text-gray-500 mb-4">o</p>
                    <label for="fileInput" class="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5L12 5H5a2 2 0 00-2 2z"></path>
                        </svg>
                        Seleccionar archivos
                    </label>
                    <input id="fileInput" type="file" class="hidden" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar">
                </div>
                
                <div id="selectedFiles" class="hidden">
                    <h4 class="text-sm font-medium text-gray-700 mb-3">Archivos seleccionados:</h4>
                    <ul id="fileList" class="space-y-2"></ul>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label for="documentType" class="block text-sm font-medium text-gray-700 mb-1">Tipo de documento:</label>
                        <select id="documentType" class="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500">
                            <option value="">Selecciona un tipo</option>
                            <option value="carta_aceptacion">Carta de Aceptación </option>
                            <option value="memoria_estadia">Memoria de Estadía</option>
                            <option value="cronograma">Cronograma</option>
                            <option value="evaluacion">Evaluación</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>
                    <div>
                        <label for="documentDescription" class="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional):</label>
                        <textarea id="documentDescription" rows="3" class="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500" placeholder="Describe brevemente el documento..."></textarea>
                    </div>
                </div>
                
                <div class="flex space-x-3 mt-4">
                    <button id="uploadBtn" class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        Subir documentos
                    </button>
                    <button id="cancelUploadBtn" class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
                        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Cancelar
                    </button>
                </div>
                </div>
            </div>
            
            <!-- Documents List -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-800">Mis Documentos</h3>
                    <div class="relative">
                        <select id="filterDocuments" class="appearance-none bg-gray-100 border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
                            <option value="all">Todos los documentos</option>
                            <option value="carta_presentacion">Cartas de Presentación</option>
                            <option value="plan_trabajo">Planes de Trabajo</option>
                            <option value="informe_parcial">Informes Parciales</option>
                            <option value="informe_final">Informes Finales</option>
                            <option value="evaluacion">Evaluaciones</option>
                            <option value="otros">Otros</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </div>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="documentsTableBody" class="bg-white divide-y divide-gray-200">
                            <!-- Document rows will be dynamically inserted here -->
                        </tbody>
                    </table>
                </div>
                
                <!-- Empty State -->
                <div id="emptyDocuments" class="hidden text-center py-12">
                    <svg class="w-16 h-16 text-gray-300 mb-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5L12 5H5a2 2 0 00-2 2z"></path>
                    </svg>
                    <h4 class="text-lg font-medium text-gray-500">No hay documentos subidos</h4>
                    <p class="text-gray-400 mt-1">Sube tu primer documento para comenzar</p>
                </div>
            </div>
        </div>
        
        <!-- Document Preview Modal -->
        <div id="documentPreviewModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <h3 id="previewDocumentTitle" class="text-lg font-medium text-gray-800">Vista previa del documento</h3>
                    <button id="closePreviewModal" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                </div>
                <div id="previewContent" class="flex-1 overflow-auto border border-gray-200 rounded-md p-4 mb-4">
                    <!-- Preview content will be inserted here -->
                </div>
                <div class="flex justify-end space-x-3">
                    <button id="downloadPreviewBtn" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                        </svg>
                        Descargar
                    </button>
                    <button id="closePreviewBtn" class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                        Cerrar
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Obtener ID de estadía
function fetchEstadia() {
    if (!token) {
        alert("No hay token almacenado");
        window.location.href = "../login-uth.html";
        return;
    }

    return fetch(apiUrl + "/api/estadia/verEstadiaAlumno", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, usuario_id: idU }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.estadia) {
            idEstadia = data.estadia.id;
            console.log("ID Estadia:", idEstadia);
        } else {
            throw new Error("No se encontró la estadía del usuario");
        }
    });
}

// Subir carta de aceptación
function subirCartaAceptacion() {
    if (!idEstadia) {
        alert("Aún no se ha cargado el ID de la estadía");
        return;
    }

    const fileInput = document.getElementById("fileInput");
    const description = document.getElementById("documentDescription").value;
    const fechaRecepcion = new Date().toISOString().split('T')[0];

    if (!fileInput.files.length) {
        alert("Selecciona un archivo primero");
        return;
    }

    const formData = new FormData();
    formData.append("estadia_id", idEstadia);
    formData.append("fecha_recepcion", fechaRecepcion);
    formData.append("documento", fileInput.files[0]);
    formData.append("observaciones", description);

    fetch(apiUrl + "/api/cartas/registrar", {  // <-- URL correcta de documentos
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error("Error en la subida: " + res.status);
        return res.json();
    })
    .then(data => {
        alert("Carta de Aceptación subida correctamente");
        console.log(data);
    })
    .catch(err => {
        console.error(err);
        alert("Error al subir la carta de aceptación");
    });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    fetchEstadia().then(() => {
        document.getElementById("uploadBtn").addEventListener("click", subirCartaAceptacion);
    });
});

// Subir memoria de estadía
function subirMemoriaEstadia() {
    if (!idEstadia) {
        alert("Aún no se ha cargado el ID de la estadía");
        return;
    }

    const fileInput = document.getElementById("fileInput");
    const description = document.getElementById("documentDescription").value; // Para el nombre opcional

    if (!fileInput.files.length) {
        alert("Selecciona un archivo primero");
        return;
    }

    const formData = new FormData();
    formData.append("estadia_id", idEstadia);
    formData.append("nombre", description || fileInput.files[0].name); // Nombre del documento
    formData.append("ruta", fileInput.files[0]); // Archivo seleccionado
    formData.append("fecha_subida", new Date().toISOString().split('T')[0]); // YYYY-MM-DD

    fetch(apiUrl + "/api/docExtra/register", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error("Error en la subida: " + res.status);
        return res.json();
    })
    .then(data => {
        alert("Memoria de estadía subida correctamente");
        console.log(data);
        // Aquí puedes refrescar la lista de documentos
    })
    .catch(err => {
        console.error(err);
        alert("Error al subir la memoria de estadía");
    });
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    fetchEstadia().then(() => {
        document.getElementById("uploadBtn").addEventListener("click", subirMemoriaEstadia);
    });
});



function getMiEstadiaContent() {
    return `
        <div class="max-w-4xl">
            <div class="flex items-center mb-6">
                <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <h1 class="text-xl font-medium text-gray-800">Mi Estadía</h1>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-medium text-gray-800 mb-4">Información de la Estadía</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="text-sm font-medium text-gray-600">Empresa:</label>
                        <p class="text-gray-800">TechSolutions México S.A. de C.V.</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Período:</label>
                        <p class="text-gray-800">Enero - Abril 2023</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Proyecto:</label>
                        <p class="text-gray-800">Sistema de Gestión de Inventarios</p>
                    </div>
                    <div>
                        <label class="text-sm font-medium text-gray-600">Asesor Empresarial:</label>
                        <p class="text-gray-800">Ing. María González</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getCronogramaContent() {
    return `
        <div class="max-w-4xl">
            <div class="flex items-center mb-6">
                <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <h1 class="text-xl font-medium text-gray-800">Cronograma</h1>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-medium text-gray-800 mb-4">Actividades Programadas</h2>
                <div class="space-y-4">
                    <div class="border-l-4 border-green-500 pl-4">
                        <h3 class="font-medium text-gray-800">Semana 1-2: Inducción</h3>
                        <p class="text-sm text-gray-600">Conocimiento de la empresa y capacitación inicial</p>
                    </div>
                    <div class="border-l-4 border-yellow-500 pl-4">
                        <h3 class="font-medium text-gray-800">Semana 3-8: Desarrollo</h3>
                        <p class="text-sm text-gray-600">Implementación del proyecto asignado</p>
                    </div>
                    <div class="border-l-4 border-blue-500 pl-4">
                        <h3 class="font-medium text-gray-800">Semana 9-12: Finalización</h3>
                        <p class="text-sm text-gray-600">Pruebas, documentación y entrega</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getSeguimientoContent() {
    return `
        <div class="max-w-4xl">
            <div class="flex items-center mb-6">
                <svg class="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                <h1 class="text-xl font-medium text-gray-800">Seguimiento</h1>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-medium text-gray-800 mb-4">Reportes de Avance</h2>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-4 border border-gray-200 rounded">
                        <div>
                            <h3 class="font-medium text-gray-800">Reporte Semanal #1</h3>
                            <p class="text-sm text-gray-600">Fecha: 15/01/2023</p>
                        </div>
                        <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Aprobado</span>
                    </div>
                    <div class="flex items-center justify-between p-4 border border-gray-200 rounded">
                        <div>
                            <h3 class="font-medium text-gray-800">Reporte Semanal #2</h3>
                            <p class="text-sm text-gray-600">Fecha: 22/01/2023</p>
                        </div>
                        <span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Pendiente</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function setupContentEventListeners(section) {
    // Add any section-specific event listeners here
    if (section === 'documentos') {
        setupDocumentManagement();
    }
}

function downloadDocument(docType) {
    alert(`Descargando documento: ${docType}`);
    // Here you would implement the actual download logic
}

function uploadDocument(docType) {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            alert(`Subiendo documento: ${file.name}`);
            // Here you would implement the actual upload logic
        }
    };
    input.click();
}

function viewDocument(docType) {
    alert(`Visualizando documento: ${docType}`);
    // Here you would implement the document viewer
}

function handleLogout() {
    setLogoutModalOpen(false);
    
    // Clear any stored session data
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

// Document Management System
let documents = [
    {
        id: 1,
        name: 'Carta de Presentación.pdf',
        type: 'carta_presentacion',
        status: 'Aprobado',
        date: '2023-05-15',
        size: '2.4 MB',
        description: 'Carta de presentación para la empresa XYZ',
        previewContent: '<div class="p-4"><h3 class="text-lg font-bold mb-4">Carta de Presentación</h3><p class="mb-3">Estimados señores,</p><p class="mb-3">Por medio de la presente me dirijo a ustedes para presentar al estudiante Carlos Martínez Gómez...</p><p class="text-gray-600 text-sm mt-4">Este es un contenido de ejemplo de la carta de presentación.</p></div>'
    },
    {
        id: 2,
        name: 'Plan de Trabajo.docx',
        type: 'plan_trabajo',
        status: 'Pendiente',
        date: '2023-05-20',
        size: '1.8 MB',
        description: 'Plan de trabajo para el proyecto ABC',
        previewContent: '<div class="p-4"><h3 class="text-lg font-bold mb-4">Plan de Trabajo</h3><h4 class="font-semibold mb-2">Objetivos:</h4><ul class="list-disc pl-5 mb-3"><li>Desarrollar sistema de inventarios</li><li>Implementar base de datos</li></ul><p class="text-gray-600 text-sm mt-4">Este es un contenido de ejemplo del plan de trabajo.</p></div>'
    },
    {
        id: 3,
        name: 'Informe Parcial 1.pdf',
        type: 'informe_parcial',
        status: 'Rechazado',
        date: '2023-06-10',
        size: '3.2 MB',
        description: 'Primer informe parcial de actividades',
        previewContent: '<div class="p-4"><h3 class="text-lg font-bold mb-4">Informe Parcial #1</h3><h4 class="font-semibold mb-2">Actividades realizadas:</h4><p class="mb-3">Durante las primeras 4 semanas de estadía se realizaron las siguientes actividades...</p><p class="text-red-600 text-sm mt-4"><strong>Nota:</strong> Documento rechazado - Faltan evidencias fotográficas</p></div>'
    }
];
function setupDocumentManagement() {
    const toggleUploadBtn = document.getElementById('toggleUploadBtn');
    const uploadSection = document.getElementById('uploadSection');
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');
    const fileDropArea = document.getElementById('fileDropArea');
    const fileInput = document.getElementById('fileInput');
    const selectedFiles = document.getElementById('selectedFiles');
    const fileList = document.getElementById('fileList');
    const uploadBtn = document.getElementById('uploadBtn');
    const documentType = document.getElementById('documentType');
    const documentDescription = document.getElementById('documentDescription');
    const documentsTableBody = document.getElementById('documentsTableBody');
    const emptyDocuments = document.getElementById('emptyDocuments');
    const filterDocuments = document.getElementById('filterDocuments');
    const documentPreviewModal = document.getElementById('documentPreviewModal');
    const closePreviewModal = document.getElementById('closePreviewModal');
    const closePreviewBtn = document.getElementById('closePreviewBtn');
    
    if (!toggleUploadBtn) return; // Exit if elements don't exist
    
    // Toggle upload section
    toggleUploadBtn.addEventListener('click', function() {
        const isHidden = uploadSection.classList.contains('hidden');
        if (isHidden) {
            uploadSection.classList.remove('hidden');
            this.innerHTML = '<svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>Ocultar subida';
        } else {
            uploadSection.classList.add('hidden');
            this.innerHTML = '<svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>Subir documento';
            resetUploadForm();
        }
    });
    
    // Cancel upload
    cancelUploadBtn.addEventListener('click', function() {
        uploadSection.classList.add('hidden');
        toggleUploadBtn.innerHTML = '<svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>Subir documento';
        resetUploadForm();
    });
    
    // File drop area functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        fileDropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        fileDropArea.classList.add('active');
    }
    
    function unhighlight() {
        fileDropArea.classList.remove('active');
    }
    
    fileDropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        if (files.length === 0) return;
        
        fileList.innerHTML = '';
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const listItem = document.createElement('li');
            listItem.className = 'flex items-center justify-between bg-gray-50 p-2 rounded';
            
            listItem.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span class="text-sm text-gray-700 truncate max-w-xs">${file.name}</span>
                </div>
                <span class="text-xs text-gray-500">${formatFileSize(file.size)}</span>
            `;
            
            fileList.appendChild(listItem);
        }
        
        selectedFiles.classList.remove('hidden');
        updateUploadButtonState();
    }
    
    function updateUploadButtonState() {
        const hasFiles = fileList.children.length > 0;
        const hasType = documentType.value !== '';
        uploadBtn.disabled = !(hasFiles && hasType);
    }
    
    documentType.addEventListener('change', updateUploadButtonState);
    
    // Upload button functionality
    uploadBtn.addEventListener('click', function() {
        if (this.disabled) return;
        
        const files = fileInput.files;
        const type = documentType.value;
        const description = documentDescription.value;
        
        // Create new document entries
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const newDoc = {
                id: documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1,
                name: file.name,
                type: type,
                status: 'Pendiente',
                date: new Date().toISOString().split('T')[0],
                size: formatFileSize(file.size),
                description: description,
                previewContent: `<div class="p-4"><h3 class="text-lg font-bold mb-4">${file.name}</h3><p class="mb-3"><strong>Tipo:</strong> ${getTypeName(type)}</p><p class="mb-3"><strong>Descripción:</strong> ${description || 'Ninguna'}</p><p class="text-gray-600 text-sm mt-4">Este documento ha sido subido exitosamente y está pendiente de revisión.</p></div>`
            };
            
            documents.unshift(newDoc);
        }
        
        // Reset form and hide upload section
        resetUploadForm();
        uploadSection.classList.add('hidden');
        toggleUploadBtn.innerHTML = '<svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>Subir documento';
        
        // Update table
        renderDocumentsTable(filterDocuments.value);
        
        // Show success message
        alert('Documentos subidos correctamente');
    });
    
    function resetUploadForm() {
        fileInput.value = '';
        fileList.innerHTML = '';
        selectedFiles.classList.add('hidden');
        documentType.value = '';
        documentDescription.value = '';
        uploadBtn.disabled = true;
    }
    
    // Filter documents
    filterDocuments.addEventListener('change', function() {
        renderDocumentsTable(this.value);
    });
    
    // Close preview modal
    closePreviewModal.addEventListener('click', function() {
        documentPreviewModal.classList.add('hidden');
    });
    
    closePreviewBtn.addEventListener('click', function() {
        documentPreviewModal.classList.add('hidden');
    });
    
    // Initialize table
    renderDocumentsTable();
}

// Helper functions for document management
function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    switch(extension) {
        case 'pdf': return 'fa-file-pdf';
        case 'doc':
        case 'docx': return 'fa-file-word';
        case 'xls':
        case 'xlsx': return 'fa-file-excel';
        case 'ppt':
        case 'pptx': return 'fa-file-powerpoint';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif': return 'fa-file-image';
        case 'zip':
        case 'rar': return 'fa-file-archive';
        default: return 'fa-file';
    }
}

function getTypeName(type) {
    const types = {
        'carta_presentacion': 'Carta Presentación',
        'plan_trabajo': 'Plan Trabajo',
        'informe_parcial': 'Informe Parcial',
        'informe_final': 'Informe Final',
        'evaluacion': 'Evaluación',
        'otros': 'Otros'
    };
    return types[type] || type;
}

function getTypeBadgeClass(type) {
    const classes = {
        'carta_presentacion': 'bg-blue-100 text-blue-800',
        'plan_trabajo': 'bg-purple-100 text-purple-800',
        'informe_parcial': 'bg-yellow-100 text-yellow-800',
        'informe_final': 'bg-green-100 text-green-800',
        'evaluacion': 'bg-red-100 text-red-800',
        'otros': 'bg-gray-100 text-gray-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
}

function getStatusBadgeClass(status) {
    const classes = {
        'Aprobado': 'bg-green-100 text-green-800',
        'Pendiente': 'bg-yellow-100 text-yellow-800',
        'Rechazado': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function renderDocumentsTable(filter = 'all') {
    const documentsTableBody = document.getElementById('documentsTableBody');
    const emptyDocuments = document.getElementById('emptyDocuments');
    
    if (!documentsTableBody || !emptyDocuments) return;
    
    const filteredDocs = filter === 'all' 
        ? documents 
        : documents.filter(doc => doc.type === filter);
    
    if (filteredDocs.length === 0) {
        emptyDocuments.classList.remove('hidden');
        documentsTableBody.innerHTML = '';
        return;
    }
    
    emptyDocuments.classList.add('hidden');
    
    documentsTableBody.innerHTML = filteredDocs.map(doc => `
        <tr class="document-card hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${doc.name}</div>
                        <div class="text-xs text-gray-500">${doc.size}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(doc.type)}">
                    ${getTypeName(doc.type)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(doc.status)}">
                    ${doc.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDate(doc.date)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onclick="viewDocument(${doc.id})" class="text-green-600 hover:text-green-900 mr-3" title="Ver documento">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                </button>
                <button onclick="downloadDocument(${doc.id})" class="text-blue-600 hover:text-blue-900 mr-3" title="Descargar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
                    </svg>
                </button>
                <button onclick="deleteDocument(${doc.id})" class="text-red-600 hover:text-red-900" title="Eliminar">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </td>
        </tr>
    `).join('');
}

// Document actions
function viewDocument(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    
    const previewDocumentTitle = document.getElementById('previewDocumentTitle');
    const previewContent = document.getElementById('previewContent');
    const downloadPreviewBtn = document.getElementById('downloadPreviewBtn');
    const documentPreviewModal = document.getElementById('documentPreviewModal');
    
    if (previewDocumentTitle) previewDocumentTitle.textContent = doc.name;
    if (previewContent) previewContent.innerHTML = doc.previewContent;
    
    // Set download button to download this document
    if (downloadPreviewBtn) {
        downloadPreviewBtn.onclick = () => downloadDocument(id);
    }
    
    if (documentPreviewModal) {
        documentPreviewModal.classList.remove('hidden');
    }
}

function downloadDocument(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    
    // In a real app, this would download the actual file
    console.log(`Downloading document: ${doc.name}`);
    alert(`Descargando documento: ${doc.name}`);
}

function deleteDocument(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este documento?')) {
        documents = documents.filter(d => d.id !== id);
        const filterDocuments = document.getElementById('filterDocuments');
        const currentFilter = filterDocuments ? filterDocuments.value : 'all';
        renderDocumentsTable(currentFilter);
    }
}