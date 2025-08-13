document.addEventListener('DOMContentLoaded', () => {
    // Elementos da UI
    const telaInicial = document.getElementById('tela-inicial');
    const telaJogo = document.getElementById('tela-jogo');
    const btnIniciar = document.getElementById('btn-iniciar');

    const descricoes = document.querySelectorAll('.descricao');
    const dropzones = document.querySelectorAll('.dropzone');
    const feedbackFinal = document.getElementById('feedback-final');

    let itemSendoArrastado = null;
    let acertos = 0;

    // --- Iniciar ---
    btnIniciar.addEventListener('click', () => {
        telaInicial.classList.remove('ativa');
        telaJogo.style.display = 'flex';
        telaJogo.classList.add('ativa');
    });

    // --- Drag ---
    descricoes.forEach(descricao => {
        descricao.addEventListener('dragstart', (e) => {
            itemSendoArrastado = e.target;
            e.target.style.opacity = '0.5';
        });

        descricao.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
            itemSendoArrastado = null;
        });
    });

    // --- Drop ---
    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('hover');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('hover');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('hover');

            if (dropzone.children.length > 0) return; // Impede soltar se tiver algo

            // --- Validação ---
            const idDescricao = itemSendoArrastado.id;
            const idDropzone = e.target.id;

            // Valida se a parte do nome corresponde
            if (idDropzone.includes(idDescricao.split('-')[1])) {
                // ACERTOU
                dropzone.appendChild(itemSendoArrastado);
                itemSendoArrastado.setAttribute('draggable', 'false'); // Bloqueia de arrastar de novo
                itemSendoArrastado.style.cursor = 'default';
                dropzone.classList.add('correto');
                acertos++;
                verificarFimDeJogo();
            } else {
                // ERROU
                dropzone.classList.add('incorreto');
                setTimeout(() => {
                    dropzone.classList.remove('incorreto');
                }
                , 1000);
                feedbackFinal.textContent = 'Tente novamente!';
                feedbackFinal.style.color = '#dc3545';
                setTimeout(() => {
                    feedbackFinal.textContent = '';
                }, 1000);
            }
        });
    });

    // --- Fim de Jogo ---
    function verificarFimDeJogo() {
        if (acertos === dropzones.length) {
            feedbackFinal.textContent = 'Parabéns! Você completou o ciclo da água!';
            feedbackFinal.style.color = '#28a745';
        }
    }
});