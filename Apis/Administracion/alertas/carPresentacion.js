//const apiUrl = "http://127.0.0.1:8000";
//const token = localStorage.getItem('token');
// Verificar si el token existe
if(!token){
    alert("No hay token almacenado ");
    window.location.href ="";
} else {
    fetch(apiUrl + "/api/cartaPres/contarCartasPres", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar el total de cartas de presentación
        if (data.total_cartasPres !== undefined) {
            document.getElementById("listaCartasPres").textContent = data.total_cartasPres;

            // Mostrar la lista de nombres de alumnos
            const lista = document.getElementById("listaCartasPresLista");
            lista.innerHTML = ""; // Limpiar la lista antes de agregar nuevos elementos

            data.nombres_alumnos.forEach(nombre => {
                const li = document.createElement("li");
                li.className = "flex justify-between w-full";
                const nombreSpan = document.createElement("span");
                nombreSpan.textContent = nombre;
                li.appendChild(nombreSpan);
                lista.appendChild(li);
            });
        } else {
            alert("Error: " + (data.mensaje || "Error al obtener las cartas de Aceptacion "));
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error inesperado. Intenta más tarde.");
    });
}