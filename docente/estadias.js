// Estado global de la aplicación
let estadias = [];
let currentEstadiaId = null;
let filteredEstadias = [];

// Elementos del DOM
const estadiaModal = document.getElementById("estadiaModal");
const deleteModal = document.getElementById("deleteModal");
const viewModal = document.getElementById("viewModal");
const estadiaForm = document.getElementById("estadiaForm");
const estadiasTableBody = document.getElementById("estadiasTableBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
  setupEventListeners();
  loadSampleData();
  renderEstadias();
  updateStats();
});

function initializeApp() {
  // Configurar sidebar
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.getElementById("menuToggle");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("sidebar-open");
    });
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", () => {
      sidebar.classList.remove("sidebar-open");
    });
  }

  // Configurar notificaciones
  const notificationsBtn = document.getElementById("notificationsBtn");
  const notificationsDropdown = document.getElementById(
    "notificationsDropdown"
  );
  const closeNotifications = document.getElementById("closeNotifications");

  if (notificationsBtn) {
    notificationsBtn.addEventListener("click", () => {
      notificationsDropdown.classList.toggle("hidden");
    });
  }

  if (closeNotifications) {
    closeNotifications.addEventListener("click", () => {
      notificationsDropdown.classList.add("hidden");
    });
  }

  // Configurar logout
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const cancelLogout = document.getElementById("cancelLogout");
  const confirmLogout = document.getElementById("confirmLogout");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logoutModal.classList.remove("hidden");
    });
  }

  if (cancelLogout) {
    cancelLogout.addEventListener("click", () => {
      logoutModal.classList.add("hidden");
    });
  }

  if (confirmLogout) {
    confirmLogout.addEventListener("click", () => {
      window.location.href = "../login-uth.html";
    });
  }
}

function setupEventListeners() {
  // Botón nueva estadía
  document
    .getElementById("newEstadiaBtn")
    .addEventListener("click", () => openEstadiaModal());

  // Botones del modal
  document
    .getElementById("closeModalBtn")
    .addEventListener("click", closeEstadiaModal);
  document
    .getElementById("cancelBtn")
    .addEventListener("click", closeEstadiaModal);

  // Formulario
  estadiaForm.addEventListener("submit", handleFormSubmit);

  // Modal de eliminación
  document
    .getElementById("cancelDeleteBtn")
    .addEventListener("click", closeDeleteModal);
  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", confirmDelete);

  // Modal de vista
  document
    .getElementById("closeViewModalBtn")
    .addEventListener("click", closeViewModal);

  // Búsqueda y filtros
  searchInput.addEventListener("input", handleSearch);
  statusFilter.addEventListener("change", handleFilter);

  // Cerrar modales al hacer clic fuera
  window.addEventListener("click", (e) => {
    if (e.target === estadiaModal) closeEstadiaModal();
    if (e.target === deleteModal) closeDeleteModal();
    if (e.target === viewModal) closeViewModal();
  });
}

function loadSampleData() {
  estadias = [
    {
      id: 1,
      nombreEstudiante: "Carlos Martínez Gómez",
      matricula: "3522110450",
      carrera: "Ing. Desarrollo y Gestión de Software",
      emailEstudiante: "carlos.martinez@uth.edu.mx",
      nombreEmpresa: "TechSolutions México S.A. de C.V.",
      contactoEmpresa: "Ing. María González",
      telefonoEmpresa: "222-123-4567",
      direccionEmpresa: "Av. Reforma 123, Col. Centro, Puebla, Pue.",
      nombreProyecto: "Sistema de Gestión de Inventarios",
      descripcionProyecto:
        "Desarrollo de un sistema web para el control y gestión de inventarios de la empresa.",
      fechaInicio: "2024-01-15",
      fechaFin: "2024-05-15",
      estado: "activa",
      fechaCreacion: "2024-01-10",
    },
    {
      id: 2,
      nombreEstudiante: "Ana González Ruiz",
      matricula: "3522114875",
      carrera: "Ing. en Sistemas Computacionales",
      emailEstudiante: "ana.gonzalez@uth.edu.mx",
      nombreEmpresa: "Innovación Digital SA",
      contactoEmpresa: "Lic. Roberto Pérez",
      telefonoEmpresa: "222-987-6543",
      direccionEmpresa: "Blvd. Atlixco 456, Col. La Paz, Puebla, Pue.",
      nombreProyecto: "App Móvil para Delivery",
      descripcionProyecto:
        "Desarrollo de aplicación móvil para servicio de entrega a domicilio.",
      fechaInicio: "2024-02-01",
      fechaFin: "2024-06-01",
      estado: "pendiente",
      fechaCreacion: "2024-01-25",
    },
    {
      id: 3,
      nombreEstudiante: "Luis Pérez Mora",
      matricula: "3522110653",
      carrera: "Ing. Industrial",
      emailEstudiante: "luis.perez@uth.edu.mx",
      nombreEmpresa: "Manufacturas del Centro",
      contactoEmpresa: "Ing. Carmen López",
      telefonoEmpresa: "222-555-0123",
      direccionEmpresa: "Carretera Federal 150, Km 5, Huejotzingo, Pue.",
      nombreProyecto: "Optimización de Procesos Productivos",
      descripcionProyecto:
        "Análisis y mejora de los procesos de producción en la línea de ensamble.",
      fechaInicio: "2023-09-01",
      fechaFin: "2024-01-01",
      estado: "completada",
      fechaCreacion: "2023-08-20",
    },
    {
      id: 4,
      nombreEstudiante: "María Fernanda López",
      matricula: "3522110789",
      carrera: "Ing. en Mecatrónica",
      emailEstudiante: "maria.lopez@uth.edu.mx",
      nombreEmpresa: "Automatización Industrial del Sur",
      contactoEmpresa: "Ing. Jorge Ramírez",
      telefonoEmpresa: "222-456-7890",
      direccionEmpresa:
        "Parque Industrial Puebla 2000, San Pedro Cholula, Pue.",
      nombreProyecto: "Sistema de Control Automatizado",
      descripcionProyecto:
        "Implementación de sistema de control automatizado para línea de producción.",
      fechaInicio: "2024-03-01",
      fechaFin: "2024-07-01",
      estado: "activa",
      fechaCreacion: "2024-02-15",
    },
    {
      id: 5,
      nombreEstudiante: "Diego Alejandro Torres",
      matricula: "3522110923",
      carrera: "Lic. en Administración",
      emailEstudiante: "diego.torres@uth.edu.mx",
      nombreEmpresa: "Consultoría Empresarial Integral",
      contactoEmpresa: "Lic. Patricia Silva",
      telefonoEmpresa: "222-321-6547",
      direccionEmpresa: "Centro Comercial Plaza Dorada, Local 45, Puebla, Pue.",
      nombreProyecto: "Plan de Marketing Digital",
      descripcionProyecto:
        "Desarrollo e implementación de estrategia de marketing digital para PYMEs.",
      fechaInicio: "2024-01-20",
      fechaFin: "2024-05-20",
      estado: "pendiente",
      fechaCreacion: "2024-01-18",
    },
    {
      id: 6,
      nombreEstudiante: "Valentina Morales",
      matricula: "3522110156",
      carrera: "Ing. Desarrollo y Gestión de Software",
      emailEstudiante: "valentina.morales@uth.edu.mx",
      nombreEmpresa: "StartupTech Solutions",
      contactoEmpresa: "Ing. Carlos Mendoza",
      telefonoEmpresa: "222-789-0123",
      direccionEmpresa: "Calle 15 Norte 1203, Col. El Carmen, Puebla, Pue.",
      nombreProyecto: "Plataforma E-commerce",
      descripcionProyecto:
        "Desarrollo de plataforma de comercio electrónico para productos artesanales.",
      fechaInicio: "2023-11-01",
      fechaFin: "2024-03-01",
      estado: "completada",
      fechaCreacion: "2023-10-25",
    },
    {
      id: 7,
      nombreEstudiante: "Roberto Carlos Vega",
      matricula: "3522110347",
      carrera: "Ing. en Sistemas Computacionales",
      emailEstudiante: "roberto.vega@uth.edu.mx",
      nombreEmpresa: "Banco Regional del Centro",
      contactoEmpresa: "Lic. Ana Cristina Herrera",
      telefonoEmpresa: "222-654-3210",
      direccionEmpresa: "Av. Juárez 789, Col. Centro, Puebla, Pue.",
      nombreProyecto: "Sistema de Seguridad Bancaria",
      descripcionProyecto:
        "Implementación de sistema de detección de fraudes y seguridad informática.",
      fechaInicio: "2024-02-15",
      fechaFin: "2024-08-15",
      estado: "activa",
      fechaCreacion: "2024-02-10",
    },
    {
      id: 8,
      nombreEstudiante: "Sofía Alejandra Ruiz",
      matricula: "3522110567",
      carrera: "Ing. Industrial",
      emailEstudiante: "sofia.ruiz@uth.edu.mx",
      nombreEmpresa: "Textiles del Valle",
      contactoEmpresa: "Ing. Miguel Ángel Castro",
      telefonoEmpresa: "222-987-6543",
      direccionEmpresa: "Zona Industrial Atlixco, Bodega 12, Atlixco, Pue.",
      nombreProyecto: "Optimización de Cadena de Suministro",
      descripcionProyecto:
        "Rediseño y optimización de la cadena de suministro para reducir costos.",
      fechaInicio: "2024-01-10",
      fechaFin: "2024-05-10",
      estado: "cancelada",
      fechaCreacion: "2024-01-05",
    },
  ];
}

function openEstadiaModal(estadia = null) {
  const modalTitle = document.getElementById("modalTitle");
  const estadiaId = document.getElementById("estadiaId");

  if (estadia && typeof estadia === "object") {
    modalTitle.textContent = "Editar Estadía";
    estadiaId.value = estadia.id;
    fillForm(estadia);
  } else {
    modalTitle.textContent = "Nueva Estadía";
    estadiaId.value = "";
    estadiaForm.reset();
    // Llenar con datos de ejemplo para nueva estadía
    fillFormWithSampleData();
  }

  estadiaModal.classList.remove("hidden");
  estadiaModal.classList.add("fade-in");
}

function closeEstadiaModal() {
  estadiaModal.classList.add("hidden");
  estadiaForm.reset();
}

function fillForm(estadia) {
  document.getElementById("nombreEstudiante").value = estadia.nombreEstudiante;
  document.getElementById("matricula").value = estadia.matricula;
  document.getElementById("carrera").value = estadia.carrera;
  document.getElementById("emailEstudiante").value = estadia.emailEstudiante;
  document.getElementById("nombreEmpresa").value = estadia.nombreEmpresa;
  document.getElementById("contactoEmpresa").value = estadia.contactoEmpresa;
  document.getElementById("telefonoEmpresa").value = estadia.telefonoEmpresa;
  document.getElementById("direccionEmpresa").value = estadia.direccionEmpresa;
  document.getElementById("nombreProyecto").value = estadia.nombreProyecto;
  document.getElementById("descripcionProyecto").value =
    estadia.descripcionProyecto;
  document.getElementById("fechaInicio").value = estadia.fechaInicio;
  document.getElementById("fechaFin").value = estadia.fechaFin;
  document.getElementById("estado").value = estadia.estado;
}

function fillFormWithSampleData() {
  // Datos de ejemplo para nueva estadía
  const sampleData = {
    nombreEstudiante: "Nuevo Estudiante",
    matricula: "3522110000",
    carrera: "Ing. Desarrollo y Gestión de Software",
    emailEstudiante: "nuevo.estudiante@uth.edu.mx",
    nombreEmpresa: "Empresa Ejemplo S.A. de C.V.",
    contactoEmpresa: "Ing. Supervisor",
    telefonoEmpresa: "222-000-0000",
    direccionEmpresa: "Dirección de ejemplo, Puebla, Pue.",
    nombreProyecto: "Proyecto de Ejemplo",
    descripcionProyecto:
      "Descripción del proyecto de ejemplo para estadía profesional.",
    fechaInicio: new Date().toISOString().split("T")[0],
    fechaFin: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    estado: "pendiente",
  };

  fillForm(sampleData);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(estadiaForm);
  const estadiaId = document.getElementById("estadiaId").value;

  const estadiaData = {
    nombreEstudiante: document.getElementById("nombreEstudiante").value,
    matricula: document.getElementById("matricula").value,
    carrera: document.getElementById("carrera").value,
    emailEstudiante: document.getElementById("emailEstudiante").value,
    nombreEmpresa: document.getElementById("nombreEmpresa").value,
    contactoEmpresa: document.getElementById("contactoEmpresa").value,
    telefonoEmpresa: document.getElementById("telefonoEmpresa").value,
    direccionEmpresa: document.getElementById("direccionEmpresa").value,
    nombreProyecto: document.getElementById("nombreProyecto").value,
    descripcionProyecto: document.getElementById("descripcionProyecto").value,
    fechaInicio: document.getElementById("fechaInicio").value,
    fechaFin: document.getElementById("fechaFin").value,
    estado: document.getElementById("estado").value,
  };

  if (estadiaId) {
    // Editar estadía existente
    const index = estadias.findIndex((e) => e.id == estadiaId);
    if (index !== -1) {
      estadias[index] = { ...estadias[index], ...estadiaData };
      showNotification("Estadía actualizada correctamente", "success");
    }
  } else {
    // Crear nueva estadía
    const newEstadia = {
      id: Date.now(),
      ...estadiaData,
      fechaCreacion: new Date().toISOString().split("T")[0],
    };
    estadias.unshift(newEstadia);
    showNotification("Estadía creada correctamente", "success");
  }

  closeEstadiaModal();
  renderEstadias();
  updateStats();
}

function openDeleteModal(id) {
  currentEstadiaId = id;
  deleteModal.classList.remove("hidden");
}

function closeDeleteModal() {
  deleteModal.classList.add("hidden");
  currentEstadiaId = null;
}

function confirmDelete() {
  if (currentEstadiaId) {
    estadias = estadias.filter((e) => e.id !== currentEstadiaId);
    showNotification("Estadía eliminada correctamente", "success");
    closeDeleteModal();
    renderEstadias();
    updateStats();
  }
}

function openViewModal(id) {
  const estadia = estadias.find((e) => e.id === id);
  if (!estadia) return;

  const viewContent = document.getElementById("viewContent");
  viewContent.innerHTML = `
        <div class="view-content">
            <div class="view-section student">
                <h4 class="view-section-title">Información del Estudiante</h4>
                <div class="view-field">
                    <span class="view-label">Nombre:</span>
                    <span class="view-value">${estadia.nombreEstudiante}</span>
                </div>
                <div class="view-field">
                    <span class="view-label">Matrícula:</span>
                    <span class="view-value">${estadia.matricula}</span>
                </div>
                <div class="view-field">
                    <span class="view-label">Carrera:</span>
                    <span class="view-value">${estadia.carrera}</span>
                </div>
                <div class="view-field">
                    <span class="view-label">Email:</span>
                    <span class="view-value">${estadia.emailEstudiante}</span>
                </div>
            </div>
            
            <div class="view-section company">
                <h4 class="view-section-title">Información de la Empresa</h4>
                <div class="view-field">
                    <span class="view-label">Empresa:</span>
                    <span class="view-value">${estadia.nombreEmpresa}</span>
                </div>
                <div class="view-field">
                    <span class="view-label">Contacto:</span>
                    <span class="view-value">${
                      estadia.contactoEmpresa || "No especificado"
                    }</span>
                </div>
                <div class="view-field">
                    <span class="view-label">Teléfono:</span>
                    <span class="view-value">${
                      estadia.telefonoEmpresa || "No especificado"
                    }</span>
                </div>
                <div class="view-field">
                    <span class="view-label">Dirección:</span>
                    <span class="view-value">${
                      estadia.direccionEmpresa || "No especificada"
                    }</span>
                </div>
            </div>
            
            <div class="view-section project">
                <h4 class="view-section-title">Información del Proyecto</h4>
                <div class="view-field">
                    <span class="view-label">Proyecto:</span>
                    <span class="view-value">${estadia.nombreProyecto}</span>
                </div>
                <div class="view-field">
                    <span class="view-label">Descripción:</span>
                    <span class="view-value">${
                      estadia.descripcionProyecto || "No especificada"
                    }</span>
                </div>
            </div>
            
            <div class="view-section dates">
                <h4 class="view-section-title">Fechas y Estado</h4>
                <div class="view-field">
                    <span class="view-label">Fecha de Inicio:</span>
                    <span class="view-value">${formatDate(
                      estadia.fechaInicio
                    )}</span>
                </div>
                <div class="view-field">
                    <span class="view-label">Fecha de Fin:</span>
                    <span class="view-value">${formatDate(
                      estadia.fechaFin
                    )}</span>
                </div>
                <div class="view-field">
                    <span class="view-label">Estado:</span>
                    <span class="view-value">${getStatusBadge(
                      estadia.estado
                    )}</span>
                </div>
                <div class="view-field">
                    <span class="view-label">Duración:</span>
                    <span class="view-value">${calculateDuration(
                      estadia.fechaInicio,
                      estadia.fechaFin
                    )} días</span>
                </div>
            </div>
        </div>
    `;

  viewModal.classList.remove("hidden");
}

function closeViewModal() {
  viewModal.classList.add("hidden");
}

function renderEstadias() {
  const estadiasToRender =
    filteredEstadias.length > 0 ? filteredEstadias : estadias;

  if (estadiasToRender.length === 0) {
    estadiasTableBody.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  estadiasTableBody.innerHTML = estadiasToRender
    .map(
      (estadia) => `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        ${estadia.nombreEstudiante
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">${
                          estadia.nombreEstudiante
                        }</div>
                        <div class="text-sm text-gray-500">${
                          estadia.matricula
                        }</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${
                  estadia.nombreEmpresa
                }</div>
                <div class="text-sm text-gray-500">${
                  estadia.contactoEmpresa || "Sin contacto"
                }</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate" title="${
                  estadia.nombreProyecto
                }">
                    ${estadia.nombreProyecto}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>${formatDate(estadia.fechaInicio)}</div>
                <div>${formatDate(estadia.fechaFin)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                ${getStatusBadge(estadia.estado)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="action-buttons">
                    <button onclick="openViewModal(${estadia.id})" 
                            class="action-button view" 
                            title="Ver detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="openEstadiaModal(${JSON.stringify(
                      estadia
                    ).replace(/"/g, "&quot;")})" 
                            class="action-button edit" 
                            title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="openDeleteModal(${estadia.id})" 
                            class="action-button delete" 
                            title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `
    )
    .join("");
}

function updateStats() {
  const total = estadias.length;
  const activas = estadias.filter((e) => e.estado === "activa").length;
  const pendientes = estadias.filter((e) => e.estado === "pendiente").length;
  const completadas = estadias.filter((e) => e.estado === "completada").length;

  document.getElementById("totalEstadias").textContent = total;
  document.getElementById("estadiasActivas").textContent = activas;
  document.getElementById("estadiasPendientes").textContent = pendientes;
  document.getElementById("estadiasCompletadas").textContent = completadas;
}

function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  filteredEstadias = estadias.filter(
    (estadia) =>
      estadia.nombreEstudiante.toLowerCase().includes(searchTerm) ||
      estadia.nombreEmpresa.toLowerCase().includes(searchTerm) ||
      estadia.nombreProyecto.toLowerCase().includes(searchTerm) ||
      estadia.matricula.toLowerCase().includes(searchTerm)
  );
  renderEstadias();
}

function handleFilter() {
  const status = statusFilter.value;
  if (status) {
    filteredEstadias = estadias.filter((estadia) => estadia.estado === status);
  } else {
    filteredEstadias = [];
  }
  renderEstadias();
}

function getStatusBadge(status) {
  const statusConfig = {
    pendiente: {
      class: "bg-yellow-100 text-yellow-800",
      text: "Pendiente",
      icon: "fas fa-clock",
    },
    activa: {
      class: "bg-green-100 text-green-800",
      text: "Activa",
      icon: "fas fa-play-circle",
    },
    completada: {
      class: "bg-blue-100 text-blue-800",
      text: "Completada",
      icon: "fas fa-check-circle",
    },
    cancelada: {
      class: "bg-red-100 text-red-800",
      text: "Cancelada",
      icon: "fas fa-times-circle",
    },
  };

  const config = statusConfig[status] || statusConfig.pendiente;
  return `
        <span class="status-badge px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.class}">
            <i class="${config.icon} mr-1"></i>
            ${config.text}
        </span>
    `;
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("es-ES", options);
}

function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function showNotification(message, type = "info") {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  const notification = document.createElement("div");
  notification.className = `notification ${colors[type]}`;
  notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;

  document.body.appendChild(notification);

  // Mostrar notificación
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Ocultar notificación
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Hacer funciones globales para los event handlers inline
window.openEstadiaModal = openEstadiaModal;
window.openDeleteModal = openDeleteModal;
window.openViewModal = openViewModal;
