// Manejo de autenticación
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.init();
    }

    init() {
        // Verificar si estamos en la página de login
        if (window.location.pathname.includes('login')) {
            this.setupLoginForm();
        } else {
            this.checkAuth();
        }
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const correo = document.getElementById('correo').value;
        const password = document.getElementById('password').value;

        if (!correo || !password) {
            this.showError('Por favor, complete todos los campos');
            return;
        }

        try {
            this.showLoading(true);
            
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    correo: correo,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.usuario || {}));
                
                // Redirigir según el tipo de usuario
                if (data.usuario && data.usuario.tipo === 'docente') {
                    window.location.href = '../public/inicio.html';
                } else {
                    window.location.href = '../public/index.html';
                }
            } else {
                this.showError(data.message || 'Credenciales inválidas');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Error de conexión. Intente nuevamente.');
        } finally {
            this.showLoading(false);
        }
    }

    checkAuth() {
        if (!this.token) {
            window.location.href = '../src/login-uth.html';
            return false;
        }
        return true;
    }

    async logout() {
        try {
            if (this.token) {
                await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ token: this.token })
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = '../src/login-uth.html';
        }
    }

    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    showLoading(show) {
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            if (show) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Iniciando sesión...';
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Ingresar';
            }
        }
    }

    showError(message) {
        // Crear o actualizar mensaje de error
        let errorDiv = document.getElementById('loginError');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'loginError';
            errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
            
            const form = document.getElementById('loginForm');
            if (form) {
                form.insertBefore(errorDiv, form.firstChild);
            }
        }
        
        errorDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            if (errorDiv) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

// Exportar para uso global
window.AuthManager = AuthManager;