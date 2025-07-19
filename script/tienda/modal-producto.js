document.addEventListener('DOMContentLoaded', () => {
    // ---- Selectores de elementos del DOM ----
    const contenedorProductos = document.getElementById('contenedor-productos');
    const filtros = document.querySelectorAll('.panel-filtros input, .panel-filtros select');
    const cargandoMas = document.getElementById('cargando-mas');
    const busquedaInput = document.getElementById('busqueda-input');
    
    // ---- Selectores del MODAL ----
    const modal = document.getElementById('modal-producto');
    const modalCerrar = document.getElementById('modal-cerrar');
    const modalImagen = document.getElementById('modal-imagen');
    const modalCategoria = document.getElementById('modal-categoria');
    const modalTitulo = document.getElementById('modal-titulo');
    const modalCalificacion = document.getElementById('modal-calificacion');
    const modalDescripcion = document.getElementById('modal-descripcion');
    const modalDetallesLista = document.getElementById('modal-detalles-lista');
    const modalPrecio = document.getElementById('modal-precio');
    
    // ---- Estado de la aplicación ----
    let paginaActual = 1;
    let cargando = false;
    let hayMasProductos = true;

    // ---- Función para cargar productos (principal) ----
    async function cargarProductos(reemplazar = false) {
        // ... (esta función se mantiene exactamente igual que en la versión anterior) ...
    }

    // ---- NUEVAS FUNCIONES PARA EL MODAL ----

    function generarEstrellas(calificacion) {
        let estrellasHTML = '';
        const totalEstrellas = 5;
        const calif = parseFloat(calificacion);

        for (let i = 1; i <= totalEstrellas; i++) {
            if (i <= calif) {
                estrellasHTML += '★'; // Estrella llena
            } else {
                estrellasHTML += '<span class="estrella-vacia">★</span>'; // Estrella vacía
            }
        }
        return estrellasHTML;
    }

    async function abrirModal(productoId) {
        document.body.classList.add('modal-abierto');
        modal.classList.add('modal-visible');

        try {
            const response = await fetch(`php/obtener_producto.php?id=${productoId}`);
            if (!response.ok) throw new Error('Producto no encontrado');
            
            const producto = await response.json();

            // Rellenar el modal con los datos
            modalImagen.src = producto.imagen_url;
            modalImagen.alt = producto.nombre;
            modalCategoria.textContent = producto.categoria;
            modalTitulo.textContent = producto.nombre;
            modalDescripcion.textContent = producto.descripcion || 'No hay descripción disponible.';
            modalPrecio.textContent = `$${parseFloat(producto.precio).toFixed(2)}`;
            
            // Generar calificación y detalles
            modalCalificacion.innerHTML = generarEstrellas(producto.calificacion);
            modalDetallesLista.innerHTML = `
                <li><strong>Marca:</strong> <span>${producto.marca || 'N/A'}</span></li>
                <li><strong>Peso:</strong> <span>${producto.peso || 'N/A'}</span></li>
                <li><strong>Volumen:</strong> <span>${producto.volumen || 'N/A'}</span></li>
                <li><strong>Agregado el:</strong> <span>${producto.fecha_agregado || 'N/A'}</span></li>
            `;

        } catch (error) {
            console.error("Error al cargar detalles del producto:", error);
            modalTitulo.textContent = 'Error al cargar';
            modalDescripcion.textContent = 'No se pudieron obtener los detalles de este producto.';
        }
    }

    function cerrarModal() {
        document.body.classList.remove('modal-abierto');
        modal.classList.remove('modal-visible');
        // Opcional: limpiar contenido al cerrar
        modalTitulo.textContent = 'Cargando...';
        modalDescripcion.textContent = '';
        modalImagen.src = '';
    }

    // ---- Event Listeners ----

    // Event Delegation para clics en productos
    contenedorProductos.addEventListener('click', (e) => {
        // Buscamos si el clic fue dentro de un enlace de tarjeta de producto
        const tarjeta = e.target.closest('.tarjeta-producto-tienda a');
        if (tarjeta) {
            e.preventDefault(); // ¡IMPORTANTE! Evita que el enlace recargue la página
            const articulo = tarjeta.closest('.tarjeta-producto-tienda');
            const productoId = articulo.dataset.id;
            if (productoId) {
                abrirModal(productoId);
            }
        }
    });

    // Listeners para cerrar el modal
    modalCerrar.addEventListener('click', cerrarModal);
    modal.addEventListener('click', (e) => {
        // Si se hace clic en la superposición (fondo), pero no en el contenido
        if (e.target === modal) {
            cerrarModal();
        }
    });

    // --- (Aquí va el resto de tu JS: carga inicial, filtros, scroll infinito) ---
    // ...
    // Modificación en la creación de tarjetas para añadir el ID
    productos.forEach(producto => {
        // Añadimos data-id="${producto.id}" al article principal
        const productoHTML = `
            <article class="tarjeta-producto-tienda" data-id="${producto.id}">
                <div class="imagen-producto">
                    <a href="producto.php?id=${producto.id}">
                        <img src="${producto.imagen_url}" alt="${producto.nombre}">
                    </a>
                </div>
                <div class="info-producto">
                    <p class="categoria">${producto.categoria}</p>
                    <h4 class="nombre-producto">
                        <a href="producto.php?id=${producto.id}">${producto.nombre}</a>
                    </h4>
                    <div class="precio-final">
                        <span>Price</span>
                        <span class="precio">$${parseFloat(producto.precio).toFixed(2)}</span>
                    </div>
                </div>
            </article>
        `;
        contenedorProductos.insertAdjacentHTML('beforeend', productoHTML);
    });
    // ...
});