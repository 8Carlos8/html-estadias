document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = "http://127.0.0.1:8000";
    const token = localStorage.getItem('token');

    if (!token) {
        alert("No hay token almacenado");
        window.location.href = "../login-uth.html";
        return;
    }

    fetch(apiUrl + "/api/estadia/estadiasPorDocente", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
    })
    .then(response => response.json())
    .then(data => {
        const estadias = data.estadias;
        const grid = document.querySelector('.grid');
        grid.innerHTML = "";

        estadias.forEach(alumno => {
            const card = document.createElement('div');
            card.className = "bg-white rounded-xl shadow-md overflow-hidden";

            card.innerHTML = `
                <div class="bg-green-700 text-white p-6">
                    <h3 class="text-xl font-bold">${alumno.nombre || 'Sin nombre'}</h3>
                  
                </div>
            
                <div class="p-6 border-b border-gray-200">
                    <h4 class="font-semibold text-gray-700 mb-2">Datos de Estadía</h4>
                    <p class="text-sm text-gray-600"><span class="font-medium">Proyecto:</span> ${alumno.proyecto_nombre || 'Sin proyecto'}</p>
                    <p class="text-sm text-gray-600"><span class="font-medium">Asesor externo:</span> ${alumno.asesor_externo || 'Sin asesor'}</p>
                    <p class="text-sm text-gray-600"><span class="font-medium">Duración:</span> ${alumno.duracion_semanas || '--'} semanas</p>
                    <p class="text-sm text-gray-600"><span class="font-medium">Inicio:</span> ${alumno.fecha_inicio || '--/--/----'}</p>
                    <p class="text-sm text-gray-600"><span class="font-medium">Fin:</span> ${alumno.fecha_fin || '--/--/----'}</p>
                    <p class="text-sm text-gray-600"><span class="font-medium">Apoyo:</span> ${alumno.apoyo || 'Sin apoyo'}</p>
                    <p class="text-sm text-gray-600"><span class="font-medium">Estatus:</span> ${alumno.estatus || 'Sin estatus'}</p>
                </div>
                <div class="p-6">
                    <h4 class="font-semibold text-gray-700 mb-2">Documentos de Estadía</h4>
                    <div class="mb-4">
                        <div class="flex justify-between items-center">
                            <span class="font-medium text-gray-800">Carta de Presentación</span>
                            <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Aceptado (Completo)</span>
                        </div>
                        <p class="text-xs text-gray-500">Subido: 14/07/2023</p>
                        <div class="flex space-x-2 mt-2">
                            <button class="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"><i class="fas fa-eye mr-1"></i>Ver</button>
                            <button class="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"><i class="fas fa-download mr-1"></i>Descargar</button>
                            <button class="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"><i class="fas fa-upload mr-1"></i>Subir</button>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="flex justify-between items-center">
                            <span class="font-medium text-gray-800">Carta de Aceptación</span>
                            <span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pendiente de revisión</span>
                        </div>
                        <p class="text-xs text-gray-500">Subido: 15/07/2023</p>
                        <div class="flex space-x-2 mt-2">
                            <button class="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"><i class="fas fa-eye mr-1"></i>Ver</button>
                            <button class="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"><i class="fas fa-download mr-1"></i>Descargar</button>
                            <button class="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"><i class="fas fa-upload mr-1"></i>Subir</button>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between items-center">
                            <span class="font-medium text-gray-800">Reporte Final</span>
                            <span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">No subido</span>
                        </div>
                        <p class="text-xs text-gray-500">Subido: --/--/----</p>
                        <div class="flex space-x-2 mt-2">
                            <button class="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"><i class="fas fa-eye mr-1"></i>Ver</button>
                            <button class="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"><i class="fas fa-download mr-1"></i>Descargar</button>
                            <button class="text-blue-600 hover:text-blue-800 text-xs font-medium flex items-center"><i class="fas fa-upload mr-1"></i>Subir</button>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    })
    .catch(error => {
        console.error("Error al cargar la documentación:", error);
        alert("Error al cargar la documentación. Intente de nuevo más tarde.");
    });
});

