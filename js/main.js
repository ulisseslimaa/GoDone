import ui from "./ui.js";
import api from "./api.js";

const formulario = document.getElementById('tarefa-form')
const campoBusca = document.getElementById('campo-busca')
const filtroStatus = document.getElementById('filtro-status')
const filtroPrioridade = document.getElementById('filtro-prioridade')
const botaoCancelar = document.getElementById('botao-cancelar')

ui.renderizarTarefas()

formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault()

    const id = document.getElementById('tarefa-id').value
    const titulo = document.getElementById('tarefa-titulo').value
    const descricao = document.getElementById('tarefa-descricao').value
    const prioridade = document.getElementById('tarefa-prioridade').value
    const dataVencimento = document.getElementById('tarefa-vencimento').value

    const tarefa = {
        titulo,
        descricao,
        prioridade,
        dataVencimento
    }

    if (id) {
        tarefa.id = id
        tarefa.dataCriacao = (await api.buscarTarefaPorId(id)).dataCriacao
        tarefa.status = (await api.buscarTarefaPorId(id)).status
        await api.atualizarTarefa(tarefa)
    } else {

        await api.criarTarefa(tarefa)
    }

    ui.limparFormulario()
    await ui.renderizarTarefas()
})

botaoCancelar.addEventListener('click', () => {
    ui.limparFormulario()
})

campoBusca.addEventListener('input', async (evento) => {
    const termo = campoBusca.value
    
    if (termo === '') {
        await aplicarFiltros()
    } else {
        const tarefasFiltradas = await api.filtrarPorTermo(termo)
        ui.renderizarTarefas(tarefasFiltradas)
    }
})

filtroStatus.addEventListener('change', async () => {
    await aplicarFiltros()
})

filtroPrioridade.addEventListener('change', async () => {
    await aplicarFiltros()
})

async function aplicarFiltros() {
    let tarefas = await api.buscarTarefas()
    const termo = campoBusca.value
    const status = filtroStatus.value
    const prioridade = filtroPrioridade.value

    if (termo !== '') {
        tarefas = tarefas.filter(t =>
            t.titulo.toUpperCase().includes(termo.toUpperCase()) ||
            t.descricao.toUpperCase().includes(termo.toUpperCase())
        )
    }

    if (status !== '') {
        tarefas = tarefas.filter(t => t.status === status)
    }

    if (prioridade !== '') {
        tarefas = tarefas.filter(t => t.prioridade === prioridade)
    }

    ui.renderizarTarefas(tarefas)
}
