import { jsPDF } from 'jspdf';
import autoTable, { type UserOptions } from 'jspdf-autotable';
import type { Temario, Modulo, Fichero, BloqueCodigo } from '../data/modulos';

const MARGEN = 40;
const ANCHO_PAGINA = 595.28; // A4 en puntos
const ALTO_PAGINA = 841.89; // A4 en puntos
const ANCHO_UTIL = ANCHO_PAGINA - 2 * MARGEN;
const COLOR_TITULO = [26, 26, 46]; // #1a1a2e
const COLOR_SUBTITULO = [107, 114, 128]; // #6b7280
const COLOR_MODULO_TITULO = [26, 26, 46];
const COLOR_MODULO_SUBTITULO = [75, 85, 99]; // #4b5563
const COLOR_PUNTOS = [55, 65, 81]; // #374151
const COLOR_COMANDO_FONDO = [243, 244, 246]; // #f3f4f6
const COLOR_TABLA_HEADER = [107, 114, 128];
const COLOR_TABLA_ALTERNADA = [249, 250, 251];
const COLOR_CODIGO_FONDO = [246, 245, 240]; // #f6f5f0
const COLOR_CODIGO_TEXTO = [35, 33, 25]; // #232119
const COLOR_CODIGO_RUTA = [75, 85, 99];

async function cargarFuenteComoBase64(ruta: string): Promise<string> {
  const response = await fetch(ruta);
  const arrayBuffer = await response.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function generarPDF(
  temario: Temario,
  idioma: 'es' | 'en' = 'es'
): Promise<jsPDF> {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  (doc as any).setAutoPageBreak?.(true, MARGEN);

  const base = import.meta.env.BASE_URL;
  const fuenteRegularB64 = await cargarFuenteComoBase64(`${base}fonts/NotoSans-Regular.ttf`);
  const fuenteBoldB64 = await cargarFuenteComoBase64(`${base}fonts/NotoSans-Bold.ttf`);

  doc.addFileToVFS('NotoSans-Regular.ttf', fuenteRegularB64);
  doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
  doc.addFileToVFS('NotoSans-Bold.ttf', fuenteBoldB64);
  doc.addFont('NotoSans-Bold.ttf', 'NotoSans', 'bold');

  let y = MARGEN;

  doc.setFont('NotoSans', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(COLOR_TITULO[0], COLOR_TITULO[1], COLOR_TITULO[2]);
  doc.text(temario.titulo, MARGEN, y);
  y += 32;

  doc.setFont('NotoSans', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(COLOR_SUBTITULO[0], COLOR_SUBTITULO[1], COLOR_SUBTITULO[2]);
  doc.text(temario.subtitulo, MARGEN, y);
  y += 20 + 20; // 20pt margin-bottom extra

  for (const modulo of temario.modulos) {
    y = await dibujarModulo(doc, modulo, y, idioma);
  }

  return doc;
}

async function dibujarModulo(
  doc: jsPDF,
  modulo: Modulo,
  yInicial: number,
  _idioma: 'es' | 'en'
): Promise<number> {
  let y = yInicial;

  if (y > ALTO_PAGINA - MARGEN - 80) {
    doc.addPage();
    y = MARGEN;
  }

  y += 24; // margin-top 24pt

  doc.setFont('NotoSans', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(COLOR_MODULO_TITULO[0], COLOR_MODULO_TITULO[1], COLOR_MODULO_TITULO[2]);
  doc.text(modulo.titulo, MARGEN, y);
  y += 22;

  doc.setFont('NotoSans', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(COLOR_MODULO_SUBTITULO[0], COLOR_MODULO_SUBTITULO[1], COLOR_MODULO_SUBTITULO[2]);
  const subtituloLines = doc.splitTextToSize(modulo.subtitulo, ANCHO_UTIL);
  doc.text(subtituloLines, MARGEN, y);
  y += subtituloLines.length * 14 + 8; // interlineado + margin-bottom 8pt

  if (modulo.puntos.length > 0) {
    y = dibujarPuntos(doc, modulo.puntos, y);
  }

  if (modulo.comandos.length > 0) {
    y = dibujarComandos(doc, modulo.comandos, y);
  }

  if (modulo.ficheros.length > 0) {
    y = await dibujarTablaFicheros(doc, modulo.ficheros, y);
  }

  if (modulo.codigo.length > 0) {
    y = dibujarBloquesCodigo(doc, modulo.codigo, y);
  }

  return y;
}

function dibujarPuntos(doc: jsPDF, puntos: string[], yInicial: number): number {
  let y = yInicial;

  doc.setFont('NotoSans', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(COLOR_PUNTOS[0], COLOR_PUNTOS[1], COLOR_PUNTOS[2]);

  const interlineado = 15; // 10pt * 1.5 = 15pt

  for (const punto of puntos) {
    if (y > ALTO_PAGINA - MARGEN - 30) {
      doc.addPage();
      y = MARGEN;
    }

    const bulletText = `• ${punto}`;
    const lines = doc.splitTextToSize(bulletText, ANCHO_UTIL - 10);

    for (const line of lines) {
      if (y > ALTO_PAGINA - MARGEN - 15) {
        doc.addPage();
        y = MARGEN;
      }
      doc.text(line, MARGEN + 10, y);
      y += interlineado;
    }
  }

  return y;
}

function dibujarComandos(doc: jsPDF, comandos: string[], yInicial: number): number {
  let y = yInicial + 8;

  doc.setFont('NotoSans', 'normal');
  doc.setFontSize(9);

  for (const comando of comandos) {
    if (y > ALTO_PAGINA - MARGEN - 30) {
      doc.addPage();
      y = MARGEN;
    }

    const textWidth = doc.getTextWidth(comando);
    const paddingX = 6;
    const paddingY = 4;
    const boxWidth = textWidth + 2 * paddingX;
    const boxHeight = 13 + 2 * paddingY;
    const radius = 3;

    if (MARGEN + boxWidth > ANCHO_PAGINA - MARGEN) {
      doc.addPage();
      y = MARGEN;
    }

    doc.setFillColor(COLOR_COMANDO_FONDO[0], COLOR_COMANDO_FONDO[1], COLOR_COMANDO_FONDO[2]);
    doc.roundedRect(MARGEN, y - 9, boxWidth, boxHeight, radius, radius, 'F');

doc.setTextColor(COLOR_PUNTOS[0], COLOR_PUNTOS[1], COLOR_PUNTOS[2]);
    doc.text(comando, MARGEN + paddingX, y + 3);

    y += boxHeight + 6;
  }

  return y;
}

async function dibujarTablaFicheros(
  doc: jsPDF,
  ficheros: Fichero[],
  yInicial: number
): Promise<number> {
  let y = yInicial + 8;

  if (y > ALTO_PAGINA - MARGEN - 60) {
    doc.addPage();
    y = MARGEN;
  }

  const head = [['Ruta', 'Descripción']];
  const body = ficheros.map((f) => [f.ruta, f.descripcion]);

  // autoTable(doc, options): la v5 de jspdf-autotable recibe el documento como primer
  // argumento. `doc` se pasa directo; si hubiera conflicto de tipos entre las versiones
  // de jsPDF, bastaría con `doc as any`.
  autoTable(doc, {
    startY: y,
    head,
    body,
    theme: 'striped',
    margin: { top: 0, right: MARGEN, bottom: MARGEN, left: MARGEN },
    tableWidth: ANCHO_UTIL,
    styles: {
      fontSize: 9,
      font: 'NotoSans',
      cellPadding: 4,
      lineColor: [200, 200, 200],
      lineWidth: 0.3,
      textColor: [55, 65, 81],
    },
    headStyles: {
      fillColor: [COLOR_TABLA_HEADER[0], COLOR_TABLA_HEADER[1], COLOR_TABLA_HEADER[2]],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [COLOR_TABLA_ALTERNADA[0], COLOR_TABLA_ALTERNADA[1], COLOR_TABLA_ALTERNADA[2]],
    },
    columnStyles: {
      0: { cellWidth: 180, fontStyle: 'normal' },
      1: { cellWidth: ANCHO_UTIL - 180 },
    },
    didDrawPage: (data) => {
      y = (data as any).cursor?.y ?? y;
    },
  } satisfies UserOptions);

  return (doc as any).lastAutoTable?.finalY ?? y + 10;
}
/*
  El código va en Courier, que es fuente estándar de jsPDF: no hay que incrustar
  nada y cubre los acentos de los prompts en español.

  Las líneas largas se ajustan con splitTextToSize. Los prompts de opencode.json
  viven en una sola línea, así que sin ajuste se saldrían de la página.
*/
function dibujarBloquesCodigo(
  doc: jsPDF,
  bloques: BloqueCodigo[],
  yInicial: number
): number {
  const TAM_CODIGO = 7.5;
  const INTERLINEADO = 10;
  const PADDING = 8;

  let y = yInicial + 12;

  for (const bloque of bloques) {
    if (y > ALTO_PAGINA - MARGEN - 60) {
      doc.addPage();
      y = MARGEN;
    }

    doc.setFont('NotoSans', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(COLOR_CODIGO_RUTA[0], COLOR_CODIGO_RUTA[1], COLOR_CODIGO_RUTA[2]);
    doc.text(`${bloque.ruta} — ${bloque.descripcion}`, MARGEN, y);
    y += 14;

    doc.setFont('courier', 'normal');
    doc.setFontSize(TAM_CODIGO);

    // Se aplana antes de pintar para saber cuántas líneas caben en cada página.
    const lineas: string[] = [];
    for (const linea of bloque.codigo.split('\n')) {
      const ajustadas = doc.splitTextToSize(linea, ANCHO_UTIL - 2 * PADDING);
      lineas.push(...(ajustadas.length > 0 ? ajustadas : ['']));
    }

    let indice = 0;
    while (indice < lineas.length) {
      if (y > ALTO_PAGINA - MARGEN - INTERLINEADO * 2) {
        doc.addPage();
        y = MARGEN;
      }

      const disponibles = Math.max(
        1,
        Math.floor((ALTO_PAGINA - MARGEN - y - PADDING) / INTERLINEADO)
      );
      const tramo = lineas.slice(indice, indice + disponibles);
      const alto = tramo.length * INTERLINEADO + 2 * PADDING;

      doc.setFillColor(COLOR_CODIGO_FONDO[0], COLOR_CODIGO_FONDO[1], COLOR_CODIGO_FONDO[2]);
      doc.rect(MARGEN, y, ANCHO_UTIL, alto, 'F');

      doc.setFont('courier', 'normal');
      doc.setFontSize(TAM_CODIGO);
      doc.setTextColor(COLOR_CODIGO_TEXTO[0], COLOR_CODIGO_TEXTO[1], COLOR_CODIGO_TEXTO[2]);

      let yLinea = y + PADDING + TAM_CODIGO;
      for (const linea of tramo) {
        doc.text(linea, MARGEN + PADDING, yLinea);
        yLinea += INTERLINEADO;
      }

      y += alto;
      indice += tramo.length;
    }

    y += 12;
  }

  return y;
}
