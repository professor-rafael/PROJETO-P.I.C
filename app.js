document.addEventListener('DOMContentLoaded', function() {
    // Configuração do tema
    const toggleTheme = document.getElementById('toggle-theme');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Aplicar tema salvo
    document.documentElement.setAttribute('data-theme', savedTheme);
    toggleTheme.checked = savedTheme === 'dark';
    
    // Alternar tema
    toggleTheme.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Variáveis para o sorteio
    let nomesDisponiveis = [];
    let todosNomesInseridos = [];
    
    // Elementos DOM
    const btnSortear = document.getElementById('btn-sortear');
    const btnReiniciar = document.getElementById('btn-reiniciar');
    const quantidadeInput = document.getElementById('quantidade');
    const nomesInput = document.getElementById('nomes');
    const resultadoDiv = document.getElementById('resultado');
    const restantesDiv = document.getElementById('restantes');
    
    // Evento de sorteio
    btnSortear.addEventListener('click', sortear);
    btnReiniciar.addEventListener('click', reiniciar);
    
    // Função para processar os nomes de forma inteligente
    function processarNomes(texto) {
        // Remove espaços extras no início e fim
        let textoLimpo = texto.trim();
        
        // Se estiver vazio, retorna array vazio
        if (textoLimpo === '') return [];
        
        // Verifica se há vírgulas
        if (textoLimpo.includes(',')) {
            // Se tiver vírgula, separa por vírgula
            return textoLimpo.split(',')
                .map(nome => nome.trim())
                .filter(nome => nome !== '');
        } else {
            // Se não tiver vírgula, tenta separar por espaço ou quebra de linha
            // Primeiro tenta por quebra de linha
            if (textoLimpo.includes('\n')) {
                return textoLimpo.split('\n')
                    .map(nome => nome.trim())
                    .filter(nome => nome !== '');
            } else {
                // Se não tiver quebra de linha, separa por espaço
                // Mas verifica se são nomes completos (com mais de uma palavra)
                const nomesSeparados = textoLimpo.split(' ')
                    .map(nome => nome.trim())
                    .filter(nome => nome !== '');
                
                // Se tiver apenas um nome ou nomes com 1-2 palavras, mantém como está
                // Se tiver muitos nomes curtos, pode ser que seja uma lista sem vírgula
                if (nomesSeparados.length === 1) {
                    return nomesSeparados;
                } else {
                    // Tenta identificar se são nomes completos
                    // Verifica se há nomes com pelo menos 2 letras e espaços internos
                    const nomesCompletos = [];
                    let nomeAtual = '';
                    
                    for (let i = 0; i < nomesSeparados.length; i++) {
                        const palavra = nomesSeparados[i];
                        
                        // Se a palavra tem mais de 2 caracteres e não é um artigo/proposição comum
                        if (palavra.length > 2 && !['de','da','do','das','dos','e','ou','com','em','para','por'].includes(palavra.toLowerCase())) {
                            if (nomeAtual !== '') {
                                nomesCompletos.push(nomeAtual.trim());
                                nomeAtual = '';
                            }
                            // Começa um novo nome
                            nomeAtual = palavra;
                        } else {
                            // Adiciona ao nome atual (parte de um nome composto)
                            if (nomeAtual !== '') {
                                nomeAtual += ' ' + palavra;
                            } else {
                                // Se não tem nome atual, pode ser um nome curto
                                if (palavra.length > 1) {
                                    nomesCompletos.push(palavra);
                                }
                            }
                        }
                    }
                    
                    // Adiciona o último nome
                    if (nomeAtual !== '') {
                        nomesCompletos.push(nomeAtual.trim());
                    }
                    
                    // Se não conseguiu identificar nomes completos, volta para a separação por espaço
                    if (nomesCompletos.length === 0) {
                        return nomesSeparados;
                    }
                    
                    return nomesCompletos;
                }
            }
        }
    }
    
    // FUNÇÃO PARA EXPLOSÃO DE CONFETI
    function lancarConfetti() {
        // Confete principal - mais intenso
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4361ee', '#3a0ca3', '#f72585', '#00f7ff', '#ff00e4', '#ffd700', '#ff6b6b', '#51cf66']
        });
        
        // Segunda onda de confete após 0.3 segundos
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 50,
                origin: { y: 0.5, x: 0.3 },
                colors: ['#4361ee', '#f72585', '#ffd700', '#00f7ff']
            });
        }, 300);
        
        // Terceira onda de confete após 0.6 segundos
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 50,
                origin: { y: 0.5, x: 0.7 },
                colors: ['#3a0ca3', '#ff00e4', '#ff6b6b', '#51cf66']
            });
        }, 600);
        
        // Pequenos confetes caindo por mais tempo (efeito cascata)
        setTimeout(() => {
            confetti({
                particleCount: 80,
                spread: 30,
                origin: { y: 0.7 },
                startVelocity: 30
            });
        }, 1000);
    }
    
    // FUNÇÃO PARA EFEITO DE CONFETI EM FORMA DE ESTRELAS
    function lancarConfettiEstrelas() {
        // Confete em forma de estrelas (são círculos, mas parecem estrelas caindo)
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
        
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            
            const particleCount = 30 * (timeLeft / duration);
            
            // Confete em forma de estrela (efeito especial)
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#ffd700', '#4361ee', '#f72585', '#00f7ff', '#ff00e4']
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#ff6b6b', '#51cf66', '#ffd700', '#4361ee', '#f72585']
            });
        }, 250);
    }
    
    function sortear() {
        // Obter valores
        const quantidade = parseInt(quantidadeInput.value);
        const nomesTexto = nomesInput.value.trim();
        
        // Validar entrada
        if (isNaN(quantidade) || quantidade < 1) {
            mostrarErro("Por favor, insira uma quantidade válida!");
            return;
        }
        
        // Se não há nomes disponíveis, carregar novos
        if (nomesDisponiveis.length === 0) {
            if (nomesTexto === '') {
                mostrarErro("Por favor, insira os nomes para sortear!");
                return;
            }
            
            // Processa os nomes usando a nova função
            todosNomesInseridos = processarNomes(nomesTexto);
                
            if (todosNomesInseridos.length === 0) {
                mostrarErro("Nenhum nome válido foi inserido!");
                return;
            }
            
            nomesDisponiveis = [...todosNomesInseridos];
        }
        
        // Validar quantidade
        if (quantidade > nomesDisponiveis.length) {
            mostrarErro(`Só há ${nomesDisponiveis.length} nomes disponíveis!`);
            return;
        }
        
        // Realizar sorteio
        const sorteados = [];
        const copiaNomes = [...nomesDisponiveis];
        
        for (let i = 0; i < quantidade; i++) {
            const indice = Math.floor(Math.random() * copiaNomes.length);
            sorteados.push(copiaNomes[indice]);
            copiaNomes.splice(indice, 1);
        }
        
        nomesDisponiveis = copiaNomes;
        
        // Exibir resultados
        exibirResultados(sorteados);
        
        // DISPARAR EFEITO DE CONFETI
        lancarConfetti();
        lancarConfettiEstrelas();
        
        // Limpar campo se foi a primeira rodada
        if (nomesDisponiveis.length === todosNomesInseridos.length - sorteados.length) {
            nomesInput.value = '';
        }
        
        // Ativar botão reiniciar
        btnReiniciar.classList.remove('disabled');
    }
    
    function exibirResultados(sorteados) {
        resultadoDiv.innerHTML = `
            <i class="fas fa-trophy"></i>
            <div class="sorteado-container">
                <span class="texto__paragrafo">Nomes sorteados:</span>
                ${sorteados.map(nome => `
                    <div class="sorteado-destaque confetti-effect">${nome}</div>
                `).join('')}
            </div>
        `;
        
        if (nomesDisponiveis.length > 0) {
            restantesDiv.style.display = 'flex';
            restantesDiv.innerHTML = `
                <i class="fas fa-list-ol"></i>
                <span>Nomes restantes: ${nomesDisponiveis.join(', ')}</span>
            `;
        } else {
            restantesDiv.style.display = 'none';
            setTimeout(() => {
                mostrarAviso("Todos os nomes foram sorteados!");
            }, 500);
        }
    }
    
    function reiniciar() {
        quantidadeInput.value = '';
        nomesInput.value = '';
        resultadoDiv.innerHTML = `
            <i class="fas fa-trophy"></i>
            <span>Nomes sorteados: nenhum até agora</span>
        `;
        restantesDiv.style.display = 'none';
        
        nomesDisponiveis = [];
        todosNomesInseridos = [];
        
        btnReiniciar.classList.add('disabled');
        
        // Limpar qualquer confete ativo
        if (typeof confetti !== 'undefined') {
            confetti.reset();
        }
    }
    
    function mostrarErro(mensagem) {
        alert(mensagem);
    }
    
    function mostrarAviso(mensagem) {
        alert(mensagem);
    }
});