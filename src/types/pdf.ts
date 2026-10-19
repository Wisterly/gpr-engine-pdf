export type ToolMode = 
  | 'select' 
  | 'text' 
  | 'draw' 
  | 'highlight' 
  | 'stamp' 
  | 'signature';

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
  tool: 'draw' | 'highlight';
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
}

export interface StampAnnotation {
  id: string;
  x: number;
  y: number;
  type: 'APROVADO' | 'CONFERIDO' | 'URGENTE' | 'MEDIDO GPR' | 'EM ANÁLISE';
  color: string;
}

export interface PageAnnotations {
  pageNumber: number;
  drawings: DrawingPath[];
  texts: TextAnnotation[];
  stamps: StampAnnotation[];
}

export interface PDFPageInfo {
  pageIndex: number; // 0-based
  pageNumber: number; // 1-based
  width: number;
  height: number;
  rotation: number; // 0, 90, 180, 270
  isDeleted?: boolean;
}

export interface LoadedPDFDocument {
  name: string;
  size: number;
  totalPages: number;
  fileBuffer: ArrayBuffer;
}
