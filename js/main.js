/* ======================================================
   NAVEGACIÓN: menú móvil, scroll suave, link activo
   ====================================================== */
const btnHamburguesa = document.getElementById('btn-hamburguesa');
const menuLinks = document.getElementById('menu-links');
btnHamburguesa.addEventListener('click', () => {
  menuLinks.classList.toggle('abierto');
  const expandido = menuLinks.classList.contains('abierto');
  btnHamburguesa.setAttribute('aria-expanded', expandido);
});
document.querySelectorAll('#menu-links a').forEach(a=>{
  a.addEventListener('click', ()=> menuLinks.classList.remove('abierto'));
});

/* Barra de progreso + botón volver arriba + resaltar link activo */
const barraProgreso = document.getElementById('barra-progreso');
const btnArriba = document.getElementById('btn-arriba');
const secciones = document.querySelectorAll('section[id]');
const enlacesNav = document.querySelectorAll('#menu-links a');

window.addEventListener('scroll', ()=>{
  const alto = document.documentElement.scrollHeight - window.innerHeight;
  const progreso = (window.scrollY / alto) * 100;
  barraProgreso.style.width = progreso + '%';
  btnArriba.classList.toggle('visible', window.scrollY > 500);

  let actual = '';
  secciones.forEach(sec=>{
    const top = sec.offsetTop - 110;
    if(window.scrollY >= top) actual = sec.id;
  });
  enlacesNav.forEach(a=>{
    a.classList.toggle('activo', a.getAttribute('href') === '#' + actual);
  });
});
btnArriba.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

/* ======================================================
   ANIMACIÓN DE APARICIÓN AL HACER SCROLL
   ====================================================== */
const observador = new IntersectionObserver((entradas)=>{
  entradas.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); }
  });
},{threshold:0.15});
document.querySelectorAll('.reveal').forEach(el=>observador.observe(el));

/* ======================================================
   CONTADOR ANIMADO 56,75%
   ====================================================== */
const contadorIndigena = document.getElementById('contador-indigena');
let animado = false;
const observadorContador = new IntersectionObserver((entradas)=>{
  entradas.forEach(e=>{
    if(e.isIntersecting && !animado){
      animado = true;
      let inicio = 0;
      const fin = 56.75;
      const duracion = 1800;
      const t0 = performance.now();
      function paso(t){
        const progreso = Math.min((t - t0)/duracion, 1);
        const valor = (progreso * fin).toFixed(2).replace('.', ',');
        contadorIndigena.textContent = valor + '%';
        if(progreso < 1) requestAnimationFrame(paso);
        else contadorIndigena.textContent = '56,75%';
      }
      requestAnimationFrame(paso);
    }
  });
},{threshold:0.4});
observadorContador.observe(document.querySelector('.dato-destacado'));

/* ======================================================
   MAPA DE NAPO (Google Maps)
   ====================================================== */
const infoCantones = {
  tena:{ nombre:"Tena", color:"#d62828",
    texto:"Capital de la provincia de Napo, conocida como la 'Capital Mundial del Guaraná'. Es el principal centro administrativo, comercial y turístico, referente del turismo comunitario y de aventura en la Amazonía." },
  archidona:{ nombre:"Archidona", color:"#e76f51",
    texto:"Fundada en 1560, es un cantón de fuerte identidad kichwa. Allí se celebra la Fiesta de la Chonta y se practica la alfarería tradicional declarada Patrimonio Inmaterial del Ecuador en 2022." },
  arosemena:{ nombre:"Carlos Julio Arosemena Tola", color:"#2d6a4f",
    texto:"El cantón más pequeño de la provincia. Alberga un museo arqueológico comunitario con petroglifos (piedritas grabadas) y un jardín botánico de gran valor cultural y natural." },
  elchaco:{ nombre:"El Chaco", color:"#48cae4",
    texto:"Ubicado en la zona de transición entre la Sierra y la Amazonía, con presencia del pueblo Kichwa de la sierra en comunidades como Oyacachi. Destaca por sus paisajes de montaña y aguas termales." },
  quijos:{ nombre:"Quijos", color:"#e9c46a",
    texto:"Su cabecera cantonal es Baeza, una de las ciudades más antiguas de la Amazonía ecuatoriana (1559). Combina páramo y selva, con comunidades kichwas de la sierra como Papallacta." }
};

const panelTitulo = document.getElementById('panel-canton-titulo');
const panelTexto = document.getElementById('panel-canton-texto');

function mostrarInfoCanton(id){
  const data = infoCantones[id];
  if(!data) return;
  panelTitulo.textContent = data.nombre;
  panelTitulo.style.color = data.color;
  panelTexto.textContent = data.texto;
  document.getElementById('panel-canton').style.borderLeftColor = data.color;
  actualizarMapa(id);
}

/* ---- Google Maps ----
   Modo 1 (por defecto, sin clave): mapa incrustado de Google Maps. Se puede acercar, alejar y explorar;
   al elegir un cantón se muestra su marcador y se actualizan los enlaces "Abrir" y "Cómo llegar".
   Modo 2 (opcional): si js/config.js contiene una clave de Maps JavaScript API, se muestran los
   cinco marcadores a la vez. Si la clave falla, vuelve solo al Modo 1. */
const MAPA_PROVINCIA = { q:'Provincia de Napo, Ecuador', z:8 };
const ubicacionesMapa = {
  tena:      { q:'Tena, Napo, Ecuador',                          coords:[-0.9936,-77.8156], z:13 },
  archidona: { q:'Archidona, Napo, Ecuador',                     coords:[-0.9203,-77.8014], z:13 },
  arosemena: { q:'Carlos Julio Arosemena Tola, Napo, Ecuador',   coords:[-1.0500,-77.8700], z:13 },
  elchaco:   { q:'El Chaco, Napo, Ecuador',                      coords:[-0.3167,-77.8167], z:13 },
  quijos:    { q:'Baeza, Quijos, Napo, Ecuador',                 coords:[-0.4667,-77.8833], z:13 }
};
const contornoNapo = [
  [0.15,-77.95],[-0.05,-77.55],[-0.35,-77.35],[-0.75,-77.3],
  [-1.3,-77.55],[-1.35,-78.05],[-0.85,-78.15],[-0.35,-78.15],[0.15,-77.95]
];
const mapaIframe = document.getElementById('mapa-iframe');
const mapaApiDiv = document.getElementById('mapa-api');
const enlaceAbrir = document.getElementById('mapa-abrir');
const enlaceRuta  = document.getElementById('mapa-ruta');
let mapaGoogle = null, marcadoresGoogle = {}, ventanaInfo = null;

function urlEmbed(q, z){ return 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&hl=es&z=' + z + '&output=embed'; }
function urlAbrir(q){ return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q); }
function urlRuta(q){ return 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(q); }

function actualizarEnlaces(q){
  if(enlaceAbrir) enlaceAbrir.href = urlAbrir(q);
  if(enlaceRuta)  enlaceRuta.href  = urlRuta(q);
}

function actualizarMapa(id){
  const u = ubicacionesMapa[id]; if(!u) return;
  actualizarEnlaces(u.q);
  if(mapaGoogle){
    mapaGoogle.panTo({lat:u.coords[0], lng:u.coords[1]}); mapaGoogle.setZoom(12);
    const m = marcadoresGoogle[id];
    if(m && ventanaInfo){
      ventanaInfo.setContent('<strong>' + infoCantones[id].nombre + '</strong><br><a href="' + urlAbrir(u.q) + '" target="_blank" rel="noopener">Abrir en Google Maps</a> · <a href="' + urlRuta(u.q) + '" target="_blank" rel="noopener">Cómo llegar</a>');
      ventanaInfo.open({map:mapaGoogle, anchor:m});
    }
  } else if(mapaIframe){
    mapaIframe.src = urlEmbed(u.q, u.z);
  }
}

function verProvincia(){
  actualizarEnlaces(MAPA_PROVINCIA.q);
  if(mapaGoogle){ mapaGoogle.panTo({lat:-0.75,lng:-77.75}); mapaGoogle.setZoom(9); if(ventanaInfo) ventanaInfo.close(); }
  else if(mapaIframe){ mapaIframe.src = urlEmbed(MAPA_PROVINCIA.q, MAPA_PROVINCIA.z); }
  panelTitulo.textContent = 'Selecciona un cantón';
  panelTitulo.style.color = '';
  panelTexto.textContent = 'Haz clic sobre un punto del mapa o en la leyenda para conocer más información de cada cantón de la provincia de Napo.';
  document.getElementById('panel-canton').style.borderLeftColor = '';
}
document.getElementById('mapa-provincia').addEventListener('click', verProvincia);

function volverAlMapaIncrustado(){
  mapaGoogle = null; marcadoresGoogle = {};
  if(mapaApiDiv) mapaApiDiv.hidden = true;
  if(mapaIframe) mapaIframe.style.display = '';
}
window.gm_authFailure = volverAlMapaIncrustado;   // clave inválida o con restricciones: se usa el mapa incrustado

function iniciarMapaGoogleAvanzado(){
  mapaGoogle = new google.maps.Map(mapaApiDiv, {
    center:{lat:-0.75,lng:-77.75}, zoom:9, gestureHandling:'cooperative',
    mapTypeControl:true, streetViewControl:false, fullscreenControl:true
  });
  new google.maps.Polygon({
    paths: contornoNapo.map(p=>({lat:p[0], lng:p[1]})), map:mapaGoogle,
    strokeColor:'#1b4332', strokeOpacity:.9, strokeWeight:2, fillColor:'#2d6a4f', fillOpacity:.05, clickable:false
  });
  ventanaInfo = new google.maps.InfoWindow();
  Object.keys(ubicacionesMapa).forEach(id=>{
    const u = ubicacionesMapa[id], data = infoCantones[id];
    const m = new google.maps.Marker({
      position:{lat:u.coords[0], lng:u.coords[1]}, map:mapaGoogle, title:data.nombre,
      icon:{ path:google.maps.SymbolPath.CIRCLE, scale: id==='tena' ? 12 : 9, fillColor:data.color,
             fillOpacity:.95, strokeColor:'#ffffff', strokeWeight:2 }
    });
    m.addListener('click', ()=> mostrarInfoCanton(id));
    marcadoresGoogle[id] = m;
  });
  mapaApiDiv.hidden = false;
  if(mapaIframe) mapaIframe.style.display = 'none';
}

(function cargarMapaAvanzadoSiHayClave(){
  const clave = window.NAPO_CONFIG && window.NAPO_CONFIG.GOOGLE_MAPS_API_KEY;
  if(!clave) return;                                   // sin clave: se queda el mapa incrustado
  window.__napoMapaListo = iniciarMapaGoogleAvanzado;
  const s = document.createElement('script');
  s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(clave) + '&callback=__napoMapaListo&language=es&region=EC';
  s.async = true; s.onerror = volverAlMapaIncrustado;
  document.head.appendChild(s);
})();

document.querySelectorAll('.leyenda-cantones li').forEach(li=>{
  li.addEventListener('click', ()=> mostrarInfoCanton(li.dataset.canton));
  li.addEventListener('keypress', (e)=>{ if(e.key==='Enter') mostrarInfoCanton(li.dataset.canton); });
});

/* ======================================================
   LÍNEA DE TIEMPO INTERACTIVA
   ====================================================== */
const eventosHistoria = [
  {anio:"Pueblos originarios", titulo:"Omagua y Quijos", texto:"Pueblos originarios del territorio, con activas relaciones comerciales con la región Sierra y con el Imperio Inca."},
  {anio:"1539", titulo:"Expedición de Gonzalo Díaz de Pineda", texto:"Primera incursión española registrada en el territorio amazónico que hoy corresponde a Napo."},
  {anio:"1540", titulo:"Expedición de Gonzalo Pizarro", texto:"Nueva expedición española en busca de El Dorado y la Canela, que profundizó el contacto con los pueblos Quijos."},
  {anio:"1559", titulo:"Fundación de Baeza", texto:"Una de las primeras ciudades españolas en la Amazonía ecuatoriana, hoy cabecera cantonal de Quijos."},
  {anio:"1560", titulo:"Fundación de Archidona", texto:"Fundada como centro de administración colonial sobre el territorio y la población Quijos."},
  {anio:"1563", titulo:"Fundación de Ávila", texto:"Nueva ciudad colonial fundada para consolidar el control español sobre la región."},
  {anio:"1578", titulo:"Rebelión de los Quijos, liderada por Jumandy", texto:"Los pueblos Quijos se levantaron contra el dominio español, destruyendo las ciudades de Ávila y Archidona. El levantamiento fue sofocado y su líder, Jumandy, fue ejecutado en Quito."},
  {anio:"Colonia", titulo:"Territorio marginal y de destierro", texto:"Durante la Colonia, la región amazónica de Napo fue considerada un territorio periférico, utilizado incluso como lugar de destierro."},
  {anio:"Siglos XIX-XX", titulo:"Auge del caucho y el petróleo", texto:"La explotación del caucho primero, y del petróleo después, transformaron la economía y la dinámica poblacional de la provincia."},
  {anio:"Actualidad", titulo:"Transformación moderna de Tena y Archidona", texto:"Tena y Archidona se consolidan como centros urbanos modernos sin perder su identidad amazónica y kichwa."}
];

const contenedorTiempo = document.getElementById('linea-tiempo');
eventosHistoria.forEach((ev)=>{
  const item = document.createElement('div');
  item.className = 'item-tiempo';
  item.innerHTML = `
    <div class="cabecera-tiempo">
      <span class="anio">${ev.anio}</span>
      <span class="titulo-evento">${ev.titulo}</span>
      <span class="flecha-tiempo">▾</span>
    </div>
    <div class="cuerpo-tiempo"><p>${ev.texto}</p></div>
  `;
  item.querySelector('.cabecera-tiempo').addEventListener('click', ()=>{
    item.classList.toggle('abierto');
  });
  contenedorTiempo.appendChild(item);
});

/* ======================================================
   PESTAÑAS SECCIÓN ARTE
   ====================================================== */
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('activo'));
    document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('activo'));
    btn.classList.add('activo');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('activo');
  });
});

/* ======================================================
   GASTRONOMÍA: tarjetas + modal "ver más"
   ====================================================== */
const platosNapo = [
  { id:'maito', titulo:'Maito de pescado', img:'https://commons.wikimedia.org/wiki/Special:FilePath/Maito%20de%20tilapia%20%28gastronom%C3%ADa%20Ecuatoriana%29.jpg?width=900',
    ingredientes:'Ingredientes: pescado de río (tilapia o bocachico), hoja de bijao, sal y hierbas amazónicas.',
    historia:'El pescado se envuelve en hoja de bijao y se cocina al calor directo de la brasa o la ceniza, una técnica ancestral que conserva el sabor y la humedad del alimento sin necesidad de utensilios metálicos.' },
  { id:'chontacuro', titulo:'Chontacuro', img:'img/chontacuro.svg',
    ingredientes:'Ingredientes: larva del escarabajo de la palma de chonta, sal al gusto.',
    historia:'Es una larva rica en proteínas y vitaminas, tradicionalmente asada en brocheta sobre brasas. Representa un alimento ancestral de alto valor nutricional dentro de la dieta kichwa amazónica.' },
  { id:'caldo', titulo:'Caldo de gallina criolla', img:'img/caldo-gallina.svg',
    ingredientes:'Ingredientes: gallina criolla, yuca, zanahoria, cebolla y hierbas aromáticas locales.',
    historia:'Plato de preparación cotidiana y festiva en las comunidades de Napo, elaborado con ingredientes propios de la chacra amazónica y aves criadas de forma tradicional.' },
  { id:'maytu', titulo:'Maytu de pescado', img:'https://commons.wikimedia.org/wiki/Special:FilePath/Maito%20de%20tilapia%20%28gastronom%C3%ADa%20Ecuatoriana%29.jpg?width=900',
    ingredientes:'Ingredientes: pescado de río, hoja de bijao, condimentos naturales de la zona.',
    historia:'Es un plato de carácter ceremonial, preparado especialmente durante la Fiesta de la Chonta, donde se comparte en comunidad como parte de los rituales de agradecimiento a la naturaleza.' },
  { id:'uchumanga', titulo:'Uchumanga', img:'img/uchumanga.svg',
    ingredientes:'Ingredientes: ají amazónico, hongos del bosque, palmito y carnes de monte o pescado.',
    historia:'Salsa picante tradicional que acompaña pescados, carnes de monte, hongos y palmito, aportando el característico sabor picante de la gastronomía kichwa amazónica.' }
];

const gridGastro = document.getElementById('grid-gastronomia');
platosNapo.forEach(p=>{
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta reveal';
  tarjeta.innerHTML = `
    <img src="${p.img}" alt="Plato típico de Napo: ${p.titulo}">
    <div class="cuerpo">
      <h3>${p.titulo}</h3>
      <p>${p.ingredientes}</p>
      <button class="btn-vermas" data-id="${p.id}">Ver más</button>
    </div>
  `;
  gridGastro.appendChild(tarjeta);
  observador.observe(tarjeta);
});

const modalGastro = document.getElementById('modal-gastronomia');
document.getElementById('grid-gastronomia').addEventListener('click', (e)=>{
  if(e.target.classList.contains('btn-vermas')){
    const plato = platosNapo.find(p=>p.id === e.target.dataset.id);
    document.getElementById('modal-gastro-img').src = plato.img;
    document.getElementById('modal-gastro-img').alt = 'Plato típico de Napo: ' + plato.titulo;
    document.getElementById('modal-gastro-titulo').textContent = plato.titulo;
    document.getElementById('modal-gastro-ingredientes').textContent = plato.ingredientes;
    document.getElementById('modal-gastro-historia').textContent = plato.historia;
    modalGastro.classList.add('activo');
  }
});
document.getElementById('cerrar-modal-gastro').addEventListener('click', ()=> modalGastro.classList.remove('activo'));
modalGastro.addEventListener('click', (e)=>{ if(e.target === modalGastro) modalGastro.classList.remove('activo'); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') modalGastro.classList.remove('activo'); });

/* ======================================================
   IMÁGENES: si una foto no carga, se muestra un marcador
   ====================================================== */
document.addEventListener('error', (e)=>{
  const img = e.target;
  if(!(img instanceof HTMLImageElement) || img.dataset.fallback) return;
  if(img.dataset.fallbackSrc && !img.dataset.fallbackTried){      // 1.º intento: imagen local de respaldo
    img.dataset.fallbackTried = '1'; img.src = img.dataset.fallbackSrc; return;
  }
  img.dataset.fallback = '1';
  const txt = (img.alt || 'Imagen pendiente').replace(/&/g,'&amp;').replace(/</g,'&lt;').slice(0,60);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d6a4f"/><stop offset="1" stop-color="#bc6c25"/></linearGradient></defs><rect width="800" height="500" fill="url(#g)"/><text x="400" y="230" font-size="64" text-anchor="middle">🌿</text><text x="400" y="300" font-size="24" fill="#fff" text-anchor="middle" font-family="sans-serif">${txt}</text><text x="400" y="340" font-size="18" fill="#ffe8c2" text-anchor="middle" font-family="sans-serif">Imagen pendiente</text></svg>`;
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}, true);

/* ======================================================
   MINIJUEGO DE TARJETAS (58 preguntas del CSV)
   ====================================================== */
(function(){
  /* ---- TARJETAS (58): pregunta, respuesta. Vienen de flashcards.csv ---- */
  var RAW = [
["¿Cuál es la capital de la provincia de Napo?","La ciudad de Tena."],
["¿Con qué país limita la provincia de Napo hacia el este?","Con el país de Perú."],
["¿Cuáles son los cinco cantones que integran la provincia de Napo?","Tena, Archidona, El Chaco, Quijos y Carlos Julio Arosemena Tola."],
["¿Qué pueblos ancestrales habitaban el territorio de Napo antes de la llegada de los españoles?","Los pueblos Omagua y Quijos."],
["¿Qué gobernante inca intentó incorporar sin éxito duradero la región de Napo a su imperio?","El inca Huayna Cápac."],
["¿Quién exploró la zona de Napo en 1539 motivado por la búsqueda de la canela y El Dorado?","Gonzalo Díaz de Pineda."],
["¿Quién organizó la gran expedición española a la Amazonía ecuatoriana en el año 1540?","Gonzalo Pizarro."],
["¿En qué año fundaron los españoles la ciudad de Baeza?","En el año 1559."],
["¿Qué líder indígena dirigió la sublevación de los Quijos en 1578 destruyendo Ávila y Archidona?","El cacique Jumandy."],
["¿Qué impacto social provocó el auge del caucho a finales del siglo XIX y principios del XX en Napo?","Provocó el desplazamiento forzado de poblaciones indígenas hacia el Perú."],
["¿Qué presidente ecuatoriano impulsó la política de “fronteras vivas” para colonizar Napo tras el conflicto de 1941?","José María Velasco Ibarra."],
["¿En qué década se descubrió petróleo en Napo, impulsando la construcción del Oleoducto Transecuatoriano (SOTE)?","En la década de 1970."],
["¿En qué mes y año fue incorporada la alfarería tradicional de Tena y Archidona al Patrimonio Cultural Inmaterial del Ecuador?","En junio de 2022."],
["¿Qué fibras vegetales utilizan habitualmente las comunidades de Napo para elaborar sus tejidos artesanales?","La chambira y el algodón."],
["¿Qué tipos de madera se emplean principalmente en Napo para la talla artesanal de figuras y utensilios?","La balsa y la chonta."],
["¿A qué condición ambiental responde principalmente el diseño de la arquitectura tradicional vernácula de Napo?","Al clima tropical húmedo."],
["¿Qué diseño urbanístico impusieron los españoles en las ciudades coloniales de Napo?","El trazado en damero con una plaza central."],
["¿A través de qué medio se transmite principalmente la literatura ancestral de la nacionalidad Kichwa en Napo?","A través de la tradición oral."],
["En la parroquia Misahuallí, el Festival de Mujeres Adultas Mayores Kichwas promueve la preservación lingüística mediante _____.","cantos y danzas ancestrales"],
["Según el Sistema de Información del Patrimonio Cultural del Ecuador, ¿cuáles son dos juegos tradicionales registrados en Napo?","Los volantes y la chaskina."],
["Mencione dos danzas tradicionales registradas como patrimonio cultural inmaterial de la provincia de Napo.","La danza de Mondayacu y la danza de la boda."],
["Según el censo del año 2010, ¿qué porcentaje de la población de Napo se autoidentificó como indígena?","El 56,75 % de la población."],
["¿En qué cantones de Napo se asienta principalmente el pueblo Kichwa amazónico?","En Archidona, Tena y Carlos Julio Arosemena Tola."],
["¿En qué comunidades del cantón Tena habita la nacionalidad Waorani?","En las comunidades de Gareno y Meñepare."],
["¿Qué grupos Kichwa procedentes de la sierra se asentaron en los cantones de Quijos y El Chaco?","Los Papallactas, Tambos y Oyacachis."],
["Además del español, ¿cuáles son las dos lenguas indígenas de relación intercultural habladas en Napo?","El Kichwa (Runa Shimi) y el Shuar."],
["El dialecto del Kichwa hablado en Tena, Arajuno y Ahuano guarda una relación estrecha con el dialecto _____.","Kichwa serrano"],
["¿En qué cantón de Napo se celebra tradicionalmente la Fiesta de la Chonta?","En el cantón Archidona."],
["¿Qué dignidad femenina se elige durante la celebración ancestral de la Fiesta de la Chonta?","La “Mushuk Chonta Warmi”."],
["¿En qué parroquia y mes se lleva a cabo la festividad del Kuya Raymi en la provincia de Napo?","En la parroquia Talag, durante el mes de junio."],
["¿En qué fecha anual se celebra el encuentro cultural Guayusa Warmi en Tena?","El 15 de noviembre."],
["¿Con qué título o epíteto cultural se le conoce popularmente a la ciudad de Tena?","Capital de la guayusa y la canela."],
["Mencione dos actividades preparatorias masculinas que forman parte del ritual tradicional de la boda Kichwa.","La cacería y la pesca."],
["¿Con qué hojas vegetales se envuelve el pescado para elaborar el tradicional maito de Napo?","Con hojas de bijao."],
["¿Qué condimento no se utiliza en la receta tradicional del maito de pescado para preservar su sabor natural?","La sal."],
["¿Qué es el chontacuro en la gastronomía tradicional de Napo?","La larva del escarabajo de la palma de chonta."],
["¿De qué forma se cocina habitualmente el chontacuro para su consumo?","Asado al fuego o al carbón."],
["¿Qué tubérculo sirve como ingrediente y acompañamiento principal en el caldo de gallina criolla?","La yuca."],
["El maytu de pescado es un plato de especial importancia ceremonial durante la celebración de _____.","la Fiesta de la Chonta"],
["¿Qué tipo de preparación gastronómica ancestral es la uchumanga?","Una salsa de ají que acompaña pescados, carnes de monte y palmito."],
["¿A qué periodo histórico se remonta la transmisión de la técnica de preparación de la uchumanga?","Al periodo prehispánico."],
["Mencione tres ingredientes base vegetales de origen local utilizados en la cocina ancestral Kichwa.","La yuca, el plátano verde y el maíz."],
["¿Qué carácter o naturaleza define a la música tradicional Naporuna?","Un carácter ritual y simbólico."],
["Mencione dos eventos rituales o festividades donde se interpreta la música Naporuna.","Las bodas tradicionales y los cambios de autoridades o varayocs."],
["¿Cuáles son los dos instrumentos principales que acompañan ritualmente las danzas ancestrales en Napo?","El tambor y el violín."],
["¿Qué instrumento de viento de origen andino se integró a la música Kichwa amazónica en Napo?","El pingullo."],
["¿Qué género musical interpreta el grupo Kichwa llamado Chicos del Barrio?","La cumbia kichwa."],
["¿Quiénes fundaron la agrupación musical Chicos del Barrio en el año 2016?","Lizandro Vargas y Darwin Tanguila."],
["Mencione un tema musical original compuesto por la agrupación Chicos del Barrio.","Warmilla (o Apatikas / Ñuka Warmishitalla)."],
["¿Cuál es el nombre artístico de Pedro Kléber Huatatoca Tapuy?","Huatusa Loca."],
["¿Por qué razón el artista Pedro Kléber Huatatoca adoptó el nombre “Huatusa Loca”?","Para rendir homenaje a la huatusa, animal selvático en peligro."],
["Mencione un tema musical destacado del artista Huatusa Loca.","Tuna malta huarmi (o Rucu causay / Mucu maqui)."],
["¿En qué año se formó la agrupación de danza y música tradicional Tushuy Taqui Sacha Manda?","En el año 2009."],
["¿Qué traducción al español tiene el tema musical “Sawarina tushuna puncha” de Tushuy Taqui Sacha Manda?","El día de la boda."],
["¿Qué estilo musical de fusión fue creado por el gestor cultural Carlos Alvarado “Mishki”?","El estilo “Runa Paju” o “Magia Runa”."],
["¿En qué elementos de la naturaleza se inspira la propuesta musical de Carlos Alvarado “Mishki”?","En los sonidos del bosque, la selva y las aves."],
["¿Qué significan las siglas SIPCE en el ámbito del patrimonio cultural ecuatoriano?","Sistema de Información del Patrimonio Cultural del Ecuador."],
["¿Cuántos bienes inmateriales registrados posee la provincia de Napo en los registros patrimoniales?","169 bienes inmateriales."]
  ];

  var KEY = 'napo_quiz_best_v1';
  var $ = function(id){return document.getElementById(id)};
  var el = {
    stage:$('nq-stage'), game:$('nq-game'), end:$('nq-end'), card:$('nq-card'), wrap:$('nq-wrap'),
    q:$('nq-q'), a:$('nq-a'), c1:$('nq-count'), c2:$('nq-count2'), verdict:$('nq-verdict'),
    prev:$('nq-prev'), next:$('nq-next'), good:$('nq-good'), bad:$('nq-bad'),
    goodN:$('nq-good-n'), badN:$('nq-bad-n'), pts:$('nq-points'), ptsN:$('nq-points-n'),
    streakN:$('nq-streak-n'), best:$('nq-best'), toast:$('nq-toast'),
    menuBtn:$('nq-menu-btn'), menu:$('nq-menu')
  };

  var allCards = RAW.map(function(r,i){return {id:i,q:r[0],a:r[1]}});
  var deck, pos, flipped, locked, status, points, streak, okN, badN, bestScore = 0;

  function loadBest(){ try{ bestScore = parseInt(localStorage.getItem(KEY)||'0',10)||0; }catch(e){ bestScore = 0; } el.best.textContent = bestScore; }
  function saveBest(){ if(points>bestScore){ bestScore=points; try{ localStorage.setItem(KEY,String(bestScore)); }catch(e){} el.best.textContent=bestScore; } }
  function bump(node){ node.classList.remove('bump'); void node.offsetWidth; node.classList.add('bump'); }
  function shuffle(a){ for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;} return a; }

  function start(cards, keepPoints){
    deck = cards.slice(); pos = 0; flipped = false; locked = false; status = {};
    okN = 0; badN = 0; streak = 0;
    if(!keepPoints) points = 0;
    el.end.classList.remove('show'); el.game.style.display = '';
    el.ptsN.textContent = points; el.streakN.textContent = 0;
    render();
  }

  function render(){
    if(pos >= deck.length){ showEnd(); return; }
    var c = deck[pos];
    el.card.classList.add('noanim'); el.card.classList.remove('flipped'); flipped = false;
    el.q.textContent = c.q; el.a.textContent = c.a;
    var label = (pos+1)+'/'+deck.length;
    el.c1.textContent = label; el.c2.textContent = label;
    void el.card.offsetWidth; el.card.classList.remove('noanim');
    el.goodN.textContent = okN; el.badN.textContent = badN;
    updateButtons();
  }

  function updateButtons(){
    var c = deck[pos];
    var answered = c && status[c.id];
    el.good.disabled = !flipped || !!answered || locked;
    el.bad.disabled = !flipped || !!answered || locked;
    el.prev.disabled = pos === 0;
    el.next.disabled = pos >= deck.length;
  }

  function flip(){
    if(locked || pos >= deck.length) return;
    flipped = !flipped; el.card.classList.toggle('flipped', flipped); updateButtons();
  }

  function go(d){
    if(locked) return;
    var n = pos + d;
    if(n < 0) return;
    pos = n; render();
  }

  function mark(ok){
    if(!flipped || locked) return;
    var c = deck[pos]; if(status[c.id]) return;
    locked = true; status[c.id] = ok ? 'ok' : 'bad';
    if(ok){
      okN++; points += 10; streak++;
      if(streak % 3 === 0){ points += 5; showToast('¡Racha x'+streak+'! +5'); }
    } else { badN++; streak = 0; }
    el.goodN.textContent = okN; el.badN.textContent = badN;
    el.ptsN.textContent = points; el.streakN.textContent = streak; bump(el.pts);
    saveBest();
    el.verdict.className = 'nq-verdict ' + (ok ? 'ok' : 'bad');
    el.verdict.textContent = ok ? 'Entendido' : 'Lo lograrás la próxima vez';
    updateButtons();
    setTimeout(function(){
      el.verdict.className = 'nq-verdict'; locked = false; pos++; render();
    }, 800);
  }

  function showToast(t){
    el.toast.textContent = t; el.toast.classList.add('show');
    setTimeout(function(){ el.toast.classList.remove('show'); }, 1400);
  }

  function showEnd(){
    el.game.style.display = 'none'; el.end.classList.add('show');
    $('nq-end-score').textContent = points;
    var pct = deck.length ? Math.round(okN/deck.length*100) : 0;
    $('nq-end-pct').textContent = 'Aciertos: ' + okN + ' de ' + deck.length + ' (' + pct + '%)';
    var defs = [['Explorador',100],['Guardián de la cultura',300],['Maestro Kichwa',500]];
    $('nq-badges').innerHTML = defs.map(function(d){
      return '<span class="nq-badge'+(points>=d[1]?' on':'')+'">'+(points>=d[1]?'🏅 ':'🔒 ')+d[0]+' · '+d[1]+'</span>';
    }).join('');
    $('nq-end-review').style.display = badN ? '' : 'none';
    saveBest();
  }

  function reviewFailed(){
    var failed = Object.keys(status).filter(function(k){return status[k]==='bad'}).map(function(k){return allCards[+k] || deck.filter(function(c){return c.id==k})[0]});
    failed = failed.filter(Boolean);
    if(!failed.length){ showToast('No tienes tarjetas falladas'); return; }
    start(failed, true);
  }

  /* Eventos */
  el.card.addEventListener('click', flip);
  el.prev.addEventListener('click', function(){ go(-1); });
  el.next.addEventListener('click', function(){ go(1); });
  el.good.addEventListener('click', function(){ mark(true); });
  el.bad.addEventListener('click', function(){ mark(false); });
  el.menuBtn.addEventListener('click', function(e){ e.stopPropagation(); el.menu.classList.toggle('open'); });
  document.addEventListener('click', function(e){ if(!el.menu.contains(e.target)) el.menu.classList.remove('open'); });
  el.menu.addEventListener('click', function(e){
    var a = e.target.getAttribute('data-act'); if(!a) return;
    el.menu.classList.remove('open');
    if(a==='shuffle') start(shuffle(allCards.slice()));
    if(a==='restart') start(allCards);
    if(a==='review') reviewFailed();
  });
  $('nq-end-review').addEventListener('click', reviewFailed);
  $('nq-end-restart').addEventListener('click', function(){ start(allCards); });

  el.stage.addEventListener('keydown', function(e){
    if(e.key === ' ' || e.key === 'Enter'){ if(e.target.tagName==='BUTTON') return; e.preventDefault(); flip(); }
    else if(e.key === 'ArrowRight'){ e.preventDefault(); go(1); }
    else if(e.key === 'ArrowLeft'){ e.preventDefault(); go(-1); }
  });

  var sx = null;
  el.wrap.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive:true});
  el.wrap.addEventListener('touchend', function(e){
    if(sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if(Math.abs(dx) < 70) return;
    if(!flipped){ return; }
    mark(dx > 0);
  });

  /* CSV propio (comillas, comas y saltos de línea; sin encabezado) */
  function parseCSV(t){
    var rows=[],row=[],f='',q=false;
    for(var i=0;i<t.length;i++){
      var ch=t[i];
      if(q){ if(ch==='"'){ if(t[i+1]==='"'){f+='"';i++;} else q=false; } else f+=ch; }
      else if(ch==='"') q=true;
      else if(ch===','){ row.push(f); f=''; }
      else if(ch==='\n'||ch==='\r'){ if(ch==='\r'&&t[i+1]==='\n') i++; row.push(f); rows.push(row); row=[]; f=''; }
      else f+=ch;
    }
    if(f!==''||row.length){ row.push(f); rows.push(row); }
    return rows.filter(function(r){return r.length>=2 && r[0].trim()});
  }
  $('nq-load-btn').addEventListener('click', function(){ $('nq-file').click(); });
  $('nq-file').addEventListener('change', function(e){
    var file = e.target.files[0]; if(!file) return;
    var rd = new FileReader();
    rd.onload = function(){
      var rows = parseCSV(String(rd.result).replace(/^\uFEFF/,''));
      if(!rows.length){ showToast('No se encontraron tarjetas'); return; }
      allCards = rows.map(function(r,i){return {id:i,q:r[0].trim(),a:r[1].trim()}});
      el.c1.textContent = '1/'+allCards.length;
      start(allCards);
    };
    rd.readAsText(file, 'utf-8');
  });

  loadBest();
  start(allCards);
})();


/* ======================================================
   YOUTUBE: no funciona si la página se abre como archivo (file://)
   ====================================================== */
(function(){
  if(location.protocol !== 'file:') return;
  document.querySelectorAll('.yt-wrap iframe').forEach(f=>{
    const id = (f.src.match(/embed\/([\w-]+)/)||[])[1];
    if(!id) return;
    const aviso = document.createElement('div');
    aviso.className = 'yt-aviso';
    aviso.innerHTML = '<span>▶ YouTube no se reproduce al abrir el archivo directamente.<br>Súbelo a un servidor o ábrelo con localhost.</span>' +
      '<a href="https://www.youtube.com/watch?v='+id+'" target="_blank" rel="noopener">Ver en YouTube</a>';
    f.replaceWith(aviso);
  });
})();

/* ======================================================
   VIDEO LOCAL: mensaje si no se encuentra video/napo.mp4
   ====================================================== */
(function(){
  const v = document.getElementById('video-napo');
  const m = document.getElementById('mensaje-video');
  if(!v || !m) return;
  const src = v.querySelector('source');
  if(src) src.addEventListener('error', ()=> m.style.display = 'block');
  v.addEventListener('error', ()=> m.style.display = 'block');
})();
