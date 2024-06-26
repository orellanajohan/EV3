funciones  

import { getData, remove, save, selectOne ,edit} from "./firestore.js"
let id = 0

document.getElementById('btnGuardar').addEventListener('click', () => {
    document.querySelectorAll('.form-control').forEach(item => {
        verificar(item.id)
    })
   
    if (document.querySelectorAll('.is-invalid').length == 0) {

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
        }
        if (document.getElementById('btnGuardar').value == 'Guardar') {
            save(estudiante)
        }
        else {
            edit(id, estudiante)
            id = 0
        }
        limpiar()

    }
})
window.addEventListener('DOMContentLoaded', () => {
    
    getData((datos) => {
        let tabla = ''
        datos.forEach((doc) => {
            
            const item = doc.data()

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
                <button class="btn btn-warning" id="${doc.id}">Editar</button>
                <button class="btn btn-danger" id="${doc.id}">Eliminar</button>
            </td>
        </tr>`
        })
        document.getElementById('contenido').innerHTML = tabla
        
        document.querySelectorAll('.btn-danger').forEach(btn => {
            
            btn.addEventListener('click', () => {
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
                        
                        remove(btn.id)
                        Swal.fire({
                            title: "Eliminado!",
                            text: "Su registro ha sido eliminado!",
                            icon: "success"
                        })
                    }
                })
            })
        })

        document.querySelectorAll('.btn-warning').forEach(btn => {
            
            btn.addEventListener('click', async () => {
                
                const estudiantes = await selectOne(btn.id)
                
                const e = estudiantes.data()
                
                document.getElementById('nombre').value = e.nom
                document.getElementById('run').value = e.run
                document.getElementById('email').value = e.email
                document.getElementById('fechaCurso').value = e.fechaCurso
                document.getElementById('calificacionC').value = e.calificacionC
                document.getElementById('calificacionP').value = e.calificacionP
                document.getElementById('comentarios').value = e.comentarios
                document.getElementById('sugerencias').value = e.sugerencias
        
                document.getElementById('btnGuardar').value = 'Editar'
    
                document.getElementById('run').readOnly = true

                id = estudiantes.id
            })
        })
    })
})














utilidadesssss

const limpiar = () => {
  
    document.getElementById('formulario').reset();
    
    document.querySelectorAll('.form-control').forEach(item => {
        item.classList.remove('is-invalid');
        item.classList.remove('is-valid');
        
        document.getElementById('e-' + item.name).innerHTML = '';
    });
    document.getElementById('run').readOnly = false;
    document.getElementById('btnGuardar').value = 'Guardar';
};

const soloNumeros = (evt) => {
    if (evt.keyCode >= 48 && evt.keyCode <= 57)
        return true;
    return false;
};

const validaRun = (run) => {
    const Fn = {
        validaRut: function (rutCompleto) {
            rutCompleto = rutCompleto.replace("‐", "-")
            if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto))
                return false
            const tmp = rutCompleto.split('-') 
            const digv = tmp[1]
            const rut = tmp[0]
            if (digv == 'K') digv = 'k'

            return (Fn.dv(rut) == digv)
        },
        dv: function (T) {
            let M = 0, S = 1
            for (; T; T = Math.floor(T / 10))
                S = (S + T % 10 * (9 - M++ % 6)) % 11
            return S ? S - 1 : 'k'
        }
    }
    return Fn.validaRut(run)
}

 const validaEmail = (email) => {
    const formato = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    if (!formato.test(email))
        return false
    return true
}

const verificar = (id) => {
    const input = document.getElementById(id);
    const div = document.getElementById('e-' + id)
    input.classList.remove('is-invalid')

    if (input.value.trim() == '') {
        
        input.classList.add('is-invalid')
        
        div.innerHTML = '<span class="badge bg-danger">El campo es obligatorio</span>'
    }

    input.classList.remove('is-invalid');

    if (input.value.trim() == '') {
        input.classList.add('is-invalid');
        div.innerHTML = '<span class="badge bg-danger">El campo es obligatorio</span>';
    } 
    else {
        input.classList.add('is-valid');
        div.innerHTML = '';

        if (id == 'calificacionC') {
            if (input.value < 1) {
                input.classList.add('is-invalid');
                div.innerHTML = '<span class="badge bg-danger">La calificacion no puede ser inferior a 1</span>';
            }
        }

        if (id == 'fecha') {
            const fecha = new Date(input.value);
            const hoy = new Date();
            if (fecha > hoy) {
                input.classList.add('is-invalid');
                div.innerHTML = '<span class="badge bg-danger">La fecha ingresada es mayor al hoy</span>';
            }
        }

        if (id == 'run') {
            if (!validaRun(input.value)) {
                input.classList.add('is-invalid');
                div.innerHTML = '<span class="badge bg-danger">El run no es válido</span>';
            }
        }

        if (id == 'email') {
            if (!validaEmail(input.value)) {
                input.classList.add('is-invalid');
                div.innerHTML = '<span class="badge bg-danger">El email no tiene el formato correcto</span>';
            }
        }
    }
}