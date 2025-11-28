document.addEventListener('DOMContentLoaded', function() {
    
    const apiUrl = "https://sis-estadias.companytechnova.tech"; 
    const token = localStorage.getItem('token'); 

    if (!token) {
        // Manejo silencioso o redirect si es necesario, 
        // pero como ya tienes validación de login, solo no cargamos la tabla
        console.warn("No token found for table loading");
        return;
    }

    // Llamada a la API
    fetch(apiUrl + "/api/cartas/obtener", { // ASERGÚRATE QUE ESTA RUTA SEA LA CORRECTA EN TU BACKEND
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ token }), 
    })
    .then(response => response.json())
    .then(data => {
        const tablaCuerpo = document.getElementById("tabla-cartas-body");
        
        if (data.cartas && Array.isArray(data.cartas)) {
            tablaCuerpo.innerHTML = ""; // Limpiar

            data.cartas.forEach(carta => {
                // Variables para acceso rápido a datos anidados
                const alumno = carta.estadia.alumno;
                const empresa = carta.estadia.empresa;
                
                // Estilo para el estado (Firma) usando clases de Tailwind
                let badgeClass = "";
                let textoEstado = "";
                
                if(carta.firmada_director === 1 || carta.firmada_director === true) {
                    badgeClass = "bg-green-100 text-green-800";
                    textoEstado = "Firmada";
                } else {
                    badgeClass = "bg-yellow-100 text-yellow-800";
                    textoEstado = "Pendiente";
                }

                // Construcción de la fila
                const fila = `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            #${carta.id}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                    <i class="fas fa-user text-xs"></i>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${alumno.nombre} ${alumno.apellido_paterno}</div>
                                    <div class="text-sm text-gray-500">${alumno.matricula}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            ${carta.estadia.proyecto_nombre}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${empresa.nombre}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${carta.fecha_emision}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}">
                                ${textoEstado}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onclick="verDocumento('${carta.id}')" class="text-green-600 hover:text-green-900 mr-3">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="text-blue-600 hover:text-blue-900">
                                <i class="fas fa-download"></i>
                            </button>
                        </td>
                    </tr>
                `;
                
                tablaCuerpo.innerHTML += fila;
            });
        } else {
             // Si no hay datos, mostrar una fila vacía informativa
             tablaCuerpo.innerHTML = `<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">No se encontraron cartas de estadía.</td></tr>`;
        }
    })
    .catch(error => {
        console.error("Error cargando cartas:", error);
    });
});

// Función placeholder para el botón de ver
function verDocumento(id) {
    alert("Abriendo documento ID: " + id);
    // Aquí iría tu lógica: window.open(url_del_pdf);
}