document.addEventListener('DOMContentLoaded', () => {
    // ---- Selectores de elementos del DOM ----
    const contenedorProductos = document.getElementById('contenedor-productos');
    const filtros = document.querySelectorAll('.panel-filtros input, .panel-filtros select');
    const cargandoMas = document.getElementById('cargando-mas');
    const busquedaInput = document.getElementById('busqueda-input');
    
    // ---- Estado de la aplicación ----
    let paginaActual = 1;
    let cargando = false; // Flag para evitar múltiples cargas simultáneas
    let hayMasProductos = true; // Flag para saber si dejar de cargar

    // ---- Función para cargar productos ----
    async function cargarProductos(reemplazar = false) {
        // Si ya estamos cargando o si ya no hay más productos, no hacemos nada.
        if (cargando || !hayMasProductos) return;
        
        cargando = true;
        cargandoMas.classList.remove('cargando-oculto');

        // --- CAMBIO CLAVE: Si es una nueva búsqueda (reemplazar), reiniciamos todo ---
        if (reemplazar) {
            paginaActual = 1;
            hayMasProductos = true;
            contenedorProductos.innerHTML = ''; // Limpiar el contenedor
        }

        // Construir la URL con los filtros
        const params = new URLSearchParams();
        params.append('pagina', paginaActual);
        
        // Recolectar filtros actuales
        const categoriasSeleccionadas = Array.from(document.querySelectorAll('input[name="categoria"]:checked')).map(cb => cb.value);
        if (categoriasSeleccionadas.length > 0) {
            params.append('categorias', categoriasSeleccionadas.join(','));
        }
        params.append('precio_max', document.getElementById('rango-precio').value);
        params.append('orden', document.getElementById('ordenar-por').value);
        if (busquedaInput.value.trim() !== '') {
            params.append('busqueda', busquedaInput.value.trim());
        }

        try {
            const response = await fetch(`php/cargar_productos.php?${params.toString()}`);
            if (!response.ok) throw new Error('Error en la respuesta del servidor');
            
            const productos = await response.json();

            // Si no se devuelven productos, significa que no hay más.
            if (productos.length === 0) {
                hayMasProductos = false;
                if (reemplazar) {
                    contenedorProductos.innerHTML = '<p class="sin-resultados">No se encontraron productos con estos filtros.</p>';
                }
                return; // Salimos de la función
            }

            // Renderizar productos
            productos.forEach(producto => {
                const productoHTML = `
                    <article class="tarjeta-producto-tienda">
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
            
            // Si la respuesta trae menos productos que el límite, ya no hay más páginas.
            if (productos.length < 12) {
                hayMasProductos = false;
            }
            
            // Incrementamos la página para la siguiente solicitud de scroll
            paginaActual++;

        } catch (error) {
            console.error('Hubo un problema al cargar los productos:', error);
            contenedorProductos.innerHTML = '<p class="sin-resultados">Error al cargar los productos. Inténtalo de nuevo.</p>';
        } finally {
            cargando = false;
            cargandoMas.classList.add('cargando-oculto');
        }
    }

    // ---- Event Listeners ----
    
    // Escuchar cambios en cualquier filtro
    filtros.forEach(filtro => {
        filtro.addEventListener('change', () => {
            // Al cambiar un filtro, siempre se reemplaza el contenido.
            cargarProductos(true); 
        });
    });

    // Búsqueda por texto (con un pequeño retardo para no sobrecargar)
    let busquedaTimeout;
    busquedaInput.addEventListener('input', () => {
        clearTimeout(busquedaTimeout);
        busquedaTimeout = setTimeout(() => {
            cargarProductos(true);
        }, 500); // Espera 500ms después de que el usuario deja de teclear
    });

    // Rango de precio con actualización visual
    const rangoPrecioInput = document.getElementById('rango-precio');
    const valorRangoLabel = document.getElementById('valor-rango');
    if (rangoPrecioInput && valorRangoLabel) {
        rangoPrecioInput.addEventListener('input', () => {
            valorRangoLabel.textContent = `$${rangoPrecioInput.value}`;
        });
        // También escuchamos el 'change' para que se actualice al soltar el ratón
        rangoPrecioInput.addEventListener('change', () => {
            cargarProductos(true);
        });
    }

    // Scroll Infinito
    window.addEventListener('scroll', () => {
        // Si el usuario está cerca del final de la página y no estamos cargando
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
            cargarProductos(false); // Cargar más productos sin reemplazar
        }
    });

    // Carga inicial de productos al cargar la página
    cargarProductos(true); // Se inicia una carga que reemplaza el contenido de ejemplo
});