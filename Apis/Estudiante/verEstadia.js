//const apiUrl = "http://127.0.0.1:8000";
//const token = localStorage.getItem('token');
//const idU = localStorage.getItem('idU');

if (!token) {
    alert("No hay token almacenado");
    window.location.href = "../login-uth.html";
} else {
    fetch(apiUrl + "/api/estadia/verEstadiaAlumno", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, usuario_id: idU }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error! status: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor:", data);

        const mainContent = document.getElementById("mainContent");
        mainContent.innerHTML = ""; // Limpiar contenido

        if (data.estadia) {
            const estadia = data.estadia;

            const html = `
                <h2 class="text-2xl font-semibold mb-6">Resumen de Estadía</h2>
                <div class="overflow-x-auto">
                    <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead class="bg-green-800 text-white">
                            <tr>
                                <th class="py-3 px-4 text-left">Campo</th>
                                <th class="py-3 px-4 text-left">Información</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr>
                                <td class="py-2 px-4 font-medium">ID Estadia</td>
                                <td class="py-2 px-4">${estadia.id}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">ID Alumno</td>
                                <td class="py-2 px-4">${estadia.alumno_id}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">ID Docente</td>
                                <td class="py-2 px-4">${estadia.id_docente || "No asignado"}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">ID Empresa</td>
                                <td class="py-2 px-4">${estadia.empresa_id || "No asignada"}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">Asesor Externo</td>
                                <td class="py-2 px-4">${estadia.asesor_externo || "No asignado"}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">Proyecto</td>
                                <td class="py-2 px-4">${estadia.proyecto_nombre}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">Duración (semanas)</td>
                                <td class="py-2 px-4">${estadia.duracion_semanas}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">Fecha Inicio</td>
                                <td class="py-2 px-4">${estadia.fecha_inicio}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">Fecha Fin</td>
                                <td class="py-2 px-4">${estadia.fecha_fin}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">Apoyo</td>
                                <td class="py-2 px-4">${estadia.apoyo}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">Estatus</td>
                                <td class="py-2 px-4">${estadia.estatus}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">Creado</td>
                                <td class="py-2 px-4">${new Date(estadia.created_at).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td class="py-2 px-4 font-medium">Actualizado</td>
                                <td class="py-2 px-4">${new Date(estadia.updated_at).toLocaleDateString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;

            mainContent.innerHTML = html;
        } else {
            mainContent.innerHTML = `<p class="text-red-500">No se encontró información de la estadía.</p>`;
        }
    })
    .catch(error => {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error inesperado. Intenta más tarde.");
    });
}
