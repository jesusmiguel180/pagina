document.addEventListener('DOMContentLoaded', function() {
    
    // Esta línea busca el div con id="mapa-promocional" en tu HTML.
    const mapaContenedor = document.getElementById('mapa-promocional');

    // Si encuentra el div en la página, ejecuta el código para crear el mapa.
    // Si no lo encuentra (porque estás en otra página que no tiene el mapa), no hace nada y evita errores.
    if (mapaContenedor) {
        
        // --- INICIALIZACIÓN DEL MAPA ---
        // Coordenadas de tu ubicación [latitud, longitud] y nivel de zoom (15 es un buen nivel para una ciudad/pueblo)
        const coordenadas = [40.9221, -98.3438];
        const nivelZoom = 17;
        
        // Crea el objeto del mapa y lo asocia al div 'mapa-promocional'
        const map = L.map('mapa-promocional').setView(coordenadas, nivelZoom);

        // --- CAPA DE TESELAS (EL MAPA BASE) ---
        // Añade la capa de imágenes del mapa de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // --- MARCADOR PERSONALIZADO ---
        // Crea un icono personalizado usando un icono de Font Awesome
        const customIcon = L.divIcon({
            html: '<i class="fas fa-map-marker-alt" style="color: #ef4758; font-size: 40px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);"></i>',
            className: '', // importante para que no añada estilos de Leaflet por defecto
            iconSize: [40, 40], // tamaño del icono en píxeles
            iconAnchor: [20, 40] // punto del icono que corresponderá a la coordenada del mapa (la punta inferior)
        });

        // --- AÑADIR MARCADOR AL MAPA ---
        // Coloca el marcador en las coordenadas especificadas con el icono personalizado
        L.marker(coordenadas, {icon: customIcon})
            .addTo(map)
            .bindPopup('<b>¡Estamos aquí!</b><br>Nuestra tienda en Cumanayagua.'); // El texto que aparece al hacer clic

        // --- ARREGLO DE VISUALIZACIÓN ---
        // A veces, Leaflet carga el mapa antes de que el CSS haya calculado el tamaño final del div,
        // lo que hace que se vea gris. Esta línea fuerza al mapa a recalcular su tamaño 
        // después de un pequeño retardo, asegurando que se muestre correctamente.
        setTimeout(function() {
            map.invalidateSize();
        }, 400);
    }
});