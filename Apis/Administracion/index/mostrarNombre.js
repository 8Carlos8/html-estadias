const apiUrl = "http://127.0.0.1:8000";
const token = localStorage.getItem('token');
const idU = localStorage.getItem('idU');

if (!token) {
    alert("No hay token almacenado");
    window.location.href = ""; // Redirige al login
} else {
    fetch(apiUrl + "/api/usuarios/por-id", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: Number(idU) }) // Solo envía el id como número
    })
    .then(response => response.json())
    .then(data => {
        if (data.usuario !== undefined) {
            // Pinta el nombre completo y el rol en los elementos correctos
            document.getElementById("nombre-usuario").textContent = `${data.usuario.nombre} ${data.usuario.apellido_paterno} ${data.usuario.apellido_materno}`;
            document.getElementById("rol-usuario").textContent = data.usuario.tipo_usuario.charAt(0).toUpperCase() + data.usuario.tipo_usuario.slice(1);
        } else {
            alert("Error: " + (data.mensaje || "No se pudo obtener la información del usuario"));
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error inesperado. Intenta más tarde.");
    });
}
