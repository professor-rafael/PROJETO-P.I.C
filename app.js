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
            
            todosNomesInseridos = nomesTexto.split(',')
                .map(nome => nome.trim())
                .filter(nome => nome !== '');
                
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
                    <div class="sorteado-destaque">${nome}</div>
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
    }
    
    function mostrarErro(mensagem) {
        alert(mensagem);
    }
    
    function mostrarAviso(mensagem) {
        alert(mensagem);
    }
});