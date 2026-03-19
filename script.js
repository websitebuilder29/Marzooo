const flowersData = [
    {
        numero: 1,
        archivo: "Morat, Juanes - Besos En Guerra (mp3cut.net).mp3",
        frase: "No es la fecha, eres tú. Siempre has sido tú.",
        icono: "💛",
        imagen: "images/11.jpg"
    },
    {
        numero: 2,
        archivo: "Morat Ft (mp3cut.net).mp3",
        frase: "No es solo tu energía. Es cómo me haces sentir cuando estoy contigo.",
        icono: "✨",
        imagen: "images/10.jpg"
    },
    {
        numero: 3,
        archivo: "Mon Laferte - Amárrame (Letra) (mp3cut.net).mp3",
        frase: "No es el día. Es que contigo cualquier fecha podría ser especial.",
        icono: "🌼",
        imagen: "images/8.jpg"
    },
    {
        numero: 4,
        archivo: "Causa Perdida (mp3cut.net).mp3",
        frase: "No busques el significado detrás de cada flor. Búscalo en mis ojos cuando las recibas.",
        icono: "🌻",
        imagen: "images/8.jpg"
    },
    {
        numero: 5,
        archivo: "Gerardo Ortiz Amor Confuso (Letra) (mp3cut.net).mp3",
        frase: "Siempre estás para mí. Hoy quería que este jardín estuviera para vos.",
        icono: "💫",
        imagen: "images/7.jpg"
    },
    {
        numero: 6,
        archivo: "Morat - Feo (Video Oficial) (mp3cut.net).mp3",
        frase: "Si el 21 de marzo no existiera, igual hoy te buscaría para darte algo bonito.",
        icono: "❤️",
        imagen: "images/8.jpg"
    },
    {
        numero: 7,
        archivo: "DUKI - Antes de Perderte (Video Oficial) (mp3cut.net).mp3",
        frase: "Esa noche, entre copas, te confesé lo que sentía. Si volviera, lo haría de nuevo. Porque no fue el alcohol. Fui yo. Y aunque pasen los días, eso no cambia.",
        icono: "💛",
        imagen: "images/12.jpg"
    }
];

const garden = document.getElementById('garden');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const messageIcon = document.getElementById('messageIcon');
const audioPlayer = document.getElementById('audioPlayer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let floresTocadas = 0;
const totalFlores = flowersData.length;

// Crear flores
flowersData.forEach((flower, index) => {
    const flowerDiv = document.createElement('div');
    flowerDiv.className = `flower ${index === 6 ? 'flower-7' : ''}`;
    flowerDiv.setAttribute('data-index', index);
    flowerDiv.setAttribute('data-numero', flower.numero);
    
    flowerDiv.innerHTML = `
        <div class="flower-number">${flower.numero}</div>
        <div class="flower-glow"></div>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle class="petal" cx="50" cy="30" r="18"/>
            <circle class="petal" cx="70" cy="45" r="18"/>
            <circle class="petal" cx="65" cy="70" r="18"/>
            <circle class="petal" cx="35" cy="70" r="18"/>
            <circle class="petal" cx="30" cy="45" r="18"/>
            <circle class="center" cx="50" cy="50" r="20"/>
            <circle cx="50" cy="50" r="8" fill="#8b4513"/>
            <circle cx="45" cy="45" r="2" fill="#fff"/>
        </svg>
    `;
    
    flowerDiv.addEventListener('click', () => {
        const numeroFlor = parseInt(flowerDiv.getAttribute('data-numero'));
        
        // Si ya completó todas las flores, PERMITIR volver a tocarlas
        if (floresTocadas >= totalFlores) {
            reproducirFlor(flower, flowerDiv, numeroFlor);
            return;
        }
        
        // Si NO ha completado todas, verificar orden
        const siguienteFlor = floresTocadas + 1;
        
        if (numeroFlor !== siguienteFlor) {
            messageText.textContent = `🌸 Primero toca la flor ${siguienteFlor} 🌸`;
            messageIcon.textContent = "⚠️";
            messageBox.classList.add('show');
            
            const florCorrecta = document.querySelector(`[data-numero="${siguienteFlor}"]`);
            if (florCorrecta) {
                florCorrecta.style.animation = 'none';
                florCorrecta.offsetHeight;
                florCorrecta.style.animation = 'brillo 0.8s ease 3';
            }
            return;
        }
        
        // Si es la flor correcta en orden, reproducir
        reproducirFlor(flower, flowerDiv, numeroFlor);
    });
    
    garden.appendChild(flowerDiv);
});

// Función para reproducir flor (separada para poder reutilizarla)
function reproducirFlor(flower, flowerDiv, numeroFlor) {
    // Reproducir audio
    audioPlayer.src = `audio/${flower.archivo}`;
    audioPlayer.currentTime = 0;
    audioPlayer.play().catch(e => {
        console.log("Error al reproducir:", e);
    });
    
    // Crear overlay con foto Y frase juntas + BOTÓN X
    if (flower.imagen) {
        const overlay = document.createElement('div');
        overlay.className = 'photo-overlay';
        overlay.innerHTML = `
            <div class="photo-container">
                <div class="close-button" id="closePhotoBtn">✕</div>
                <img src="${flower.imagen}" alt="Foto especial" class="photo-show">
                <div class="photo-frase">
                    <p>"${flower.frase}"</p>
                </div>
                <div class="photo-icon">${flower.icono}</div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Animar entrada
        setTimeout(() => {
            overlay.classList.add('show');
        }, 100);
        
        // Evento para cerrar con la X
        const closeBtn = overlay.querySelector('#closePhotoBtn');
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
            }, 500);
        });
        
        // Cerrar también haciendo clic fuera de la foto
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('show');
                setTimeout(() => {
                    overlay.remove();
                }, 500);
            }
        });
    }
    
    // Mostrar frase en tarjeta
    messageText.textContent = flower.frase;
    messageIcon.textContent = flower.icono;
    messageBox.classList.add('show');
    
    // Marcar flor como tocada (solo si no ha completado todas)
    if (floresTocadas < totalFlores) {
        flowerDiv.classList.add('touched');
        flowerDiv.style.opacity = '0.8';
        
        // Actualizar progreso
        floresTocadas++;
        const porcentaje = (floresTocadas / totalFlores) * 100;
        progressFill.style.width = `${porcentaje}%`;
        progressText.textContent = `${floresTocadas}/${totalFlores} flores`;
        
        // Animación
        flowerDiv.style.transform = 'scale(1.3)';
        setTimeout(() => {
            flowerDiv.style.transform = '';
        }, 300);
        
        // Si completó todas
        if (floresTocadas === totalFlores) {
            setTimeout(() => {
                messageText.textContent = "🌼 Has tocado todas las flores... Ahora ya sabes lo que siento 🌼";
                messageIcon.textContent = "💛";
                messageBox.classList.add('show');
                crearLluviaDePetales();
            }, 500);
        }
    } else {
        // Si ya completó todas, solo animar sin cambiar progreso
        flowerDiv.style.transform = 'scale(1.3)';
        setTimeout(() => {
            flowerDiv.style.transform = '';
        }, 300);
    }
}

// Mensaje de bienvenida
setTimeout(() => {
    messageText.textContent = "🌼 Toca las flores en orden del 1 al 7 🌼";
    messageIcon.textContent = "✨";
    messageBox.classList.add('show');
}, 1000);

function crearLluviaDePetales() {
    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const petalo = document.createElement('div');
            petalo.innerHTML = '🌼';
            petalo.style.position = 'fixed';
            petalo.style.left = Math.random() * 100 + '%';
            petalo.style.top = '-10%';
            petalo.style.fontSize = (25 + Math.random() * 40) + 'px';
            petalo.style.opacity = '0.7';
            petalo.style.animation = `caer ${4 + Math.random() * 6}s linear`;
            petalo.style.zIndex = '9998';
            petalo.style.pointerEvents = 'none';
            petalo.style.filter = 'drop-shadow(0 0 10px gold)';
            document.body.appendChild(petalo);
            
            setTimeout(() => {
                petalo.remove();
            }, 10000);
        }, i * 150);
    }
}