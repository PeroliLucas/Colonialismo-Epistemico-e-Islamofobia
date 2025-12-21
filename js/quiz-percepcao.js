/* ==============================
   VARIÁVEIS GLOBAIS
============================== */
let perguntas = [];
let indiceAtual = 0;
let pontuacaoTotal = 0;
let acertos = 0; 

const textoPergunta = document.getElementById("texto-pergunta");
const botoes = document.querySelectorAll(".opcao");
const contador = document.getElementById("contador");
const feedback = document.getElementById("feedback");
const explicacaoEl = document.getElementById("explicacao");
const botaoProxima = document.getElementById("proxima");

/* ==============================
   ESCALA INTERPRETATIVA
============================== */
const escala = {
  neutra: 0,
  ambigua: 1,
  estigmatizante: 2,
  desumanizacao: 3,
};

/* ==============================
   CARREGAR PERGUNTAS
============================== */

fetch("../../data/midia/perguntas.json")
  .then((res) => res.json())
  .then((dados) => {
    perguntas = dados;
    iniciarQuiz();
  })
  .catch((err) => {
    textoPergunta.innerText = "Erro ao carregar o quiz.";
    console.error(err);
  });

/* ==============================
   INICIAR QUIZ
============================== */
function iniciarQuiz() {
  indiceAtual = 0;
  pontuacaoTotal = 0;
  acertos = 0;
  mostrarPergunta();
}

/* ==============================
   MOSTRAR PERGUNTA
============================== */
function mostrarPergunta() {
  const pergunta = perguntas[indiceAtual];

  textoPergunta.innerText = pergunta.texto;
  contador.innerText = `Pergunta ${indiceAtual + 1} de ${perguntas.length}`;

  feedback.classList.add("oculto");

  botoes.forEach((botao) => {
    botao.classList.remove("selecionada");
    botao.disabled = false;
  });

  if (pergunta.categoria === "metamanchete") {
    botoes.forEach((b) => (b.style.display = "none"));

    explicacaoEl.innerHTML = `
      <strong>Aqui não existe classificação correta.</strong><br><br>
      ${pergunta.explicacao}
    `;
    feedback.classList.remove("oculto");

    botaoProxima.innerText = "Ver meu perfil";
    botaoProxima.style.display = "inline-block";
  } else {
    botoes.forEach((b) => (b.style.display = "inline-block"));
    botaoProxima.innerText = "Próxima";
    botaoProxima.style.display = "inline-block";
  }
}

/* ==============================
   SELEÇÃO DE RESPOSTA
============================== */

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    const respostaUsuario = botao.dataset.resposta;
    const respostaEsperada = perguntas[indiceAtual].categoria;

    botoes.forEach((b) => (b.disabled = true));
    botao.classList.add("selecionada");

    mostrarFeedback(respostaUsuario, respostaEsperada);

    if (respostaEsperada !== "metamanchete") {
      const valorResposta = escala[respostaUsuario];
      pontuacaoTotal += valorResposta;

      if (respostaUsuario === respostaEsperada) acertos++;
    }
  });
});

/* ==============================
   FEEDBACK CRÍTICO (GRADUAL)
============================== */

function mostrarFeedback(respostaUsuario, respostaEsperada) {
  if (respostaEsperada === "metamanchete") {
    explicacaoEl.innerHTML = `
      <strong>Aqui não existe classificação correta.</strong><br><br>
      ${perguntas[indiceAtual].explicacao}
    `;
    feedback.classList.remove("oculto");
    return;
  }

  const nivelUsuario = escala[respostaUsuario];
  const nivelEsperado = escala[respostaEsperada];

  let introducao = "";

  if (nivelUsuario === nivelEsperado) {
    introducao =
      "Essa leitura é consistente com uma análise crítica do enquadramento.";
  } else if (nivelUsuario > nivelEsperado) {
    introducao =
      "Essa é uma leitura mais crítica. Ela amplia a sensibilidade para efeitos simbólicos que nem sempre são explícitos.";
  } else if (nivelUsuario < nivelEsperado) {
    introducao =
      "Essa leitura é possível, mas tende a suavizar efeitos simbólicos que merecem atenção.";
  }

  if (nivelEsperado === 0 && nivelUsuario >= 2) {
    introducao =
      "Essa leitura pode parecer plausível, mas aqui a manchete não atribui ameaça, juízo moral ou desumanização direta.";
  }

  explicacaoEl.innerHTML = `
    <strong>${introducao}</strong><br><br>
    ${perguntas[indiceAtual].explicacao}
  `;

  feedback.classList.remove("oculto");
}

/* ================================
   PRÓXIMA PERGUNTA / VER RESULTADO
=================================== */

botaoProxima.addEventListener("click", () => {
  const perguntaAtual = perguntas[indiceAtual];

  if (perguntaAtual.categoria === "metamanchete") {
    finalizarQuiz();
    return;
  }

  indiceAtual++;

  if (indiceAtual < perguntas.length) {
    mostrarPergunta();
  } else {
    finalizarQuiz();
  }
});

/* ==============================
   FINAL DO QUIZ / PERFIL
============================== */

function finalizarQuiz() {
  const mediaCritica = pontuacaoTotal / (perguntas.length - 1); 
  const precisao = acertos / (perguntas.length - 1); 
  let reflexao = "";
  let detalheNeutro = "";
  let perfil = "";

  if (mediaCritica <= 0.5 && precisao >= 0.5) {
    reflexao =
      "Você tende a priorizar leituras neutras das manchetes, focando nos fatos de forma objetiva.";
    detalheNeutro =
      "Isso mostra que você percebe os acontecimentos sem necessariamente atribuir juízos morais ou simbólicos. É uma abordagem consistente, embora possa não capturar nuances de estigmatização ou desumanização.";
    perfil =
      "Perfil: Observador neutro — atento aos fatos, com visão equilibrada.";
  } else if (mediaCritica <= 1.5 && precisao >= 0.5) {
    reflexao =
      "Você percebe nuances nas manchetes, identificando sutilezas de enquadramento sem exagerar em interpretações críticas.";
    detalheNeutro =
      "Sua leitura demonstra sensibilidade aos diferentes tons da mídia, mas ainda há espaço para aprofundar a percepção sobre possíveis efeitos simbólicos e estigmatizantes.";
    perfil =
      "Perfil: Analista em desenvolvimento — consciente das nuances, em processo de aprimoramento.";
  } else if (mediaCritica <= 2.5 && precisao >= 0.5) {
    reflexao =
      "Você identifica bem enquadramentos mais críticos e estigmatizantes, demonstrando atenção aos efeitos simbólicos das manchetes.";
    detalheNeutro =
      "Essa postura mostra que você consegue perceber além do óbvio, reconhecendo construções de sentido que podem impactar a percepção social dos grupos envolvidos.";
    perfil =
      "Perfil: Perceptivo — atento às mensagens implícitas e aos efeitos sociais da mídia.";
  } else if (precisao < 0.5) {
    reflexao =
      "Algumas respostas não coincidiram com as categorias analíticas esperadas, o que é natural ao explorar um tema complexo.";
    detalheNeutro =
      "Isso indica oportunidades de refletir mais sobre as nuances das manchetes e como elas constroem significados. Cada tentativa é uma chance de aprendizado.";
    perfil =
      "Perfil: Em aprendizado — explorando a percepção crítica das narrativas.";
  } else {
    reflexao =
      "Você demonstra uma percepção crítica aguçada, identificando rapidamente padrões de desumanização e estigmatização.";
    detalheNeutro =
      "Essa leitura indica atenção aos efeitos simbólicos da mídia e capacidade de analisar enquadramentos de forma sofisticada.";
    perfil =
      "Perfil: Crítico avançado — altamente sensível às nuances da construção midiática.";
  }

  textoPergunta.innerHTML = `<strong>Quiz concluído.</strong><br><br>${reflexao}<br><br><em>${perfil}</em>`;

  if (detalheNeutro) {
    textoPergunta.innerHTML += `<br><br><em>${detalheNeutro}</em>`;
  }

  document.querySelector(".alternativas").style.display = "none";
  feedback.classList.add("oculto");
  botaoProxima.style.display = "none";
  contador.innerText = "Reflexão final";
}
