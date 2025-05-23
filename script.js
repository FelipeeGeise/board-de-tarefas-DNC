
const carregarTarefasSalvas = () => {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefasSalvas.forEach(tarefa => criarTarefaNaTela(tarefa.nome, tarefa.etiqueta, tarefa.data));
};


const salvarTarefas = () => {
  const todasTarefas = Array.from(document.querySelectorAll(".tarefa-item")).map(tarefa => {
    const nome = tarefa.querySelector(".tarefa-texto p:first-child").textContent;
    const etiquetaTexto = tarefa.querySelector(".etiqueta-item")?.textContent || "Sem etiqueta";
    const data = tarefa.querySelector(".etiqueta-data")?.textContent.replace("Criado em: ", "") || "";
    return { nome, etiqueta: etiquetaTexto, data };
  });
  localStorage.setItem("tarefas", JSON.stringify(todasTarefas));
};


const criarTarefaNaTela = (nomeTarefa, etiquetaTexto, dataTarefa) => {
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


  const concluirBtn = document.createElement("button");
  concluirBtn.textContent = "Concluir"; 
  concluirBtn.className = "btn-concluir";

  
  concluirBtn.addEventListener("click", () => {
    nomeTarefaP.classList.add("concluido"); 

    const imgConcluido = document.createElement("img");
    imgConcluido.src = "./img/circulo-verde.png";
    imgConcluido.alt = "Tarefa concluída";
    imgConcluido.style.width = "30px";
    imgConcluido.style.height = "30px";
    imgConcluido.className = "img-concluido";

    imgConcluido.addEventListener("click", () => {
      tarefaDiv.remove(); 
      salvarTarefas();
    });

    concluirBtn.remove();
    tarefaDiv.appendChild(imgConcluido);

    salvarTarefas();
  });

  tarefaDiv.appendChild(tarefaTexto);
  tarefaDiv.appendChild(concluirBtn);
  document.querySelector("footer").appendChild(tarefaDiv);

  salvarTarefas();
};


document.getElementById("cadastrar-item").addEventListener("click", () => {
  const nomeTarefa = document.getElementById("input-esquerda").value.trim();
  const etiquetaTexto = document.getElementById("input-direita").value.trim();
  const dataAtual = new Date().toLocaleDateString("pt-BR");

  if (!nomeTarefa) return alert("Digite um nome para a tarefa!");

  criarTarefaNaTela(nomeTarefa, etiquetaTexto, dataAtual);

  document.getElementById("input-esquerda").value = "";
  document.getElementById("input-direita").value = "";
});


window.onload = carregarTarefasSalvas;
