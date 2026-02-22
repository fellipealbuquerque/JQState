# JQState Framework
**Reatividade Moderna para Sistemas Consolidados**

O **JQState** é um micro-framework reativo construído sobre o ecossistema jQuery. Ele foi projetado especificamente para auxiliar na criação e manutenção de códigos legados, como sistemas em PHP, ASP Clássico ou Ruby on Rails antigo, agilizando o processo de desenvolvimento e trazendo padrões modernos de interface para arquiteturas monolíticas.



## Propósito do Projeto
Este projeto nasceu da necessidade de modernizar interfaces sem a complexidade ou o custo de refatoração total para frameworks como React ou Vue. O JQState permite que o desenvolvedor consiga:

1.  **Agilizar a criação** de novas funcionalidades em telas preexistentes.
2.  **Manter o código legado** operacional enquanto adiciona uma camada de estado reativo.
3.  **Eliminar a manipulação excessiva do DOM** através de seletores manuais do jQuery.

## Funcionalidades Principais

* **Single Source of Truth**: O estado da interface é controlado por um objeto JavaScript centralizado.
* **Two-Way Data Binding**: Sincronização automática entre campos de entrada (inputs) e o estado.
* **Computed Properties**: Funções que processam e retornam dados em tempo real baseados em alterações do estado.
* **Observers & Global Bus**: Sistema de eventos para comunicação entre componentes isolados na mesma página.
* **Diretivas Declarativas**: Controle de exibição e lógica diretamente no HTML via atributos de dados.

---

## Diretivas do Framework

| Diretiva | Descrição |
| :--- | :--- |
| `data-bind` | Conecta o elemento a uma chave do estado (Texto ou Input). |
| `data-click` | Executa expressões JavaScript no escopo do estado ao disparar o evento de clique. |
| `data-if` | Renderiza ou remove elementos baseando-se em condições lógicas. |
| `data-switch` | Estrutura condicional complexa (Case/Default) dentro do HTML. |
| `data-on` | Gerencia estados de interação (ex: habilitar botão) via lógica de estado. |
| `data-preview` | Injeta a visualização JSON do estado atual, atuando como ferramenta de inspeção. |

---

## Exemplo de Implementação (Integração PHP)

O JQState permite receber dados diretamente do servidor através de atributos de inicialização:

```html
<div id="userApp" class="card shadow-sm p-4" data-initial='{"user": "<?php echo $username; ?>", "tasks": 0}'>
    <h3>Gerenciador de Tarefas</h3>
    
    <div class="mb-3">
        <label>Operador:</label>
        <input type="text" data-bind="user" class="form-control">
    </div>

    <div class="alert alert-info">
        Usuario: <strong data-bind="user"></strong> | 
        Registros pendentes: <span data-bind="tasks"></span>
    </div>

    <div data-switch>
        <div data-case="this.tasks > 10">
            <p class="text-danger">Alerta: Limite de capacidade atingido.</p>
        </div>
        <div data-case="this.tasks <= 0">
            <p class="text-muted">Status: Sistema em espera.</p>
        </div>
    </div>

    <button class="btn btn-primary" data-click="this.tasks++">Registrar Tarefa</button>
    
    <pre class="mt-4" data-preview="JSON.stringify(this, null, 2)"></pre>
</div>

<script type="module">
    import { JQState } from './JQState.js';
    
    // Inicialização do componente
    const app = new JQState('#userApp');
    
    // Observer para persistência ou auditoria
    app.on('tasks', (state, val) => {
        console.log("Atualização de registros:", val);
    });
</script>