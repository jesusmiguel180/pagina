// logica de el fondo animado
const container = document.getElementById('animation-container');

// --- PARÁMETROS PARA PERSONALIZAR ---
const lineColors = ['#FF0000', '#0062ffff', '#ffff']; // Rojo y Azul (puedes usar 'red' y 'deepskyblue')
const minLineWidth = 100; // Ancho mínimo de una línea en píxeles
const maxLineWidth = 400; // Ancho máximo de una línea en píxeles
const minAnimationDuration = 8; // Duración mínima de la animación en segundos (más lento)
const maxAnimationDuration = 20; // Duración máxima de la animación en segundos (más rápido)
const creationInterval = 300; // Intervalo en milisegundos para crear una nueva línea (menor número = más líneas)


function createLine() {
    // 1. Crear el elemento div que será la línea
    const line = document.createElement('div');
    line.classList.add('line');

    // 2. Asignar propiedades aleatorias
    const randomColor = lineColors[Math.floor(Math.random() * lineColors.length)];
    const randomWidth = Math.random() * (maxLineWidth - minLineWidth) + minLineWidth;
    const randomTop = Math.random() * window.innerHeight; // Posición vertical aleatoria
    const randomDuration = Math.random() * (maxAnimationDuration - minAnimationDuration) + minAnimationDuration;
    
    // 3. Aplicar los estilos al elemento
    line.style.backgroundColor = randomColor;
    line.style.width = `${randomWidth}px`;
    line.style.top = `${randomTop}px`;
    // Posicionamos la línea justo fuera del borde derecho de la pantalla para que entre suavemente
    line.style.left = `${window.innerWidth}px`; 
    line.style.animationDuration = `${randomDuration}s`;
    
    // 4. Añadir la línea al contenedor
    container.appendChild(line);

    // 5. ¡Muy importante! Eliminar la línea del DOM cuando su animación termine
    // para no sobrecargar la página con miles de elementos.
    line.addEventListener('animationend', () => {
        line.remove();
    });
}

// Llamar a la función createLine() repetidamente en un intervalo de tiempo
setInterval(createLine, creationInterval);