document.addEventListener("DOMContentLoaded", () => {
  // ================================
  // AOS INIT
  // ================================
  if (typeof AOS !== "undefined") {
    AOS.init({ duration: 1000, once: true });
  }

  // ================================
  // PROGRESS BAR
  // ================================
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = progress + "%";
    });
  }

  // ================================
  // TOOLTIP GLOSSÁRIO
  // ================================
  document.querySelectorAll("[data-glossario]").forEach((term) => {
    const tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.textContent = term.getAttribute("title") || "";
    term.appendChild(tooltip);
    term.removeAttribute("title");

    term.addEventListener("click", (e) => {
      e.stopPropagation();
      term.classList.toggle("aberto");
    });
  });

  document.addEventListener("click", () => {
    document
      .querySelectorAll(".glossario.aberto")
      .forEach((t) => t.classList.remove("aberto"));
  });

  // ================================
  // CHART.JS INIT PAG 1
  // ================================
  const vermelhoVinho = getComputedStyle(document.documentElement)
    .getPropertyValue("--vermelho-vinho")
    .trim();
  const cinzaClaro = getComputedStyle(document.documentElement)
    .getPropertyValue("--cinza-claro")
    .trim();
  const verdePalestina = getComputedStyle(document.documentElement)
    .getPropertyValue("--verde-palestina")
    .trim();

  fetch("data/dados.json")
    .then((response) => response.json())
    .then((dados) => {
      new Chart(document.getElementById("chart1"), {
        type: "doughnut",
        data: {
          labels: ["Estereotipados", "Não estereotipados"],
          datasets: [
            {
              data: dados.chart1,
              backgroundColor: [vermelhoVinho, cinzaClaro],
            },
          ],
        },
        options: { responsive: true },
      });

      new Chart(document.getElementById("chart2"), {
        type: "line",
        data: {
          labels: ["2018", "2019", "2020", "2021"],
          datasets: [
            {
              label: "Estudos sobre colonialismo epistêmico",
              data: dados.chart2,
              backgroundColor: verdePalestina,
            },
          ],
        },
        options: { responsive: true },
      });

      new Chart(document.getElementById("chart3"), {
        type: "pie",
        data: {
          labels: ["Distorção Midiática", "Representação Correta"],
          datasets: [
            {
              data: dados.chart3,
              backgroundColor: [vermelhoVinho, cinzaClaro],
            },
          ],
        },
        options: { responsive: true },
      });
    })
    .catch((err) => console.error("Erro ao carregar os dados do JSON:", err));

  // ================================
  // CARROSSEL DE CITAÇÕES PAG 1
  // ================================
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  let current = 0;

  const showSlide = (index) => {
    slides.forEach((slide, i) => slide.classList.toggle("active", i === index));
  };

  if (slides.length > 0 && prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    });

    nextBtn.addEventListener("click", () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    });

    showSlide(current);
  }

  // =================================
  // ACCORDION IMPACTOS SOCIAIS PAG 2
  // =================================
  const impactoCards = document.querySelectorAll(".impactos-sociais .impactos");
  impactoCards.forEach((card) => {
    const title = card.querySelector("h3");
    const content = card.querySelector("p");
    if (!title || !content) return;

    title.addEventListener("click", () => {
      const isOpen = card.classList.contains("open");

      // Fecha todos
      impactoCards.forEach((c) => {
        c.classList.remove("open");
        const p = c.querySelector("p");
        if (p) p.style.maxHeight = null;
      });

      // Abre o clicado
      if (!isOpen) {
        card.classList.add("open");
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // ================================
  // TABS DE FILTRO DE CARDS PAG 2
  // ================================
  const tabs = document.querySelectorAll(".tab-btn");
  const cards = document.querySelectorAll(".card.conteudo");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        if (!card) return;
        if (filter === "todos" || card.classList.contains(filter)) {
          card.style.display = "block";
          card.classList.add("aos-animate");
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // =========================================
  // CARDS ESTEREÓTIPOS COM CONTRAPONTO PAG 2
  // =========================================
  const estereotipoCards = document.querySelectorAll(".card-estereotipo");

  estereotipoCards.forEach((card) => {
    const contraponto = card.querySelector(".contraponto");
    if (!contraponto) return;

    const btn = document.createElement("button");
    btn.classList.add("toggle-contraponto");
    btn.textContent = "Ver contraponto";
    btn.setAttribute("aria-expanded", "false");

    contraponto.style.maxHeight = "0";
    contraponto.style.overflow = "hidden";
    card.insertBefore(btn, contraponto);

    btn.addEventListener("click", () => {
      const isOpen = card.classList.contains("open");

      if (isOpen) {
        card.classList.remove("open");
        contraponto.style.maxHeight = "0";
        btn.textContent = "Ver contraponto";
        btn.setAttribute("aria-expanded", "false");
      } else {
        card.classList.add("open");
        contraponto.style.maxHeight = contraponto.scrollHeight + "px";
        btn.textContent = "Ocultar contraponto";
        btn.setAttribute("aria-expanded", "true");
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ================================
  // LINHA DO TEMPO PAG 2
  // ================================
  document.querySelectorAll(".linha-tempo .evento button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const contexto = btn.nextElementSibling;
      if (!contexto) return;
      const aberto =
        contexto.style.maxHeight && contexto.style.maxHeight !== "0px";
      contexto.style.maxHeight = aberto ? "0" : contexto.scrollHeight + "px";
      btn.textContent = aberto ? "Ver contexto" : "Ocultar contexto";
    });
  });

  // ================================
  // LINHA DO TEMPO PAG 3
  // ================================
  const botoes = document.querySelectorAll(".marco .botao-analise");

  let marcoAtivo = null;

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      const conteudo = botao.closest(".conteudo-marco");

      if (marcoAtivo && marcoAtivo !== conteudo) {
        marcoAtivo.classList.remove("ativo");
      }

      conteudo.classList.toggle("ativo");

      marcoAtivo = conteudo.classList.contains("ativo") ? conteudo : null;
    });
  });
});
