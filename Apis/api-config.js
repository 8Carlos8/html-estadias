// Configuración de la API
const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:8000/api/',
    ENDPOINTS: {
        // Autenticación
        LOGIN: '/usuarios/login',
        LOGOUT: '/usuarios/logout',
        
        // Cartas de Presentación
        CARTAS_PRESENTACION: {
            REGISTER: '/cartasPres/register',
            UPDATE: '/cartasPres/update',
            DELETE: '/cartasPres/delete',
            LIST: '/cartasPres/listaCartasPres',
            VIEW: '/cartasPres/verCartaPres',
            SIGN: '/cartasPres/firmaCartaPres',
            DOWNLOAD: '/cartasPres/descargarCartaPres',
            COUNT: '/cartasPres/contarCartasPres'
        },
        
        // Cartas de Aceptación
        CARTAS_ACEPTACION: {
            REGISTER: '/cartaAceptacion/registrarCartaAceptacion',
            UPDATE: '/cartaAceptacion/update',
            DELETE: '/cartaAceptacion/destroy',
            LIST: '/cartaAceptacion/listarTodas',
            VIEW: '/cartaAceptacion/obtenerCartaAceptacionPorEstadia',
            COUNT: '/cartaAceptacion/contarCartasAcep'
        },
        
        // Cartas de Terminación
        CARTAS_TERMINACION: {
            REGISTER: '/cartas/registar',
            UPDATE: '/cartas/actualizar',
            DELETE: '/cartas/eliminar',
            LIST: '/cartas/listar',
            VIEW: '/cartas/por-estadia',

        },
        
        // Documentos Extra
        DOCUMENTOS_EXTRA: {
            REGISTER: '/docExtra/register',
            UPDATE: '/docExtra/update',
            DELETE: '/docExtra/delete',
            LIST: '/doc/listaDocExtra',
            VIEW: '/doc/verDocExtra'
        }
    }
};

// Función para obtener el token del localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Función para hacer peticiones HTTP
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    
    const defaultOptions = {
        headers: {
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    };

    // Si no es FormData, agregar Content-Type
    if (!(options.body instanceof FormData)) {
        defaultOptions.headers['Content-Type'] = 'application/json';
    }

    const config = {
        ...defaultOptions,
        ...options
    };

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Exportar para uso global
window.API_CONFIG = API_CONFIG;
window.apiRequest = apiRequest;
window.getAuthToken = getAuthToken;