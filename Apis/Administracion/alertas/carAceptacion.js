//const apiUrl = "http://127.0.0.1:8000"; // URL base de la API
//const token = localStorage.getItem('token');// Obtener el token almacenado en el navegador (localStorage)

// Verificar si el token existe
if(!token){
    alert("No hay token almacenado ");// Avisar al usuario que no hay token
    window.location.href ="";// Redirigir a la página de inicio o login (aquí está vacío, puedes poner la URL)
} else {
    // Si hay token, hacer una solicitud POST a la API para contar las estadías
    fetch(apiUrl + "/api/cartas/contarCartasAcep", {
        method: "POST",// Método HTTP POST
        headers: {
            "Content-Type": "application/json",// Indicamos que el cuerpo es JSON
        },
        body: JSON.stringify({ token }),// Enviamos el token como JSON en el cuerpo de la petición
    })
    .then(response => response.json())// Convertir la respuesta a JSON
    .then(data => {
        // Verificar que la respuesta contenga la propiedad 'total_cartasAcep'
        if (data.total_cartasAcep !== undefined) {
            // Mostrar el total de cartas de aceptación
            document.getElementById("total_cartasAcep").textContent = data.total_cartasAcep;

            // Mostrar la lista de nombres de alumnos
            const lista = document.getElementById("listaCartasAcepLista");
            if (lista && Array.isArray(data.nombres_alumnos)) {
                lista.innerHTML = "";
                data.nombres_alumnos.forEach(nombre => {
                    const li = document.createElement("li");
                    li.className = "flex justify-between w-full";
                    const nombreSpan = document.createElement("span");
                    nombreSpan.textContent = nombre;
                    li.appendChild(nombreSpan);
                    lista.appendChild(li);
                });
            }
        } else {
            alert("Error: " + (data.mensaje || "Error al obtener las cartas de Aceptacion "));
        }
    })
    .catch(error => {
        // Capturar y mostrar cualquier error ocurrido durante la solicitud
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error inesperado. Intenta más tarde.");
    });
}