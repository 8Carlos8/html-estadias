//const apiUrl = "http://127.0.0.1:8000";
//const token = localStorage.getItem('token');

if (!token) {
    alert("No hay token almacenado");
    window.location.href = "../login-uth.html";
} else {
    fetch(apiUrl + "/api/usuarios/contarAlumnos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.total_alumnos !== undefined) {
            // Asegúrate de tener este ID en tu HTML
            document.getElementById("total-alumnos").textContent = data.total_alumnos;
        } else {
            alert("No se pudo obtener el número de estudiantes activos.");
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error inesperado. Intenta más tarde.");
    });
}