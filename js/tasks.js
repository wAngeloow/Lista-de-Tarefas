let inputNovaTarefa = document.querySelector('#inputNovaTarefa');
let btnAddTarefa = document.querySelector('#btnAddTarefa');
let listaTarefas = document.querySelector('#listaTarefas');
let janelaEdicao = document.querySelector('#janelaEdicao');
let janelaEdicaoFundo = document.querySelector('#janelaEdicaoFundo');
let janelaEdicaoBtnFechar = document.querySelector('#janelaEdicaoBtnFechar');
let btnAtualizarTarefa = document.querySelector('#btnAtualizarTarefa');
let inputTarefaNomeEdicao = document.querySelector('#inputTarefaNomeEdicao');

// Adiciona uma nova tarefa ao clicar no botão
btnAddTarefa.addEventListener('click', () => {
    if (inputNovaTarefa.value.trim() === '') {
        console.log('Por favor, insira uma tarefa.');
        return;
    }
    adicionarTarefa(inputNovaTarefa.value);
});

// Adiciona uma nova tarefa ao pressionar a tecla Enter
inputNovaTarefa.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        if (inputNovaTarefa.value.trim() === '') {
            console.log('Por favor, insira uma tarefa.');
            return;
        }
        adicionarTarefa(inputNovaTarefa.value);
    }
});

// Atualiza a tarefa selecionada ao clicar no botão de atualização
btnAtualizarTarefa.addEventListener('click', (e) => {
    e.preventDefault();
    let tarefaAtual = document.querySelector('.tarefaEditada');
    if (tarefaAtual) {
        tarefaAtual.querySelector('.textoTarefa').innerText = inputTarefaNomeEdicao.value;
        alternarJanelaEdicao();
    } else {
        console.log('Elemento HTML não encontrado!');
    }
});

// Fecha a janela de edição quando o botão de fechar é clicado
janelaEdicaoBtnFechar.addEventListener('click', () => {
    alternarJanelaEdicao();
});

// Função para adicionar uma nova tarefa à lista
function adicionarTarefa(nome) {
    let li = criarTagLI(nome);
    listaTarefas.appendChild(li);
    inputNovaTarefa.value = '';
    atualizarTituloTarefas();
}

// Função para criar um item de lista para a tarefa
function criarTagLI(nome) {
    let li = document.createElement('li');
    let div = document.createElement('div');
    div.classList.add('div-botoes');

    // Botão para concluir a tarefa
    let btnConcluir = document.createElement('button');
    btnConcluir.classList.add('btnAcao');
    btnConcluir.innerHTML = '<i class="fa fa-check-double"></i>';
    btnConcluir.onclick = () => concluirTarefa(li);

    // Texto que exibe o nome da tarefa
    let span = document.createElement('span');
    span.classList.add('textoTarefa');
    span.innerHTML = nome;

    // Botão para editar a tarefa
    let btnEditar = document.createElement('button');
    btnEditar.classList.add('btnAcao');
    btnEditar.innerHTML = '<i class="fa fa-pencil"></i>';
    btnEditar.onclick = () => editar(li);

    // Botão para excluir a tarefa
    let btnExcluir = document.createElement('button');
    btnExcluir.classList.add('btnAcao', 'excluir');
    btnExcluir.innerHTML = '<i class="fa fa-trash"></i>';
    btnExcluir.onclick = () => excluir(li);

    div.appendChild(btnEditar);
    div.appendChild(btnExcluir);
    li.appendChild(btnConcluir);
    li.appendChild(span);
    li.appendChild(div);
    return li;
}

// Inicializa o canvas para a animação de fogos de artifício
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define as dimensões do canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Chama a função no carregamento e sempre que a janela for redimensionada
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let animationFrameId;

// Referência ao áudio de parabéns
const audioParabens = document.getElementById('audioParabens');

// Cria fogos de artifício a partir de um ponto específico
function createFirework(x, y) {
    const numParticles = 100;
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(x, y));
    }
}

// Classe que representa cada partícula dos fogos de artifício
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = (Math.random() - 0.5) * 10;
        this.speedY = (Math.random() - 0.5) * 10;
        this.gravity = 0.1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.alpha = 1;
    }

    update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Função de animação para os fogos de artifício
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });
    if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
    } else {
        cancelAnimationFrame(animationFrameId);
        canvas.style.display = 'none';
    }
}

// Inicia a animação de fogos de artifício em uma posição específica
function drawFireworks(x, y) {
    canvas.style.display = 'block';
    createFirework(x, y);
    animate();
}

// Marca a tarefa como concluída e exibe animações
function concluirTarefa(li) {
    li.classList.toggle('concluida');
    let btnConcluir = li.querySelector('.btnAcao i');
    if (li.classList.contains('concluida')) {
        btnConcluir.className = 'fa fa-check';
        listaTarefas.appendChild(li);
        drawFireworks(canvas.width / 2, canvas.height / 2);
        audioParabens.currentTime = 0;
        audioParabens.play();
    } else {
        btnConcluir.className = 'fa fa-check-double';
    }
}

// Abre a janela de edição com o texto da tarefa selecionada
function editar(li) {
    inputTarefaNomeEdicao.value = li.querySelector('.textoTarefa').innerText;
    li.classList.add('tarefaEditada');
    alternarJanelaEdicao();
}

// Remove a tarefa da lista
function excluir(li) {
    listaTarefas.removeChild(li);
    atualizarTituloTarefas();
}

let btnExcluirTodos = document.querySelector('#btnExcluirTodos');

// Adiciona o evento de clique para excluir todas as tarefas
btnExcluirTodos.addEventListener('click', () => {
    listaTarefas.innerHTML = ''; // Limpa a lista de tarefas
    atualizarTituloTarefas(); // Atualiza o título da lista
});

// Atualiza o título e verifica se o botão "Excluir Todos" deve ser exibido
function atualizarTituloTarefas() {
    let quantidadeTarefas = listaTarefas.children.length;
    document.getElementById('tituloTarefas').innerText = 'Tarefas (' + quantidadeTarefas + ')';
    
    // Exibe ou oculta o botão "Excluir Todos"
    if (quantidadeTarefas > 1) {
        btnExcluirTodos.style.display = 'block';
    } else {
        btnExcluirTodos.style.display = 'none';
    }
}

// Chama a função ao adicionar uma nova tarefa
function adicionarTarefa(nome) {
    let li = criarTagLI(nome);
    listaTarefas.appendChild(li);
    inputNovaTarefa.value = '';
    atualizarTituloTarefas(); // Atualiza a contagem e o botão
}


// Alterna a exibição da janela de edição e do fundo
function alternarJanelaEdicao() {
    janelaEdicao.classList.toggle('abrir');
    janelaEdicaoFundo.classList.toggle('abrir');
}
