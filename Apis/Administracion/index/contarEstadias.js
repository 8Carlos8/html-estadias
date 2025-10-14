
/*Solicitudes de estadias */
const apiUrl = "http://127.0.0.1:8000"; // URL base de la API
const token = localStorage.getItem('token');// Obtener el token almacenado en el navegador (localStorage)

// Verificar si el token existe
    if(!token){
        alert("No hay token almacenado ");// Avisar al usuario que no hay token
        window.location.href ="";// Redirigir a la página de inicio o login (aquí está vacío, puedes poner la URL)
    } else {
        // Si hay token, hacer una solicitud POST a la API para contar las estadías
        fetch(apiUrl + "/api/estadia/contarEstadias", {
            method: "POST",// Método HTTP POST
            headers: {
                "Content-Type": "application/json",// Indicamos que el cuerpo es JSON
            },
            body: JSON.stringify({ token }),// Enviamos el token como JSON en el cuerpo de la petición
        })
        .then(response => response.json())// Convertir la respuesta a JSON
        .then(data => {
            // Verificar que la respuesta contenga la propiedad 'total_estadias'
            if (data.total_estadias !== undefined) {
                // Mostrar el total de estadías en el elemento con id "total-estadias", en el html
                document.getElementById("total-estadias").textContent = data.total_estadias;
            } else {
                // Si no está la propiedad, mostrar un mensaje de error
                alert("Error: " + (data.mensaje || "Error al obtener las estadías"));
            }
        })
        .catch(error => {
            // Capturar y mostrar cualquier error ocurrido durante la solicitud
            console.error("Error en la solicitud:", error);
            alert("Ocurrió un error inesperado. Intenta más tarde.");
        });
    }
    
 