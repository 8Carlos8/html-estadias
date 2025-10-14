//const apiUrl = "http://127.0.0.1:8000"; // URL base de la API
//const token = localStorage.getItem('token');

if (!token) {
    alert("No hay token almacenado");
    // Puedes poner una URL aquí para redirigir al login
    window.location.href = "/login.html"; 
} else {
    fetch(apiUrl + "/api/empresa/contarEmpresas", {
        method: "POST", // Método HTTP POST
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Es la forma estándar de enviar el token
        },
        body: JSON.stringify({ token: token }), // Enviamos el token en el cuerpo
    })
    .then(response => {
        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Asumiendo que la API devuelve 'total_empresas' y no 'total_estadias'
        if (data.total_empresas !== undefined) {
            // **¡Aquí está la corrección!** Se elimina el espacio después del ID
            document.getElementById("contarEmpresas").textContent = data.total_empresas;
        } else {
            alert("Error: " + (data.mensaje || "Error al obtener el conteo de empresas"));
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error inesperado. Intenta más tarde.");
    });
}