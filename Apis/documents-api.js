// API para gestión de documentos
class DocumentsAPI {
    constructor() {
        this.token = getAuthToken();
    }

    // Cartas de Presentación
    async createCartaPresentacion(data) {
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('estadia_id', data.estadia_id);
        formData.append('fecha_emision', data.fecha_emision);
        formData.append('ruta_documento', data.file);

        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_PRESENTACION.REGISTER, {
            method: 'POST',
            body: formData
        });
    }

    async updateCartaPresentacion(id, data) {
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('id', id);
        
        if (data.estadia_id) formData.append('estadia_id', data.estadia_id);
        if (data.fecha_emision) formData.append('fecha_emision', data.fecha_emision);
        if (data.file) formData.append('ruta_documento', data.file);

        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_PRESENTACION.UPDATE, {
            method: 'POST',
            body: formData
        });
    }

    async deleteCartaPresentacion(id) {
        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_PRESENTACION.DELETE, {
            method: 'POST',
            body: JSON.stringify({ token: this.token, id })
        });
    }

    async getCartasPresentacion() {
        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_PRESENTACION.LIST, {
            method: 'POST',
            body: JSON.stringify({ token: this.token })
        });
    }

    async signCartaPresentacion(id, file = null) {
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('id', id);
        if (file) formData.append('ruta_documento', file);

        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_PRESENTACION.SIGN, {
            method: 'POST',
            body: formData
        });
    }

    // Cartas de Aceptación
    async createCartaAceptacion(data) {
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('estadia_id', data.estadia_id);
        formData.append('fecha_recepcion', data.fecha_recepcion);
        formData.append('documento', data.file);
        if (data.observaciones) formData.append('observaciones', data.observaciones);

        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_ACEPTACION.REGISTER, {
            method: 'POST',
            body: formData
        });
    }

    async updateCartaAceptacion(id, data) {
        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_ACEPTACION.UPDATE, {
            method: 'POST',
            body: JSON.stringify({
                token: this.token,
                id,
                ...data
            })
        });
    }

    async deleteCartaAceptacion(id) {
        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_ACEPTACION.DELETE, {
            method: 'POST',
            body: JSON.stringify({ token: this.token, id })
        });
    }

    async getCartasAceptacion() {
        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_ACEPTACION.LIST, {
            method: 'POST',
            body: JSON.stringify({ token: this.token })
        });
    }

    // Cartas de Terminación
    async createCartaTerminacion(data) {
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('estadia_id', data.estadia_id);
        formData.append('fecha_subida', data.fecha_subida);
        formData.append('documento', data.file);

        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_TERMINACION.REGISTER, {
            method: 'POST',
            body: formData
        });
    }

    async updateCartaTerminacion(id, data) {
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('id', id);
        
        if (data.estadia_id) formData.append('estadia_id', data.estadia_id);
        if (data.fecha_subida) formData.append('fecha_subida', data.fecha_subida);
        if (data.file) formData.append('documento', data.file);

        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_TERMINACION.UPDATE, {
            method: 'POST',
            body: formData
        });
    }

    async deleteCartaTerminacion(id) {
        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_TERMINACION.DELETE, {
            method: 'POST',
            body: JSON.stringify({ token: this.token, id })
        });
    }

    async getCartasTerminacion() {
        return await apiRequest(API_CONFIG.ENDPOINTS.CARTAS_TERMINACION.LIST, {
            method: 'POST',
            body: JSON.stringify({ token: this.token })
        });
    }

    // Documentos Extra
    async createDocumentoExtra(data) {
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('estadia_id', data.estadia_id);
        formData.append('nombre', data.nombre);
        formData.append('ruta', data.file);
        formData.append('fecha_subida', data.fecha_subida);

        return await apiRequest(API_CONFIG.ENDPOINTS.DOCUMENTOS_EXTRA.REGISTER, {
            method: 'POST',
            body: formData
        });
    }

    async updateDocumentoExtra(id, data) {
        const formData = new FormData();
        formData.append('token', this.token);
        formData.append('id', id);
        
        if (data.nombre) formData.append('nombre', data.nombre);
        if (data.fecha_subida) formData.append('fecha_subida', data.fecha_subida);
        if (data.file) formData.append('ruta', data.file);

        return await apiRequest(API_CONFIG.ENDPOINTS.DOCUMENTOS_EXTRA.UPDATE, {
            method: 'POST',
            body: formData
        });
    }

    async deleteDocumentoExtra(id) {
        return await apiRequest(API_CONFIG.ENDPOINTS.DOCUMENTOS_EXTRA.DELETE, {
            method: 'POST',
            body: JSON.stringify({ token: this.token, id })
        });
    }

    async getDocumentosExtra() {
        return await apiRequest(API_CONFIG.ENDPOINTS.DOCUMENTOS_EXTRA.LIST, {
            method: 'POST',
            body: JSON.stringify({ token: this.token })
        });
    }

    // Método para obtener todos los documentos
    async getAllDocuments() {
        try {
            const [cartasPres, cartasAcep, cartasTer, docsExtra] = await Promise.all([
                this.getCartasPresentacion(),
                this.getCartasAceptacion(),
                this.getCartasTerminacion(),
                this.getDocumentosExtra()
            ]);

            return {
                cartasPresentacion: cartasPres.cartasPres || [],
                cartasAceptacion: cartasAcep.cartas_aceptacion || [],
                cartasTerminacion: cartasTer.cartasTer || [],
                documentosExtra: docsExtra.docExtras || []
            };
        } catch (error) {
            console.error('Error fetching all documents:', error);
            throw error;
        }
    }

    // Método para obtener estadísticas
    async getDocumentStats() {
        try {
            const documents = await this.getAllDocuments();
            
            const totalDocs = 
                documents.cartasPresentacion.length +
                documents.cartasAceptacion.length +
                documents.cartasTerminacion.length +
                documents.documentosExtra.length;

            // Simular estados para las estadísticas
            const pendientes = Math.floor(totalDocs * 0.3);
            const aprobados = Math.floor(totalDocs * 0.6);
            const rechazados = totalDocs - pendientes - aprobados;

            return {
                total: totalDocs,
                pendientes,
                aprobados,
                rechazados
            };
        } catch (error) {
            console.error('Error fetching document stats:', error);
            return { total: 0, pendientes: 0, aprobados: 0, rechazados: 0 };
        }
    }
}

// Exportar para uso global
window.DocumentsAPI = DocumentsAPI;