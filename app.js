// Normaliza texto (elimina tildes y convierte a minúsculas)
function normalizarTexto(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

let libros = [];

// Renderiza las tarjetas en pantalla (solo con datos de books.json)
function renderizar(librosFiltrados) {
  const cont = document.getElementById('resultados');
  if (!librosFiltrados.length) {
    cont.innerHTML = '<p>No se encontraron libros.</p>';
    return;
  }
  cont.innerHTML = librosFiltrados.map((b) => `
    <article class="card" data-id="${b.id}">
      <img src="${b.portada}" alt="Portada ${b.titulo}" onerror="this.style.display='none'">
      <div class="meta">
        <h3>${b.titulo}</h3>
      </div>
    </article>
  `).join('');

  // ➕ Evento click para abrir modal
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
      const id = parseInt(card.dataset.id);
      abrirModal(id);
    });
  });
}

// Busca por título
function buscar(q) {
  const qn = normalizarTexto(q);
  if (!qn) return libros;
  return libros.filter(b =>
    normalizarTexto(b.titulo).includes(qn)
  );
}

// Carga inicial de datos desde books.json 🚀
fetch('books.json')
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

// 🔥 Abre el modal cargando detalles desde bookdes.json
function abrirModal(id) {
  const libroGeneral = libros.find(l => l.id === id);

  // Buscar detalles en bookdes.json
  fetch('bookdes.json')
    .then(r => r.json())
    .then(detalles => {
      const detalle = detalles.find(d => d.id === id);

      document.getElementById("modalTitulo").innerText = libroGeneral.titulo;
      document.getElementById("modalDescripcion").innerText = detalle.descripcion;
      document.getElementById("modalCategoria").innerText = detalle.categoria;
      document.getElementById("modalAutor").innerText = detalle.autor;

      // ✅ Mostrar portada
      const img = document.getElementById("modalPortada");
      img.src = libroGeneral.portada;
      img.alt = `Portada de ${libroGeneral.titulo}`;
      img.onerror = () => { 
        img.style.display = "none"; 
      };

      document.getElementById("modal").style.display = "flex";
    })
    .catch(err => {
      console.error("Error cargando detalles", err);
    });
}



