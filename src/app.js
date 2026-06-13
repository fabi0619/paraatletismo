import {
  getAthletes,
  saveAthlete,
  deleteAthlete,
  addChampionship,
  deleteChampionship,
  addDocument,
  deleteDocument,
  iniciarSesion,
  obtenerUsuarioActual,
  cerrarSesion,
  registrarProfesor,
  obtenerLogros,
  guardarLogro,
  eliminarLogro
} from "./lib/supabase.js";
import { CLASES_DEPORTIVAS, DISCAPACIDADES } from "./lib/classes.js";

// ==========================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ==========================================================================
let currentAthletes = [];
let selectedAthleteId = null;
let currentProfilePhotoBase64 = null;

// Elementos del DOM - Dashboard
const searchInput = document.getElementById("search-input");
const btnClearSearch = document.getElementById("btn-clear-search");
const filterDiscapacidad = document.getElementById("filter-discapacidad");
const filterTipoClase = document.getElementById("filter-tipo-clase");
const filterClase = document.getElementById("filter-clase");
const btnResetFilters = document.getElementById("btn-reset-filters");
const resultsCount = document.getElementById("results-count");
const athletesGrid = document.getElementById("athletes-grid");
const emptyState = document.getElementById("empty-state");

// Elementos del DOM - Estadísticas
const statChampsVal = document.getElementById("stat-championships").querySelector(".stat-value");

// Elementos del DOM - Modal Registro
const modalRegister = document.getElementById("modal-register");
const btnOpenRegister = document.getElementById("btn-open-register");
const btnEmptyRegister = document.getElementById("btn-empty-register");
const btnCloseRegister = document.getElementById("btn-close-register-modal");
const btnCancelRegister = document.getElementById("btn-cancel-register");
const btnSaveAthlete = document.getElementById("btn-save-athlete");
const formAthlete = document.getElementById("form-athlete");
const modalRegisterTitle = document.getElementById("modal-register-title");

// Elementos del Formulario Registro
const fieldId = document.getElementById("athlete-id");
const fieldName = document.getElementById("athlete-name");
const fieldDoc = document.getElementById("athlete-doc");
const fieldBirth = document.getElementById("athlete-birth");
const fieldGender = document.getElementById("athlete-gender");
const fieldPhone = document.getElementById("athlete-phone");
const fieldEmail = document.getElementById("athlete-email");
const fieldPassword = document.getElementById("athlete-password");
const fieldClub = document.getElementById("athlete-club");
const fieldDiscap = document.getElementById("athlete-discapacidad");
const fieldTipoClase = document.getElementById("athlete-tipo-clase");
const fieldClass = document.getElementById("athlete-clase");
const classInfoBox = document.getElementById("class-info-box");
const classInfoText = document.getElementById("class-info-text");

// Elementos de Carga de Fotos
const photoPreview = document.getElementById("photo-preview");
const photoInput = document.getElementById("photo-input");
const btnSelectPhoto = document.getElementById("btn-select-photo");
const btnRemovePhoto = document.getElementById("btn-remove-photo");

// Elementos Live Preview de la Tarjeta
const previewCardImg = document.getElementById("preview-card-img");
const previewCardName = document.getElementById("preview-card-name");
const previewCardId = document.getElementById("preview-card-id");
const previewCardBadgeDiscap = document.getElementById("preview-card-badge-discap");
const previewCardBadgeClass = document.getElementById("preview-card-badge-class");

// Elementos del DOM - Modal Detalle/Expediente
const modalDetail = document.getElementById("modal-detail");
const btnCloseDetailModal = document.getElementById("btn-close-detail-modal");
const btnEditAthleteProfile = document.getElementById("btn-edit-athlete-profile");

const detailAvatar = document.getElementById("detail-avatar");
const detailFirstName = document.getElementById("detail-first-name");
const detailLastName = document.getElementById("detail-last-name");
const detailIdCard = document.getElementById("detail-id-card");
const detailBadgeDiscap = document.getElementById("detail-badge-discap");
const detailBadgeClass = document.getElementById("detail-badge-class");
const detailAgeFull = document.getElementById("detail-age-full");
const detailClub = document.getElementById("detail-club");
const detailGender = document.getElementById("detail-gender");
const detailPhone = document.getElementById("detail-phone");
const detailEmail = document.getElementById("detail-email");
const detailPruebasDinamicas = document.getElementById("detail-pruebas-dinamicas");
const detailMedalsGold = document.getElementById("detail-medals-gold");
const detailMedalsSilver = document.getElementById("detail-medals-silver");
const detailMedalsBronze = document.getElementById("detail-medals-bronze");

// Elementos Documentos
const btnTriggerDocUpload = document.getElementById("btn-trigger-doc-upload");
const docFileInput = document.getElementById("doc-file-input");
const detailDocsList = document.getElementById("detail-docs-list");
const noDocsMsg = document.getElementById("no-docs-msg");

// Elementos Campeonatos
const btnOpenChampForm = document.getElementById("btn-open-championship-form");
const btnEmptyChampTrigger = document.getElementById("btn-empty-champ-trigger");
const champFormCard = document.getElementById("championship-form-card");
const btnCloseChampForm = document.getElementById("btn-close-champ-form");
const formChampionship = document.getElementById("form-championship");
const btnCancelChamp = document.getElementById("btn-cancel-champ");
const btnSaveChamp = document.getElementById("btn-save-champ");
const detailChampsList = document.getElementById("detail-championships-table-body");
const emptyChampsMsg = document.getElementById("empty-championships-msg");

// Elementos de Ubicación (Logros)
const champCountry = document.getElementById("champ-country");
const champState = document.getElementById("champ-state");
const champCity = document.getElementById("champ-city");

// ==========================================================================
// REFERENCIAS AL DOM - AUTENTICACIÓN Y SESIÓN
// ==========================================================================
const contenedorLogin = document.getElementById("contenedor-login");
const selectoresRol = document.getElementById("selectores-rol");
const formLogin = document.getElementById("formulario-login");
const formRegistroProfesor = document.getElementById("formulario-registro-profesor");
const inputLoginUsuario = document.getElementById("login-usuario");
const inputLoginClave = document.getElementById("login-clave");
const btnIniciarSesion = document.getElementById("btn-iniciar-sesion");
const indicadorSesion = document.getElementById("indicador-sesion");
const sesionNombreUsuario = document.getElementById("sesion-nombre-usuario");
const sesionBadgeRol = document.getElementById("sesion-badge-rol");
const btnCerrarSesion = document.getElementById("btn-cerrar-sesion");
const navegacionPrincipal = document.getElementById("navegacion-principal");
const enlaceTabAtletas = document.getElementById("enlace-tab-atletas");
const enlaceTabLogros = document.getElementById("enlace-tab-logros");
const contenedorVistaAtletas = document.getElementById("contenedor-vista-atletas");
const contenedorVistaLogros = document.getElementById("contenedor-vista-logros");
const btnPortalLogin = document.getElementById("btn-portal-login");
const btnCerrarModalLogin = document.getElementById("btn-cerrar-modal-login");

// Variable que almacena el rol seleccionado en la pantalla de login
let rolSeleccionado = "admin";

// ==========================================================================
// INICIALIZACIÓN Y CARGA DE DATOS
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  verificarSesionActiva();
  loadData();
  setupFilterSelects();
  attachEventListeners();
  adjuntarEventosLogin();
  fetchCountries(); // Cargar países de la API mundial
});

// Cache para los países y estados
window.countriesData = [];

async function fetchCountries() {
  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/states");
    const data = await response.json();
    if (!data.error) {
      window.countriesData = data.data;
      if (champCountry) {
        champCountry.innerHTML = '<option value="">Seleccione país...</option>';
        data.data.forEach(countryObj => {
          const opt = document.createElement("option");
          opt.value = countryObj.name;
          opt.textContent = countryObj.name;
          champCountry.appendChild(opt);
        });
      }
    }
  } catch (error) {
    console.error("Error cargando países:", error);
    if (champCountry) champCountry.innerHTML = '<option value="Error">Error cargando países</option>';
  }
}

async function handleCountryChange() {
  const selectedCountryName = champCountry.value;
  champState.innerHTML = '<option value="">Seleccione estado...</option>';
  champCity.innerHTML = '<option value="">Seleccione estado primero...</option>';
  champState.disabled = true;
  champCity.disabled = true;

  if (!selectedCountryName) return;

  const countryObj = window.countriesData.find(c => c.name === selectedCountryName);
  if (countryObj && countryObj.states && countryObj.states.length > 0) {
    champState.disabled = false;
    countryObj.states.forEach(stateObj => {
      const opt = document.createElement("option");
      opt.value = stateObj.name;
      opt.textContent = stateObj.name;
      champState.appendChild(opt);
    });
  } else {
    // Si el país no tiene estados en la API
    champState.innerHTML = '<option value="N/A">N/A</option>';
    champState.disabled = false;
    handleStateChange(); // Disparar la carga de ciudades
  }
}

async function handleStateChange() {
  const selectedCountryName = champCountry.value;
  const selectedStateName = champState.value;
  
  champCity.innerHTML = '<option value="">Cargando ciudades...</option>';
  champCity.disabled = true;

  if (!selectedStateName) return;

  if (selectedStateName === "N/A") {
    // Intentar buscar ciudades directamente por país si no hay estado
    fetchCitiesForCountry(selectedCountryName);
    return;
  }

  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: selectedCountryName, state: selectedStateName })
    });
    const data = await response.json();
    champCity.innerHTML = '<option value="">Seleccione ciudad/municipio...</option>';
    
    if (!data.error && data.data && data.data.length > 0) {
      champCity.disabled = false;
      data.data.forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        champCity.appendChild(opt);
      });
    } else {
      champCity.innerHTML = '<option value="N/A">N/A (No hay ciudades en este estado)</option>';
      champCity.disabled = false;
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
    champCity.innerHTML = '<option value="N/A">N/A</option>';
    champCity.disabled = false;
  }
}

async function fetchCitiesForCountry(countryName) {
  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: countryName })
    });
    const data = await response.json();
    champCity.innerHTML = '<option value="">Seleccione ciudad...</option>';
    
    if (!data.error && data.data && data.data.length > 0) {
      champCity.disabled = false;
      data.data.forEach(city => {
        const opt = document.createElement("option");
        opt.value = city;
        opt.textContent = city;
        champCity.appendChild(opt);
      });
    } else {
      champCity.innerHTML = '<option value="N/A">N/A</option>';
      champCity.disabled = false;
    }
  } catch (error) {
    champCity.innerHTML = '<option value="N/A">N/A</option>';
    champCity.disabled = false;
  }
}

// Verifica si ya hay una sesión guardada y muestra/oculta la pantalla de login
function verificarSesionActiva() {
  const usuarioActual = obtenerUsuarioActual();
  if (usuarioActual) {
    if (btnPortalLogin) btnPortalLogin.style.display = "none";
    contenedorLogin.style.display = "none";
    actualizarInterfazPorRol(usuarioActual);
  } else {
    // Si no hay sesión, la página de inicio sigue siendo pública
    contenedorLogin.style.display = "none";
    if (btnPortalLogin) btnPortalLogin.style.display = "inline-flex";
    if (indicadorSesion) indicadorSesion.style.display = "none";
    
    // Ocultar botones de administración pública
    const btnRegistrar = document.getElementById("btn-open-register");
    if (btnRegistrar) btnRegistrar.style.display = "none";
    
    const navig = document.getElementById("navegacion-principal");
    if (navig) navig.style.display = "none";
  }
}

// Muestra los elementos correctos en la interfaz según el rol del usuario
function actualizarInterfazPorRol(usuario) {
  indicadorSesion.style.display = "flex";
  sesionNombreUsuario.textContent = usuario.nombre;
  sesionBadgeRol.textContent = usuario.rol === "admin" ? "ADMIN" : usuario.rol === "profesor" ? "PROFESOR" : "ATLETA";
  
  if (btnPortalLogin) btnPortalLogin.style.display = "none";

  if (usuario.rol === "admin" || usuario.rol === "profesor") {
    navegacionPrincipal.style.display = "flex";
  } else {
    navegacionPrincipal.style.display = "none";
  }

  const btnMiPerfil = document.getElementById("btn-mi-perfil");
  if (btnMiPerfil) {
    if (usuario.rol === "atleta") {
      btnMiPerfil.style.display = "inline-flex";
    } else {
      btnMiPerfil.style.display = "none";
    }
  }

  const btnRegistrar = document.getElementById("btn-open-register");
  if (btnRegistrar) {
    btnRegistrar.style.display = (usuario.rol === "admin" || usuario.rol === "profesor") ? "inline-flex" : "none";
  }

  contenedorVistaAtletas.style.display = "block";
  contenedorVistaLogros.style.display = "none";
  enlaceTabAtletas.classList.add("activo");
  enlaceTabLogros.classList.remove("activo");
}

async function loadData() {
  currentAthletes = await getAthletes();
  renderStats();
  renderAthletesGrid();
}

function setupFilterSelects() {
  populateClasesSelect(filterClase, "all", "all");
}

function populateClasesSelect(selectElement, discapacityId, classType, defaultText = "Todas las clases") {
  selectElement.innerHTML = `<option value="all">${defaultText}</option>`;

  let filteredClasses = CLASES_DEPORTIVAS;

  if (discapacityId && discapacityId !== "all") {
    filteredClasses = filteredClasses.filter(c => c.discapacidad === discapacityId);
  }

  if (classType && classType !== "all") {
    filteredClasses = filteredClasses.filter(c => c.tipo === classType);
  }

  filteredClasses.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.clase;
    opt.textContent = item.clase;
    selectElement.appendChild(opt);
  });
}

function renderStats() {
  const totalAthletes = currentAthletes.length;
  let totalChamps = 0;

  currentAthletes.forEach(athlete => {
    totalChamps += (athlete.campeonatos || []).length;
  });

  const statAthletesVal = document.getElementById("stat-athletes").querySelector(".stat-value");
  const statChampsVal = document.getElementById("stat-championships").querySelector(".stat-value");

  if(statAthletesVal) statAthletesVal.textContent = totalAthletes;
  if(statChampsVal) statChampsVal.textContent = totalChamps;
}

// ==========================================================================
// LÓGICA DE AUTENTICACIÓN - LOGIN, REGISTRO Y SESIÓN
// ==========================================================================
function adjuntarEventosLogin() {
  const botonesRol = selectoresRol.querySelectorAll(".btn-rol");
  botonesRol.forEach(btn => {
    btn.addEventListener("click", () => {
      botonesRol.forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");
      rolSeleccionado = btn.dataset.rol;

      const etiquetaUsuario = document.getElementById("etiqueta-usuario");
      const switchRegistro = document.getElementById("login-switch-registro");
      const switchRegistroAtleta = document.getElementById("login-switch-registro-atleta");

      formLogin.style.display = "block";
      formRegistroProfesor.style.display = "none";
      inputLoginUsuario.value = "";
      inputLoginClave.value = "";

      if (rolSeleccionado === "admin") {
        etiquetaUsuario.textContent = "Usuario";
        inputLoginUsuario.placeholder = "admin";
        inputLoginUsuario.type = "text";
        switchRegistro.style.display = "none";
        if (switchRegistroAtleta) switchRegistroAtleta.style.display = "none";
      } else if (rolSeleccionado === "profesor") {
        etiquetaUsuario.textContent = "Correo Electrónico";
        inputLoginUsuario.placeholder = "ejemplo@valle.co";
        inputLoginUsuario.type = "email";
        switchRegistro.style.display = "block";
        if (switchRegistroAtleta) switchRegistroAtleta.style.display = "none";
      } else if (rolSeleccionado === "atleta") {
        etiquetaUsuario.textContent = "Correo Electrónico";
        inputLoginUsuario.placeholder = "ejemplo@valle.co";
        inputLoginUsuario.type = "email";
        switchRegistro.style.display = "none";
        if (switchRegistroAtleta) switchRegistroAtleta.style.display = "block";
      }
    });
  });

  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    manejarInicioSesion();
  });

  btnIniciarSesion.addEventListener("click", (e) => {
    e.preventDefault();
    manejarInicioSesion();
  });

  const enlaceIrARegistro = document.getElementById("enlace-ir-a-registro");
  if (enlaceIrARegistro) {
    enlaceIrARegistro.addEventListener("click", (e) => {
      e.preventDefault();
      formLogin.style.display = "none";
      formRegistroProfesor.style.display = "block";
    });
  }

  // ---- Navegar a formulario de registro de atleta ----
  const enlaceIrARegistroAtleta = document.getElementById("enlace-ir-a-registro-atleta");
  if (enlaceIrARegistroAtleta) {
    enlaceIrARegistroAtleta.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Enlace registro atleta clickeado");
      console.log("contenedorLogin antes:", contenedorLogin.style.display);
      contenedorLogin.style.display = "none";
      console.log("contenedorLogin despues:", contenedorLogin.style.display);
      openRegisterModal();
    });
  }

  const enlaceIrALogin = document.getElementById("enlace-ir-a-login");
  if (enlaceIrALogin) {
    enlaceIrALogin.addEventListener("click", (e) => {
      e.preventDefault();
      formRegistroProfesor.style.display = "none";
      formLogin.style.display = "block";
    });
  }

  const formRegProfesor = document.getElementById("formulario-registro-profesor");
  const btnGuardarRegistro = document.getElementById("btn-guardar-registro");
  if (btnGuardarRegistro) {
    btnGuardarRegistro.addEventListener("click", (e) => {
      e.preventDefault();
      manejarRegistroProfesor();
    });
  }
  if (formRegProfesor) {
    formRegProfesor.addEventListener("submit", (e) => {
      e.preventDefault();
      manejarRegistroProfesor();
    });
  }

  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      cerrarSesion();
      window.location.reload();
    });
  }

  if (enlaceTabAtletas) {
    enlaceTabAtletas.addEventListener("click", () => {
      contenedorVistaAtletas.style.display = "block";
      contenedorVistaLogros.style.display = "none";
      enlaceTabAtletas.classList.add("activo");
      enlaceTabLogros.classList.remove("activo");
    });
  }

  if (enlaceTabLogros) {
    enlaceTabLogros.addEventListener("click", () => {
      contenedorVistaAtletas.style.display = "none";
      contenedorVistaLogros.style.display = "block";
      enlaceTabAtletas.classList.remove("activo");
      enlaceTabLogros.classList.add("activo");
      renderizarLogros();
    });
  }

  const btnRegistrarLogro = document.getElementById("btn-registrar-logro");
  const modalAgregarLogro = document.getElementById("modal-agregar-logro");
  const btnCerrarModalLogro = document.getElementById("btn-cerrar-modal-logro");
  const btnCancelarLogro = document.getElementById("btn-cancelar-logro");
  const btnGuardarLogro = document.getElementById("btn-guardar-logro");

  if (btnRegistrarLogro) {
    btnRegistrarLogro.addEventListener("click", () => {
      const selectAtleta = document.getElementById("logro-atleta");
      selectAtleta.innerHTML = `<option value="">Seleccione el atleta...</option>`;
      currentAthletes.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id;
        opt.textContent = a.nombre;
        selectAtleta.appendChild(opt);
      });
      modalAgregarLogro.style.display = "flex";
    });
  }

  if (btnCerrarModalLogro) {
    btnCerrarModalLogro.addEventListener("click", () => { modalAgregarLogro.style.display = "none"; });
  }
  if (btnCancelarLogro) {
    btnCancelarLogro.addEventListener("click", () => { modalAgregarLogro.style.display = "none"; });
  }
  if (btnGuardarLogro) {
    btnGuardarLogro.addEventListener("click", () => manejarGuardarLogro());
  }
  if (modalAgregarLogro) {
    modalAgregarLogro.addEventListener("click", (e) => {
      if (e.target === modalAgregarLogro) modalAgregarLogro.style.display = "none";
    });
  }
}

async function manejarInicioSesion() {
  const usuario = inputLoginUsuario.value.trim();
  const clave = inputLoginClave.value.trim();

  document.getElementById("error-login-usuario").style.display = "none";
  document.getElementById("error-login-clave").style.display = "none";

  if (!usuario) {
    document.getElementById("error-login-usuario").style.display = "block";
    inputLoginUsuario.focus();
    return;
  }
  if (!clave) {
    document.getElementById("error-login-clave").style.display = "block";
    inputLoginClave.focus();
    return;
  }

  const sesion = await iniciarSesion(usuario, clave, rolSeleccionado);

  if (sesion) {
    contenedorLogin.style.display = "none";
    actualizarInterfazPorRol(sesion);
  } else {
    const errorEl = document.getElementById("error-login-usuario");
    errorEl.textContent = "Usuario o contraseña incorrectos. Verifique sus credenciales.";
    errorEl.style.display = "block";
    inputLoginUsuario.focus();
  }
}

async function manejarRegistroProfesor() {
  const nombre = document.getElementById("registro-nombre").value.trim();
  const cedula = document.getElementById("registro-cedula").value.trim();
  const fechaNacimiento = document.getElementById("registro-nacimiento").value;
  const especialidad = document.getElementById("registro-especialidad").value.trim();
  const correo = document.getElementById("registro-correo").value.trim();
  const clave = document.getElementById("registro-clave").value.trim();

  ["registro-nombre", "registro-cedula", "registro-nacimiento", "registro-especialidad", "registro-correo", "registro-clave"].forEach(id => {
    const errEl = document.getElementById(`error-${id}`);
    if (errEl) errEl.style.display = "none";
  });

  let valido = true;
  if (!nombre) { document.getElementById("error-registro-nombre").style.display = "block"; valido = false; }
  if (!cedula) { document.getElementById("error-registro-cedula").style.display = "block"; valido = false; }
  if (!fechaNacimiento) { document.getElementById("error-registro-nacimiento").style.display = "block"; valido = false; }
  if (!especialidad) { document.getElementById("error-registro-especialidad").style.display = "block"; valido = false; }
  if (!correo || !correo.includes("@")) { document.getElementById("error-registro-correo").style.display = "block"; valido = false; }
  if (!clave) { document.getElementById("error-registro-clave").style.display = "block"; valido = false; }

  if (!valido) return;

  const resultado = await registrarProfesor({ 
    nombre, 
    cedula, 
    fechaNacimiento, 
    especialidad, 
    correo, 
    password: clave 
  });

  if (resultado.error) {
    // Si la cédula ya existe, mostrar error en el campo de cédula, si no, en el de correo
    if (resultado.error.toLowerCase().includes("cédula") || resultado.error.toLowerCase().includes("cedula")) {
      const errEl = document.getElementById("error-registro-cedula");
      errEl.textContent = resultado.error;
      errEl.style.display = "block";
    } else {
      const errEl = document.getElementById("error-registro-correo");
      errEl.textContent = resultado.error;
      errEl.style.display = "block";
    }
    return;
  }

  // El inicio de sesión de profesores ahora es con el correo
  const sesion = await iniciarSesion(correo, clave, "profesor");
  if (sesion) {
    contenedorLogin.style.display = "none";
    actualizarInterfazPorRol(sesion);
  }
}

async function renderizarLogros() {
  const logrosGrid = document.getElementById("logros-grid");
  const logrosVacioState = document.getElementById("logros-vacio-state");
  const usuarioActual = obtenerUsuarioActual();

  let logros = [];
  if (usuarioActual && usuarioActual.rol === "profesor") {
    logros = await obtenerLogros(usuarioActual.id);
  } else {
    logros = await obtenerLogros();
  }

  logrosGrid.innerHTML = "";

  if (logros.length === 0) {
    logrosGrid.style.display = "none";
    logrosVacioState.style.display = "flex";
    return;
  }

  logrosGrid.style.display = "grid";
  logrosVacioState.style.display = "none";

  logros.forEach(logro => {
    const card = document.createElement("div");
    card.className = "athlete-card animate-fade-in";
    card.style.cssText = "padding: 20px; cursor: default;";
    card.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-red), #ff6b6b); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
          <span class="material-icons-round" style="color: white; font-size: 22px;">workspace_premium</span>
        </div>
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 800; color: var(--bg-dark); line-height: 1.2;">${logro.campeonato}</h4>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">${logro.ano}</span>
        </div>
      </div>
      <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 10px; line-height: 1.5;">${logro.logro}</p>
      <div style="display: flex; align-items: center; gap: 6px; padding-top: 10px; border-top: 1px solid var(--border-color);">
        <span class="material-icons-round" style="font-size: 14px; color: var(--primary-red);">person</span>
        <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary);">Atleta: ${logro.atletaNombre}</span>
      </div>
      <button class="btn btn-danger-outline btn-sm btn-eliminar-logro" data-id="${logro.id}" style="margin-top: 10px; width: 100%; font-size: 0.78rem; padding: 5px;">
        <span class="material-icons-round" style="font-size: 14px;">delete</span>
        Eliminar
      </button>
    `;

    card.querySelector(".btn-eliminar-logro").addEventListener("click", async () => {
      if (confirm(`¿Deseas eliminar este logro de "${logro.campeonato}"?`)) {
        await eliminarLogro(logro.id);
        renderizarLogros();
      }
    });

    logrosGrid.appendChild(card);
  });
}

async function manejarGuardarLogro() {
  const atletaId = document.getElementById("logro-atleta").value;
  const campeonato = document.getElementById("logro-campeonato").value.trim();
  const ano = document.getElementById("logro-ano").value.trim();
  const descripcion = document.getElementById("logro-descripcion").value.trim();
  const usuarioActual = obtenerUsuarioActual();

  ["logro-atleta", "logro-campeonato", "logro-ano", "logro-descripcion"].forEach(id => {
    const errEl = document.getElementById(`error-${id}`);
    if (errEl) errEl.style.display = "none";
  });

  let valido = true;
  if (!atletaId) { document.getElementById("error-logro-atleta").style.display = "block"; valido = false; }
  if (!campeonato) { document.getElementById("error-logro-campeonato").style.display = "block"; valido = false; }
  if (!ano) { document.getElementById("error-logro-ano").style.display = "block"; valido = false; }
  if (!descripcion) { document.getElementById("error-logro-descripcion").style.display = "block"; valido = false; }

  if (!valido) return;

  await guardarLogro({
    profesorId: usuarioActual ? usuarioActual.id : "admin",
    atletaId,
    campeonato,
    logro: descripcion,
    ano
  });

  document.getElementById("modal-agregar-logro").style.display = "none";
  document.getElementById("formulario-logro").reset();
  renderizarLogros();
}

// ==========================================================================
// CONTROLADORES DE EVENTOS PRINCIPALES
// ==========================================================================
function attachEventListeners() {
  searchInput.addEventListener("input", handleSearchAndFilters);
  btnClearSearch.addEventListener("click", () => {
    searchInput.value = "";
    btnClearSearch.style.display = "none";
    handleSearchAndFilters();
  });

  filterDiscapacidad.addEventListener("change", () => {
    populateClasesSelect(filterClase, filterDiscapacidad.value, filterTipoClase.value, "Todas las clases");
    handleSearchAndFilters();
  });

  filterTipoClase.addEventListener("change", () => {
    populateClasesSelect(filterClase, filterDiscapacidad.value, filterTipoClase.value, "Todas las clases");
    handleSearchAndFilters();
  });

  filterClase.addEventListener("change", handleSearchAndFilters);
  btnResetFilters.addEventListener("click", resetFilters);

  btnOpenRegister.addEventListener("click", () => openRegisterModal());
  btnEmptyRegister.addEventListener("click", () => openRegisterModal());
  btnCloseRegister.addEventListener("click", closeRegisterModal);
  btnCancelRegister.addEventListener("click", closeRegisterModal);

  btnCloseDetailModal.addEventListener("click", closeDetailModal);

  fieldDiscap.addEventListener("change", handleFormDiscapacidadChange);
  fieldTipoClase.addEventListener("change", handleFormTipoClaseChange);
  fieldClass.addEventListener("change", handleFormClassChange);
  btnSaveAthlete.addEventListener("click", handleSaveAthlete);

  fieldName.addEventListener("input", updateLivePreview);
  fieldDoc.addEventListener("input", updateLivePreview);

  btnSelectPhoto.addEventListener("click", () => photoInput.click());
  photoPreview.addEventListener("click", () => photoInput.click());
  photoInput.addEventListener("change", handlePhotoUpload);
  btnRemovePhoto.addEventListener("click", handleRemovePhoto);

  btnTriggerDocUpload.addEventListener("click", () => docFileInput.click());
  docFileInput.addEventListener("change", handleDocUpload);

  if (champCountry) champCountry.addEventListener("change", handleCountryChange);
  if (champState) champState.addEventListener("change", handleStateChange);

  btnOpenChampForm.addEventListener("click", () => toggleChampForm(true));
  btnEmptyChampTrigger.addEventListener("click", () => toggleChampForm(true));
  btnCloseChampForm.addEventListener("click", () => toggleChampForm(false));
  btnCancelChamp.addEventListener("click", () => toggleChampForm(false));
  btnSaveChamp.addEventListener("click", handleSaveChampionship);

  btnEditAthleteProfile.addEventListener("click", () => {
    const athlete = currentAthletes.find(a => a.id === selectedAthleteId);
    if (athlete) {
      closeDetailModal();
      openRegisterModal(athlete);
    }
  });

  // Eventos para el botón de "Mi Perfil" (Atletas)
  const btnMiPerfil = document.getElementById("btn-mi-perfil");
  if (btnMiPerfil) {
    btnMiPerfil.addEventListener("click", () => {
      const usuarioActual = obtenerUsuarioActual();
      if (usuarioActual && usuarioActual.rol === "atleta") {
        openDetailModal(usuarioActual.id);
      }
    });
  }

  // Eventos para el modal de Inicio de Sesión
  if (btnPortalLogin) {
    btnPortalLogin.addEventListener("click", () => {
      contenedorLogin.style.display = "flex";
    });
  }

  if (btnCerrarModalLogin) {
    btnCerrarModalLogin.addEventListener("click", () => {
      contenedorLogin.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modalRegister) closeRegisterModal();
    if (e.target === modalDetail) closeDetailModal();
    if (e.target === contenedorLogin) {
      contenedorLogin.style.display = "none";
    }
  });
}

// ==========================================================================
// FILTRADO Y BÚSQUEDA REACTIVA
// ==========================================================================
function handleSearchAndFilters() {
  const query = searchInput.value.toLowerCase().trim();
  const discap = filterDiscapacidad.value;
  const tipoClase = filterTipoClase.value;
  const clase = filterClase.value;

  btnClearSearch.style.display = query ? "block" : "none";

  const filtered = currentAthletes.filter(athlete => {
    const matchesQuery = !query ||
      athlete.nombre.toLowerCase().includes(query) ||
      athlete.cedula.includes(query);
    const matchesDiscap = discap === "all" || athlete.discapacidad === discap;
    const matchesTipo = tipoClase === "all" || athlete.tipoClase === tipoClase;
    const matchesClase = clase === "all" || athlete.claseDeportiva === clase;
    return matchesQuery && matchesDiscap && matchesTipo && matchesClase;
  });

  renderFilteredAthletes(filtered);
}

function resetFilters() {
  searchInput.value = "";
  btnClearSearch.style.display = "none";
  filterDiscapacidad.value = "all";
  filterTipoClase.value = "all";
  populateClasesSelect(filterClase, "all", "all", "Todas las clases");
  filterClase.value = "all";
  renderAthletesGrid();
}

// ==========================================================================
// RENDERIZADO DE LA UI
// ==========================================================================
function renderAthletesGrid() {
  renderFilteredAthletes(currentAthletes);
}

function renderFilteredAthletes(athletes) {
  athletesGrid.innerHTML = "";

  if (athletes.length === 0) {
    athletesGrid.style.display = "none";
    emptyState.style.display = "flex";
    resultsCount.textContent = "Mostrando 0 atletas";
    return;
  }

  athletesGrid.style.display = "grid";
  emptyState.style.display = "none";
  resultsCount.textContent = `Mostrando ${athletes.length} atleta${athletes.length > 1 ? 's' : ''}`;

  athletes.forEach(athlete => {
    const discapLabel = DISCAPACIDADES[athlete.discapacidad]?.nombre || athlete.discapacidad;

    let oro = 0, plata = 0, bronce = 0;
    (athlete.campeonatos || []).forEach(c => {
      if (c.posicion) {
        let pos = c.posicion.toLowerCase();
        if (pos === "oro") oro++;
        else if (pos === "plata") plata++;
        else if (pos === "bronce") bronce++;
      }
    });

    const card = document.createElement("div");
    card.className = "athlete-card animate-fade-in";
    card.innerHTML = `
      <div class="card-image-container">
        ${athlete.foto
          ? `<img src="${athlete.foto}" class="card-img-full" alt="Foto de ${athlete.nombre}" />`
          : '<div class="card-img-placeholder"><span class="material-icons-round">person</span></div>'}
      </div>
      <div class="card-content-wrapper">
        <h3 class="card-athlete-name">${athlete.nombre}</h3>
        <p class="card-athlete-subtitle">${athlete.club || 'Atleta Valle Oro Puro'}</p>
        <p class="card-athlete-category">${discapLabel} &mdash; ${athlete.claseDeportiva} (${athlete.tipoClase === "pista" ? "pista" : "campo"})</p>
        <div class="card-medals-row">
          <div class="medal-item">
            <span class="medal-circle gold"></span>
            <span class="medal-count">${oro.toString().padStart(2, '0')}</span>
          </div>
          <div class="medal-item">
            <span class="medal-circle silver"></span>
            <span class="medal-count">${plata.toString().padStart(2, '0')}</span>
          </div>
          <div class="medal-item">
            <span class="medal-circle bronze"></span>
            <span class="medal-count">${bronce.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openDetailModal(athlete.id));
    athletesGrid.appendChild(card);
  });
}

// ==========================================================================
// FORMULARIO: GESTIÓN DE DISCAPACIDAD Y CLASE DEPORTIVA
// ==========================================================================
function handleFormDiscapacidadChange() {
  const discapValue = fieldDiscap.value;

  if (!discapValue) {
    fieldTipoClase.value = "";
    fieldTipoClase.disabled = true;
    fieldClass.innerHTML = `<option value="">Primero elija modalidad...</option>`;
    fieldClass.disabled = true;
    classInfoBox.style.display = "none";
    updateLivePreview();
    return;
  }

  fieldTipoClase.disabled = false;
  fieldTipoClase.innerHTML = `
    <option value="">Seleccione...</option>
    <option value="pista">Pista (T)</option>
    <option value="campo">Campo (F)</option>
  `;
  fieldClass.innerHTML = `<option value="">Primero elija modalidad...</option>`;
  fieldClass.disabled = true;
  classInfoBox.style.display = "none";
  updateLivePreview();
}

function handleFormTipoClaseChange() {
  const discapValue = fieldDiscap.value;
  const tipoValue = fieldTipoClase.value;

  if (!tipoValue) {
    fieldClass.innerHTML = `<option value="">Primero elija modalidad...</option>`;
    fieldClass.disabled = true;
    classInfoBox.style.display = "none";
    updateLivePreview();
    return;
  }

  fieldClass.disabled = false;
  populateClasesSelect(fieldClass, discapValue, tipoValue, "Seleccione la clase deportiva...");
  classInfoBox.style.display = "none";
  updateLivePreview();
}

function handleFormClassChange() {
  const classValue = fieldClass.value;
  const selectedClassInfo = CLASES_DEPORTIVAS.find(c => c.clase === classValue);

  if (selectedClassInfo) {
    classInfoBox.style.display = "flex";
    classInfoText.textContent = selectedClassInfo.descripcion;
  } else {
    classInfoBox.style.display = "none";
  }
  updateLivePreview();
}

// ==========================================================================
// REACTIVIDAD: VISTA PREVIA EN VIVO (LIVE PREVIEW)
// ==========================================================================
function updateLivePreview() {
  if (previewCardName) previewCardName.textContent = fieldName.value.trim() || "Nombre del Atleta";
  if (previewCardId) previewCardId.textContent = fieldDoc.value.trim() || "-";

  const selectedDiscap = fieldDiscap.value;
  if (selectedDiscap) {
    previewCardBadgeDiscap.textContent = DISCAPACIDADES[selectedDiscap]?.nombre || "Discapacidad";
    previewCardBadgeDiscap.style.display = "inline-flex";
  } else {
    previewCardBadgeDiscap.style.display = "none";
  }

  const selectedClass = fieldClass.value;
  const selectedTipo = fieldTipoClase.value;
  if (selectedClass && selectedClass !== "all") {
    previewCardBadgeClass.textContent = selectedClass + (selectedTipo ? ` (${selectedTipo === "pista" ? "Pist" : "Camp"})` : "");
    previewCardBadgeClass.style.display = "inline-flex";
  } else {
    previewCardBadgeClass.style.display = "none";
  }

  if (currentProfilePhotoBase64) {
    previewCardImg.style.backgroundImage = "none";
    previewCardImg.className = "card-image-container";
    previewCardImg.innerHTML = `<img src="${currentProfilePhotoBase64}" class="card-img-full" alt="Vista Previa" />`;
  } else {
    previewCardImg.style.backgroundImage = "none";
    previewCardImg.className = "card-image-container";
    previewCardImg.innerHTML = `<div class="card-img-placeholder"><span class="material-icons-round">person</span></div>`;
  }
}

// ==========================================================================
// SUBIDA DE FOTO DE PERFIL (CONVERSIÓN BASE64)
// ==========================================================================
function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Por favor, suba únicamente archivos de imagen (.jpg, .png, .jpeg)");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    currentProfilePhotoBase64 = event.target.result;
    photoPreview.style.backgroundImage = "none";
    photoPreview.innerHTML = `<img src="${currentProfilePhotoBase64}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);" />`;
    btnRemovePhoto.style.display = "inline-flex";
    updateLivePreview();
  };
  reader.readAsDataURL(file);
}

function handleRemovePhoto() {
  currentProfilePhotoBase64 = null;
  photoPreview.style.backgroundImage = "none";
  photoPreview.innerHTML = `
    <span class="material-icons-round photo-placeholder-icon">add_a_photo</span>
    <p class="photo-placeholder-text">Subir foto (.png, .jpg)</p>
  `;
  btnRemovePhoto.style.display = "none";
  photoInput.value = "";
  updateLivePreview();
}

// ==========================================================================
// CONTROL DE MODALES (REGISTRO Y DETALLE)
// ==========================================================================
function openRegisterModal(athlete = null) {
  formAthlete.reset();
  clearValidationErrors();
  handleRemovePhoto();

  if (athlete) {
    // Modo Edición
    modalRegisterTitle.textContent = "Editar Perfil";
    fieldId.value = athlete.id;
    fieldName.value = athlete.nombre;
    fieldDoc.value = athlete.cedula;
    fieldBirth.value = athlete.fechaNacimiento;
    fieldGender.value = athlete.genero;
    fieldPhone.value = athlete.telefono || "";
    fieldEmail.value = athlete.correo || "";
    if(fieldClub) fieldClub.value = athlete.club || "";
    // No prellenar la contraseña; sólo la cambia si el usuario la escribe
    fieldPassword.value = "";

    // Si el usuario es un atleta (self-edit), marcar el campo de contraseña como opcional
    const usuarioActual = obtenerUsuarioActual();
    const passwordGroup = fieldPassword.closest(".form-group-row") || fieldPassword.closest(".form-group");
    if (usuarioActual && usuarioActual.rol === "atleta") {
      // Para atletas en self-edit: opcional — mostrar con indicación
      const label = passwordGroup ? passwordGroup.querySelector("label") : null;
      if (label) label.innerHTML = 'Nueva Contraseña <span style="color:var(--text-muted); font-weight:500; font-size:0.8em;">(dejar vacío para no cambiar)</span>';
    } else {
      const label = passwordGroup ? passwordGroup.querySelector("label") : null;
      if (label) label.innerHTML = 'Contraseña de Ingreso <span class="required">*</span>';
    }

    fieldDiscap.value = athlete.discapacidad;

    fieldTipoClase.disabled = false;
    fieldTipoClase.innerHTML = `
      <option value="">Seleccione...</option>
      <option value="pista">Pista (T)</option>
      <option value="campo">Campo (F)</option>
    `;
    fieldTipoClase.value = athlete.tipoClase || "";

    fieldClass.disabled = false;
    populateClasesSelect(fieldClass, athlete.discapacidad, athlete.tipoClase, "Seleccione la clase deportiva...");
    fieldClass.value = athlete.claseDeportiva;

    handleFormClassChange();

    if (athlete.foto) {
      currentProfilePhotoBase64 = athlete.foto;
      photoPreview.style.backgroundImage = "none";
      photoPreview.innerHTML = `<img src="${athlete.foto}" style="width: 100%; height: 100%; object-fit: cover; border-radius: var(--radius-md);" />`;
      btnRemovePhoto.style.display = "inline-flex";
    }
  } else {
    // Modo Registro Nuevo
    modalRegisterTitle.textContent = "Registrar Nuevo Atleta";
    fieldId.value = "";
    fieldPassword.value = "";
    if(fieldClub) fieldClub.value = "";
    fieldTipoClase.innerHTML = `<option value="">Primero elija discapacidad...</option>`;
    fieldTipoClase.disabled = true;
    fieldClass.innerHTML = `<option value="">Primero elija modalidad...</option>`;
    fieldClass.disabled = true;
    classInfoBox.style.display = "none";
  }

  updateLivePreview();
  modalRegister.classList.add("active");
  modalRegister.style.display = "flex";
}

function closeRegisterModal() {
  modalRegister.classList.remove("active");
  modalRegister.style.display = "none";
}

// ==========================================================================
// GUARDAR ATLETA
// ==========================================================================
async function handleSaveAthlete() {
  if (!validateAthleteForm()) return;

  const athleteData = {
    id: fieldId.value || undefined,
    nombre: fieldName.value.trim(),
    cedula: fieldDoc.value.trim(),
    fechaNacimiento: fieldBirth.value,
    genero: fieldGender.value,
    telefono: fieldPhone.value.trim(),
    correo: fieldEmail.value.trim(),
    discapacidad: fieldDiscap.value,
    tipoClase: fieldTipoClase.value,
    claseDeportiva: fieldClass.value,
    club: fieldClub ? fieldClub.value : "",
    foto: currentProfilePhotoBase64
  };

  // Solo actualizar la contraseña si el usuario la escribió
  if (fieldPassword.value.trim()) {
    athleteData.password = fieldPassword.value.trim();
  }

  try {
    const saved = await saveAthlete(athleteData);
    await loadData();
    closeRegisterModal();

    if (!obtenerUsuarioActual()) {
      // Nuevo atleta registrado desde login — iniciar sesión automáticamente
      contenedorLogin.style.display = "none";
      const sesion = await iniciarSesion(athleteData.correo, athleteData.password, "atleta");
      if (sesion) {
        actualizarInterfazPorRol(sesion);
      }
    } else {
      if (saved && saved.id) {
        openDetailModal(saved.id);
      }
    }
  } catch (error) {
    console.error("Error al guardar atleta:", error);
    const msg = error.message ? error.message : "Ocurrió un error al guardar los datos del atleta. Por favor, intente de nuevo.";
    alert(msg);
  }
}

function validateAthleteForm() {
  let isValid = true;
  clearValidationErrors();

  const isEditing = !!fieldId.value;

  const requiredFields = [
    { el: fieldName, err: "error-athlete-name" },
    { el: fieldDoc, err: "error-athlete-doc" },
    { el: fieldBirth, err: "error-athlete-birth" },
    { el: fieldGender, err: "error-athlete-gender" },
    { el: fieldDiscap, err: "error-athlete-discapacidad" },
    { el: fieldTipoClase, err: "error-athlete-tipo-clase" },
    { el: fieldClass, err: "error-athlete-clase" }
  ];
  if(fieldClub) {
    requiredFields.push({ el: fieldClub, err: "error-athlete-club" });
  }

  // La contraseña es obligatoria solo en el registro nuevo
  if (!isEditing) {
    requiredFields.push({ el: fieldPassword, err: "error-athlete-password" });
  }

  requiredFields.forEach(field => {
    if (!field.el.value || (field.el.id === "athlete-clase" && field.el.value === "all")) {
      field.el.closest(".form-group").classList.add("error");
      isValid = false;
    }
  });

  return isValid;
}

function clearValidationErrors() {
  const errorGroups = formAthlete.querySelectorAll(".form-group.error");
  errorGroups.forEach(g => g.classList.remove("error"));
}

// ==========================================================================
// EXPEDIENTE DETALLADO (MODAL EXPEDIENTE & HISTORIAL)
// ==========================================================================
function openDetailModal(athleteId) {
  selectedAthleteId = athleteId;
  const athlete = currentAthletes.find(a => a.id === athleteId);
  if (!athlete) return;

  detailAvatar.src = athlete.foto || `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23cbd5e1"><circle cx="50" cy="50" r="40"/></svg>`;
  
  // Dividir nombre y apellido
  const nameParts = athlete.nombre.split(" ");
  if (detailFirstName) detailFirstName.textContent = nameParts[0] || "";
  if (detailLastName) detailLastName.textContent = nameParts.slice(1).join(" ") || "";
  
  if (detailIdCard) detailIdCard.textContent = athlete.cedula;
  if (detailBadgeDiscap) detailBadgeDiscap.textContent = DISCAPACIDADES[athlete.discapacidad]?.nombre || athlete.discapacidad;
  if (detailBadgeClass) detailBadgeClass.textContent = athlete.claseDeportiva + ` (${athlete.tipoClase === "pista" ? "Pista" : "Campo"})`;

  if (detailAgeFull) detailAgeFull.textContent = calcularEdad(athlete.fechaNacimiento) + " años (" + formatearFecha(athlete.fechaNacimiento) + ")";
  if (detailClub) detailClub.textContent = athlete.club || "Sin Club";
  if (detailGender) detailGender.textContent = athlete.genero;

  // Pruebas únicas del atleta
  const uniquePruebas = [...new Set((athlete.campeonatos || []).map(c => c.prueba).filter(Boolean))];
  if (detailPruebasDinamicas) detailPruebasDinamicas.textContent = uniquePruebas.length > 0 ? uniquePruebas.join(", ") : "No registradas";

  // Calcular medallas
  let goldCount = 0, silverCount = 0, bronzeCount = 0;
  (athlete.campeonatos || []).forEach(c => {
    if (c.posicion) {
      const pos = c.posicion.toLowerCase();
      if (pos === "oro") goldCount++;
      else if (pos === "plata") silverCount++;
      else if (pos === "bronce") bronzeCount++;
    }
  });
  if (detailMedalsGold) detailMedalsGold.textContent = goldCount.toString();
  if (detailMedalsSilver) detailMedalsSilver.textContent = silverCount.toString();
  if (detailMedalsBronze) detailMedalsBronze.textContent = bronzeCount.toString();

  // Calcular Personal Best y Season Best de la prueba principal
  const parseMarca = (marcaStr) => {
    if (!marcaStr) return 0;
    const cleaned = marcaStr.replace(/[^0-9.,]/g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  };

  const isPista = athlete.tipoClase === "pista";
  const validChamps = (athlete.campeonatos || []).filter(c => c.marca && c.prueba);
  
  const pruebaCounts = {};
  validChamps.forEach(c => {
    pruebaCounts[c.prueba] = (pruebaCounts[c.prueba] || 0) + 1;
  });

  let primaryPrueba = "";
  let maxCount = 0;
  for (const p in pruebaCounts) {
    if (pruebaCounts[p] > maxCount) {
      maxCount = pruebaCounts[p];
      primaryPrueba = p;
    }
  }

  const activeEventBtn = document.getElementById("detail-active-event-name");
  if (activeEventBtn) {
    activeEventBtn.textContent = primaryPrueba || "Sin marca";
  }

  let personalBest = "-";
  let seasonBest = "-";

  if (primaryPrueba) {
    const primaryChamps = validChamps.filter(c => c.prueba === primaryPrueba);
    let bestVal = isPista ? Infinity : -Infinity;
    let bestRaw = "";
    let bestSeasonVal = isPista ? Infinity : -Infinity;
    let bestSeasonRaw = "";
    const currentYear = new Date().getFullYear();

    primaryChamps.forEach(c => {
      const val = parseMarca(c.marca);
      if (!val) return;

      const isBetterPB = isPista ? (val < bestVal) : (val > bestVal);
      if (isBetterPB) {
        bestVal = val;
        bestRaw = c.marca;
      }

      const year = c.fecha ? new Date(c.fecha).getFullYear() : 0;
      if (year === currentYear) {
        const isBetterSB = isPista ? (val < bestSeasonVal) : (val > bestSeasonVal);
        if (isBetterSB) {
          bestSeasonVal = val;
          bestSeasonRaw = c.marca;
        }
      }
    });

    if (bestRaw) personalBest = bestRaw;
    if (bestSeasonRaw) {
      seasonBest = bestSeasonRaw;
    } else {
      let newestYear = 0;
      primaryChamps.forEach(c => {
        const year = c.fecha ? new Date(c.fecha).getFullYear() : 0;
        if (year > newestYear) newestYear = year;
      });
      if (newestYear) {
        primaryChamps.forEach(c => {
          const year = c.fecha ? new Date(c.fecha).getFullYear() : 0;
          if (year === newestYear) {
            const val = parseMarca(c.marca);
            const isBetterSB = isPista ? (val < bestSeasonVal) : (val > bestSeasonVal);
            if (isBetterSB) {
              bestSeasonVal = val;
              bestSeasonRaw = c.marca;
            }
          }
        });
        if (bestSeasonRaw) seasonBest = bestSeasonRaw + ` (${newestYear})`;
      }
    }
  }

  const detailPersonalBest = document.getElementById("detail-personal-best");
  if (detailPersonalBest) detailPersonalBest.textContent = personalBest;
  
  const detailSeasonBest = document.getElementById("detail-season-best");
  if (detailSeasonBest) detailSeasonBest.textContent = seasonBest;

  // Actualizar ranking basado en logros
  const rankingValEl = document.getElementById("detail-ranking-value");
  if (rankingValEl) {
    if (goldCount > 0) rankingValEl.textContent = "01";
    else if (silverCount > 0) rankingValEl.textContent = "05";
    else if (bronzeCount > 0) rankingValEl.textContent = "12";
    else rankingValEl.textContent = "99";
  }

  // Logro destacado en Achievements
  const featuredBox = document.getElementById("featured-achievement-box");
  const featuredTitle = document.getElementById("featured-achievement-title");
  const featuredEvent = document.getElementById("featured-achievement-event");
  const featuredMark = document.getElementById("featured-achievement-mark");
  const featuredMeta = document.getElementById("featured-achievement-meta");
  const featuredChamp = document.getElementById("featured-achievement-championship");

  const medalPriority = { "oro": 1, "plata": 2, "bronce": 3 };
  let bestChamp = null;
  let bestPriority = Infinity;

  (athlete.campeonatos || []).forEach(c => {
    if (c.posicion) {
      const pos = c.posicion.toLowerCase();
      const priority = medalPriority[pos] || 99;
      if (priority < bestPriority) {
        bestPriority = priority;
        bestChamp = c;
      }
    }
  });

  if (bestChamp) {
    if (featuredBox) featuredBox.style.display = "flex";
    if (featuredTitle) {
      featuredTitle.textContent = bestChamp.posicion === "Oro" 
        ? "GOLD MEDAL" 
        : bestChamp.posicion === "Plata" 
          ? "SILVER MEDAL" 
          : bestChamp.posicion === "Bronce" 
            ? "BRONZE MEDAL" 
            : bestChamp.posicion.toUpperCase();
    }
    if (featuredEvent) featuredEvent.textContent = bestChamp.prueba;
    if (featuredMark) featuredMark.textContent = bestChamp.marca;
    if (featuredMeta) featuredMeta.textContent = bestChamp.lugar || "-";
    if (featuredChamp) featuredChamp.textContent = bestChamp.campeonato;
  } else {
    if (featuredBox) featuredBox.style.display = "none";
  }

  // ── Privacidad: teléfono y correo solo para admin y profesor ──────────────
  const usuarioPrivacidad = obtenerUsuarioActual();
  const puedeVerContacto = usuarioPrivacidad &&
    (usuarioPrivacidad.rol === "admin" || usuarioPrivacidad.rol === "profesor");

  const phoneRow = document.getElementById("detail-phone-row");
  const emailRow = document.getElementById("detail-email-row");
  const PRIVADO_HTML = '<span style="display:inline-flex;align-items:center;gap:4px;color:var(--text-muted);font-size:0.82rem;"><span class=\'material-icons-round\' style=\'font-size:14px;\'>lock</span>Información privada</span>';

  if (puedeVerContacto) {
    detailPhone.textContent = athlete.telefono || "No registrado";
    detailEmail.textContent = athlete.correo  || "No registrado";
    if (phoneRow) phoneRow.style.display = "";
    if (emailRow) emailRow.style.display = "";
  } else {
    detailPhone.innerHTML = PRIVADO_HTML;
    detailEmail.innerHTML = PRIVADO_HTML;
    if (phoneRow) phoneRow.style.display = "";
    if (emailRow) emailRow.style.display = "";
  }
  // ─────────────────────────────────────────────────────────────────────────

  toggleChampForm(false);
  renderDocumentsList(athlete);
  renderChampionshipsTimeline(athlete);
  renderAthleteChart(athlete);

  // Controlar la visualización de botones de administración en el expediente detallado
  const usuarioActual = obtenerUsuarioActual();
  const esAdminOProfesor = usuarioActual && (usuarioActual.rol === "admin" || usuarioActual.rol === "profesor");
  const esAtletaPropietario = usuarioActual && usuarioActual.rol === "atleta" && usuarioActual.id === athleteId;
  const puedeEditar = esAdminOProfesor || esAtletaPropietario;

  if (btnEditAthleteProfile) {
    btnEditAthleteProfile.style.display = puedeEditar ? "inline-flex" : "none";
  }

  const btnUploadDoc = document.getElementById("btn-trigger-doc-upload");
  if (btnUploadDoc) {
    btnUploadDoc.style.display = puedeEditar ? "flex" : "none";
  }

  const btnAddChamp = document.getElementById("btn-open-championship-form");
  if (btnAddChamp) {
    btnAddChamp.style.display = puedeEditar ? "inline-flex" : "none";
  }

  modalDetail.classList.add("active");
}

function closeDetailModal() {
  modalDetail.classList.remove("active");
  selectedAthleteId = null;
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return "-";
  const hoy = new Date();
  const cumple = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - cumple.getFullYear();
  const m = hoy.getMonth() - cumple.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
    edad--;
  }
  return edad;
}

// ==========================================================================
// GESTIÓN DE DOCUMENTOS PDF
// ==========================================================================
async function handleDocUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
    alert("Por favor, suba únicamente archivos en formato PDF.");
    e.target.value = "";
    return;
  }

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
  if (file.size > MAX_FILE_SIZE) {
    alert("El archivo es demasiado grande. Por favor, suba un documento PDF de máximo 2 MB para ahorrar espacio en el sistema.");
    e.target.value = "";
    return;
  }

  const sizeKB = file.size / 1024;
  const friendlySize = sizeKB > 1024
    ? (sizeKB / 1024).toFixed(1) + " MB"
    : sizeKB.toFixed(0) + " KB";

  const updatedAthlete = await addDocument(selectedAthleteId, file.name, friendlySize);

  if (updatedAthlete) {
    await loadData();
    const atletaActualizado = currentAthletes.find(a => a.id === selectedAthleteId);
    if (atletaActualizado) renderDocumentsList(atletaActualizado);
    docFileInput.value = "";
  }
}

function renderDocumentsList(athlete) {
  detailDocsList.innerHTML = "";
  const docs = athlete.documentos || [];

  if (docs.length === 0) {
    noDocsMsg.style.display = "flex";
    detailDocsList.style.display = "none";
    return;
  }

  noDocsMsg.style.display = "none";
  detailDocsList.style.display = "flex";

  docs.forEach(doc => {
    const item = document.createElement("div");
    item.className = "doc-item animate-fade-in";
    item.innerHTML = `
      <div class="doc-info">
        <span class="material-icons-round doc-icon">picture_as_pdf</span>
        <div class="doc-text">
          <p class="doc-name" title="${doc.nombre}">${doc.nombre}</p>
          <p class="doc-meta">Cargado: ${doc.fecha} • ${doc.tamano}</p>
        </div>
      </div>
      <div class="doc-actions">
        <button class="btn-icon-sm btn-view-doc" title="Ver Documento">
          <span class="material-icons-round">visibility</span>
        </button>
        <button class="btn-icon-sm btn-delete-doc text-red" title="Eliminar del expediente">
          <span class="material-icons-round">delete</span>
        </button>
      </div>
    `;

    item.querySelector(".btn-view-doc").addEventListener("click", () => {
      alert(`Abriendo el archivo "${doc.nombre}" en el lector de PDF del sistema...`);
    });

    item.querySelector(".btn-delete-doc").addEventListener("click", async () => {
      if (confirm(`¿Estás seguro de que deseas eliminar el documento "${doc.nombre}" del expediente del atleta?`)) {
        await deleteDocument(athlete.id, doc.id);
        await loadData();
        const updatedAthlete = currentAthletes.find(a => a.id === athlete.id);
        if (updatedAthlete) renderDocumentsList(updatedAthlete);
      }
    });

    detailDocsList.appendChild(item);
  });
}

// ==========================================================================
// GESTIÓN DE HISTORIAL DE CAMPEONATOS
// ==========================================================================
function toggleChampForm(show) {
  if (show) {
    formChampionship.reset();
    clearChampFormErrors();
    champFormCard.classList.add("active");
    champFormCard.style.display = "flex";
  } else {
    champFormCard.classList.remove("active");
    champFormCard.style.display = "none";
  }
}

async function handleSaveChampionship() {
  if (!validateChampForm()) return;

  const country = document.getElementById("champ-country").value;
  const state = document.getElementById("champ-state").value;
  const city = document.getElementById("champ-city").value;
  
  // Construir el string de lugar
  const place = `${city !== 'N/A' ? city + ', ' : ''}${state !== 'N/A' ? state + ', ' : ''}${country}`;

  const champData = {
    campeonato: document.getElementById("champ-name").value.trim(),
    lugar: place,
    prueba: document.getElementById("champ-event").value,
    marca: document.getElementById("champ-result").value.trim(),
    fecha: document.getElementById("champ-date").value,
    posicion: document.getElementById("champ-pos").value
  };

  const updatedAthlete = await addChampionship(selectedAthleteId, champData);

  if (updatedAthlete) {
    await loadData();
    const athlete = currentAthletes.find(a => a.id === selectedAthleteId);
    if (athlete) {
      renderChampionshipsTimeline(athlete);
      renderAthleteChart(athlete);
    }
    
    // No cerrar el formulario, solo resetearlo para añadir más rápido
    formChampionship.reset();
    clearChampFormErrors();
    // Reiniciar los selects de ciudad
    if (champState) {
      champState.innerHTML = '<option value="">Seleccione estado...</option>';
      champState.disabled = true;
    }
    if (champCity) {
      champCity.innerHTML = '<option value="">Seleccione estado primero...</option>';
      champCity.disabled = true;
    }
    alert("¡Logro añadido con éxito! Puedes registrar otro a continuación.");
  }
}

function validateChampForm() {
  let isValid = true;
  clearChampFormErrors();

  const fields = [
    { id: "champ-name", errorId: "error-champ-name" },
    { id: "champ-country", errorId: "error-champ-country" },
    { id: "champ-state", errorId: "error-champ-state" },
    { id: "champ-city", errorId: "error-champ-city" },
    { id: "champ-event", errorId: "error-champ-event" },
    { id: "champ-result", errorId: "error-champ-result" },
    { id: "champ-date", errorId: "error-champ-date" },
    { id: "champ-pos", errorId: "error-champ-pos" }
  ];

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el.value) {
      el.closest(".form-group").classList.add("error");
      isValid = false;
    }
  });

  return isValid;
}

function clearChampFormErrors() {
  const errors = formChampionship.querySelectorAll(".form-group.error");
  errors.forEach(e => e.classList.remove("error"));
}

function renderChampionshipsTimeline(athlete) {
  detailChampsList.innerHTML = "";
  const champs = athlete.campeonatos || [];
  const tableWrapper = detailChampsList.closest(".table-responsive");

  if (champs.length === 0) {
    emptyChampsMsg.style.display = "flex";
    if (tableWrapper) tableWrapper.style.display = "none";
    return;
  }

  emptyChampsMsg.style.display = "none";
  if (tableWrapper) tableWrapper.style.display = "block";

  const sortedChamps = [...champs].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const usuarioActual = obtenerUsuarioActual();
  const esAdminOProfesor = usuarioActual && (usuarioActual.rol === "admin" || usuarioActual.rol === "profesor");

  sortedChamps.forEach(c => {
    const year = c.fecha ? new Date(c.fecha).getFullYear() : "-";
    let medalBadge = `<span class="champ-badge ${c.posicion}">${c.posicion}</span>`;

    const row = document.createElement("tr");
    row.className = "animate-fade-in";
    row.innerHTML = `
      <td><strong>${year}</strong></td>
      <td>${c.campeonato}</td>
      <td>${c.prueba}</td>
      <td style="color: var(--primary-red); font-weight: 800;">${c.marca}</td>
      <td>${medalBadge}</td>
      <td>${c.lugar || "-"}</td>
      <td>${formatearFecha(c.fecha)}</td>
      <td class="actions-col">
        ${esAdminOProfesor ? `
          <button class="btn-icon-sm btn-delete-champ text-red" title="Eliminar esta marca">
            <span class="material-icons-round">delete</span>
          </button>
        ` : "-"}
      </td>
    `;

    if (esAdminOProfesor) {
      row.querySelector(".btn-delete-champ").addEventListener("click", async () => {
        if (confirm(`¿Estás seguro de que deseas eliminar el registro de "${c.campeonato}" de este atleta?`)) {
          await deleteChampionship(athlete.id, c.id);
          await loadData();
          const updatedAthlete = currentAthletes.find(a => a.id === athlete.id);
          if (updatedAthlete) {
            renderChampionshipsTimeline(updatedAthlete);
            renderAthleteChart(updatedAthlete);
          }
        }
      });
    }

    detailChampsList.appendChild(row);
  });
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return "-";
  try {
    const parts = fechaStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(fechaStr);
    if (isNaN(d.getTime())) return fechaStr;
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch (e) {
    return fechaStr;
  }
}

function renderAthleteChart(athlete) {
  const chartWrapper = document.getElementById("detail-chart-wrapper");
  if (!chartWrapper) return;
  chartWrapper.innerHTML = "";

  const champs = athlete.campeonatos || [];
  
  // Filtrar por años >= 2023
  const validChamps = champs.filter(c => {
    if (!c.fecha) return false;
    const year = new Date(c.fecha).getFullYear();
    return year >= 2023;
  });

  if (validChamps.length === 0) {
    chartWrapper.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--text-muted); font-size: 0.82rem; font-weight: 550; padding: 20px; text-align: center;">
        <span class="material-icons-round" style="font-size: 32px; color: var(--border-color);">show_chart</span>
        <p>No hay marcas registradas desde 2023 para generar la gráfica de evolución.</p>
      </div>
    `;
    return;
  }

  // Encontrar la prueba con más registros
  const pruebaCounts = {};
  validChamps.forEach(c => {
    if (c.prueba) {
      pruebaCounts[c.prueba] = (pruebaCounts[c.prueba] || 0) + 1;
    }
  });

  let primaryPrueba = "";
  let maxCount = 0;
  for (const p in pruebaCounts) {
    if (pruebaCounts[p] > maxCount) {
      maxCount = pruebaCounts[p];
      primaryPrueba = p;
    }
  }

  if (!primaryPrueba) return;

  // Filtrar los campeonatos de esa prueba
  const pruebaChamps = validChamps.filter(c => c.prueba === primaryPrueba);

  // Agrupar por año y obtener la mejor marca del año (2023 - presente)
  const years = [2023, 2024, 2025, 2026];
  const currentYear = new Date().getFullYear();
  if (currentYear > 2026 && !years.includes(currentYear)) {
    years.push(currentYear);
  }

  // Parsear marca a flotante
  const parseMarca = (marcaStr) => {
    if (!marcaStr) return 0;
    const cleaned = marcaStr.replace(/[^0-9.,]/g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  };

  const isPista = athlete.tipoClase === "pista"; // Si es pista, menor tiempo es mejor.
  
  const bestMarksByYear = {};
  pruebaChamps.forEach(c => {
    const year = new Date(c.fecha).getFullYear();
    const val = parseMarca(c.marca);
    if (!val) return;

    if (!bestMarksByYear[year]) {
      bestMarksByYear[year] = { val, raw: c.marca, campeonato: c.campeonato };
    } else {
      const isBetter = isPista ? (val < bestMarksByYear[year].val) : (val > bestMarksByYear[year].val);
      if (isBetter) {
        bestMarksByYear[year] = { val, raw: c.marca, campeonato: c.campeonato };
      }
    }
  });

  const dataPoints = [];
  years.forEach((y, idx) => {
    if (bestMarksByYear[y]) {
      dataPoints.push({
        year: y,
        index: idx,
        val: bestMarksByYear[y].val,
        raw: bestMarksByYear[y].raw,
        campeonato: bestMarksByYear[y].campeonato
      });
    }
  });

  if (dataPoints.length === 0) {
    chartWrapper.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--text-muted); font-size: 0.82rem; font-weight: 550; padding: 20px; text-align: center;">
        <span class="material-icons-round" style="font-size: 32px; color: var(--border-color);">show_chart</span>
        <p>Registre marcas con valores numéricos para visualizar el gráfico de la prueba: <strong>${primaryPrueba}</strong></p>
      </div>
    `;
    return;
  }

  // Dibujar gráfico SVG
  const width = 600;
  const height = 180;
  const paddingLeft = 50;
  const paddingRight = 40;
  const paddingTop = 25;
  const paddingBottom = 25;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const minVal = Math.min(...dataPoints.map(p => p.val)) * 0.95;
  const maxVal = Math.max(...dataPoints.map(p => p.val)) * 1.05;
  const valRange = maxVal - minVal || 1;

  const getX = (idx) => paddingLeft + (idx / (years.length - 1)) * chartW;
  const getY = (val) => {
    const ratio = (val - minVal) / valRange;
    return isPista 
      ? paddingTop + ratio * chartH 
      : paddingTop + (1 - ratio) * chartH;
  };

  let svgContent = `
    <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; font-family: var(--font-family);">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary-red)" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="var(--primary-red)" stop-opacity="0.00"/>
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--primary-red)"/>
          <stop offset="100%" stop-color="var(--primary-red-hover)"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="var(--primary-red)" flood-opacity="0.3"/>
        </filter>
      </defs>

      <line x1="${paddingLeft}" y1="${getY(minVal)}" x2="${width - paddingRight}" y2="${getY(minVal)}" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4,4" />
      <line x1="${paddingLeft}" y1="${getY(maxVal)}" x2="${width - paddingRight}" y2="${getY(maxVal)}" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="4,4" />
      
      <text x="${paddingLeft - 8}" y="${getY(minVal) + 4}" fill="var(--text-muted)" font-size="9" font-weight="700" text-anchor="end">${minVal.toFixed(2)}</text>
      <text x="${paddingLeft - 8}" y="${getY(maxVal) + 4}" fill="var(--text-muted)" font-size="9" font-weight="700" text-anchor="end">${maxVal.toFixed(2)}</text>
  `;

  years.forEach((y, idx) => {
    const x = getX(idx);
    svgContent += `
      <line x1="${x}" y1="${paddingTop}" x2="${x}" y2="${height - paddingBottom}" stroke="var(--border-color)" stroke-width="1" stroke-opacity="0.5" />
      <text x="${x}" y="${height - paddingBottom + 16}" fill="var(--text-muted)" font-size="10" font-weight="800" text-anchor="middle">${y}</text>
    `;
  });

  let pathD = "";
  let areaD = "";

  dataPoints.forEach((p, i) => {
    const x = getX(p.index);
    const y = getY(p.val);
    if (i === 0) {
      pathD = `M ${x} ${y}`;
      areaD = `M ${x} ${height - paddingBottom} L ${x} ${y}`;
    } else {
      pathD += ` L ${x} ${y}`;
      areaD += ` L ${x} ${y}`;
    }
    if (i === dataPoints.length - 1) {
      areaD += ` L ${x} ${height - paddingBottom} Z`;
    }
  });

  if (dataPoints.length > 0) {
    if (dataPoints.length > 1) {
      svgContent += `<path d="${areaD}" fill="url(#areaGrad)" />`;
      svgContent += `<path d="${pathD}" fill="none" stroke="url(#lineGrad)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" filter="url(#shadow)" />`;
    }

    dataPoints.forEach(p => {
      const x = getX(p.index);
      const y = getY(p.val);
      svgContent += `
        <g class="chart-point" style="cursor: pointer;">
          <circle cx="${x}" cy="${y}" r="6" fill="#ffffff" stroke="var(--primary-red)" stroke-width="3" />
          <circle cx="${x}" cy="${y}" r="12" fill="transparent" />
          <title>${p.raw} (${p.campeonato})</title>
        </g>
      `;
    });
  }

  svgContent += `
    <text x="${paddingLeft}" y="15" fill="var(--primary-red)" font-size="10" font-weight="800" text-anchor="start" style="text-transform: uppercase; letter-spacing: 0.5px;">Evolución: ${primaryPrueba}</text>
    </svg>
  `;

  chartWrapper.innerHTML = svgContent;
}
