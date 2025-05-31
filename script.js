const contadorConcluidas = document.getElementById("contador-concluidas");

const atualizarContador = () => {
  const tarefasConcluidas = document.querySelectorAll(".tarefa-texto p.concluido").length;
  contadorConcluidas.textContent = `Tarefas concluídas: ${tarefasConcluidas}`;
};

const criarElementoConcluido = () => {
  const imgConcluido = document.createElement("img");
  imgConcluido.src = "./img/circulo-verde.png";
  imgConcluido.alt = "Tarefa concluída";
  imgConcluido.style.width = "30px";
  imgConcluido.style.height = "30px";
  imgConcluido.className = "img-concluido";
  imgConcluido.tabIndex = 0; // acessível por teclado
  return imgConcluido;
};

const marcarComoConcluida = (tarefaDiv, nomeTarefaP, concluirBtn) => {
  nomeTarefaP.classList.add("concluido");
  const imgConcluido = criarElementoConcluido();

  imgConcluido.addEventListener("click", () => {
    tarefaDiv.remove();
    salvarTarefas();
    atualizarContador();
  });

  concluirBtn.remove();
  tarefaDiv.appendChild(imgConcluido);

  salvarTarefas();
  atualizarContador();
};

const adicionarEventosTarefa = (tarefaDiv, nomeTarefaP, concluirBtn, imgConcluido) => {
  if (concluirBtn) {
    concluirBtn.addEventListener("click", () => marcarComoConcluida(tarefaDiv, nomeTarefaP, concluirBtn));
    concluirBtn.setAttribute("aria-label", "Concluir tarefa");
  }
  if (imgConcluido) {
    imgConcluido.addEventListener("click", () => {
      tarefaDiv.remove();
      salvarTarefas();
      atualizarContador();
    });
    imgConcluido.tabIndex = 0;
  }
};

const criarTarefaNaTela = (nomeTarefa, etiquetaTexto, dataTarefa, concluida = false) => {
  const tarefaDiv = document.createElement("div");
  tarefaDiv.className = "tarefa-item";

  const tarefaTexto = document.createElement("div");
  tarefaTexto.className = "tarefa-texto";

  const nomeTarefaP = document.createElement("p");
  nomeTarefaP.textContent = nomeTarefa;

  const etiquetaContainer = document.createElement("div");
  etiquetaContainer.className = "etiqueta-container";

  const etiquetaDiv = document.createElement("div");
  etiquetaDiv.className = "etiqueta-item";
  etiquetaDiv.textContent = etiquetaTexto || "Sem etiqueta";

  const etiquetaDataSpan = document.createElement("span");
  etiquetaDataSpan.className = "etiqueta-data";
  etiquetaDataSpan.innerHTML = `<strong>Criado em:</strong> ${dataTarefa}`;

  etiquetaContainer.appendChild(etiquetaDiv);
  etiquetaContainer.appendChild(etiquetaDataSpan);

  tarefaTexto.appendChild(nomeTarefaP);
  tarefaTexto.appendChild(etiquetaContainer);
  tarefaDiv.appendChild(tarefaTexto);

  if (concluida) {
    nomeTarefaP.classList.add("concluido");
    const imgConcluido = criarElementoConcluido();
    tarefaDiv.appendChild(imgConcluido);
    adicionarEventosTarefa(tarefaDiv, nomeTarefaP, null, imgConcluido);
  } else {
    const concluirBtn = document.createElement("button");
    concluirBtn.textContent = "Concluir";
    concluirBtn.className = "btn-concluir";
    tarefaDiv.appendChild(concluirBtn);
    adicionarEventosTarefa(tarefaDiv, nomeTarefaP, concluirBtn, null);
  }

  document.querySelector("footer").appendChild(tarefaDiv);
  salvarTarefas();
  atualizarContador();
};

const carregarTarefasSalvas = () => {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefasSalvas.forEach(({ nome, etiqueta, data, concluida }) =>
    criarTarefaNaTela(nome, etiqueta, data, concluida)
  );
  atualizarContador();
};

const salvarTarefas = () => {
  const todasTarefas = Array.from(document.querySelectorAll(".tarefa-item")).map(tarefa => {
    const nome = tarefa.querySelector(".tarefa-texto p:first-child").textContent;
    const etiquetaTexto = tarefa.querySelector(".etiqueta-item")?.textContent || "Sem etiqueta";
    const data = tarefa.querySelector(".etiqueta-data")?.textContent.replace("Criado em:", "").trim() || "";
    const concluida = tarefa.querySelector(".tarefa-texto p:first-child").classList.contains("concluido");
    return { nome, etiqueta: etiquetaTexto, data, concluida };
  });
  localStorage.setItem("tarefas", JSON.stringify(todasTarefas));
};

document.getElementById("cadastrar-item").addEventListener("click", () => {
  const nomeTarefa = document.getElementById("input-esquerda").value.trim();
  const etiquetaTexto = document.getElementById("input-direita").value.trim();
  const dataAtual = new Date().toLocaleDateString("pt-BR");

  if (!nomeTarefa) {
    alert("Digite um nome para a tarefa!");
    return;
  }

  criarTarefaNaTela(nomeTarefa, etiquetaTexto, dataAtual);

  document.getElementById("input-esquerda").value = "";
  document.getElementById("input-direita").value = "";
});

window.onload = carregarTarefasSalvas;
