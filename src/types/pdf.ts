export type AcrobatMode = 
  | 'view'         // Visualizar e Navegar
  | 'comment'      // Comentar e Anotar (Highlight, Sticky Note, Caneta, Formas)
  | 'edit'         // Editar PDF (Adicionar texto, imagem)
  | 'organize'     // Organizar Páginas (Miniaturas, Rotação, Exclusão, Reordenação)
  | 'fill_sign';   // Preencher e Assinar (Assinatura manuscrita, Visto, X, Ponto)

export type ToolMode = 
  | 'select'       // Selecionar / Mover
  | 'pan'          // Ferramenta Mãozinha (Arrastar documento)
  | 'text'         // Texto Livre / Caixa de Texto
  | 'sticky_note'  // Nota Adesiva / Comentário clássico do Acrobat
  | 'draw'         // Caneta / Lápis livre
  | 'highlight'    // Marca-texto
  | 'underline'    // Sublinhado
  | 'strikeout'    // Riscado / Tachado
  | 'rectangle'    // Forma: Retângulo
  | 'circle'       // Forma: Círculo
  | 'arrow'        // Forma: Seta
  | 'line'         // Forma: Linha reta
  | 'stamp'        // Carimbos oficiais
  | 'signature'    // Assinatura manuscrita
  | 'check'        // Preenchimento: Checkmark (✓)
  | 'cross'        // Preenchimento: X (✗)
  | 'dot';         // Preenchimento: Ponto (•)

export interface Point {
  x: number;
  y: number;
}

export interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  size: number;
  opacity: number;
  tool: 'draw' | 'highlight' | 'underline' | 'strikeout';
}

export interface TextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  color: string;
  fontFamily?: string;
  isEditing?: boolean;
  hasBorder?: boolean;
  backgroundColor?: string;
}

export interface StickyNote {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  createdAt: string;
  color: string;
  isOpen?: boolean;
}

export interface ShapeAnnotation {
  id: string;
  type: 'rectangle' | 'circle' | 'arrow' | 'line';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  strokeWidth: number;
  fillColor?: string;
  opacity: number;
}

export interface StampAnnotation {
  id: string;
  x: number;
  y: number;
  type: 'APROVADO' | 'CONFERIDO' | 'URGENTE' | 'MEDIDO GPR' | 'EM ANÁLISE';
  color: string;
  timestamp?: string;
}

export interface SignatureAnnotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl: string;
}

export interface FormMarkAnnotation {
  id: string;
  x: number;
  y: number;
  type: 'check' | 'cross' | 'dot';
  color: string;
  size: number;
}

export interface PageAnnotations {
  pageNumber: number;
  drawings: DrawingPath[];
  texts: TextAnnotation[];
  stickyNotes: StickyNote[];
  shapes: ShapeAnnotation[];
  stamps: StampAnnotation[];
  signatures: SignatureAnnotation[];
  formMarks: FormMarkAnnotation[];
}

export interface PDFPageInfo {
  pageIndex: number;
  pageNumber: number;
  width: number;
  height: number;
  rotation: number;
  isDeleted?: boolean;
}

export interface LoadedPDFDocument {
  id: string;
  name: string;
  size: number;
  fileBuffer: ArrayBuffer;
  pdfDoc: any;
  pages: PDFPageInfo[];
  pageAnnotations: Record<number, PageAnnotations>;
  currentPage: number;
  zoom: number;
}

export type MainTabId = 'home' | 'tools' | string; // 'home' | 'tools' | docId

export interface OpenTab {
  id: string;
  title: string;
  type: 'home' | 'tools' | 'document';
  docId?: string;
}

export interface RecentFile {
  id: string;
  name: string;
  openedAt: string;
  size: string;
  sizeBytes: number;
  isFavorite?: boolean;
  fileBuffer?: ArrayBuffer;
}

export interface ToolItem {
  id: string;
  name: string;
  actionText: 'Abrir ▾' | 'Adicionar ▾';
  icon: string;
  isNew?: boolean;
  category: string;
  description?: string;
}

export interface ToolCategory {
  title: string;
  items: ToolItem[];
}
