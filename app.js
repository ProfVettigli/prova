// Applicazione Interattiva - Moto del Proiettile
class ProjectileMotionApp {
    constructor() {
        // Dati dell'applicazione
        this.quizData = [
            {
                id: 1,
                domanda: "Il moto parabolico è la composizione di quali due moti?",
                opzioni: [
                    "Due moti rettilinei uniformi",
                    "Due moti uniformemente accelerati",
                    "Un moto rettilineo uniforme e un moto uniformemente accelerato",
                    "Un moto circolare e un moto rettilineo"
                ],
                risposta_corretta: 2,
                spiegazione: "Il moto parabolico si compone di un moto rettilineo uniforme lungo l'asse orizzontale (x) e un moto uniformemente accelerato lungo l'asse verticale (y) a causa della gravità."
            },
            {
                id: 2,
                domanda: "Quando un proiettile raggiunge il punto più alto della sua traiettoria, quale delle seguenti affermazioni è vera?",
                opzioni: [
                    "La velocità è nulla",
                    "La componente verticale della velocità è nulla",
                    "La componente orizzontale della velocità è nulla",
                    "L'accelerazione è nulla"
                ],
                risposta_corretta: 1,
                spiegazione: "Nel punto più alto della traiettoria, la componente verticale della velocità è nulla (vᵧ = 0), mentre la componente orizzontale rimane costante."
            },
            {
                id: 3,
                domanda: "A quale angolo di lancio si ottiene la gittata massima (in assenza di resistenza dell'aria)?",
                opzioni: [
                    "30°",
                    "45°",
                    "60°",
                    "90°"
                ],
                risposta_corretta: 1,
                spiegazione: "La gittata è massima quando sin(2α) = 1, il che accade quando 2α = 90°, quindi α = 45°."
            },
            {
                id: 4,
                domanda: "Durante il moto parabolico, quale componente della velocità rimane costante?",
                opzioni: [
                    "La componente verticale",
                    "La componente orizzontale", 
                    "Entrambe le componenti",
                    "Nessuna delle due componenti"
                ],
                risposta_corretta: 1,
                spiegazione: "La componente orizzontale della velocità rimane costante perché non ci sono forze che agiscono orizzontalmente (trascurando l'attrito dell'aria)."
            },
            {
                id: 5,
                domanda: "Se raddoppiamo la velocità iniziale di un proiettile mantenendo lo stesso angolo, la gittata:",
                opzioni: [
                    "Rimane uguale",
                    "Raddoppia",
                    "Quadruplica",  
                    "Si dimezza"
                ],
                risposta_corretta: 2,
                spiegazione: "La gittata è proporzionale al quadrato della velocità iniziale: R = (v₀² · sin(2α))/g. Quindi raddoppiando v₀, la gittata quadruplica."
            },
            {
                id: 6,
                domanda: "Un proiettile viene lanciato orizzontalmente da un'altezza h. Il tempo di volo dipende:",
                opzioni: [
                    "Solo dalla velocità iniziale",
                    "Solo dall'altezza h",
                    "Sia dalla velocità che dall'altezza",
                    "Dall'angolo di lancio"
                ],
                risposta_corretta: 1,
                spiegazione: "Per un lancio orizzontale, il tempo di volo dipende solo dall'altezza: t = √(2h/g). La velocità orizzontale non influenza il tempo di caduta."
            },
            {
                id: 7,
                domanda: "Nel moto parabolico, l'accelerazione del proiettile è:",
                opzioni: [
                    "Variabile in modulo e direzione",
                    "Costante in modulo ma variabile in direzione",
                    "Costante in modulo e direzione",
                    "Nulla"
                ],
                risposta_corretta: 2,
                spiegazione: "L'accelerazione è sempre g = 9.81 m/s² diretta verticalmente verso il basso, quindi costante in modulo e direzione."
            },
            {
                id: 8,
                domanda: "Due proiettili vengono lanciati con la stessa velocità iniziale ma con angoli di 30° e 60°. Quale avrà gittata maggiore?",
                opzioni: [
                    "Quello a 30°",
                    "Quello a 60°",
                    "Avranno la stessa gittata",
                    "Dipende dalla velocità"
                ],
                risposta_corretta: 2,
                spiegazione: "Gli angoli 30° e 60° sono complementari (30° + 60° = 90°). Per angoli complementari, sin(2×30°) = sin(60°) = sin(2×60°) = sin(120°), quindi hanno la stessa gittata."
            }
        ];

        this.presets = {
            basket: { velocita_iniziale: 12, angolo: 45, altezza_iniziale: 2 },
            cannon: { velocita_iniziale: 50, angolo: 30, altezza_iniziale: 0 },
            water: { velocita_iniziale: 15, angolo: 60, altezza_iniziale: 1 }
        };

        this.g = 9.81; // Accelerazione di gravità

        // Stato dell'applicazione
        this.currentSection = 'teoria';
        this.currentQuestion = 0;
        this.score = 0;
        this.quizCompleted = false;

        // Stato simulatore
        this.isAnimating = false;
        this.isPaused = false;
        this.animationId = null;
        this.startTime = 0;
        this.trajectoryPoints = [];

        // Aspetta che il DOM sia completamente caricato
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Inizializzazione app...');
        this.setupNavigation();
        this.setupQuiz();
        this.setupSimulator();
        
        // Inizializza il canvas della teoria dopo un breve delay
        setTimeout(() => {
            this.drawTheoryCanvas();
        }, 100);
    }

    // Gestione navigazione
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        console.log('Pulsanti navigazione trovati:', navButtons.length);
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = btn.dataset.section;
                console.log('Navigazione verso:', section);
                this.showSection(section);
                
                // Aggiorna navigazione attiva
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    showSection(sectionName) {
        console.log('Mostrando sezione:', sectionName);
        
        // Nascondi tutte le sezioni
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostra sezione selezionata
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            console.log('Sezione attivata:', sectionName);

            // Inizializzazioni specifiche per sezione
            if (sectionName === 'simulatore') {
                setTimeout(() => this.initSimulationCanvas(), 200);
            } else if (sectionName === 'quiz' && this.currentQuestion === 0) {
                setTimeout(() => this.loadQuestion(), 100);
            }
        } else {
            console.error('Sezione non trovata:', sectionName);
        }
    }

    // Gestione Quiz
    setupQuiz() {
        // Event listeners per i controlli del quiz
        const nextBtn = document.getElementById('next-question');
        const restartBtn = document.getElementById('restart-quiz');
        const restartFinalBtn = document.getElementById('restart-quiz-final');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextQuestion();
            });
        }

        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.restartQuiz();
            });
        }

        if (restartFinalBtn) {
            restartFinalBtn.addEventListener('click', () => {
                this.restartQuiz();
            });
        }
    }

    loadQuestion() {
        if (this.currentQuestion >= this.quizData.length) {
            this.showResults();
            return;
        }

        const question = this.quizData[this.currentQuestion];
        const questionCard = document.getElementById('question-card');

        if (!questionCard) {
            console.error('Elemento question-card non trovato');
            return;
        }

        questionCard.innerHTML = `
            <div class="question-text">${question.domanda}</div>
            <ul class="options-list">
                ${question.opzioni.map((opzione, index) => `
                    <li class="option-item">
                        <button class="option-btn" data-index="${index}">
                            ${String.fromCharCode(65 + index)}. ${opzione}
                        </button>
                    </li>
                `).join('')}
            </ul>
        `;

        // Aggiungi event listeners alle opzioni
        questionCard.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAnswer(parseInt(e.target.dataset.index), question);
            });
        });

        // Aggiorna UI
        const currentQuestionEl = document.getElementById('current-question');
        const progressFillEl = document.getElementById('progress-fill');
        
        if (currentQuestionEl) {
            currentQuestionEl.textContent = this.currentQuestion + 1;
        }
        
        if (progressFillEl) {
            progressFillEl.style.width = `${((this.currentQuestion + 1) / this.quizData.length) * 100}%`;
        }
    }

    selectAnswer(selectedIndex, question) {
        const isCorrect = selectedIndex === question.risposta_corretta;
        
        if (isCorrect) {
            this.score++;
            const scoreEl = document.getElementById('current-score');
            if (scoreEl) {
                scoreEl.textContent = this.score;
            }
        }

        // Disabilita tutti i pulsanti e mostra risultato
        const optionBtns = document.querySelectorAll('.option-btn');
        optionBtns.forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.risposta_corretta) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('wrong');
            }
        });

        // Mostra spiegazione
        const questionCard = document.getElementById('question-card');
        const explanation = document.createElement('div');
        explanation.className = 'explanation';
        explanation.innerHTML = `
            <div class="explanation-title">Spiegazione:</div>
            <div>${question.spiegazione}</div>
        `;
        questionCard.appendChild(explanation);

        // Mostra pulsante per prossima domanda
        const nextBtn = document.getElementById('next-question');
        if (nextBtn) {
            nextBtn.style.display = 'inline-block';
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        const nextBtn = document.getElementById('next-question');
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        this.loadQuestion();
    }

    showResults() {
        const quizContent = document.querySelector('.quiz-content');
        const resultsDiv = document.getElementById('quiz-results');
        
        if (quizContent) {
            quizContent.style.display = 'none';
        }
        
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
        }

        const finalScoreEl = document.getElementById('final-score');
        if (finalScoreEl) {
            finalScoreEl.textContent = this.score;
        }

        let comment;
        const percentage = (this.score / this.quizData.length) * 100;
        
        if (percentage >= 90) {
            comment = "Eccellente! Hai una comprensione perfetta del moto parabolico! 🎉";
        } else if (percentage >= 75) {
            comment = "Molto bene! Hai una buona conoscenza dell'argomento! 👏";
        } else if (percentage >= 60) {
            comment = "Buono! C'è ancora qualcosa da ripassare, ma sei sulla strada giusta! 📚";
        } else {
            comment = "È il momento di rivedere la teoria! Non preoccuparti, la fisica richiede pratica! 💪";
        }

        const commentEl = document.getElementById('score-comment');
        if (commentEl) {
            commentEl.textContent = comment;
        }
        
        this.quizCompleted = true;
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.quizCompleted = false;
        
        const scoreEl = document.getElementById('current-score');
        if (scoreEl) {
            scoreEl.textContent = '0';
        }
        
        const quizContent = document.querySelector('.quiz-content');
        const resultsDiv = document.getElementById('quiz-results');
        const nextBtn = document.getElementById('next-question');
        
        if (quizContent) {
            quizContent.style.display = 'block';
        }
        
        if (resultsDiv) {
            resultsDiv.style.display = 'none';
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
        this.loadQuestion();
    }

    // Gestione Simulatore
    setupSimulator() {
        // Sliders
        const velocitySlider = document.getElementById('velocity-slider');
        const angleSlider = document.getElementById('angle-slider');
        const heightSlider = document.getElementById('height-slider');

        const velocityValue = document.getElementById('velocity-value');
        const angleValue = document.getElementById('angle-value');
        const heightValue = document.getElementById('height-value');

        if (velocitySlider && velocityValue) {
            velocitySlider.addEventListener('input', (e) => {
                velocityValue.textContent = e.target.value;
            });
        }

        if (angleSlider && angleValue) {
            angleSlider.addEventListener('input', (e) => {
                angleValue.textContent = e.target.value;
            });
        }

        if (heightSlider && heightValue) {
            heightSlider.addEventListener('input', (e) => {
                heightValue.textContent = e.target.value;
            });
        }

        // Presets
        const presetBtns = document.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const preset = this.presets[btn.dataset.preset];
                if (preset) {
                    this.applyPreset(preset);
                }
            });
        });

        // Controlli simulazione
        const launchBtn = document.getElementById('launch-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (launchBtn) {
            launchBtn.addEventListener('click', () => {
                this.launchProjectile();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.togglePause();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSimulation();
            });
        }
    }

    applyPreset(preset) {
        const velocitySlider = document.getElementById('velocity-slider');
        const angleSlider = document.getElementById('angle-slider');
        const heightSlider = document.getElementById('height-slider');
        
        const velocityValue = document.getElementById('velocity-value');
        const angleValue = document.getElementById('angle-value');
        const heightValue = document.getElementById('height-value');

        if (velocitySlider && velocityValue) {
            velocitySlider.value = preset.velocita_iniziale;
            velocityValue.textContent = preset.velocita_iniziale;
        }
        
        if (angleSlider && angleValue) {
            angleSlider.value = preset.angolo;
            angleValue.textContent = preset.angolo;
        }
        
        if (heightSlider && heightValue) {
            heightSlider.value = preset.altezza_iniziale;
            heightValue.textContent = preset.altezza_iniziale;
        }
    }

    initSimulationCanvas() {
        const canvas = document.getElementById('simulation-canvas');
        if (!canvas) {
            console.error('Canvas simulazione non trovato');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        this.drawGrid(ctx, canvas);
        console.log('Canvas simulazione inizializzato');
    }

    drawGrid(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Sfondo
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Griglia
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;
        
        const gridSize = 20;
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Assi
        ctx.strokeStyle = '#6c757d';
        ctx.lineWidth = 2;
        
        // Asse X
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 50);
        ctx.lineTo(canvas.width, canvas.height - 50);
        ctx.stroke();
        
        // Asse Y
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(50, canvas.height);
        ctx.stroke();
        
        // Etichette
        ctx.fillStyle = '#495057';
        ctx.font = '12px Arial';
        ctx.fillText('x (m)', canvas.width - 30, canvas.height - 30);
        ctx.fillText('y (m)', 20, 20);
    }

    launchProjectile() {
        if (this.isAnimating) {
            this.resetSimulation();
            return;
        }

        const velocitySlider = document.getElementById('velocity-slider');
        const angleSlider = document.getElementById('angle-slider');
        const heightSlider = document.getElementById('height-slider');

        if (!velocitySlider || !angleSlider || !heightSlider) {
            console.error('Sliders non trovati');
            return;
        }

        const v0 = parseFloat(velocitySlider.value);
        const angle = parseFloat(angleSlider.value);
        const h0 = parseFloat(heightSlider.value);

        this.startProjectileAnimation(v0, angle, h0);
    }

    startProjectileAnimation(v0, angle, h0) {
        const canvas = document.getElementById('simulation-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const angleRad = (angle * Math.PI) / 180;
        const v0x = v0 * Math.cos(angleRad);
        const v0y = v0 * Math.sin(angleRad);
        
        // Calcola parametri teorici
        const discriminant = v0y * v0y + 2 * this.g * h0;
        const totalTime = (v0y + Math.sqrt(Math.max(0, discriminant))) / this.g;
        const range = v0x * totalTime;
        const maxHeight = h0 + (v0y * v0y) / (2 * this.g);
        
        // Scale per il canvas
        const scaleX = (canvas.width - 100) / Math.max(range * 1.2, 1);
        const scaleY = (canvas.height - 100) / Math.max(maxHeight * 1.2, 1);
        const scale = Math.min(scaleX, scaleY, 5); // Limita la scala massima
        
        this.isAnimating = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.trajectoryPoints = [];
        
        const launchBtn = document.getElementById('launch-btn');
        const pauseBtn = document.getElementById('pause-btn');
        
        if (launchBtn) {
            launchBtn.textContent = '🔄 Reset';
        }
        
        if (pauseBtn) {
            pauseBtn.style.display = 'inline-block';
        }
        
        // Aggiorna display con valori teorici
        this.updateDisplay('range-display', `${range.toFixed(1)} m`);
        this.updateDisplay('max-height-display', `${maxHeight.toFixed(1)} m`);

        const animate = () => {
            if (!this.isAnimating) return;
            
            if (!this.isPaused) {
                const currentTime = (Date.now() - this.startTime) / 1000;
                
                if (currentTime <= totalTime) {
                    // Calcola posizione
                    const x = v0x * currentTime;
                    const y = h0 + v0y * currentTime - 0.5 * this.g * currentTime * currentTime;
                    
                    if (y >= 0) {
                        // Calcola velocità
                        const vx = v0x;
                        const vy = v0y - this.g * currentTime;
                        const speed = Math.sqrt(vx * vx + vy * vy);
                        
                        // Aggiorna display
                        this.updateDisplay('position-display', `x: ${x.toFixed(1)} m, y: ${y.toFixed(1)} m`);
                        this.updateDisplay('velocity-display', `${speed.toFixed(1)} m/s`);
                        this.updateDisplay('time-display', `${currentTime.toFixed(2)} s`);
                        
                        // Aggiungi punto alla traiettoria
                        this.trajectoryPoints.push({x, y});
                        
                        // Disegna
                        this.drawFrame(ctx, canvas, x, y, scale, h0);
                    } else {
                        this.stopAnimation();
                    }
                } else {
                    this.stopAnimation();
                }
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    stopAnimation() {
        this.isAnimating = false;
        
        const launchBtn = document.getElementById('launch-btn');
        const pauseBtn = document.getElementById('pause-btn');
        
        if (launchBtn) {
            launchBtn.textContent = '🚀 Lancia!';
        }
        
        if (pauseBtn) {
            pauseBtn.style.display = 'none';
        }
    }

    updateDisplay(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }

    drawFrame(ctx, canvas, x, y, scale, h0) {
        this.drawGrid(ctx, canvas);
        
        const originX = 50;
        const originY = canvas.height - 50;
        
        // Disegna traiettoria completa (fade)
        if (this.trajectoryPoints.length > 1) {
            ctx.strokeStyle = 'rgba(31, 184, 205, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let i = 0; i < this.trajectoryPoints.length; i++) {
                const point = this.trajectoryPoints[i];
                const canvasX = originX + point.x * scale;
                const canvasY = originY - point.y * scale;
                
                if (i === 0) {
                    ctx.moveTo(canvasX, canvasY);
                } else {
                    ctx.lineTo(canvasX, canvasY);
                }
            }
            ctx.stroke();
        }
        
        // Disegna proiettile
        const canvasX = originX + x * scale;
        const canvasY = originY - y * scale;
        
        ctx.fillStyle = '#dc3545';
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        // Punto di partenza
        const startY = originY - h0 * scale;
        ctx.fillStyle = '#28a745';
        ctx.beginPath();
        ctx.arc(originX, startY, 6, 0, 2 * Math.PI);
        ctx.fill();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = this.isPaused ? '▶️ Riprendi' : '⏸️ Pausa';
        }
    }

    resetSimulation() {
        this.isAnimating = false;
        this.isPaused = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        const launchBtn = document.getElementById('launch-btn');
        const pauseBtn = document.getElementById('pause-btn');
        
        if (launchBtn) {
            launchBtn.textContent = '🚀 Lancia!';
        }
        
        if (pauseBtn) {
            pauseBtn.style.display = 'none';
            pauseBtn.textContent = '⏸️ Pausa';
        }
        
        // Reset displays
        this.updateDisplay('position-display', 'x: 0 m, y: 0 m');
        this.updateDisplay('velocity-display', '0 m/s');
        this.updateDisplay('time-display', '0 s');
        this.updateDisplay('range-display', '0 m');
        this.updateDisplay('max-height-display', '0 m');
        
        this.trajectoryPoints = [];
        this.initSimulationCanvas();
    }

    // Canvas teoria
    drawTheoryCanvas() {
        const canvas = document.getElementById('theory-canvas');
        if (!canvas) {
            console.error('Canvas teoria non trovato');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Sfondo
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Griglia leggera
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;
        const gridSize = 20;
        
        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Disegna diverse traiettorie
        const angles = [30, 45, 60];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1'];
        const v0 = 40;
        const originX = 50;
        const originY = canvas.height - 50;
        const scale = 3;
        
        angles.forEach((angle, index) => {
            const angleRad = (angle * Math.PI) / 180;
            const v0x = v0 * Math.cos(angleRad);
            const v0y = v0 * Math.sin(angleRad);
            const totalTime = (2 * v0y) / this.g;
            
            ctx.strokeStyle = colors[index];
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            for (let t = 0; t <= totalTime; t += 0.1) {
                const x = v0x * t;
                const y = v0y * t - 0.5 * this.g * t * t;
                
                if (y >= 0) {
                    const canvasX = originX + x * scale;
                    const canvasY = originY - y * scale;
                    
                    if (t === 0) {
                        ctx.moveTo(canvasX, canvasY);
                    } else {
                        ctx.lineTo(canvasX, canvasY);
                    }
                }
            }
            ctx.stroke();
        });
        
        // Legenda
        ctx.fillStyle = '#495057';
        ctx.font = '12px Arial';
        angles.forEach((angle, index) => {
            ctx.fillStyle = colors[index];
            ctx.fillRect(canvas.width - 120, 20 + index * 25, 15, 15);
            ctx.fillStyle = '#495057';
            ctx.fillText(`${angle}°`, canvas.width - 100, 32 + index * 25);
        });
        
        // Assi
        ctx.strokeStyle = '#6c757d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, canvas.height);
        ctx.moveTo(0, originY);
        ctx.lineTo(canvas.width, originY);
        ctx.stroke();

        console.log('Canvas teoria disegnato');
    }
}

// Inizializza l'applicazione
const app = new ProjectileMotionApp();