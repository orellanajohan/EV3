import { getData, remove, save, selectOne, edit, runExists } from "./firestore.js";

let id = 0;

document.getElementById('btnGuardar').addEventListener('click', () => {
    document.querySelectorAll('.form-control').forEach(item => {
        verificar(item.id);
    });

    if (document.querySelectorAll('.is-invalid').length === 0) {
        const estudiante = {
            nom: document.getElementById('nombre').value.trim(),
            run: document.getElementById('run').value,
            email: document.getElementById('email').value,
            nombreC: document.getElementById('nombreC').value,
            fechaCurso: document.getElementById('fechaCurso').value,
            calificacionC: document.getElementById('calificacionC').value,
            calificacionP: document.getElementById('calificacionP').value,
            comentarios: document.getElementById('comentarios').value,
            sugerencias: document.getElementById('sugerencias').value
        };

        runExists(estudiante.run).then(exists => {
            if (exists) {
                Swal.fire({
                    title: "Error!",
                    text: "El RUN ya existe en la base de datos",
                    icon: "error"
                });
            } else {
                Swal.fire({
                    title: "¿Está seguro que desea guardar el registro?",
                    text: "Confirme que desea guardar los cambios",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Guardar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        if (document.getElementById('btnGuardar').value === 'Guardar') {
                            save(estudiante).then(() => {
                                Swal.fire({
                                    title: "Guardado!",
                                    text: "Su registro ha sido guardado exitosamente!",
                                    icon: "success"
                                });
                            }).catch((error) => {
                                Swal.fire({
                                    title: "Error!",
                                    text: "Hubo un problema al guardar su registro: " + error.message,
                                    icon: "error"
                                });
                            });
                        } else {
                            edit(id, estudiante).then(() => {
                                Swal.fire({
                                    title: "Actualizado!",
                                    text: "Su registro ha sido actualizado exitosamente!",
                                    icon: "success"
                                });
                            }).catch((error) => {
                                Swal.fire({
                                    title: "Error!",
                                    text: "Hubo un problema al actualizar su registro: " + error.message,
                                    icon: "error"
                                });
                            });
                            id = 0;
                        }
                        limpiar();
                    }
                });
            }
        }).catch((error) => {
            Swal.fire({
                title: "Error!",
                text: "Hubo un problema al verificar el RUN: " + error.message,
                icon: "error"
            });
        });
    }
});

window.addEventListener('DOMContentLoaded', () => {
    getData((datos) => {
        let tabla = '';
        datos.forEach((doc) => {
            const item = doc.data();
            tabla += `<tr>
                <td>${item.nom}</td>
                <td>${item.run}</td>
                <td>${item.email}</td>
                <td>${item.fechaCurso}</td>
                <td>${item.calificacionC}</td>
                <td>${item.calificacionP}</td>
                <td>${item.comentarios}</td>
                <td>${item.sugerencias}</td>
                <td nowrap>
                    <button class="btn btn-warning" id="edit-${doc.id}">Editar</button>
                    <button class="btn btn-danger" id="delete-${doc.id}">Eliminar</button>
                </td>
            </tr>`;
        });
        document.getElementById('contenido').innerHTML = tabla;

        document.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', () => {
                const recordId = btn.id.replace('delete-', '');
                Swal.fire({
                    title: "¿Está seguro que desea eliminar el registro?",
                    text: "No podrá revertir los cambios",
                    icon: "error",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Eliminar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        remove(recordId).then(() => {
                            Swal.fire({
                                title: "Eliminado!",
                                text: "Su registro ha sido eliminado!",
                                icon: "success"
                            });
                        }).catch((error) => {
                            Swal.fire({
                                title: "Error!",
                                text: "Hubo un problema al eliminar su registro: " + error.message,
                                icon: "error"
                            });
                        });
                    }
                });
            });
        });

        document.querySelectorAll('.btn-warning').forEach(btn => {
            btn.addEventListener('click', () => {
                const recordId = btn.id.replace('edit-', '');
                selectOne(recordId).then((doc) => {
                    if (doc.exists) {
                        const data = doc.data();
                        id = recordId;
                        document.getElementById('nombre').value = data.nom;
                        document.getElementById('run').value = data.run;
                        document.getElementById('email').value = data.email;
                        document.getElementById('nombreC').value = data.nombreC;
                        document.getElementById('fechaCurso').value = data.fechaCurso;
                        document.getElementById('calificacionC').value = data.calificacionC;
                        document.getElementById('calificacionP').value = data.calificacionP;
                        document.getElementById('comentarios').value = data.comentarios;
                        document.getElementById('sugerencias').value = data.sugerencias;
                        document.getElementById('btnGuardar').value = 'Actualizar';
                    }
                }).catch((error) => {
                    Swal.fire({
                        title: "Error!",
                        text: "Hubo un problema al seleccionar su registro: " + error.message,
                        icon: "error"
                    });
                });
            });
        });
    });
});

function limpiar() {
    document.getElementById('formulario').reset();
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.getElementById('btnGuardar').value = 'Guardar';
}
