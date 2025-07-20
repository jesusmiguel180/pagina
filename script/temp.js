// --- LÓGICA DEL TEMPORIZADOR DE OFERTAS ---

// Asegurarnos de que el script se ejecuta cuando el HTML está listo
document.addEventListener('DOMContentLoaded', () => {

    // Pon aquí la fecha y hora en que termina la oferta
    // Formato: "Mes Dia, Año HH:MM:SS" -> ej: "Dec 31, 2024 23:59:59"
    const fechaLimite = new Date("Dec 31, 2024 23:59:59").getTime();

    // Seleccionamos los elementos del HTML donde mostraremos el tiempo
    const diasEl = document.getElementById('dias');
    const horasEl = document.getElementById('horas');
    const minutosEl = document.getElementById('minutos');
    const segundosEl = document.getElementById('segundos');
    
    // Si los elementos no existen en la página, no hacemos nada.
    if (!diasEl) return;

    // Actualizamos el contador cada segundo
    const intervalo = setInterval(() => {

        // Obtenemos la fecha y hora actual
        const ahora = new Date().getTime();

        // Calculamos la distancia que queda hasta la fecha límite
        const distancia = fechaLimite - ahora;

        // Si el tiempo se ha acabado
        if (distancia < 0) {
            clearInterval(intervalo); // Detenemos el temporizador
            document.querySelector('.barra-temporizador').innerHTML = "<span style='font-weight: bold; font-size: 1.2rem;'>¡LA OFERTA HA TERMINADO!</span>";
            return;
        }

        // Cálculos de tiempo para días, horas, minutos y segundos
        const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
        
        // Función para añadir un cero delante si el número es menor que 10
        const formatoDosDigitos = (numero) => numero < 10 ? '0' + numero : numero;

        // Mostramos el resultado en los elementos del HTML
        diasEl.innerHTML = formatoDosDigitos(dias);
        horasEl.innerHTML = formatoDosDigitos(horas);
        minutosEl.innerHTML = formatoDosDigitos(minutos);
        segundosEl.innerHTML = formatoDosDigitos(segundos);

    }, 1000); // Se ejecuta cada 1000 milisegundos (1 segundo)
});