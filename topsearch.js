// =====================================================================
//  topsearch.js — buscador de la barra superior, compartido por todas
//  las páginas. Filtra PLACES (definido en site-data.js) por nombre y
//  lleva a la ficha del lugar (lugar.html?p=<slug>) elegido.
// =====================================================================
(function(){
  const input = document.getElementById('topSearchInput');
  const list = document.getElementById('topSearchResults');
  if(!input || !list) return;

  function normalize(s){
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  // lugares turísticos + hoteles (si el sitio ya cargó HOTELS)
  function searchItems(){
    const items = PLACES.map(function(p){ return { name: p.name, href: 'lugar.html?p=' + p.slug }; });
    if(typeof HOTELS !== 'undefined'){
      HOTELS.forEach(function(h){ items.push({ name: h.name, href: 'hotel.html?h=' + h.slug }); });
    }
    return items;
  }

  function render(query){
    const q = normalize(query.trim());
    list.innerHTML = '';
    if(!q){ list.classList.remove('open'); return; }

    const matches = searchItems().filter(function(p){ return normalize(p.name).includes(q); });

    if(!matches.length){
      const li = document.createElement('li');
      li.className = 'empty';
      li.textContent = 'Sin resultados para "' + query + '"';
      list.appendChild(li);
    } else {
      matches.slice(0, 8).forEach(function(p){
        const li = document.createElement('li');
        li.textContent = p.name;
        li.addEventListener('click', function(){
          window.location.href = p.href;
        });
        list.appendChild(li);
      });
    }
    list.classList.add('open');
  }

  input.addEventListener('input', function(){ render(input.value); });
  input.addEventListener('focus', function(){ if(input.value.trim()) render(input.value); });
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      const q = normalize(input.value.trim());
      const first = searchItems().find(function(p){ return normalize(p.name).includes(q); });
      if(first) window.location.href = first.href;
    }
  });
  document.addEventListener('click', function(e){
    if(!e.target.closest('.site-search')) list.classList.remove('open');
  });
})();
