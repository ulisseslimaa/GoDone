const URL_BASE = 'http://localhost:3000'

const api = {

    async buscarTarefas() {
        try {
            const tarefas = await axios.get(`${URL_BASE}/tarefas`)
            return tarefas.data
        } catch (error) {
            console.log('Erro ao carregar tarefas:', error)
            return []
        }
    },

    async buscarTarefaPorId(id) {
        try {
            const tarefa = await axios.get(`${URL_BASE}/tarefas/${id}`)
            return tarefa.data
        } catch (error) {
            console.log('Erro ao carregar tarefa:', error)
            return null
        }
    },

    async criarTarefa(tarefa) {
        try {
            const novaTarefa = {
                ...tarefa,
                dataCriacao: new Date().toISOString().split('T')[0],
                status: 'pendente'
            }
            const response = await axios.post(`${URL_BASE}/tarefas`, novaTarefa)
            return response.data
        } catch (error) {
            console.log('Erro ao criar tarefa:', error)
            return null
        }
    },

    async atualizarTarefa(tarefa) {
        try {
            await axios.put(`${URL_BASE}/tarefas/${tarefa.id}`, tarefa)
        } catch (error) {
            console.log('Erro ao atualizar tarefa:', error)
        }
    },

    async atualizarStatusTarefa(id, status) {
        try {
            await axios.patch(`${URL_BASE}/tarefas/${id}`, { status: status })
        } catch (error) {
            console.log('Erro ao atualizar status da tarefa:', error)
        }
    },

    async deletarTarefa(id) {
        try {
            await axios.delete(`${URL_BASE}/tarefas/${id}`)
        } catch (error) {
            console.log('Erro ao deletar tarefa:', error)
        }
    },

    async filtrarPorTermo(termo) {
        try {
            const tarefas = await this.buscarTarefas()
            const termoMaiusculo = termo.toUpperCase()
            return tarefas.filter(tarefa =>
                tarefa.titulo.toUpperCase().includes(termoMaiusculo) ||
                tarefa.descricao.toUpperCase().includes(termoMaiusculo)
            )
        } catch (error) {
            console.log('Erro ao filtrar tarefas:', error)
            return []
        }
    },

    async filtrarPorStatus(status) {
        try {
            const tarefas = await this.buscarTarefas()
            if (status === '') return tarefas
            return tarefas.filter(tarefa => tarefa.status === status)
        } catch (error) {
            console.log('Erro ao filtrar tarefas por status:', error)
            return []
        }
    },

    async filtrarPorPrioridade(prioridade) {
        try {
            const tarefas = await this.buscarTarefas()
            if (prioridade === '') return tarefas
            return tarefas.filter(tarefa => tarefa.prioridade === prioridade)
        } catch (error) {
            console.log('Erro ao filtrar tarefas por prioridade:', error)
            return []
        }
    }
}

export default api