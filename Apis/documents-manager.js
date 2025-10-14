// Gestor principal de documentos
class DocumentsManager {
    constructor() {
        this.api = new DocumentsAPI();
        this.currentFilter = 'all';
        this.documents = [];
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.setupEventListeners();
        await this.loadDocuments();
        await this.updateStats();
    }

    checkAuth() {
        const token = getAuthToken();
        if (!token) {
            window.location.href = '../src/login-uth.html';
            return;
        }
    }

    setupEventListeners() {
        // Botones de filtro
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleFilterChange(e));
        });

        // Botón de exportar
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportDocuments());

        // Botón de filtros avanzados
        document.getElementById('filtersBtn')?.addEventListener('click', () => this.showAdvancedFilters());

        // Botones de acción en la tabla
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const id = e.target.closest('.view-btn').dataset.id;
                const type = e.target.closest('.view-btn').dataset.type;
                this.viewDocument(id, type);
            }
            
            if (e.target.closest('.download-btn')) {
                const id = e.target.closest('.download-btn').dataset.id;
                const type = e.target.closest('.download-btn').dataset.type;
                this.downloadDocument(id, type);
            }
            
            if (e.target.closest('.approve-btn')) {
                const id = e.target.closest('.approve-btn').dataset.id;
                const type = e.target.closest('.approve-btn').dataset.type;
                this.approveDocument(id, type);
            }
            
            if (e.target.closest('.reject-btn')) {
                const id = e.target.closest('.reject-btn').dataset.id;
                const type = e.target.closest('.reject-btn').dataset.type;
                this.rejectDocument(id, type);
            }
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            document.getElementById('logoutModal').classList.remove('hidden');
        });

        document.getElementById('confirmLogout')?.addEventListener('click', async () => {
            await this.logout();
        });

        document.getElementById('cancelLogout')?.addEventListener('click', () => {
            document.getElementById('logoutModal').classList.add('hidden');
        });

        // Notificaciones
        document.getElementById('notificationsBtn')?.addEventListener('click', () => {
            document.getElementById('notificationsDropdown').classList.toggle('hidden');
        });

        document.getElementById('closeNotifications')?.addEventListener('click', () => {
            document.getElementById('notificationsDropdown').classList.add('hidden');
        });

        // Sidebar
        document.getElementById('menuToggle')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('sidebar-open');
        });

        document.getElementById('closeSidebarBtn')?.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('sidebar-open');
        });
    }

    async loadDocuments() {
        try {
            this.showLoading(true);
            const allDocuments = await this.api.getAllDocuments();
            this.documents = this.formatDocuments(allDocuments);
            this.renderDocuments();
        } catch (error) {
            console.error('Error loading documents:', error);
            this.showError('Error al cargar los documentos');
        } finally {
            this.showLoading(false);
        }
    }

    formatDocuments(allDocuments) {
        const formatted = [];

        // Cartas de Presentación
        allDocuments.cartasPresentacion.forEach(doc => {
            formatted.push({
                id: doc.id,
                type: 'carta_presentacion',
                typeName: 'Carta Presentación',
                fileName: this.getFileNameFromPath(doc.ruta_documento),
                studentName: 'Estudiante', // Esto debería venir de la relación
                studentId: doc.estadia_id,
                status: doc.firmada_director ? 'aprobado' : 'pendiente',
                date: doc.fecha_emision,
                url: doc.url_documento,
                size: '2.1 MB', // Simulated
                ...doc
            });
        });

        // Cartas de Aceptación
        allDocuments.cartasAceptacion.forEach(doc => {
            formatted.push({
                id: doc.id,
                type: 'carta_aceptacion',
                typeName: 'Carta Aceptación',
                fileName: this.getFileNameFromPath(doc.ruta_documento),
                studentName: 'Estudiante',
                studentId: doc.estadia_id,
                status: 'pendiente',
                date: doc.fecha_recepcion,
                size: '1.8 MB',
                ...doc
            });
        });

        // Cartas de Terminación
        allDocuments.cartasTerminacion.forEach(doc => {
            formatted.push({
                id: doc.id,
                type: 'carta_terminacion',
                typeName: 'Carta Terminación',
                fileName: this.getFileNameFromPath(doc.documento),
                studentName: 'Estudiante',
                studentId: doc.estadia_id,
                status: 'aprobado',
                date: doc.fecha_subida,
                size: '2.5 MB',
                ...doc
            });
        });

        // Documentos Extra
        allDocuments.documentosExtra.forEach(doc => {
            formatted.push({
                id: doc.id,
                type: 'documento_extra',
                typeName: doc.nombre,
                fileName: this.getFileNameFromPath(doc.ruta),
                studentName: 'Estudiante',
                studentId: doc.estadia_id,
                status: 'pendiente',
                date: doc.fecha_subida,
                size: '1.5 MB',
                ...doc
            });
        });

        return formatted;
    }

    getFileNameFromPath(path) {
        if (!path) return 'Documento';
        return path.split('/').pop() || 'Documento';
    }

    renderDocuments() {
        const tbody = document.querySelector('#documentsTableBody');
        if (!tbody) return;

        const filteredDocs = this.filterDocuments();
        
        if (filteredDocs.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                        <i class="fas fa-folder-open text-4xl text-gray-300 mb-2"></i>
                        <p>No se encontraron documentos</p>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredDocs.map(doc => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                            <img src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop" 
                                 alt="${doc.studentName}" class="w-full h-full object-cover">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${doc.studentName}</div>
                            <div class="text-sm text-gray-500">ID: ${doc.studentId}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${doc.fileName}</div>
                    <div class="text-sm text-gray-500">${doc.size}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${this.getTypeColor(doc.type)}">
                        ${doc.typeName}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${this.getStatusColor(doc.status)}">
                        ${this.getStatusText(doc.status)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.formatDate(doc.date)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button class="text-green-600 hover:text-green-900 mr-3 view-btn" 
                            data-id="${doc.id}" data-type="${doc.type}" title="Ver">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="text-blue-600 hover:text-blue-900 mr-3 download-btn" 
                            data-id="${doc.id}" data-type="${doc.type}" title="Descargar">
                        <i class="fas fa-download"></i>
                    </button>
                    ${doc.status === 'pendiente' ? `
                        <button class="text-green-600 hover:text-green-900 mr-3 approve-btn" 
                                data-id="${doc.id}" data-type="${doc.type}" title="Aprobar">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-900 reject-btn" 
                                data-id="${doc.id}" data-type="${doc.type}" title="Rechazar">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    filterDocuments() {
        if (this.currentFilter === 'all') {
            return this.documents;
        }
        return this.documents.filter(doc => doc.status === this.currentFilter);
    }

    getTypeColor(type) {
        const colors = {
            carta_presentacion: 'bg-blue-100 text-blue-800',
            carta_aceptacion: 'bg-green-100 text-green-800',
            carta_terminacion: 'bg-purple-100 text-purple-800',
            documento_extra: 'bg-yellow-100 text-yellow-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    }

    getStatusColor(status) {
        const colors = {
            pendiente: 'bg-yellow-100 text-yellow-800',
            aprobado: 'bg-green-100 text-green-800',
            rechazado: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    getStatusText(status) {
        const texts = {
            pendiente: 'Pendiente',
            aprobado: 'Aprobado',
            rechazado: 'Rechazado'
        };
        return texts[status] || 'Desconocido';
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    handleFilterChange(e) {
        e.preventDefault();
        
        // Remover clase activa de todos los tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('border-green-500', 'text-green-600');
            tab.classList.add('border-transparent', 'text-gray-500');
        });

        // Agregar clase activa al tab seleccionado
        e.target.classList.remove('border-transparent', 'text-gray-500');
        e.target.classList.add('border-green-500', 'text-green-600');

        // Actualizar filtro
        this.currentFilter = e.target.dataset.filter;
        this.renderDocuments();
    }

    async updateStats() {
        try {
            const stats = await this.api.getDocumentStats();
            
            document.querySelector('#totalDocs').textContent = stats.total;
            document.querySelector('#pendingDocs').textContent = stats.pendientes;
            document.querySelector('#approvedDocs').textContent = stats.aprobados;
            document.querySelector('#rejectedDocs').textContent = stats.rechazados;
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    async viewDocument(id, type) {
        try {
            const doc = this.documents.find(d => d.id == id && d.type === type);
            if (doc && doc.url) {
                window.open(doc.url, '_blank');
            } else {
                this.showError('No se pudo abrir el documento');
            }
        } catch (error) {
            console.error('Error viewing document:', error);
            this.showError('Error al abrir el documento');
        }
    }

    async downloadDocument(id, type) {
        try {
            const doc = this.documents.find(d => d.id == id && d.type === type);
            if (doc && doc.url) {
                const link = document.createElement('a');
                link.href = doc.url;
                link.download = doc.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                this.showError('No se pudo descargar el documento');
            }
        } catch (error) {
            console.error('Error downloading document:', error);
            this.showError('Error al descargar el documento');
        }
    }

    async approveDocument(id, type) {
        try {
            if (type === 'carta_presentacion') {
                await this.api.signCartaPresentacion(id);
                this.showSuccess('Documento aprobado correctamente');
                await this.loadDocuments();
                await this.updateStats();
            } else {
                this.showInfo('Funcionalidad de aprobación en desarrollo para este tipo de documento');
            }
        } catch (error) {
            console.error('Error approving document:', error);
            this.showError('Error al aprobar el documento');
        }
    }

    async rejectDocument(id, type) {
        if (confirm('¿Está seguro de que desea rechazar este documento?')) {
            try {
                // Aquí implementarías la lógica de rechazo según el tipo
                this.showInfo('Funcionalidad de rechazo en desarrollo');
            } catch (error) {
                console.error('Error rejecting document:', error);
                this.showError('Error al rechazar el documento');
            }
        }
    }

    exportDocuments() {
        try {
            const csvContent = this.generateCSV();
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `documentos_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showSuccess('Documentos exportados correctamente');
        } catch (error) {
            console.error('Error exporting documents:', error);
            this.showError('Error al exportar los documentos');
        }
    }

    generateCSV() {
        const headers = ['ID', 'Estudiante', 'Documento', 'Tipo', 'Estado', 'Fecha'];
        const rows = this.documents.map(doc => [
            doc.id,
            doc.studentName,
            doc.fileName,
            doc.typeName,
            this.getStatusText(doc.status),
            this.formatDate(doc.date)
        ]);

        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }

    showAdvancedFilters() {
        this.showInfo('Filtros avanzados en desarrollo');
    }

    async logout() {
        try {
            await apiRequest(API_CONFIG.ENDPOINTS.LOGOUT, {
                method: 'POST',
                body: JSON.stringify({ token: getAuthToken() })
            });
            
            localStorage.removeItem('authToken');
            window.location.href = '../src/login-uth.html';
        } catch (error) {
            console.error('Error during logout:', error);
            // Aún así, limpiar el token local
            localStorage.removeItem('authToken');
            window.location.href = '../src/login-uth.html';
        }
    }

    showLoading(show) {
        const tbody = document.querySelector('#documentsTableBody');
        if (!tbody) return;

        if (show) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center">
                        <div class="flex items-center justify-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <span class="ml-2 text-gray-600">Cargando documentos...</span>
                        </div>
                    </td>
                </tr>
            `;
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Mostrar
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new DocumentsManager();
});