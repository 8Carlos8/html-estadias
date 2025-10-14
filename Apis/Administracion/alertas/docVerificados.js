//const apiUrl = "http://127.0.0.1:8000";
//const token = localStorage.getItem('token');
// Verificar si el token existe
    if(!token){
        alert("No hay token almacenado ");// Avisar al usuario que no hay token
        window.location.href ="";// Redirigir a la página de inicio o login (aquí está vacío, puedes poner la URL)
    } else {
        // Si hay token, hacer una solicitud POST a la API para contar las estadías
        fetch(apiUrl + "/api/verifi/contarDocVerificados", {
            method: "POST",// Método HTTP POST
            headers: {
                "Content-Type": "application/json",// Indicamos que el cuerpo es JSON
            },
            body: JSON.stringify({ token }),// Enviamos el token como JSON en el cuerpo de la petición
        })
        .then(response => response.json())// Convertir la respuesta a JSON
        .then(data => {
            // Verificar que la respuesta contenga la propiedad 'total_estadias'
            if (data.total_verificados!== undefined) {
                // Mostrar el total de estadías en el elemento con id "total-estadias", en el html
                document.getElementById("total_veri").textContent = data.total_verificados;

                const lista = document.getElementById("listaCartasPresLista");
                lista.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

                data.nombres_alumnos.forEach(nombre => {
                    const li = document.createElement("li");
                    li.className = "flex justify-between w-full";
                    
                    const nombreSpan = document.createElement("span");
                    nombreSpan.textContent = nombre;

                    li.spendChild(nombreSpan);
                    li.spendChild(li);
                });
            } else {
                // Si no está la propiedad, mostrar un mensaje de error
                alert("Error: " + (data.mensaje || "Error al obtener las cartas de Aceptacion "));
            }
        })
        .catch(error => {
            // Capturar y mostrar cualquier error ocurrido durante la solicitud
            console.error("Error en la solicitud:", error);
            alert("Ocurrió un error inesperado. Intenta más tarde.");
        });
    }
    
 