/* Mapa cultural interactivo */
(function(){
// Configuración de categorías y colores editoriales
    const CATEGORIES = {
      "Todos": {
        color: "#123524",
        badgeBg: "bg-selva-900 text-white",
        pillInactive: "bg-white text-selva-900 border-crema-200 hover:bg-crema-100",
        pillActive: "bg-selva-900 text-white border-selva-900"
      },
      "Fiestas y Rituales": {
        color: "#b84b27",
        badgeBg: "bg-terracota-600 text-white",
        pillInactive: "bg-white text-terracota-700 border-crema-200 hover:bg-terracota-100/50",
        pillActive: "bg-terracota-600 text-white border-terracota-600"
      },
      "Patrimonio Material": {
        color: "#b58119",
        badgeBg: "bg-ocre-600 text-white",
        pillInactive: "bg-white text-ocre-600 border-crema-200 hover:bg-ocre-100/60",
        pillActive: "bg-ocre-600 text-white border-ocre-600"
      },
      "Patrimonio Inmaterial y Alfarería": {
        color: "#247196",
        badgeBg: "bg-rio-600 text-white",
        pillInactive: "bg-white text-rio-700 border-crema-200 hover:bg-rio-100/60",
        pillActive: "bg-rio-600 text-white border-rio-600"
      },
      "Juegos y Tradición Oral": {
        color: "#276a4b",
        badgeBg: "bg-selva-700 text-white",
        pillInactive: "bg-white text-selva-800 border-crema-200 hover:bg-selva-100/60",
        pillActive: "bg-selva-700 text-white border-selva-700"
      },
      "Gobernanza y Desarrollo Local": {
        color: "#5b3e96",
        badgeBg: "bg-indigo-800 text-white",
        pillInactive: "bg-white text-indigo-900 border-crema-200 hover:bg-indigo-50",
        pillActive: "bg-indigo-800 text-white border-indigo-800"
      }
    };

    // Base de datos georreferenciada extraída estrictamente de S15-COMPONENTE PRACTICO_2.docx
    const CULTURAL_POINTS = [
      {
        id: "tena",
        name: "Tena (Cabecera Cantonal)",
        canton: "Cantón Tena • Capital Provincial",
        category: "Gobernanza y Desarrollo Local",
        secondaryCategories: ["Fiestas y Rituales", "Patrimonio Material", "Patrimonio Inmaterial y Alfarería"],
        x: 382,
        y: 358,
        shortLabel: "Tena",
        description: "Reconocida como la 'capital de la guayusa y la canela', Tena articula la celebración cívico-ritual de la Guayusa Warmi, la arquitectura tradicional adaptada al clima tropical húmedo, la alfarería inscrita en 2022 y las políticas provinciales de educación intercultural y gobernanza del PDOT.",
        keyFacts: [
          { label: "Fiesta Emblemática", value: "Guayusa Warmi (15 de noviembre, coincidente con la fundación de Tena)." },
          { label: "Educación Kichwa", value: "685 participantes capacitados en cursos básico e intermedio (convenio GAD Provincial – SEIBE)." },
          { label: "Meta PDOT 2027", value: "Incrementar de 3.542 a 5.542 participantes activos en identidad cultural." },
          { label: "Patrimonio y Alerta", value: "Alfarería inscrita en 2022 y arquitectura tradicional; el PDOT advierte bienes destruidos/abandonados que requieren actualizar inventario." }
        ],
        quote: "«Guayusa Warmi: Tena, 15 de noviembre, coincidente con la fundación de Tena; Tena es reconocida como 'capital de la guayusa y la canela'.»"
      },
      {
        id: "archidona",
        name: "Archidona y Universidad Ikiam",
        canton: "Cantón Archidona",
        category: "Fiestas y Rituales",
        secondaryCategories: ["Patrimonio Inmaterial y Alfarería", "Gobernanza y Desarrollo Local"],
        x: 368,
        y: 298,
        shortLabel: "Archidona",
        description: "Centro neurálgico de las festividades Kichwa amazónicas como la Fiesta de la Chonta y el Carnaval 'Capoa'. Además, sus talleres de alfarería tradicional y la articulación académica con la Universidad Regional Amazónica Ikiam lograron el reconocimiento nacional de 2022.",
        keyFacts: [
          { label: "Fiesta de la Chonta", value: "Abril–mayo (registro del 3 al 7 de mayo): maytu de pescado, chicha de chonta y elección de Mushuk Chonta Warmi." },
          { label: "Carnaval", value: "Tematizado como 'Territorio Ancestral y Cultural', destacando el 'Capoa' en Archidona." },
          { label: "Alianza Institucional", value: "Articulación entre GAD de Archidona y Tena, Universidad Ikiam y Ministerio de Cultura para la declaratoria de junio 2022." },
          { label: "Arquitectura", value: "Vivienda y arquitectura tradicional adaptada al clima tropical húmedo." }
        ],
        quote: "«La alfarería fue incorporada a la lista representativa del patrimonio inmaterial en 2022 tras un proceso de varios años que involucró a los GAD municipales de Tena y Archidona, la Universidad Ikiam y el Ministerio de Cultura.»"
      },
      {
        id: "talag",
        name: "Parroquia Talag",
        canton: "Cantón Tena • Parroquia Talag",
        category: "Fiestas y Rituales",
        secondaryCategories: [],
        x: 315,
        y: 355,
        shortLabel: "Talag",
        description: "Parroquia rural del cantón Tena donde se celebra el Kuya Raymi, una manifestación festiva y artesanal que pone en valor la elaboración de utensilios con kuya y visibiliza el liderazgo cultural de la mujer Kichwa.",
        keyFacts: [
          { label: "Fecha de Celebración", value: "14 y 15 de junio de cada año." },
          { label: "Expresión Artesanal", value: "Elaboración de recipientes y artesanías tradicionales con kuya." },
          { label: "Enfoque de Igualdad", value: "Elección de la Kuya Warmi, visibilizando el rol femenino en la cultura local." }
        ],
        quote: "«Kuya Raymi: parroquia Talag, 14–15 de junio. Elaboración de recipientes y artesanías con kuya; elección de la Kuya Warmi.»"
      },
      {
        id: "puerto-napo",
        name: "Puerto Napo",
        canton: "Cantón Tena • Puerto Napo",
        category: "Patrimonio Material",
        secondaryCategories: ["Gobernanza y Desarrollo Local"],
        x: 412,
        y: 382,
        shortLabel: "Puerto Napo",
        description: "Punto estratégico sobre el río Napo donde se ejecuta la construcción del Hito Cultural de Puerto Napo mediante mecanismos de presupuesto participativo, fortaleciendo la infraestructura patrimonial de la provincia.",
        keyFacts: [
          { label: "Inversión Pública", value: "USD 36.472 financiados mediante presupuesto participativo." },
          { label: "Cronograma", value: "Previsto para julio de 2026 como patrimonio material en construcción." },
          { label: "Gobernanza", value: "Ejemplo de presupuestación participativa y rendición de cuentas del GAD Provincial." }
        ],
        quote: "«El hito cultural de Puerto Napo, financiado con presupuesto participativo (USD 36 472) y previsto para julio de 2026, constituye un patrimonio material en construcción.»"
      },
      {
        id: "comunidades-alfareras",
        name: "Comunidades Alfareras (Tiyuyaku, Venecia Derecha, Kachiwañuska, Ahuano y San Pedro de Muyuna)",
        canton: "Cantones Tena y Archidona • Cuenca del Napo",
        category: "Patrimonio Inmaterial y Alfarería",
        secondaryCategories: ["Gobernanza y Desarrollo Local"],
        x: 505,
        y: 368,
        shortLabel: "Ruta Alfarera",
        description: "Red de cinco comunidades amazónicas donde 31 mujeres alfareras mantienen viva la cerámica ancestral Kichwa, inscrita en junio de 2022 en la Lista Representativa del Patrimonio Cultural Inmaterial del Ecuador.",
        keyFacts: [
          { label: "Portadoras", value: "31 alfareras de Tiyuyaku, Venecia Derecha, Kachiwañuska, Ahuano y San Pedro de Muyuna." },
          { label: "Reconocimiento", value: "Inscrita en junio de 2022 en la Lista Representativa del PCI del Ecuador (aún pendiente de registro en SIPCE)." },
          { label: "Impacto Económico", value: "'Renacer' impulsado por el turismo comunitario, generando ingresos directos para familias artesanas." }
        ],
        quote: "«La alfarería de Tena y Archidona, aunque inscrita como patrimonio inmaterial, tiene una dimensión material conformada por objetos, herramientas y talleres.»"
      },
      {
        id: "wayra-yacu",
        name: "Wayra Yacu",
        canton: "Cantón Tena • Wayra Yacu",
        category: "Patrimonio Inmaterial y Alfarería",
        secondaryCategories: [],
        x: 448,
        y: 332,
        shortLabel: "Wayra Yacu",
        description: "Comunidad referente en la lutería y tradición musical amazónica, destacada en los registros del SIPCE por la fabricación artesanal del warkar (tambor tradicional) y la interpretación de música Naporuna.",
        keyFacts: [
          { label: "Técnica Artesanal", value: "Fabricación tradicional del warkar (tambor ancestral)." },
          { label: "Música y Danza", value: "Música Naporuna, Mondayacu, danza de la boda y danza de la siembra." },
          { label: "Agrupaciones", value: "Presencia de grupos musicales tradicionales como Kurikindy, Los Jilgueritos y Los Yumbos Chawamankos." }
        ],
        quote: "«Técnicas artesanales registradas en el SIPCE: cestería; artesanías en fibras y semillas; fabricación del warkar (tambor) en Wayra Yacu.»"
      },
      {
        id: "shiwakucha",
        name: "Shiwakucha y Tradición Oral / Lúdica Napu Runa",
        canton: "Cantón Tena • Shiwakucha",
        category: "Juegos y Tradición Oral",
        secondaryCategories: [],
        x: 348,
        y: 392,
        shortLabel: "Shiwakucha",
        description: "Espacio emblemático de la tradición oral Kichwa donde se documenta el cuento del Pumarumi, junto con los relatos morales de Apústulu y 'El origen del sapo gota', y juegos tradicionales como la chaskina (sara panga).",
        keyFacts: [
          { label: "Tradición Oral", value: "Cuento del Pumarumi en Shiwakucha; mitos de Apústulu (pesca con llika), 'El origen del sapo gota' y 'El origen de la guatusa'." },
          { label: "Reglas de la Chaskina", value: "Pelota de hojas secas de maíz (sara panga), equipos de 3 hombres y 3 mujeres en círculo de 3–4 m, máx. 2 golpes con una mano." },
          { label: "Otros Juegos", value: "Pukuna (cerbatana), lanzamiento de lanza, waysapuru (trompo ancestral), volantes y 'navegando por el río'." }
        ],
        quote: "«Los relatos transmiten valores morales claros: generosidad, honestidad, respeto a los mayores y correcto uso de los recursos.»"
      },
      {
        id: "linares",
        name: "Parroquia Linares",
        canton: "Cantón El Chaco • Parroquia Linares",
        category: "Patrimonio Material",
        secondaryCategories: ["Patrimonio Inmaterial y Alfarería", "Juegos y Tradición Oral"],
        x: 495,
        y: 162,
        shortLabel: "Linares",
        description: "Parroquia del cantón El Chaco que concentra importantes vestigios arqueológicos monumentales y rupestres de Napo, además de saberes vivos de medicina tradicional y relatos fundacionales.",
        keyFacts: [
          { label: "Patrimonio Arqueológico", value: "Asentamiento monumental Pamba Huasi y Petroglifo Río Cauchillo de Linares." },
          { label: "Medicina Tradicional", value: "Atención ancestral al parto ejercida por la portadora María Collago." },
          { label: "Tradición Oral", value: "Historia oral de la fundación de Linares registrada en el SIPCE." }
        ],
        quote: "«En la parroquia Linares (El Chaco) se registran el asentamiento monumental Pamba Huasi y el Petroglifo Río Cauchillo de Linares.»"
      },
      {
        id: "el-chaco",
        name: "Cabecera Cantonal de El Chaco",
        canton: "Cantón El Chaco",
        category: "Patrimonio Material",
        secondaryCategories: [],
        x: 425,
        y: 122,
        shortLabel: "El Chaco",
        description: "Núcleo urbano del valle del río Quijos que conserva muestras representativas de la arquitectura y vivienda tradicional vernácula de la alta Amazonía.",
        keyFacts: [
          { label: "Bienes Inmuebles", value: "Vivienda tradicional registrada en las calles La Revolución y Francisco Tram." },
          { label: "Valor Patrimonial", value: "Arquitectura adaptada a las condiciones climáticas y constructivas de la región." }
        ],
        quote: "«En la cabecera cantonal de El Chaco se registra vivienda tradicional en las calles La Revolución y Francisco Tram.»"
      },
      {
        id: "el-bombon",
        name: "Comunidad El Bombón",
        canton: "Provincia de Napo • El Bombón",
        category: "Patrimonio Inmaterial y Alfarería",
        secondaryCategories: [],
        x: 325,
        y: 225,
        shortLabel: "El Bombón",
        description: "Localidad reconocida en el inventario patrimonial por la vigencia de la medicina ancestral amazónica especializada en el tratamiento traumatológico tradicional.",
        keyFacts: [
          { label: "Práctica Médica", value: "Curación tradicional de golpes y torceduras mediante saberes botánicos y terapéuticos." },
          { label: "Portador Reconocido", value: "Juan Manuel Collago (registrado en el ámbito de medicina tradicional)." }
        ],
        quote: "«Medicina tradicional: curación de golpes y torceduras en El Bombón (portador: Juan Manuel Collago).»"
      },
      {
        id: "territorio-multinacional",
        name: "Territorio Multinacional (Kichwa, Waorani y Quijos)",
        canton: "Toda la Provincia de Napo (Incl. Quijos y C.J. Arosemena Tola)",
        category: "Gobernanza y Desarrollo Local",
        secondaryCategories: ["Patrimonio Inmaterial y Alfarería"],
        x: 585,
        y: 412,
        shortLabel: "Territorio Vivo",
        description: "Napo es un territorio pluricultural habitado por las nacionalidades Kichwa, Waorani y Quijos, donde la chakra ancestral, los ríos y los sitios sagrados integran identidad, soberanía alimentaria y desarrollo turístico.",
        keyFacts: [
          { label: "Nacionalidades", value: "Convivencia de pueblos Kichwa (Napu Runa), Waorani y Quijos con sus propias cosmovisiones." },
          { label: "Chakra Ancestral", value: "Sistema agroforestal protegido mediante proyectos de soberanía alimentaria y conservación." },
          { label: "Identidad y Turismo", value: "Memoria histórica de Jumandi y Plan de Desarrollo Turístico Provincial 2022–2027." }
        ],
        quote: "«El territorio no es solo espacio físico: la chakra ancestral, los ríos y los sitios sagrados son parte del patrimonio cultural.»"
      }
    ];

    // Estado de la aplicación
    let activeCategory = "Todos";
    let searchQuery = "";
    let selectedPointId = "tena";

    // Estado de Transformación (Zoom y Paneo del SVG)
    let zoomScale = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    // Referencias del DOM
    const categoryFilterBar = document.getElementById("categoryFilterBar");
    const searchInput = document.getElementById("searchInput");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const markersLayer = document.getElementById("markersLayer");
    const legendItems = document.getElementById("legendItems");
    const quickPointList = document.getElementById("quickPointList");
    const detailPanel = document.getElementById("detailPanel");
    const visibleCountBadge = document.getElementById("visibleCountBadge");
    const mapViewport = document.getElementById("mapViewport");
    const mapTransformGroup = document.getElementById("mapTransformGroup");

    // Obtener puntos filtrados
    function getFilteredPoints() {
      const q = searchQuery.trim().toLowerCase();
      return CULTURAL_POINTS.filter(pt => {
        const matchesCategory =
          activeCategory === "Todos" ||
          pt.category === activeCategory ||
          (pt.secondaryCategories && pt.secondaryCategories.includes(activeCategory));

        const searchable = [
          pt.name,
          pt.canton,
          pt.category,
          pt.description,
          ...pt.keyFacts.map(f => `${f.label} ${f.value}`)
        ].join(" ").toLowerCase();

        const matchesSearch = !q || searchable.includes(q);
        return matchesCategory && matchesSearch;
      });
    }

    // Renderizar barra de categorías
    function renderCategoryBar() {
      categoryFilterBar.innerHTML = Object.keys(CATEGORIES).map(cat => {
        const isActive = activeCategory === cat;
        const styleClass = isActive ? CATEGORIES[cat].pillActive : CATEGORIES[cat].pillInactive;
        return `
          <button
            data-cat="${cat}"
            class="cat-pill shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${styleClass}"
          >
            ${cat}
          </button>
        `;
      }).join("");

      document.querySelectorAll(".cat-pill").forEach(btn => {
        btn.addEventListener("click", () => {
          activeCategory = btn.getAttribute("data-cat");
          renderCategoryBar();
          updateApp();
        });
      });
    }

    // Renderizar leyenda del mapa
    function renderLegend() {
      const cats = Object.keys(CATEGORIES).filter(c => c !== "Todos");
      legendItems.innerHTML = cats.map(cat => `
        <button data-legend-cat="${cat}" class="legend-btn inline-flex items-center gap-1.5 hover:opacity-80 transition cursor-pointer">
          <span class="w-2.5 h-2.5 rounded-full inline-block" style="background-color: ${CATEGORIES[cat].color}"></span>
          <span class="text-[11px] font-medium text-gray-700">${cat}</span>
        </button>
      `).join("");

      document.querySelectorAll(".legend-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const clickedCat = btn.getAttribute("data-legend-cat");
          activeCategory = activeCategory === clickedCat ? "Todos" : clickedCat;
          renderCategoryBar();
          updateApp();
        });
      });
    }

    // Renderizar marcadores en el SVG
    function renderMarkers(filteredPoints) {
      markersLayer.innerHTML = filteredPoints.map(pt => {
        const isSelected = pt.id === selectedPointId;
        const catColor = CATEGORIES[pt.category]?.color || "#123524";
        const radius = isSelected ? 11 : 8.5;

        return `
          <g
            class="marker-group"
            data-point-id="${pt.id}"
            transform="translate(${pt.x}, ${pt.y})"
            role="button"
            tabindex="0"
            aria-label="${pt.name} - ${pt.category}"
          >
            <!-- Halo pulsante si está seleccionado -->
            ${isSelected ? `
              <circle r="15" fill="${catColor}" class="marker-pulse"></circle>
              <circle r="16" fill="none" stroke="${catColor}" stroke-width="1.5" stroke-dasharray="3 2"></circle>
            ` : `
              <circle r="12" fill="${catColor}" opacity="0.18"></circle>
            `}

            <!-- Núcleo del marcador -->
            <circle
              class="marker-core"
              r="${radius}"
              fill="${catColor}"
              stroke="#ffffff"
              stroke-width="${isSelected ? 3 : 2.2}"
            ></circle>

            <!-- Punto interior blanco -->
            <circle r="2.8" fill="#ffffff"></circle>

            <!-- Etiqueta flotante legible -->
            <g transform="translate(0, ${isSelected ? -18 : -14})">
              <rect
                x="${-(pt.shortLabel.length * 3.4 + 8)}"
                y="-11"
                width="${pt.shortLabel.length * 6.8 + 16}"
                height="16"
                rx="6"
                fill="${isSelected ? '#123524' : 'rgba(255,255,255,0.92)'}"
                stroke="${isSelected ? '#eab64d' : '#d6ccb8'}"
                stroke-width="1"
              ></rect>
              <text
                y="0.5"
                text-anchor="middle"
                font-size="9.5"
                font-weight="700"
                fill="${isSelected ? '#ffffff' : '#123524'}"
              >
                ${pt.shortLabel}
              </text>
            </g>
          </g>
        `;
      }).join("");

      // Eventos en marcadores SVG
      document.querySelectorAll(".marker-group").forEach(el => {
        const selectHandler = (e) => {
          e.stopPropagation();
          const id = el.getAttribute("data-point-id");
          selectPoint(id, false);
        };
        el.addEventListener("click", selectHandler);
        el.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectHandler(e);
          }
        });
      });
    }

    // Renderizar lista rápida debajo del mapa
    function renderQuickList(filteredPoints) {
      if (filteredPoints.length === 0) {
        quickPointList.innerHTML = `
          <div class="col-span-full text-center py-4 text-xs text-gray-500">
            No hay puntos que coincidan con el filtro actual.
          </div>
        `;
        return;
      }

      quickPointList.innerHTML = filteredPoints.map(pt => {
        const isSelected = pt.id === selectedPointId;
        const catColor = CATEGORIES[pt.category]?.color || "#123524";
        return `
          <button
            data-list-id="${pt.id}"
            class="quick-pt-btn text-left px-3 py-2 rounded-xl border transition flex items-center gap-2.5 cursor-pointer ${
              isSelected
                ? "bg-selva-900 text-white border-selva-900 shadow-xs"
                : "bg-crema-50 hover:bg-crema-100 text-selva-950 border-crema-200"
            }"
          >
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${catColor}; border: 1.5px solid white;"></span>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-bold truncate">${pt.shortLabel}</p>
              <p class="text-[10px] truncate ${isSelected ? 'text-selva-100' : 'text-gray-500'}">${pt.category}</p>
            </div>
          </button>
        `;
      }).join("");

      document.querySelectorAll(".quick-pt-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-list-id");
          selectPoint(id, true);
        });
      });
    }

    // Renderizar Panel Lateral de Detalle Dinámico
    function renderDetailPanel(filteredPoints) {
      if (filteredPoints.length === 0) {
        detailPanel.innerHTML = `
          <div class="p-8 text-center">
            <p class="font-serif text-lg font-bold text-selva-900">Sin resultados en el mapa</p>
            <p class="text-xs text-gray-600 mt-2">Prueba restablecer los filtros o buscar otro término del informe (ej. Chonta, Linares, Alfarería).</p>
            <button id="panelResetBtn" class="mt-4 px-4 py-2 bg-selva-800 text-white text-xs font-semibold rounded-xl hover:bg-selva-900 transition">
              Restablecer filtros
            </button>
          </div>
        `;
        document.getElementById("panelResetBtn")?.addEventListener("click", () => {
          activeCategory = "Todos";
          searchQuery = "";
          searchInput.value = "";
          clearSearchBtn.classList.add("hidden");
          renderCategoryBar();
          updateApp();
        });
        return;
      }

      // Asegurar que selectedPointId esté dentro de los filtrados
      let currentIdx = filteredPoints.findIndex(p => p.id === selectedPointId);
      if (currentIdx === -1) {
        currentIdx = 0;
        selectedPointId = filteredPoints[0].id;
      }

      const pt = filteredPoints[currentIdx];
      const badgeClass = CATEGORIES[pt.category]?.badgeBg || "bg-selva-800 text-white";

      detailPanel.innerHTML = `
        <div class="fade-in flex flex-col">
          <!-- Cabecera del Panel -->
          <div class="bg-selva-900 text-white px-5 py-5 border-b-4 border-ocre-500">
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeClass}">
                ${pt.category}
              </span>
              <span class="text-xs font-mono text-ocre-400 font-semibold">
                Punto ${currentIdx + 1} de ${filteredPoints.length}
              </span>
            </div>
            <h2 class="font-serif text-xl sm:text-2xl font-bold leading-snug text-white">
              ${pt.name}
            </h2>
            <p class="text-xs text-selva-100 mt-1 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-ocre-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>${pt.canton}</span>
            </p>
          </div>

          <!-- Cuerpo con datos exactos del documento -->
          <div class="p-5 space-y-4 text-sm">
            <div>
              <h3 class="text-[11px] font-bold uppercase tracking-wider text-selva-800 mb-1">Síntesis Territorial y Patrimonial</h3>
              <p class="text-gray-800 text-xs sm:text-sm leading-relaxed">
                ${pt.description}
              </p>
            </div>

            <!-- Ficha de Datos Clave -->
            <div class="space-y-2">
              <h3 class="text-[11px] font-bold uppercase tracking-wider text-terracota-700">Datos Verificados del Informe UNEMI</h3>
              <div class="space-y-2">
                ${pt.keyFacts.map(fact => `
                  <div class="bg-crema-50 p-3 rounded-xl border border-crema-200">
                    <span class="text-[11px] font-bold text-selva-900 block">${fact.label}</span>
                    <span class="text-xs text-gray-700 leading-snug block mt-0.5">${fact.value}</span>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- Cita Textual del Informe -->
            <blockquote class="border-l-4 border-terracota-600 bg-terracota-100/45 p-3.5 rounded-r-xl text-xs italic text-selva-950 leading-relaxed">
              ${pt.quote}
            </blockquote>

            <!-- Botón de Enfoque en el Mapa -->
            <button
              id="focusOnMapBtn"
              class="w-full py-2.5 px-4 rounded-xl bg-rio-700 hover:bg-rio-600 text-white text-xs font-semibold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
              </svg>
              Centrar y acercar ubicación en el mapa
            </button>
          </div>

          <!-- Navegación Anterior / Siguiente -->
          <div class="px-5 py-3.5 bg-crema-100 border-t border-crema-200 flex items-center justify-between gap-2">
            <button
              id="prevPointBtn"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-crema-200 hover:bg-crema-50 text-selva-900 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              ${currentIdx === 0 ? "disabled" : ""}
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Anterior
            </button>

            <button
              id="nextPointBtn"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-selva-800 hover:bg-selva-900 text-white text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              ${currentIdx === filteredPoints.length - 1 ? "disabled" : ""}
            >
              Siguiente
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      `;

      // Eventos del panel lateral
      document.getElementById("focusOnMapBtn")?.addEventListener("click", () => {
        focusPointOnSvg(pt);
      });

      document.getElementById("prevPointBtn")?.addEventListener("click", () => {
        if (currentIdx > 0) {
          selectPoint(filteredPoints[currentIdx - 1].id, true);
        }
      });

      document.getElementById("nextPointBtn")?.addEventListener("click", () => {
        if (currentIdx < filteredPoints.length - 1) {
          selectPoint(filteredPoints[currentIdx + 1].id, true);
        }
      });
    }

    // Seleccionar punto y actualizar componentes
    function selectPoint(pointId, shouldCenter = false) {
      selectedPointId = pointId;
      updateApp();
      if (shouldCenter) {
        const pt = CULTURAL_POINTS.find(p => p.id === pointId);
        if (pt) focusPointOnSvg(pt);
      }
    }

    // Centrar y hacer zoom suave sobre un punto específico del SVG
    function focusPointOnSvg(pt) {
      zoomScale = 1.65;
      const centerX = 400;
      const centerY = 290;
      panX = centerX - pt.x * zoomScale;
      panY = centerY - pt.y * zoomScale;
      applySvgTransform();
    }

    // Aplicar transformación SVG
    function applySvgTransform() {
      // Limitar rango de zoom
      zoomScale = Math.max(0.85, Math.min(2.8, zoomScale));
      mapTransformGroup.setAttribute(
        "transform",
        `translate(${panX.toFixed(1)}, ${panY.toFixed(1)}) scale(${zoomScale.toFixed(2)})`
      );
    }

    // Actualizar toda la vista
    function updateApp() {
      const filtered = getFilteredPoints();
      visibleCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'nodo georreferenciado' : 'nodos georreferenciados'}`;
      renderDetailPanel(filtered);
      renderMarkers(filtered);
      renderQuickList(filtered);
      updateGoogleMap();
    }

    // Google Maps incrustado (sin clave): se centra en el punto seleccionado
    const GMAP_PLACES = {
      "tena": ["Tena, Napo, Ecuador", 13],
      "archidona": ["Archidona, Napo, Ecuador", 13],
      "talag": ["Talag, Tena, Napo, Ecuador", 14],
      "puerto-napo": ["Puerto Napo, Tena, Napo, Ecuador", 14],
      "comunidades-alfareras": ["Ahuano, Tena, Napo, Ecuador", 12],
      "wayra-yacu": ["Wayra Yacu, Tena, Napo, Ecuador", 14],
      "shiwakucha": ["Shiwakucha, Tena, Napo, Ecuador", 14],
      "linares": ["Linares, El Chaco, Napo, Ecuador", 14],
      "el-chaco": ["El Chaco, Napo, Ecuador", 13],
      "el-bombon": ["El Bombón, Napo, Ecuador", 14],
      "territorio-multinacional": ["Napo, Ecuador", 8]
    };
    function updateGoogleMap() {
      const frame = document.getElementById("gmapFrame");
      if (!frame) return;
      const pt = CULTURAL_POINTS.find(p => p.id === selectedPointId);
      const [q, z] = (pt && GMAP_PLACES[pt.id]) || ["Napo, Ecuador", 8];
      const src = "https://www.google.com/maps?q=" + encodeURIComponent(q) + "&z=" + z + "&output=embed";
      if (frame.getAttribute("src") !== src) frame.setAttribute("src", src);
      const link = document.getElementById("gmapOpenLink");
      if (link) link.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
      const title = document.getElementById("gmapTitle");
      if (title) title.textContent = "Google Maps • " + (pt ? pt.name.split(" (")[0].split(" y ")[0] : "Provincia de Napo");
    }

    // Controles de Zoom y Paneo Interactivo
    document.getElementById("zoomInBtn").addEventListener("click", () => {
      const oldScale = zoomScale;
      zoomScale = Math.min(2.8, zoomScale + 0.25);
      const factor = zoomScale / oldScale;
      panX = 400 - (400 - panX) * factor;
      panY = 290 - (290 - panY) * factor;
      applySvgTransform();
    });

    document.getElementById("zoomOutBtn").addEventListener("click", () => {
      const oldScale = zoomScale;
      zoomScale = Math.max(0.85, zoomScale - 0.25);
      const factor = zoomScale / oldScale;
      panX = 400 - (400 - panX) * factor;
      panY = 290 - (290 - panY) * factor;
      applySvgTransform();
    });

    document.getElementById("resetZoomBtn").addEventListener("click", () => {
      zoomScale = 1;
      panX = 0;
      panY = 0;
      applySvgTransform();
    });

    // Zoom con rueda del ratón
    mapViewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      const oldScale = zoomScale;
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      zoomScale = Math.max(0.85, Math.min(2.8, zoomScale + delta));
      const factor = zoomScale / oldScale;
      panX = 400 - (400 - panX) * factor;
      panY = 290 - (290 - panY) * factor;
      applySvgTransform();
    }, { passive: false });

    // Arrastre (Pan) con mouse y táctil
    mapViewport.addEventListener("mousedown", (e) => {
      if (e.target.closest(".marker-group")) return;
      isDragging = true;
      dragStartX = e.clientX - panX;
      dragStartY = e.clientY - panY;
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      panX = e.clientX - dragStartX;
      panY = e.clientY - dragStartY;
      applySvgTransform();
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Soporte táctil para paneo en móviles
    mapViewport.addEventListener("touchstart", (e) => {
      if (e.target.closest(".marker-group") || e.touches.length !== 1) return;
      isDragging = true;
      dragStartX = e.touches[0].clientX - panX;
      dragStartY = e.touches[0].clientY - panY;
    }, { passive: true });

    mapViewport.addEventListener("touchmove", (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      panX = e.touches[0].clientX - dragStartX;
      panY = e.touches[0].clientY - dragStartY;
      applySvgTransform();
    }, { passive: true });

    mapViewport.addEventListener("touchend", () => {
      isDragging = false;
    });

    // Eventos del buscador
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      clearSearchBtn.classList.toggle("hidden", !searchQuery);
      updateApp();
    });

    clearSearchBtn.addEventListener("click", () => {
      searchQuery = "";
      searchInput.value = "";
      clearSearchBtn.classList.add("hidden");
      updateApp();
    });

    // Inicialización
    renderCategoryBar();
    renderLegend();
    updateApp();
})();

/* Línea de tiempo cultural interactiva */
(function(){
// Base de datos estructurada a partir del informe S15-COMPONENTE PRACTICO_2 (UNEMI)
    const timelineEvents = [
      {
        id: 1,
        orderLabel: "01",
        dateShort: "Época Ancestral",
        title: "Época Ancestral y Tradición Oral Kichwa (Napu Runa)",
        category: "Tradición Oral y Saberes",
        colorClass: "bg-selva-800 text-white",
        badgeClass: "bg-selva-100 text-selva-900 border-selva-700/30",
        dotColor: "bg-selva-700",
        summary: "Origen de las prácticas de subsistencia, la chakra ancestral, los juegos tradicionales comunitarios y los relatos morales que ordenan la relación con el bosque amazónico.",
        description: "La tradición cultural de Napo nace de las prácticas cotidianas de subsistencia y cosmovisión de las nacionalidades Kichwa (Napu Runa), Waorani y Quijos. A través de la oralidad, el juego y la chakra ancestral, las comunidades han transmitido normas ecológicas, respeto a los mayores y cohesión social.",
        location: "Territorio Amazónico de Napo (Tena, Archidona, cuencas fluviales)",
        actors: "Pueblos y nacionalidades Kichwa (Napu Runa), Waorani y Quijos",
        highlights: [
          "Mitos fundacionales: El héroe civilizador Apústulu enseñó a los Naporuna a pescar con llika (red) y a ordenar el mundo natural.",
          "Relatos morales: 'El origen del sapo gota' (castigo a la mezquindad de un cazador con su suegra) y 'El origen de la guatusa' (compilados en la serie Inti-Killa).",
          "Juegos de subsistencia y entorno: Pukuna (cerbatana), lanzamiento de lanza, waysapuru (trompo ancestral), navegando por el río y la chaskina (sara panga).",
          "Reglas de la chaskina: Pelota de hojas secas de maíz, equipos mixtos (3 hombres y 3 mujeres) en un círculo de 3 a 4 m de radio, máximo dos golpes con una mano y prohibición de remates ('batidas')."
        ],
        quote: "«Los juegos transmiten conocimientos ecológicos —obtención de materiales, restricciones ambientales implícitas en las reglas— y normas comunitarias. Son un canal de transmisión intergeneracional.»"
      },
      {
        id: 2,
        orderLabel: "02",
        dateShort: "Siglo XVI (1578)",
        title: "Memoria Histórica y Resistencia de Jumandi",
        category: "Historia e Identidad",
        colorClass: "bg-terracota-700 text-white",
        badgeClass: "bg-terracota-100 text-terracota-700 border-terracota-500/30",
        dotColor: "bg-terracota-600",
        summary: "Reivindicación del líder indígena Jumandi como símbolo histórico de la identidad Napu Runa, la defensa territorial y la gobernanza de los pueblos originarios.",
        description: "La figura de Jumandi constituye el eje de la memoria histórica reivindicada por las comunidades amazónicas de Napo frente a la colonización del siglo XVI. Su legado articula la resistencia territorial con la construcción contemporánea de identidad y autonomía comunitaria.",
        location: "Región de los Quijos y valle del Alto Napo (Archidona / Tena)",
        actors: "Líder indígena Jumandi y pueblos originarios Quijos y Napu Runa",
        highlights: [
          "Símbolo vivo de dignidad, soberanía territorial y memoria colectiva de los pueblos originarios.",
          "Base identitaria articulada junto con la lengua Kichwa, la música, la danza y los rituales comunitarios.",
          "Referente directo para las políticas actuales del PDOT provincial orientadas a fortalecer la gobernanza comunitaria."
        ],
        quote: "«La identidad Napu Runa se sostiene en la lengua Kichwa, la memoria de Jumandi (personaje histórico reivindicado), la música, la danza y los rituales.»"
      },
      {
        id: 3,
        orderLabel: "03",
        dateShort: "1997",
        title: "Publicación de la «Antología poética de Napo»",
        category: "Documentación Cultural",
        colorClass: "bg-guayusa-600 text-white",
        badgeClass: "bg-guayusa-100 text-guayusa-600 border-guayusa-500/30",
        dotColor: "bg-guayusa-500",
        summary: "La Casa de la Cultura Ecuatoriana Benjamín Carrión (Núcleo de Napo) publica en Tena esta obra clave para salvaguardar la creación literaria y memoria regional.",
        description: "En el proceso de consolidación documental de la provincia, el Núcleo de Napo de la Casa de la Cultura Ecuatoriana editó en 1997 la 'Antología poética de Napo', sentando un precedente institucional en el registro escrito de las expresiones literarias locales, línea que continúa con obras recientes como 'Una voz en la selva' (2025).",
        location: "Tena, provincia de Napo",
        actors: "Casa de la Cultura Ecuatoriana Benjamín Carrión – Núcleo de Napo y escritores locales",
        highlights: [
          "Rescate y difusión formal de la poética e identidad amazónica desde la institucionalidad cultural.",
          "Antecedente documental para la compilación de literatura oral, mitos y producciones editoriales provinciales.",
          "Complementa las adaptaciones radiofónicas y registros etnográficos de tradición oral."
        ],
        quote: "«La compilación de mitos y literatura en formatos accesibles contribuye directamente a la difusión y salvaguardia del patrimonio cultural.»"
      },
      {
        id: 4,
        orderLabel: "04",
        dateShort: "Junio 2022",
        title: "Alfarería de Tena y Archidona: Patrimonio Cultural Inmaterial del Ecuador",
        category: "Patrimonio y Gobernanza",
        colorClass: "bg-terracota-600 text-white",
        badgeClass: "bg-terracota-100 text-terracota-700 border-terracota-500/30",
        dotColor: "bg-terracota-600",
        summary: "Inscripción oficial en la Lista Representativa del Patrimonio Cultural Inmaterial del Ecuador gracias al trabajo de 31 alfareras, GAD municipales, Ikiam y el Ministerio de Cultura.",
        description: "Tras un proceso articulado de varios años, en junio de 2022 se reconoció oficialmente la alfarería tradicional de Tena y Archidona. Sin embargo, la investigación detectó una brecha institucional crítica: su ausencia en el Sistema de Información del Patrimonio Cultural del Ecuador (SIPCE) y en los portales ministeriales.",
        location: "Comunidades de Tiyuyaku, Venecia Derecha, Kachiwañuska, Ahuano y San Pedro de Muyuna (Tena y Archidona)",
        actors: "31 mujeres alfareras, GAD de Tena y Archidona, Universidad Regional Amazónica Ikiam y Ministerio de Cultura y Patrimonio",
        highlights: [
          "Reconocimiento nacional en junio de 2022 que impulsa el 'renacer' económico de los talleres familiares mediante el turismo comunitario.",
          "Dimensión dual: saber inmaterial (técnicas ancestrales de barro) y patrimonio material (objetos, herramientas y talleres).",
          "Brecha identificada: invisibilidad digital en el SIPCE, motivando la creación del portal cultural de la UNEMI."
        ],
        quote: "«La alfarería fue incorporada a la lista representativa del patrimonio inmaterial en 2022 tras un proceso de varios años que involucró a los GAD municipales de Tena y Archidona, la Universidad Ikiam y el Ministerio de Cultura.»"
      },
      {
        id: 5,
        orderLabel: "05",
        dateShort: "2022–2027",
        title: "Plan de Desarrollo Turístico Provincial de Napo",
        category: "Desarrollo Local",
        colorClass: "bg-emerald-800 text-white",
        badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-700/30",
        dotColor: "bg-emerald-700",
        summary: "Instrumento de planificación que posiciona la cultura viva, la gastronomía típica, la medicina ancestral y la alfarería como ejes del turismo comunitario sostenible.",
        description: "El Plan de Desarrollo Turístico Provincial 2022–2027 transforma el patrimonio cultural en motor de dinamización económica local, articulando gobernanza, competitividad y promoción de experiencias comunitarias respetuosas con el entorno amazónico.",
        location: "Toda la provincia de Napo (cantones Tena, Archidona, El Chaco, Quijos y Carlos Julio Arosemena Tola)",
        actors: "GAD Provincial de Napo, emprendimientos de turismo comunitario y portadores de saberes",
        highlights: [
          "Integración de circuitos de alfarería, medicina tradicional (curación en El Bombón, partería en Linares) y gastronomía (maytu, chicha de chonta, tamal de San Juan).",
          "Generación de ingresos directos para familias artesanas y comunidades indígenas.",
          "Promoción del destino Napo vinculando identidad cultural y conservación ambiental."
        ],
        quote: "«El Plan de Desarrollo Turístico Provincial 2022-2027 identifica la cultura como atractivo central, promoviendo el turismo comunitario con estrategias de gobernanza y competitividad.»"
      },
      {
        id: 6,
        orderLabel: "06",
        dateShort: "2023–2027",
        title: "Plan de Desarrollo y Ordenamiento Territorial (PDOT) de Napo",
        category: "Patrimonio y Gobernanza",
        colorClass: "bg-selva-900 text-white",
        badgeClass: "bg-selva-100 text-selva-900 border-selva-700/30",
        dotColor: "bg-selva-800",
        summary: "Hoja de ruta provincial con eje de igualdad de derechos, enseñanza de Kichwa (685 capacitados con SEIBE), Escuela de Líderes y metas medibles de participación ciudadana.",
        description: "El PDOT 2023–2027 institucionaliza la revitalización cultural como política pública con presupuesto y metas verificables, priorizando la inclusión de mujeres, jóvenes, adultos mayores y nacionalidades originarias en la toma de decisiones.",
        location: "Provincia de Napo",
        actors: "GAD Provincial de Napo, SEIBE, Escuela de Formación de Líderes Comunitarios y comunidades",
        highlights: [
          "Educación intercultural: Cursos de lengua Kichwa (básico e intermedio) en convenio con la SEIBE con 685 participantes capacitados.",
          "Escuela de Formación de Líderes Comunitarios enfocada en territorio, identidad, justicia indígena y economía ancestral.",
          "Alerta patrimonial: El PDOT advierte sobre bienes destruidos o abandonados en Tena y exige actualizar el inventario antes de intervenir."
        ],
        quote: "«El PDOT provincial tiene como objetivo explícito fortalecer la gobernanza comunitaria e identidad de los pueblos y nacionalidades originarios.»"
      },
      {
        id: 7,
        orderLabel: "07",
        dateShort: "Ciclo: Abr–May",
        title: "Fiesta de la Chonta en Archidona (3 al 7 de mayo)",
        category: "Fiestas y Rituales",
        colorClass: "bg-terracota-600 text-white",
        badgeClass: "bg-terracota-100 text-terracota-700 border-terracota-500/30",
        dotColor: "bg-terracota-500",
        summary: "Celebración anual de la cosecha de la chonta en Archidona con gastronomía ancestral (maytu de pescado, chicha de chonta) y elección de la Mushuk Chonta Warmi.",
        description: "Entre abril y mayo (con registro central del 3 al 7 de mayo), las comunidades Kichwa de Archidona celebran la abundancia de la palma de chonta. La festividad refuerza los lazos comunitarios, la soberanía alimentaria y el protagonismo cultural de la mujer amazónica.",
        location: "Cantón Archidona, provincia de Napo",
        actors: "Comunidades Kichwa de Archidona, autoridades locales y portadoras de saberes gastronómicos",
        highlights: [
          "Preparación comunitaria de chicha de chonta, maytu de pescado y platos derivados de la biodiversidad local.",
          "Elección de la Mushuk Chonta Warmi como símbolo de liderazgo cultural femenino.",
          "Consolidación como atractivo central del calendario turístico y patrimonial de Napo."
        ],
        quote: "«Fiesta de la Chonta: Archidona, abril–mayo (registro del 3 al 7 de mayo). Incluye maytu de pescado, chicha de chonta y elección de la Mushuk Chonta Warmi.»"
      },
      {
        id: 8,
        orderLabel: "08",
        dateShort: "Ciclo: 14–15 Jun",
        title: "Kuya Raymi en la Parroquia Talag",
        category: "Fiestas y Rituales",
        colorClass: "bg-guayusa-600 text-white",
        badgeClass: "bg-guayusa-100 text-guayusa-600 border-guayusa-500/30",
        dotColor: "bg-guayusa-500",
        summary: "Festividad comunitaria dedicada a la elaboración artesanal con kuya (pilche/calabaza) y la elección de la Kuya Warmi, visibilizando el rol de la mujer.",
        description: "Cada 14 y 15 de junio, la parroquia Talag celebra el Kuya Raymi, un encuentro donde la artesanía utilitaria elaborada con frutos de kuya y los rituales comunitarios ponen en valor el conocimiento femenino y la relación armónica con la chakra.",
        location: "Parroquia Talag, cantón Tena",
        actors: "Comunidades Kichwa de Talag, artesanas y lideresas comunitarias",
        highlights: [
          "Elaboración de recipientes y artesanías tradicionales a partir de la kuya.",
          "Elección de la Kuya Warmi, fortaleciendo el eje de igualdad y visibilización de la mujer en la cultura local.",
          "Transmisión intergeneracional de técnicas artesanales y música tradicional Naporuna."
        ],
        quote: "«Las fiestas como la Guayusa Warmi y la Kuya Warmi visibilizan el rol de la mujer en la cultura local.»"
      },
      {
        id: 9,
        orderLabel: "09",
        dateShort: "Julio 2026",
        title: "Construcción del Hito Cultural de Puerto Napo",
        category: "Patrimonio Material",
        colorClass: "bg-amber-800 text-white",
        badgeClass: "bg-amber-100 text-amber-900 border-amber-700/30",
        dotColor: "bg-amber-700",
        summary: "Infraestructura patrimonial en construcción financiada con presupuesto participativo (USD 36.472), que se suma al acervo arqueológico y arquitectónico de la provincia.",
        description: "Previsto para julio de 2026 mediante mecanismos de presupuestación participativa, el Hito Cultural de Puerto Napo representa una inversión directa en patrimonio material contemporáneo, dialogando con sitios arqueológicos históricos como Pamba Huasi y el Petroglifo Río Cauchillo en Linares (El Chaco).",
        location: "Puerto Napo (Tena) y articulación con sitios patrimoniales de El Chaco y Archidona",
        actors: "GAD Provincial/Parroquial, ciudadanía participante en presupuesto participativo",
        highlights: [
          "Inversión de USD 36.472 aprobada mediante presupuesto participativo y rendición de cuentas.",
          "Complementa el patrimonio arqueológico de Linares (asentamiento monumental Pamba Huasi y Petroglifo Río Cauchillo) y la vivienda tradicional de El Chaco, Tena y Archidona.",
          "Responde a la necesidad de revitalizar espacios físicos culturales frente al deterioro registrado en otras zonas."
        ],
        quote: "«El hito cultural de Puerto Napo, financiado con presupuesto participativo (USD 36 472) y previsto para julio de 2026, constituye un patrimonio material en construcción.»"
      },
      {
        id: 10,
        orderLabel: "10",
        dateShort: "Ciclo: 15 Nov",
        title: "Guayusa Warmi y Fundación de Tena",
        category: "Fiestas y Rituales",
        colorClass: "bg-selva-800 text-white",
        badgeClass: "bg-selva-100 text-selva-900 border-selva-700/30",
        dotColor: "bg-selva-700",
        summary: "Celebración emblemática en Tena ('capital de la guayusa y la canela') que une la ceremonia matinal de la wayusa upina con el reconocimiento al liderazgo femenino.",
        description: "Cada 15 de noviembre, coincidiendo con la conmemoración de la fundación de Tena, se celebra la Guayusa Warmi. Este evento reivindica la planta sagrada de la guayusa como espacio de diálogo familiar, planificación comunitaria y afirmación de la identidad Kichwa.",
        location: "Ciudad de Tena, provincia de Napo",
        actors: "Comunidades Kichwa de Tena, mujeres lideresas y GAD Municipal/Provincial",
        highlights: [
          "Revalorización de la tradición ancestral de la Wayusa Upina (toma comunitaria de guayusa al amanecer).",
          "Protagonismo de la mujer Kichwa como guardiana de los saberes de la chakra y la comunidad.",
          "Integración entre historia cívica de Tena y cosmovisión amazónica."
        ],
        quote: "«Guayusa Warmi: Tena, 15 de noviembre, coincidente con la fundación de Tena; Tena es reconocida como capital de la guayusa y la canela.»"
      },
      {
        id: 11,
        orderLabel: "11",
        dateShort: "2026 (Actualidad)",
        title: "Portal Web Cultural y Salvaguardia Digital (UNEMI)",
        category: "Innovación Tecnológica",
        colorClass: "bg-indigo-800 text-white",
        badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-700/30",
        dotColor: "bg-indigo-700",
        summary: "Evolución del portal napo-cultural-unemi.vercel.app hacia una plataforma de salvaguardia, gobernanza y documentación sistemática de los 169 bienes inmateriales.",
        description: "Desarrollado por estudiantes de Tecnologías de la Información de la UNEMI (Grupo J), el proyecto trasciende el enfoque meramente descriptivo de su primera fase para convertirse en una herramienta operativa que combate la invisibilidad institucional y fortalece la transmisión intergeneracional.",
        location: "Entorno Digital (napo-cultural-unemi.vercel.app) • UNEMI / Provincia de Napo",
        actors: "Estudiantes Grupo J y MSc. Sandra Campuzano (UNEMI), portadores culturales de Napo",
        highlights: [
          "Cierra tres brechas críticas: la ausencia de la alfarería en el SIPCE, la débil transmisión intergeneracional y la dispersión documental de 169 bienes inmateriales.",
          "Integra juegos tradicionales, mitología oral, calendario festivo, desarrollo local y mecanismos de gobernanza.",
          "Combina herramientas tecnológicas modernas con rigor metodológico y verificación en fuentes primarias."
        ],
        quote: "«¿Cómo puede ese portal convertirse en una herramienta de salvaguardia, gobernanza y desarrollo local, y no solo en un repositorio de contenidos?»"
      },
      {
        id: 12,
        orderLabel: "12",
        dateShort: "Horizonte 2027",
        title: "Meta de Participación, Inclusión e Inventario Patrimonial",
        category: "Proyección y Gobernanza",
        colorClass: "bg-selva-950 text-guayusa-400",
        badgeClass: "bg-guayusa-100 text-selva-950 border-guayusa-500/40",
        dotColor: "bg-guayusa-500",
        summary: "Cumplimiento de las metas del PDOT al 2027: alcanzar 5.542 participantes activos en revitalización cultural, actualizar inventarios y garantizar la equidad territorial.",
        description: "Hacia 2027, la gobernanza cultural de Napo proyecta consolidar un ecosistema sostenible donde la inversión pública, la participación ciudadana y la documentación sistemática aseguren que las prácticas vivas de Kichwas, Waoranis y Quijos perduren en las nuevas generaciones.",
        location: "Provincia de Napo (parroquias urbanas y rurales)",
        actors: "GAD Provincial y Municipales, pueblos y nacionalidades, mujeres, jóvenes y adultos mayores",
        highlights: [
          "Meta cuantitativa de participación: Incrementar de 3.542 a 5.542 miembros de pueblos y nacionalidades activos en procesos de identidad cultural hasta 2027.",
          "Actualización integral del inventario de patrimonio material e inmaterial como condición previa para intervenciones de conservación.",
          "Consolidación de la comunicación accesible del patrimonio para superar brechas de difusión en juegos tradicionales y tradición oral."
        ],
        quote: "«La comunicación del patrimonio y la participación ciudadana efectiva son condiciones necesarias para que la conservación cultural sea sostenible.»"
      }
    ];

    // Datos del Calendario Festivo Lateral
    const festivalsData = [
      {
        title: "Fiesta de la Chonta",
        date: "Abril – Mayo (3 al 7 de mayo)",
        place: "Cantón Archidona",
        description: "Celebración comunitaria de la cosecha de chonta. Incluye preparación de maytu de pescado, chicha de chonta y elección de la Mushuk Chonta Warmi.",
        tag: "Gastronomía y Cosecha"
      },
      {
        title: "Kuya Raymi",
        date: "14 y 15 de junio",
        place: "Parroquia Talag (Tena)",
        description: "Encuentro cultural centrado en la elaboración de recipientes y artesanías con kuya, danzas tradicionales y elección de la Kuya Warmi.",
        tag: "Artesanía y Mujer"
      },
      {
        title: "Guayusa Warmi",
        date: "15 de noviembre",
        place: "Ciudad de Tena",
        description: "Coincide con la fundación de Tena ('capital de la guayusa y la canela'). Reivindica la ceremonia de la wayusa upina y el liderazgo femenino Kichwa.",
        tag: "Identidad y Fundación"
      },
      {
        title: "Carnaval y Boda Kichwa",
        date: "Ciclo Ritual y Comunitario",
        place: "Archidona, Tena y comunidades",
        description: "El Carnaval se vive como 'Territorio Ancestral y Cultural' (destacando el 'Capoa' en Archidona). La Boda Kichwa articula cacería, pesca, recolección de leña, bebidas y danzas con tambor y violín.",
        tag: "Ritualidad Viva"
      }
    ];

    // Estado de la aplicación
    let activeCategory = "Todas";
    let searchQuery = "";
    let isCompactView = false;
    let currentFilteredEvents = [...timelineEvents];
    let selectedEventIndex = 0;

    // Referencias del DOM
    const categoryFiltersEl = document.getElementById("categoryFilters");
    const quickNavTrackEl = document.getElementById("quickNavTrack");
    const timelineContainerEl = document.getElementById("timelineContainer");
    const timelineWrapperEl = document.getElementById("timelineWrapper");
    const emptyStateEl = document.getElementById("emptyState");
    const resultsCountEl = document.getElementById("resultsCount");
    const searchInputEl = document.getElementById("tlSearchInput");
    const clearSearchBtnEl = document.getElementById("tlClearSearchBtn");
    const resetAllBtnEl = document.getElementById("resetAllBtn");
    const viewModeBtnEl = document.getElementById("viewModeBtn");
    const viewModeLabelEl = document.getElementById("viewModeLabel");

    // Modal DOM
    const detailModalEl = document.getElementById("detailModal");
    const closeModalBtnEl = document.getElementById("closeModalBtn");
    const prevEventBtnEl = document.getElementById("prevEventBtn");
    const nextEventBtnEl = document.getElementById("nextEventBtn");

    // Obtener categorías únicas
    const categories = ["Todas", ...new Set(timelineEvents.map(ev => ev.category))];

    // Renderizar botones de categoría
    function renderCategoryFilters() {
      categoryFiltersEl.innerHTML = categories.map(cat => {
        const isActive = activeCategory === cat;
        return `
          <button
            data-category="${cat}"
            class="cat-btn shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border ${
              isActive
                ? "bg-selva-800 text-white border-selva-800 shadow-sm"
                : "bg-white text-selva-900 border-crema-200 hover:bg-crema-100"
            }"
          >
            ${cat}
          </button>
        `;
      }).join("");

      document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          activeCategory = btn.getAttribute("data-category");
          renderCategoryFilters();
          filterAndRenderTimeline();
        });
      });
    }

    // Filtrar y renderizar la línea de tiempo y la navegación rápida
    function filterAndRenderTimeline() {
      const q = searchQuery.trim().toLowerCase();

      currentFilteredEvents = timelineEvents.filter(ev => {
        const matchesCategory = activeCategory === "Todas" || ev.category === activeCategory;
        const searchableText = [
          ev.title,
          ev.dateShort,
          ev.category,
          ev.summary,
          ev.description,
          ev.location,
          ev.actors,
          ...ev.highlights
        ].join(" ").toLowerCase();

        const matchesSearch = !q || searchableText.includes(q);
        return matchesCategory && matchesSearch;
      });

      resultsCountEl.textContent = `Mostrando ${currentFilteredEvents.length} de ${timelineEvents.length} hitos`;

      // Renderizar barra de salto rápido
      quickNavTrackEl.innerHTML = currentFilteredEvents.map(ev => `
        <a
          href="#hito-${ev.id}"
          class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-crema-50 hover:bg-selva-100 border border-crema-200 text-xs font-medium text-selva-900 transition"
        >
          <span class="w-2 h-2 rounded-full ${ev.dotColor}"></span>
          <span class="font-bold">${ev.dateShort}</span>
        </a>
      `).join("");

      if (currentFilteredEvents.length === 0) {
        timelineWrapperEl.classList.add("hidden");
        emptyStateEl.classList.remove("hidden");
        return;
      }

      timelineWrapperEl.classList.remove("hidden");
      emptyStateEl.classList.add("hidden");

      timelineContainerEl.innerHTML = currentFilteredEvents.map((ev, index) => `
        <article
          id="hito-${ev.id}"
          style="animation-delay: ${index * 45}ms"
          class="card-enter relative group scroll-mt-36"
        >
          <!-- Nodo indicador sobre la línea vertical -->
          <div class="absolute -left-[22px] sm:-left-[34px] top-6 w-4 h-4 rounded-full ${ev.dotColor} ring-4 ring-crema-50 group-hover:scale-125 transition-transform"></div>

          <!-- Tarjeta del Hito -->
          <div
            data-index="${index}"
            role="button"
            tabindex="0"
            class="timeline-card bg-white hover:bg-crema-50/70 rounded-2xl border border-crema-200 hover:border-selva-700/50 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-selva-700"
          >
            <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold ${ev.colorClass} shadow-xs">
                  ${ev.dateShort}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${ev.badgeClass}">
                  ${ev.category}
                </span>
              </div>
              <span class="text-xs font-mono font-semibold text-gray-400 group-hover:text-selva-800 transition">
                Hito #${ev.orderLabel}
              </span>
            </div>

            <h3 class="font-serif text-lg sm:text-xl font-bold text-selva-950 group-hover:text-terracota-700 transition-colors">
              ${ev.title}
            </h3>

            <p class="mt-2 text-sm text-gray-700 leading-relaxed ${isCompactView ? 'line-clamp-2' : ''}">
              ${ev.summary}
            </p>

            ${!isCompactView ? `
              <div class="mt-4 pt-3.5 border-t border-crema-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-600">
                <div class="flex items-center gap-1.5 truncate">
                  <svg class="w-4 h-4 text-terracota-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="truncate">${ev.location}</span>
                </div>
                <span class="inline-flex items-center gap-1 font-semibold text-selva-800 group-hover:translate-x-1 transition-transform shrink-0">
                  Ver ficha completa
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            ` : ''}
          </div>
        </article>
      `).join("");

      // Asignar eventos de clic y teclado a cada tarjeta
      document.querySelectorAll(".timeline-card").forEach(card => {
        const openHandler = () => {
          const idx = parseInt(card.getAttribute("data-index"), 10);
          openModal(idx);
        };
        card.addEventListener("click", openHandler);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openHandler();
          }
        });
      });
    }

    // Abrir Modal con información detallada
    function openModal(index) {
      selectedEventIndex = index;
      const ev = currentFilteredEvents[selectedEventIndex];
      if (!ev) return;

      document.getElementById("modalDateBadge").textContent = ev.dateShort;
      document.getElementById("modalCategoryBadge").textContent = ev.category;
      document.getElementById("modalTitle").textContent = ev.title;
      document.getElementById("modalDescription").textContent = ev.description;
      document.getElementById("modalLocation").textContent = ev.location;
      document.getElementById("modalActors").textContent = ev.actors;
      document.getElementById("modalQuote").textContent = ev.quote;

      const highlightsEl = document.getElementById("modalHighlights");
      highlightsEl.innerHTML = ev.highlights.map(item => `
        <li class="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-crema-200">
          <span class="w-2 h-2 rounded-full bg-terracota-600 mt-1.5 shrink-0"></span>
          <span class="text-gray-800 text-xs sm:text-sm">${item}</span>
        </li>
      `).join("");

      document.getElementById("modalStepIndicator").textContent = `${selectedEventIndex + 1} / ${currentFilteredEvents.length}`;
      prevEventBtnEl.disabled = selectedEventIndex === 0;
      nextEventBtnEl.disabled = selectedEventIndex === currentFilteredEvents.length - 1;

      detailModalEl.classList.remove("hidden");
      detailModalEl.classList.add("flex");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      detailModalEl.classList.add("hidden");
      detailModalEl.classList.remove("flex");
      document.body.style.overflow = "";
    }

    // Renderizar módulo lateral de Calendario Festivo
    function renderFestival(idx) {
      const fest = festivalsData[idx];
      const container = document.getElementById("festivalDetail");
      container.innerHTML = `
        <div class="flex items-center justify-between gap-2 mb-1.5">
          <span class="text-[11px] font-bold uppercase tracking-wider text-terracota-700">${fest.date}</span>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-guayusa-100 text-guayusa-600">${fest.tag}</span>
        </div>
        <h4 class="font-serif text-base font-bold text-selva-950">${fest.title}</h4>
        <p class="text-xs font-medium text-selva-800 mt-0.5 mb-2">📍 ${fest.place}</p>
        <p class="text-xs text-gray-700 leading-relaxed">${fest.description}</p>
      `;

      document.querySelectorAll(".fest-tab").forEach((tab, i) => {
        if (i === idx) {
          tab.className = "fest-tab px-2 py-2 rounded-xl text-xs font-semibold bg-terracota-100 text-terracota-700 border border-terracota-500/40 transition";
        } else {
          tab.className = "fest-tab px-2 py-2 rounded-xl text-xs font-semibold bg-crema-100 text-selva-800 hover:bg-crema-200 transition";
        }
      });
    }

    // Event Listeners
    searchInputEl.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      clearSearchBtnEl.classList.toggle("hidden", !searchQuery);
      filterAndRenderTimeline();
    });

    clearSearchBtnEl.addEventListener("click", () => {
      searchQuery = "";
      searchInputEl.value = "";
      clearSearchBtnEl.classList.add("hidden");
      filterAndRenderTimeline();
    });

    resetAllBtnEl.addEventListener("click", () => {
      activeCategory = "Todas";
      searchQuery = "";
      searchInputEl.value = "";
      clearSearchBtnEl.classList.add("hidden");
      renderCategoryFilters();
      filterAndRenderTimeline();
    });

    viewModeBtnEl.addEventListener("click", () => {
      isCompactView = !isCompactView;
      viewModeLabelEl.textContent = isCompactView ? "Vista Detallada" : "Vista Compacta";
      filterAndRenderTimeline();
    });

    closeModalBtnEl.addEventListener("click", closeModal);
    detailModalEl.addEventListener("click", (e) => {
      if (e.target === detailModalEl) closeModal();
    });

    prevEventBtnEl.addEventListener("click", () => {
      if (selectedEventIndex > 0) openModal(selectedEventIndex - 1);
    });

    nextEventBtnEl.addEventListener("click", () => {
      if (selectedEventIndex < currentFilteredEvents.length - 1) openModal(selectedEventIndex + 1);
    });

    // Navegación con teclado (Escape, Flecha Izquierda y Flecha Derecha)
    document.addEventListener("keydown", (e) => {
      if (detailModalEl.classList.contains("hidden")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft" && selectedEventIndex > 0) {
        openModal(selectedEventIndex - 1);
      }
      if (e.key === "ArrowRight" && selectedEventIndex < currentFilteredEvents.length - 1) {
        openModal(selectedEventIndex + 1);
      }
    });

    // Tabs del calendario festivo lateral
    document.querySelectorAll(".fest-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        const idx = parseInt(tab.getAttribute("data-fest"), 10);
        renderFestival(idx);
      });
    });

    // Inicialización
    renderCategoryFilters();
    filterAndRenderTimeline();
    renderFestival(0);
})();
