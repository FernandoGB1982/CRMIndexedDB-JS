(function () {
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        formulario.addEventListener('submit', validarCliente);

        conectarDB();
    });

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm',1);
    
        abrirConexion.onerror = function () {
            console.log('Hubo un error');
        }
    
        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }
    
    function validarCliente(e){
        e.preventDefault();

        // Leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;
        
        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Crear un objeto con la informacion
        const cliente = {
            nombre, //nombre : nombre
            email, //email : email
            telefono, //telefono : telefono
            empresa // empresa : empresa
        }
        cliente.id = Date.now();

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.oncomplete = function () {
            console.log('Cliente Agregado');
            imprimirAlerta('El Cliente se agrego correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }

        transaction.onerror = function () {
            console.log('Hubo un error');
            imprimirAlerta('Hubo un error', 'error');
        }
    }

    function imprimirAlerta(mensaje, tipo){
        const alerta = document.querySelector('.alerta');
    
        if(!alerta){
            //Crear la alerta
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border','alerta');
            
            if(tipo === 'error'){
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            }else{
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }
    
            divMensaje.textContent = mensaje;
    
            formulario.appendChild(divMensaje);
    
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }
})();
