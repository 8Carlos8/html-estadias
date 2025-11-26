const apiUrl = "https://sis-estadias.companytechnova.tech"; // URL base de la API
document.addEventListener('DOMContentLoaded', function() {
    // Crear cuadrícula de fondo interactiva
    const bgAnimation = document.getElementById('bgAnimation');
    const squares = 20 * 20;
    for (let i = 0; i < squares; i++) {
        const square = document.createElement('div');
        square.classList.add('bg-square');
        bgAnimation.appendChild(square);
        square.addEventListener('mouseover', () => {
            square.style.transition = '0s';
            square.style.backgroundColor = 'rgba(0, 143, 57, 0.8)';
        });
        square.addEventListener('mouseout', () => {
            square.style.transition = '2s ease';
            square.style.backgroundColor = 'rgba(0, 20, 5, 0.1)';
        });
    }
    const loginForm = document.getElementById('loginForm');
    const btn = document.querySelector('.btn');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const correo = document.getElementById('correo').value.trim();
        const password = document.getElementById('password').value.trim();
        if (!correo || !password) {
            alert('Por favor, complete todos los campos');
            return;
        }
        btn.textContent = 'Verificando...';
        btn.disabled = true;
        fetch(apiUrl + "/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json", //Aquí se envia el token
            },
            body: JSON.stringify({ correo, password }),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.usuario && data.usuario.token) {
                localStorage.setItem("token", data.usuario.token);
                localStorage.setItem("idU", data.usuario.id);
                localStorage.setItem("tipo_usuario", data.usuario.tipo_usuario);
                localStorage.setItem("nombre", data.usuario.nombre);

                createConfetti();
                btn.textContent = 'Acceso concedido ✓';
                btn.style.background = 'linear-gradient(135deg, #00c853, #008f39)';

                setTimeout(() => {
                    const tipo_usuario = data.usuario.tipo_usuario;
                    if (tipo_usuario === "docente") {
                        window.location.href = "../docente-asignaciones.html";
                    } else if (tipo_usuario === "director") {
                        window.location.href = "../administracion/index.html";
                    } else {
                        window.location.href = "../estudiantes/index.html";
                    }
                }, 1500);
            } else {
                alert("Error: " + (data.mensaje || 'Credenciales inválidas'));
                btn.textContent = 'Ingresar';
                btn.disabled = false;
            }
        })
        .catch((error) => {
            console.error("Error al realizar la solicitud:", error);
            alert("Ocurrió un error inesperado. Intenta nuevamente más tarde.");
            btn.textContent = 'Ingresar';
            btn.disabled = false;
        });
    });

    function createConfetti() {
        const colors = ['#008f39', '#006b2b', '#004d20', '#ffffff'];
        const container = document.querySelector('.login-container');
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;

            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}%`;
            confetti.style.bottom = '0';
            confetti.style.opacity = '1';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.animation = `confettiFall ${animationDuration}s ease-in ${delay}s forwards`;

            const keyframes = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(-200px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            const style = document.createElement('style');
            style.innerHTML = keyframes;
            document.head.appendChild(style);

            container.appendChild(confetti);
            setTimeout(() => { confetti.remove(); style.remove(); }, (animationDuration + delay) * 1000);
        }
    }

    // Efecto 3D al mover el mouse
    const loginContainer = document.querySelector('.login-container');
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        loginContainer.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    loginContainer.addEventListener('mouseleave', () => {
        loginContainer.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
});
