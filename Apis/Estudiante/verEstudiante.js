//const apiUrl = "http://127.0.0.1:8000";
//const token = localStorage.getItem('token');
//const idU = localStorage.getItem('idU');

if (!token) {
    alert("No hay token almacenado");
    window.location.href = "../login-uth.html";
} else {
    fetch(apiUrl + "/api/usuarios/por-id", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, id: idU }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor:", data); // 👈 importante para ver qué llega

        if (data.usuario) {
            const usuario = data.usuario;

            const nombreCompleto = `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`;
            document.getElementById("userName").textContent = nombreCompleto;

            if (document.getElementById("userEmail")) {
                document.getElementById("userEmail").textContent = usuario.correo;
            }

            if (document.getElementById("userPhone")) {
                document.getElementById("userPhone").textContent = usuario.telefono;
            }

            if (usuario.foto_url) {
                document.querySelector("#userProfile img").src = usuario.foto_url;
            }
        } else {
            alert("No se pudo obtener la información del usuario.");
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error inesperado. Intenta más tarde.");
    });
}
