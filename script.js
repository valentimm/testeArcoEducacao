document.addEventListener('DOMContentLoaded', () => {
    // Coleta dos elementos da interface
    const telaInicial = document.getElementById('tela-inicial');
    const telaJogo = document.getElementById('tela-jogo');
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const tituloPagina = document.querySelector('title');
    const tituloInicial = telaInicial.querySelector('h1');
    const timer = document.getElementById('timer');

    const descricoesContainer = document.getElementById('descricoes-container');
    const etapasContainer = document.getElementById('etapas-container');

    const placarElemento = document.getElementById('valor-acertos');
    const feedbackFinal = document.getElementById('feedback-final');
    const feedbackErro = document.getElementById('feedback-erro');

    const somAcerto = document.getElementById('som-acerto');
    const somErro = document.getElementById('som-erro');
    const somVitoria = document.getElementById('som-vitoria');

    // Variáveis de estado do jogo
    let itemSendoArrastado = null;
    let acertos = 0;
    let totalDeEtapas = 0;

    // Variáveis timer
    let segundosTotais = 0;
    let timerIntervalo;

    // Formatação do texto
    function criarId(texto) {
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    }
    // Função para embaralhar os elementos
    function randomizer(array) {
        const arrayCopiado = [...array];
        for (let i = arrayCopiado.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopiado[i], arrayCopiado[j]] = [arrayCopiado[j], arrayCopiado[i]];
        }
        return arrayCopiado;
    }
    // Funções do Timer

    function iniciarTimer() {
        if (timerIntervalo) return;

        timerIntervalo = setInterval(() => {
            segundosTotais++;
            const minutos = Math.floor(segundosTotais / 60);
            const segundos = segundosTotais % 60;

            const minutosFormatados = String(minutos).padStart(2, '0');
            const segundosFormatados = String(segundos).padStart(2, '0');
            timer.textContent = `${minutosFormatados}:${segundosFormatados}`;
        }, 1000);
    }

    function pararTimer() {
        clearInterval(timerIntervalo);
        timerIntervalo = null;
    }

    function resetarTimer() {
        pararTimer();
        segundosTotais = 0;
        timer.textContent = "00:00";
    }

    // Função principal que lê o JSON e constrói a interface do jogo.
    async function carregarJogo() {
        try {
            const response = await fetch('jogo.json');
            if (!response.ok) {
                throw new Error('Falha ao carregar o arquivo jogo.json');
            }
            const jogoData = await response.json();

            tituloPagina.textContent = jogoData.titulo;
            tituloInicial.textContent = jogoData.titulo;
            totalDeEtapas = jogoData.etapas.length;

            jogoData.etapas.forEach(etapa => {
                const idBase = criarId(etapa.nome);

                const etapaDiv = document.createElement('div');
                etapaDiv.className = 'etapa';
                etapaDiv.innerHTML = `
                    <h2>${etapa.nome}</h2>
                    <div id="drop-${idBase}" class="dropzone"></div>
                `;
                etapasContainer.appendChild(etapaDiv);

            });

            const etapasEmbaralhadas = randomizer(jogoData.etapas);

            etapasEmbaralhadas.forEach(etapa => {
                const idBase = criarId(etapa.nome);
                const descricaoDiv = document.createElement('div');
                descricaoDiv.id = `desc-${idBase}`;
                descricaoDiv.className = 'descricao';
                descricaoDiv.draggable = true;
                descricaoDiv.textContent = etapa.descricao;
                descricoesContainer.appendChild(descricaoDiv);
            });

            adicionarEventListenersDragDrop();

        } catch (error) {
            console.error("Erro ao carregar o jogo:", error);
            feedbackFinal.textContent = "Não foi possível carregar o jogo. Verifique o console para mais detalhes.";
        }
    }

    // Adiciona todos os eventos de arrastar e soltar aos elementos criados dinamicamente.
    function adicionarEventListenersDragDrop() {
        const descricoes = document.querySelectorAll('.descricao');
        const dropzones = document.querySelectorAll('.dropzone');

        descricoes.forEach(descricao => {
            descricao.addEventListener('dragstart', e => {
                itemSendoArrastado = e.target;
                e.target.style.opacity = '0.5';
            });
            descricao.addEventListener('dragend', e => {
                e.target.style.opacity = '1';
                itemSendoArrastado = null;
            });
        });

        dropzones.forEach(dropzone => {
            dropzone.addEventListener('dragover', e => {
                e.preventDefault();
                dropzone.classList.add('hover');
            });
            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('hover');
            });
            dropzone.addEventListener('drop', e => {
                e.preventDefault();
                dropzone.classList.remove('hover');

                if (dropzone.children.length > 0) return;

                const idDescricao = itemSendoArrastado.id;
                const idDropzone = e.currentTarget.id; // currentTarget para garantir que seja o dropzone

                if (idDropzone.includes(idDescricao.split('-')[1])) {

                    somAcerto.currentTime = 0;
                    somAcerto.play();

                    dropzone.appendChild(itemSendoArrastado);
                    itemSendoArrastado.setAttribute('draggable', 'false');
                    itemSendoArrastado.style.cursor = 'default';
                    dropzone.classList.add('correto');
                    acertos++;
                    placarElemento.textContent = acertos;
                    verificarFimDeJogo();

                    dropzone.classList.add('animar-acerto');

                    dropzone.addEventListener('animationend', () => {
                        dropzone.classList.remove('animar-acerto');
                    }, { once: true });
                } else {

                    // Impede que a animação seja adicionada novamente
                    if (dropzone.classList.contains('animar-erro')) return;
                    somErro.currentTime = 0; // Reinicia o som
                    somErro.play();

                    feedbackErro.textContent = 'Resposta incorreta! Tente novamente.';
                    dropzone.classList.add('incorreto');
                    dropzone.classList.add('animar-erro');

                    dropzone.addEventListener('animationend', function handler() {
                        dropzone.classList.remove('animar-erro');
                        // Remove o próprio listener para não acumular eventos
                        dropzone.removeEventListener('animationend', handler);
                    });

                    setTimeout(() => {
                        feedbackErro.textContent = '';
                        dropzone.classList.remove('incorreto');
                    }, 2000);
                }
            });
        });
    }
    function reiniciarJogo() {
        acertos = 0;
        placarElemento.textContent = acertos;
        feedbackErro.textContent = '';
        feedbackFinal.textContent = '';
        descricoesContainer.innerHTML = '';
        etapasContainer.innerHTML = '';
        btnReiniciar.style.display = 'none';

        carregarJogo();
    }

    function verificarFimDeJogo() {
        if (acertos === totalDeEtapas) {
            somVitoria.currentTime = 0; // Reinicia o som
            somVitoria.play();
            feedbackFinal.textContent = '🏆Parabéns! Você completou o capítulo em ' + timer.textContent + '! 🏆';
            confetti({
                particleCount: 1200,
                spread: 200,
                origin: { y: 0.6 },
            });
            btnReiniciar.style.display = 'block';
            pararTimer();
        }
    }
    btnIniciar.addEventListener('click', () => {
        telaInicial.classList.remove('ativa');
        telaJogo.style.display = 'flex';
        telaJogo.classList.add('ativa');
        const sons = [somAcerto, somErro, somVitoria];
        sons.forEach(som => {

        som.play().catch(error => console.warn("O áudio foi bloqueado pelo navegador, mas a interação do usuário deve liberá-lo."));

        som.pause();

        som.currentTime = 0;
    });
        iniciarTimer();
    });

    btnReiniciar.addEventListener('click',() => {
        reiniciarJogo();
        resetarTimer();
        iniciarTimer();
    });

    carregarJogo();
});