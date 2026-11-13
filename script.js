"use strict";
const CONFIG = {

  /* VIOLINSKI KLJUČ */
  CLEF_HEIGHT_SPACES: 6,

  // Da li je ključ uključen kad se program pokrene (false = OFF)
  CLEF_DEFAULT_ON: false,

  CLEF_GLYPH: "\u{1D11E}",
  CLEF_FONT:  '"Noto Music", "Bravura Text", "Segoe UI Symbol", "Noto Sans Symbols 2", "Apple Symbols", serif',
  CLEF_COLOR: "#1a1a1a",


  /* LINIJSKI SISTEMI */

  LINE_COLOR:        "#3d3d3d",
  LINE_THICKNESS_PX: 1.6,

  // Visina jednog sistema u razmacima: 4 za linije + prazan prostor iznad i ispod.
  // Mora biti paran broj.
  STAFF_PITCH_SPACES: 10,

  // Željeni razmak između linija u px. Od njega zavisi koliko sistema stane na ekran
  // (broj sistema je uvijek cijeli, pa svaki ima tačno 5 linija).
  TARGET_SPACE_PX: 28,
  MIN_SYSTEMS:     2,
  MAX_SYSTEMS:     12,

  MARGIN_X_RATIO:       0.04,   // lijeva i desna margina (dio širine ekrana)
  TOP_RESERVE_PX:       30,     // prostor pri vrhu (potpis)
  GAP_ABOVE_TOOLBAR_PX: 8,

  /* OSTALO */

  LONG_PRESS_MS: 450,           // koliko dugo držati boju/gumicu za debljinu
  
  /* GUMICA */

  // Najveće povećanje gumice pri brzom pomjeranju (3 = do 3x veća od postavljene debljine)
  ERASER_MAX_GROWTH: 3,
  // Brzina (px po milisekundi) pri kojoj gumica dostiže najveću veličinu
  ERASER_FULL_SPEED: 2.5,
  // Glatkoća promjene veličine (manji broj = sporije i glatkije)
  ERASER_SMOOTHING: 0.25,
};


/* ALATI */

const TOOLS = {
  black:  { label: "Crna",   color: "#000000", width: 4,  min: 1, max: 40,  eraser: false },
  red:    { label: "Crvena", color: "#d92d2d", width: 4,  min: 1, max: 40,  eraser: false },
  yellow: { label: "Žuta",   color: "#f1c40f", width: 10, min: 1, max: 40,  eraser: false },
  eraser: { label: "Gumica", color: "#000000", width: 30, min: 8, max: 120, eraser: true  },
};


/* ELEMENTI I STANJE */

const $ = (id) => document.getElementById(id);

const paper    = $("paper");
const ink      = $("ink");
const paperCtx = paper.getContext("2d");
const inkCtx   = ink.getContext("2d");

const toolbar   = $("toolbar");
const btnClef   = $("btn-clef");
const clefState = $("clef-state");

const popup         = $("size-popup");
const popupBackdrop = $("popup-backdrop");
const sizeTitle     = $("size-title");
const sizeValue     = $("size-value");
const sizeDot       = $("size-dot");
const sizeRange     = $("size-range");

const confirmBox    = $("confirm");
const eraserCursor  = $("eraser-cursor");

let dpr         = 1;
let layout      = null;
let clefOn      = CONFIG.CLEF_DEFAULT_ON;
let currentTool = "black";
let sizeTool    = null;

const strokes       = [];
let currentStroke   = null;
let activePointerId = null;


/* POMOĆNE FUNKCIJE */

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/* Unos: dodir, olovka i miš */

const HAS_POINTER_EVENTS = "PointerEvent" in window;

// Pretvara dodir u isti oblik kao pointer događaj
function fromTouch(e, touch) {
  return {
    pointerId:   touch.identifier,
    pointerType: "touch",
    clientX:     touch.clientX,
    clientY:     touch.clientY,
    timeStamp:   e.timeStamp,
  };
}

// Povezuje element s unosom. Radi s pointer događajima, a na uređajima
// bez njih automatski prelazi na dodir (touchstart / touchmove / touchend).
function bindInput(el, handlers) {
  const noop = () => {};

  const down   = handlers.down   || noop;
  const move   = handlers.move   || noop;
  const up     = handlers.up     || noop;
  const cancel = handlers.cancel || noop;
  const leave  = handlers.leave  || noop;

  if (HAS_POINTER_EVENTS) {
    el.addEventListener("pointerdown",   down);
    el.addEventListener("pointermove",   move);
    el.addEventListener("pointerup",     up);
    el.addEventListener("pointercancel", cancel);
    el.addEventListener("pointerleave",  leave);
    return;
  }

  const forward = (type, handler) => {
    el.addEventListener(type, (e) => {
      e.preventDefault();

      for (const touch of e.changedTouches) {
        handler(fromTouch(e, touch));
      }
    }, { passive: false });
  };

  forward("touchstart",  down);
  forward("touchmove",   move);
  forward("touchend",    up);
  forward("touchcancel", cancel);
}


function getSafeInsets() {
  const style = getComputedStyle($("safe-probe"));

  return {
    left:  parseFloat(style.paddingLeft)  || 0,
    right: parseFloat(style.paddingRight) || 0,
  };
}


/*
   RASPORED LINIJSKIH SISTEMA
   Sve se računa u stvarnim pikselima ekrana, pa su linije
   ostre i svi razmaci tačno jednaki.
  */

function computeLayout(width) {
  const toolbarTop = toolbar.getBoundingClientRect().top;
  const available  = toolbarTop - CONFIG.GAP_ABOVE_TOOLBAR_PX - CONFIG.TOP_RESERVE_PX;

  const count = clamp(
    Math.round(available / (CONFIG.STAFF_PITCH_SPACES * CONFIG.TARGET_SPACE_PX)),
    CONFIG.MIN_SYSTEMS,
    CONFIG.MAX_SYSTEMS
  );

  const availableDev = available * dpr;
  const spaceDev     = Math.max(4, Math.floor(availableDev / (CONFIG.STAFF_PITCH_SPACES * count)));
  const pitchDev     = spaceDev * CONFIG.STAFF_PITCH_SPACES;
  const padDev       = Math.round(((CONFIG.STAFF_PITCH_SPACES - 4) / 2) * spaceDev);

  // Višak prostora se dijeli gore i dolje da sistemi budu na sredini
  const startDev = Math.round(CONFIG.TOP_RESERVE_PX * dpr)
                 + Math.floor((availableDev - pitchDev * count) / 2);

  const staffTops = [];

  for (let i = 0; i < count; i++) {
    staffTops.push(startDev + i * pitchDev + padDev);
  }

  const insets  = getSafeInsets();
  const marginX = width * CONFIG.MARGIN_X_RATIO;

  layout = {
    spaceDev,
    staffTops,
    leftDev:  Math.round(Math.max(marginX, insets.left  + 16) * dpr),
    rightDev: Math.round((width - Math.max(marginX, insets.right + 16)) * dpr),
  };
}


/* CRTANJE LINIJA I VIOLINSKOG KLJUČA */

function drawPaper() {
  paperCtx.setTransform(1, 0, 0, 1, 0, 0);
  paperCtx.clearRect(0, 0, paper.width, paper.height);

  const thickness = Math.max(1, Math.round(CONFIG.LINE_THICKNESS_PX * dpr));
  const lineWidth = layout.rightDev - layout.leftDev;

  paperCtx.fillStyle = CONFIG.LINE_COLOR;

  for (const top of layout.staffTops) {

    // Tačno 5 linija u svakom sistemu
    for (let i = 0; i < 5; i++) {
      const y = top + i * layout.spaceDev - Math.floor(thickness / 2);
      paperCtx.fillRect(layout.leftDev, y, lineWidth, thickness);
    }

    if (clefOn) {
      drawClef(top);
    }
  }
}

function drawClef(staffTop) {
  const space     = layout.spaceDev;
  const inkHeight = CONFIG.CLEF_HEIGHT_SPACES * space;

  // Spirala ključa obavija G liniju (druga linija odozdo).
  // Oko 62.5% visine ključa je iznad G linije.
  const gLineY = staffTop + 3 * space;
  const inkTop = gLineY - inkHeight * 0.625;

  // Izmjeri stvarnu veličinu znaka pa ga skaliraj tačno na traženu visinu
  const REF = 200;

  paperCtx.font         = `${REF}px ${CONFIG.CLEF_FONT}`;
  paperCtx.textAlign    = "left";
  paperCtx.textBaseline = "alphabetic";

  const m       = paperCtx.measureText(CONFIG.CLEF_GLYPH);
  const ascent  = m.actualBoundingBoxAscent  || REF * 0.8;
  const descent = m.actualBoundingBoxDescent || 0;
  const leftEx  = m.actualBoundingBoxLeft    || 0;
  const scale   = inkHeight / (ascent + descent);

  paperCtx.font      = `${REF * scale}px ${CONFIG.CLEF_FONT}`;
  paperCtx.fillStyle = CONFIG.CLEF_COLOR;

  paperCtx.fillText(
    CONFIG.CLEF_GLYPH,
    layout.leftDev + 0.5 * space + leftEx * scale,
    inkTop + ascent * scale
  );
}


/* CRTANJE OLOVKOM I GUMICOM */

function widthOf(stroke, point) {
  return point.w || stroke.width;
}

function applyStrokeStyle(stroke, width) {
  inkCtx.globalCompositeOperation = stroke.eraser ? "destination-out" : "source-over";
  inkCtx.strokeStyle = stroke.color;
  inkCtx.fillStyle   = stroke.color;
  inkCtx.lineWidth   = width;
}

function drawDot(stroke, point) {
  const width = widthOf(stroke, point);

  applyStrokeStyle(stroke, width);

  inkCtx.beginPath();
  inkCtx.arc(point.x, point.y, width / 2, 0, Math.PI * 2);
  inkCtx.fill();
}

// Crta dio poteza koji završava na točki s rednim brojem "index"
// (glatke krivulje kroz sredine točaka)
function drawSegment(stroke, index) {
  const pts = stroke.points;

  if (index === 0) {
    drawDot(stroke, pts[0]);
    return;
  }

  const a     = pts[index - 1];
  const b     = pts[index];
  const start = (index === 1) ? a : midpoint(pts[index - 2], a);
  const end   = midpoint(a, b);

  applyStrokeStyle(stroke, widthOf(stroke, b));

  inkCtx.beginPath();
  inkCtx.moveTo(start.x, start.y);
  inkCtx.quadraticCurveTo(a.x, a.y, end.x, end.y);
  inkCtx.stroke();
}

function drawLastHalf(stroke) {
  const pts = stroke.points;
  const n   = pts.length;

  if (n < 2) return;

  const last  = pts[n - 1];
  const start = midpoint(pts[n - 2], last);

  applyStrokeStyle(stroke, widthOf(stroke, last));

  inkCtx.beginPath();
  inkCtx.moveTo(start.x, start.y);
  inkCtx.lineTo(last.x, last.y);
  inkCtx.stroke();
}

function drawFullStroke(stroke) {
  for (let i = 0; i < stroke.points.length; i++) {
    drawSegment(stroke, i);
  }

  drawLastHalf(stroke);
}

function redrawStrokes() {
  for (const stroke of strokes) {
    drawFullStroke(stroke);
  }
}

function pointFrom(e) {
  return { x: e.clientX, y: e.clientY };
}


/* Gumica: veličina zavisi od brzine */

function nextEraserWidth(stroke, point, time) {
  const prev    = stroke.points[stroke.points.length - 1];
  const dt      = Math.max(1, time - stroke.lastTime);
  const instant = Math.hypot(point.x - prev.x, point.y - prev.y) / dt;

  stroke.lastTime = time;
  stroke.speed   += (instant - stroke.speed) * CONFIG.ERASER_SMOOTHING;

  const t = clamp(stroke.speed / CONFIG.ERASER_FULL_SPEED, 0, 1);

  return stroke.width * (1 + t * (CONFIG.ERASER_MAX_GROWTH - 1));
}

// Sivi obris koji prati prst i pokazuje trenutnu veličinu gumice
function showEraserCursor(x, y, diameter) {
  eraserCursor.style.width     = diameter + "px";
  eraserCursor.style.height    = diameter + "px";
  eraserCursor.style.transform = `translate(${x - diameter / 2}px, ${y - diameter / 2}px)`;

  eraserCursor.classList.remove("hidden");
}

function hideEraserCursor() {
  eraserCursor.classList.add("hidden");
}


/* Događaji dodira / olovke / miša na platnu */

function onInkDown(e) {
  if (activePointerId !== null) return;

  const tool  = TOOLS[currentTool];
  const point = pointFrom(e);

  if (tool.eraser) {
    point.w = tool.width;
  }

  activePointerId = e.pointerId;

  if (HAS_POINTER_EVENTS) {
    ink.setPointerCapture(e.pointerId);
  }

  currentStroke = {
    color:    tool.color,
    width:    tool.width,
    eraser:   tool.eraser,
    speed:    0,
    lastTime: e.timeStamp,
    points:   [point],
  };

  strokes.push(currentStroke);
  drawSegment(currentStroke, 0);

  if (tool.eraser) {
    showEraserCursor(point.x, point.y, point.w);
  }
}

function onInkMove(e) {

  // Miš bez pritiska: samo prikaži obris gumice
  if (e.pointerId !== activePointerId || !currentStroke) {
    if (e.pointerType === "mouse" && activePointerId === null && TOOLS[currentTool].eraser) {
      showEraserCursor(e.clientX, e.clientY, TOOLS[currentTool].width);
    }
    return;
  }

  const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
  const list   = events.length ? events : [e];

  for (const ev of list) {
    const point = pointFrom(ev);

    if (currentStroke.eraser) {
      point.w = nextEraserWidth(currentStroke, point, ev.timeStamp);
    }

    currentStroke.points.push(point);
    drawSegment(currentStroke, currentStroke.points.length - 1);
  }

  if (currentStroke.eraser) {
    const last = currentStroke.points[currentStroke.points.length - 1];
    showEraserCursor(last.x, last.y, last.w);
  }
}

function finishStroke(e) {
  if (e.pointerId !== activePointerId) return;

  if (currentStroke) {
    drawLastHalf(currentStroke);
  }

  currentStroke   = null;
  activePointerId = null;

  hideEraserCursor();
}

function onInkLeave() {
  if (activePointerId === null) {
    hideEraserCursor();
  }
}

bindInput(ink, {
  down:   onInkDown,
  move:   onInkMove,
  up:     finishStroke,
  cancel: finishStroke,
  leave:  onInkLeave,
});


/* ODABIR ALATA */

function selectTool(id) {
  currentTool = id;
  hideEraserCursor();

  document.querySelectorAll("[data-tool]").forEach((el) => {
    el.classList.toggle("active", el.dataset.tool === id);
  });
}

// Kratak dodir = odabir alata, dugi pritisak = prozor za debljinu
function bindToolButton(el) {
  let timer  = null;
  let startX = 0;
  let startY = 0;

  const cancel = () => {
    clearTimeout(timer);
    timer = null;
  };

  bindInput(el, {

    down: (e) => {
      startX = e.clientX;
      startY = e.clientY;

      timer = setTimeout(() => {
        timer = null;
        openSizePopup(el.dataset.tool, el);
      }, CONFIG.LONG_PRESS_MS);
    },

    move: (e) => {
      if (timer && Math.hypot(e.clientX - startX, e.clientY - startY) > 12) {
        cancel();
      }
    },

    up: () => {
      if (timer) {
        cancel();
        selectTool(el.dataset.tool);
      }
    },

    cancel: cancel,
    leave:  cancel,
  });
}


/* DEBLJINA */

function updateSizePreview() {
  const tool = TOOLS[sizeTool];

  sizeValue.textContent = tool.width + " px";

  sizeDot.style.width      = tool.width + "px";
  sizeDot.style.height     = tool.width + "px";
  sizeDot.style.background = tool.eraser ? "#ffffff" : tool.color;
  sizeDot.style.boxShadow  = tool.eraser ? "inset 0 0 0 2px #888888" : "none";
}

function openSizePopup(id, anchor) {
  const tool = TOOLS[id];

  sizeTool = id;
  selectTool(id);

  sizeTitle.textContent = "Debljina: " + tool.label;
  sizeRange.min   = tool.min;
  sizeRange.max   = tool.max;
  sizeRange.value = tool.width;
  updateSizePreview();

  popupBackdrop.classList.remove("hidden");
  popup.classList.remove("hidden");

  // Prozor se postavlja iznad dugmeta koje je držano
  const rect = anchor.getBoundingClientRect();
  const left = clamp(rect.left + rect.width / 2 - popup.offsetWidth / 2,
                     12, window.innerWidth - popup.offsetWidth - 12);

  popup.style.left   = left + "px";
  popup.style.bottom = (window.innerHeight - toolbar.getBoundingClientRect().top + 12) + "px";
}

function closeSizePopup() {
  popup.classList.add("hidden");
  popupBackdrop.classList.add("hidden");
}

sizeRange.addEventListener("input", () => {
  TOOLS[sizeTool].width = Number(sizeRange.value);
  updateSizePreview();
  saveWidths();
});

bindInput(popupBackdrop, { down: closeSizePopup });


/* PAMĆENJE DEBLJINE */

const STORAGE_KEY = "muzickaTabla.debljine";

function saveWidths() {
  try {
    const widths = {};

    for (const [id, tool] of Object.entries(TOOLS)) {
      widths[id] = tool.width;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(widths));
  } catch (err) {
    // localStorage nije dostupan ništa se ne pamti, ali program radi dalje
  }
}

function loadWidths() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    for (const [id, tool] of Object.entries(TOOLS)) {
      const width = Number(saved[id]);

      if (width >= tool.min && width <= tool.max) {
        tool.width = width;
      }
    }
  } catch (err) {
    // Neispravni ili nedostupni podaci ostaju zadane vrijednosti
  }
}


/* VIOLINSKI KLJUČ (uključi / isključi) */

function updateClefButton() {
  btnClef.classList.toggle("on", clefOn);
  clefState.textContent = clefOn ? "ON" : "OFF";
}

btnClef.addEventListener("click", () => {
  clefOn = !clefOn;
  updateClefButton();
  drawPaper();
});


/* OBRIŠI SVE (uz potvrdu) */

$("btn-clear").addEventListener("click", () => {
  confirmBox.classList.remove("hidden");
});

$("confirm-no").addEventListener("click", () => {
  confirmBox.classList.add("hidden");
});

$("confirm-yes").addEventListener("click", () => {
  strokes.length = 0;
  inkCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  confirmBox.classList.add("hidden");
});


/* VELICINA EKRANA */

function resize() {
  const width  = window.innerWidth;
  const height = window.innerHeight;

  dpr = Math.min(window.devicePixelRatio || 1, 3);

  // Promjena veličine platna briše sadržaj, zato se potezi crtaju ponovo
  for (const canvas of [paper, ink]) {
    canvas.width  = Math.round(width  * dpr);
    canvas.height = Math.round(height * dpr);
  }

  inkCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  inkCtx.lineCap  = "round";
  inkCtx.lineJoin = "round";

  computeLayout(width);
  drawPaper();
  redrawStrokes();
}

let resizeQueued = false;

function scheduleResize() {
  if (resizeQueued) return;

  resizeQueued = true;

  requestAnimationFrame(() => {
    resizeQueued = false;
    resize();
  });
}

window.addEventListener("resize", scheduleResize);

if ("ResizeObserver" in window) {
  new ResizeObserver(scheduleResize).observe(toolbar);
}

// Bez menija na dugi pritisak
document.addEventListener("contextmenu", (e) => e.preventDefault());


/* POKRETANJE */

loadWidths();

for (const [id, tool] of Object.entries(TOOLS)) {
  const swatch = document.querySelector(`.swatch[data-tool="${id}"]`);

  if (swatch) {
    swatch.style.setProperty("--c", tool.color);
  }
}

document.querySelectorAll("[data-tool]").forEach(bindToolButton);

selectTool("black");
updateClefButton();
resize();