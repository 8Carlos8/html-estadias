document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Configuración
    const baseUrl = "https://sis-estadias.companytechnova.tech"; 
    const endPoint = "/api/estadias/listaEstadias"; 
    const token = localStorage.getItem('token'); 

    // Validación
    if (!token) {
        console.warn("No hay token.");
        return;
    }
    
    const contenedor = document.getElementById('contenedor-estadias');

    // 2. Petición Fetch
    fetch(baseUrl + endPoint, { 
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({}), 
    })
    .then(response => response.json())
    .then(data => {
        contenedor.innerHTML = ""; // Limpiamos el contenedor (quitamos el loader)

        if (data.estadias && data.estadias.length > 0) {
            
            // ---> PASO 1: Variable vacía para guardar TODAS las tarjetas
            let htmlAcumulado = ""; 

            // ---> PASO 2: Recorremos el arreglo
            data.estadias.forEach(item => {
                
                // Extraemos datos para código más limpio
                const alumno = item.alumno;
                const empresa = item.empresa;
                const carrera = item.carrera; 
                
                // Formato de fechas
                const fechaInicio = new Date(item.created_at).toLocaleDateString('es-MX');
                const fechaFin = new Date(item.updated_at).toLocaleDateString('es-MX');

                // Lógica de colores según estatus
                let colorEstatus = "bg-yellow-100 text-yellow-800 border-yellow-200";
                let iconoEstatus = "fa-clock";

                if (item.estatus === 'aceptada' || item.estatus === 'finalizada') {
                    colorEstatus = "bg-green-100 text-green-800 border-green-200";
                    iconoEstatus = "fa-check-circle";
                } else if (item.estatus === 'rechazada') {
                    colorEstatus = "bg-red-100 text-red-800 border-red-200";
                    iconoEstatus = "fa-times-circle";
                }

                // Plantilla HTML (Tarjeta)
                const tarjetaHTML = `
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                        
                        <div class="bg-green-700 p-6 text-white relative overflow-hidden">
                            <div class="absolute -right-6 -top-6 opacity-10 text-9xl"><i class="fas fa-university"></i></div>
                            <h3 class="text-xl font-bold relative z-10 truncate" title="${alumno.nombre} ${alumno.apellido_paterno}">
                                ${alumno.nombre} ${alumno.apellido_paterno}
                            </h3>
                            <p class="text-green-100 text-sm font-medium relative z-10 mt-1 truncate">
                                ${carrera.nombre}
                            </p>
                            <div class="mt-4 flex items-center relative z-10">
                                <span class="bg-green-900 bg-opacity-60 px-3 py-1 rounded-full text-xs font-mono tracking-wider border border-green-600">
                                    ${alumno.matricula}
                                </span>
                            </div>
                        </div>

                        <div class="p-6 bg-gray-50 border-b border-gray-100">
                            <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Contacto</h4>
                            <div class="space-y-2">
                                <div class="flex items-center text-sm text-gray-700">
                                    <div class="w-8 text-center text-green-600"><i class="fas fa-envelope"></i></div>
                                    <span class="truncate" title="${alumno.correo}">${alumno.correo}</span>
                                </div>
                                <div class="flex items-center text-sm text-gray-700">
                                    <div class="w-8 text-center text-blue-600"><i class="fas fa-building"></i></div>
                                    <span class="truncate" title="${empresa.nombre}">${empresa.nombre}</span>
                                </div>
                            </div>
                        </div>

                        <div class="p-6 flex-grow">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide">Estatus</h4>
                                <span class="${colorEstatus} px-2 py-1 rounded text-xs font-bold uppercase border flex items-center">
                                    <i class="fas ${iconoEstatus} mr-1"></i> ${item.estatus}
                                </span>
                            </div>
                            <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
                                <p class="text-xs text-gray-500 mb-1">Proyecto</p>
                                <p class="text-sm font-bold text-gray-800 leading-tight line-clamp-2" title="${item.proyecto_nombre}">
                                    ${item.proyecto_nombre}
                                </p>
                            </div>
                            <div class="flex justify-between text-xs text-gray-400 px-1">
                                <span>Inicio: ${fechaInicio}</span>
                                <span>Act: ${fechaFin}</span>
                            </div>
                        </div>

                        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center mt-auto">
                            <span class="text-xs font-medium text-gray-500">ID: ${item.id}</span>
                            <button onclick="verDocumentos(${item.id})" class="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition-colors shadow-sm flex items-center">
                                <i class="fas fa-eye mr-2"></i> Ver Detalles
                            </button>
                        </div>
                    </div>
                `;

                // ---> PASO 3: ACUMULAMOS (Concatenamos)
                htmlAcumulado += tarjetaHTML;
            });

            // ---> PASO 4: Inyectamos TODO el HTML generado de una sola vez
            contenedor.innerHTML = htmlAcumulado;

        } else {
            contenedor.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                    <i class="fas fa-folder-open text-4xl mb-3 text-gray-300"></i>
                    <p>No se encontraron estadías registradas.</p>
                </div>
            `;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        contenedor.innerHTML = `
            <div class="col-span-full p-4 bg-red-50 text-red-600 rounded border border-red-200 text-center">
                <i class="fas fa-exclamation-triangle mr-2"></i> Error de conexión al cargar los datos.
            </div>
        `;
    });
});

// Función para redirigir
function verDocumentos(id) {
    // Redirige a la página de detalle pasando el ID
    window.location.href = `documentacion-detalle.html?id=${id}`; 
}