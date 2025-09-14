// Normaliza texto (elimina tildes y convierte a minúsculas)
function normalizarTexto(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

let libros = [];

// Renderiza las tarjetas en pantalla
function renderizar(librosFiltrados) {
  const cont = document.getElementById('resultados');
  if (!librosFiltrados.length) {
    cont.innerHTML = '<p>No se encontraron libros.</p>';
    return;
  }
  cont.innerHTML = librosFiltrados.map((b, i) => `
    <article class="card" data-id="${i}">
      <img src="${b.portada}" alt="Portada ${b.titulo}" onerror="this.style.display='none'">
      <div class="meta">
        <h3>${b.titulo}</h3>
        <p class="cat">${b.categoria}</p>
        <p class="desc">${b.descripcion}</p>
      </div>
    </article>
  `).join('');

  // ➕ Evento click para abrir modal
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      abrirModal(libros[id]); // 🔥 ahora abre modal en lugar de detalle.html
    });
  });
}

// Busca por título, categoría o descripción
function buscar(q) {
  const qn = normalizarTexto(q);
  if (!qn) return libros;
  return libros.filter(b =>
    normalizarTexto(b.titulo).includes(qn) ||
    normalizarTexto(b.categoria).includes(qn) ||
    normalizarTexto(b.descripcion).includes(qn)
  );
}

// Carga inicial de datos desde bookdes.json 🚀
fetch('bookdes.json')
  .then(r => r.json())
  .then(data => {
    libros = data.libros || data;
    renderizar(libros);
  })
  .catch(err => {
    document.getElementById('resultados').innerHTML = '<p>Error cargando libros.</p>';
    console.error(err);
  });

// Evento de búsqueda en tiempo real
document.getElementById('buscar').addEventListener('input', (e) => {
  renderizar(buscar(e.target.value));
});

// Ejemplo de función para abrir modal
// Ejemplo de función para abrir modal
function abrirModal(libro) {
  document.getElementById("modalTitulo").innerText = libro.titulo;
  document.getElementById("modalDescripcion").innerText = libro.descripcion;
  document.getElementById("modalCategoria").innerText = libro.categoria;

  // ✅ Mostrar la portada como imagen
  const img = document.getElementById("modalPortada");
  img.src = libro.portada;
  img.alt = `Portada de ${libro.titulo}`;
  img.onerror = () => { 
    img.style.display = "none"; 
  };

  document.getElementById("modal").style.display = "flex";
}


