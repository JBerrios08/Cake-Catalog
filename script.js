const selectedCategories = new Set();
let pastelesData = [];

// Cargar pasteles desde el archivo JSON
fetch("pasteles.json")
  .then(response => response.json())
  .then(data => {
    pastelesData = data;
    renderizarPasteles();
  })
  .catch(error => console.error("Error al cargar el JSON:", error));

function renderizarPasteles() {
  const contenedor = document.getElementById("catalogo");
  contenedor.innerHTML = "";

  pastelesData.forEach(pastel => {
    const visible = selectedCategories.size === 0 || selectedCategories.has(pastel.categoria);

    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-md-4 pastel position-relative";
    col.dataset.category = pastel.categoria;
    col.style.display = visible ? "block" : "none";

    col.innerHTML = `
      <div class="card mb-4">
        <span class="badge bg-success position-absolute top-0 start-0 m-2 px-2 py-1 text-capitalize">
          ${pastel.categoria}
        </span>
        <img src="${pastel.imagen}" class="card-img-top img-fluid" alt="${pastel.titulo}">
        <div class="card-body">
          <h5 class="card-title text-color-naranja">
            <i class="${pastel.icono}"></i> ${pastel.titulo}
          </h5>
        </div>
      </div>
    `;

    contenedor.appendChild(col);
  });
}

// Filtros
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category;
    selectedCategories.has(category) ? selectedCategories.delete(category) : selectedCategories.add(category);
    actualizarCatalogo();
    actualizarBotones();
  });
});

document.getElementById("clearFilters").addEventListener("click", () => {
  selectedCategories.clear();
  actualizarCatalogo();
  actualizarBotones();
});

function actualizarCatalogo() {
  renderizarPasteles();
}

function actualizarBotones() {
  document.querySelectorAll(".filter-btn").forEach(btn => {
    const cat = btn.dataset.category;
    btn.classList.toggle("active", selectedCategories.has(cat));
  });
}

// PDF
document.getElementById("btnDescargar").addEventListener("click", () => {
  const visibles = Array.from(document.querySelectorAll(".pastel"))
    .filter(el => el.style.display !== "none");

  if (visibles.length === 0) {
    alert("No hay pasteles visibles para descargar.");
    return;
  }

  const contenedor = document.createElement("div");
  contenedor.className = "container mt-4";

  const titulo = document.createElement("h2");
  titulo.textContent = "Catálogo de Pasteles";
  titulo.style.textAlign = "center";
  titulo.style.color = "#ed7324";
  contenedor.appendChild(titulo);

  const logo = document.createElement("img");
  logo.src = "img/logo-lorena.png";
  logo.style.display = "block";
  logo.style.margin = "0 auto 20px auto";
  logo.style.maxWidth = "200px";
  contenedor.appendChild(logo);

  const fila = document.createElement("div");
  fila.className = "row";

  visibles.forEach(card => {
    const clon = card.cloneNode(true);
    fila.appendChild(clon);
  });

  contenedor.appendChild(fila);

  html2pdf().set({
    margin: 0.5,
    filename: "catalogo-pasteles.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
  }).from(contenedor).save();
});
