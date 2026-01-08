import api from "./api.js"

const ui = {

  async preencherFormulario(id) {
    const idTarefa = document.getElementById('tarefa-id')
    const titulo = document.getElementById('tarefa-titulo')
    const descricao = document.getElementById('tarefa-descricao')
    const prioridade = document.getElementById('tarefa-prioridade')
    const vencimento = document.getElementById('tarefa-vencimento')

    const tarefa = await api.buscarTarefaPorId(id)

    idTarefa.value = tarefa.id
    titulo.value = tarefa.titulo
    descricao.value = tarefa.descricao
    prioridade.value = tarefa.prioridade
    vencimento.value = tarefa.dataVencimento
  },

  async renderizarTarefas(tarefasFiltradas) {
    try {
      const listaTarefas = document.getElementById("lista-tarefas")

      let tarefas
      if (tarefasFiltradas) {
        tarefas = tarefasFiltradas
      } else {
        tarefas = await api.buscarTarefas()
      }

      listaTarefas.textContent = ""

      if (tarefas.length === 0) {
        const mensagemVazia = document.createElement("div")
        mensagemVazia.classList.add("lista-vazia")
        
        const img = document.createElement("img")
        img.src = "assets/icons/empty-state.svg"
        img.alt = "Nenhuma tarefa"
        
        const p1 = document.createElement("p")
        p1.textContent = "Nenhuma tarefa encontrada"
        
        const p2 = document.createElement("p")
        p2.classList.add("subtitulo")
        p2.textContent = "Adicione uma nova tarefa acima!"
        
        mensagemVazia.append(img, p1, p2)
        listaTarefas.appendChild(mensagemVazia)
        return
      }

      for (let i = 0; i < tarefas.length; i++) {
        const tarefa = tarefas[i]
        this.criarElementoTarefa(tarefa)
      }

    } catch (error) {
      console.log(error)
    }
  },

  criarElementoTarefa(tarefa) {
    const listaTarefas = document.getElementById("lista-tarefas")
    const li = document.createElement("li")
    li.setAttribute("data-id", tarefa.id)
    li.classList.add("item-tarefa")

    li.classList.add(`status-${tarefa.status}`)

    li.classList.add(`prioridade-${tarefa.prioridade}`)


    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.checked = tarefa.status === 'concluido'
    checkbox.classList.add("checkbox-tarefa")
    checkbox.addEventListener('change', async () => {
      const novoStatus = checkbox.checked ? 'concluido' : 'pendente'
      await api.atualizarStatusTarefa(tarefa.id, novoStatus)
      await ui.renderizarTarefas()
    })

    const conteudoTarefa = document.createElement("div")
    conteudoTarefa.classList.add("conteudo-tarefa")

    const titulo = document.createElement("h4")
    titulo.textContent = tarefa.titulo
    titulo.classList.add("titulo-tarefa")

    const descricao = document.createElement("p")
    descricao.textContent = tarefa.descricao
    descricao.classList.add("descricao-tarefa")

    const metadados = document.createElement("div")
    metadados.classList.add("metadados-tarefa")

    const prioridade = document.createElement("span")
    prioridade.textContent = `Prioridade: ${tarefa.prioridade.toUpperCase()}`
    prioridade.classList.add("badge-prioridade")
    prioridade.classList.add(`badge-${tarefa.prioridade}`)

    const vencimento = document.createElement("span")
    const [ano, mes, dia] = tarefa.dataVencimento.split('-')
    vencimento.textContent = `Vencimento: ${dia}/${mes}/${ano}`
    vencimento.classList.add("badge-vencimento")

    metadados.appendChild(prioridade)
    metadados.appendChild(vencimento)

    conteudoTarefa.appendChild(titulo)
    conteudoTarefa.appendChild(descricao)
    conteudoTarefa.appendChild(metadados)


    const botoes = document.createElement("div")
    botoes.classList.add("botoes-tarefa")

    const botaoEditar = document.createElement("button")
    botaoEditar.classList.add("botao-editar")
    const imgEditar = document.createElement("img")
    imgEditar.src = "assets/icons/edit-icon.svg"
    imgEditar.alt = "Editar"
    botaoEditar.appendChild(imgEditar)
    botaoEditar.title = "Editar"
    botaoEditar.onclick = () => ui.preencherFormulario(tarefa.id)

    const botaoDeletar = document.createElement("button")
    botaoDeletar.classList.add("botao-deletar")
    const imgDeletar = document.createElement("img")
    imgDeletar.src = "assets/icons/delete-icon.svg"
    imgDeletar.alt = "Deletar"
    botaoDeletar.appendChild(imgDeletar)
    botaoDeletar.title = "Deletar"
    botaoDeletar.onclick = async () => {
      if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
        await api.deletarTarefa(tarefa.id)
        await ui.renderizarTarefas()
      }
    }

    botoes.appendChild(botaoEditar)
    botoes.appendChild(botaoDeletar)

    li.appendChild(checkbox)
    li.appendChild(conteudoTarefa)
    li.appendChild(botoes)

    listaTarefas.appendChild(li)
  },

  limparFormulario() {
    document.getElementById('tarefa-id').value = ''
    document.getElementById('tarefa-titulo').value = ''
    document.getElementById('tarefa-descricao').value = ''
    document.getElementById('tarefa-prioridade').value = ''
    document.getElementById('tarefa-vencimento').value = ''
  }
}

export default ui
