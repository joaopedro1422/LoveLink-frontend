import { Data } from "@angular/router";

export interface Pagina {
  id: string; // UUID como string
  nomeCasal: string;
  musica: string;
  planoSelecionado: string;
  email: string;
  mensagem: string;
  autor: string;
  data: Date;
  titulo: string;
  videoId: string;
  imagens: string[];
  playlist: string[];
  album: Album[];
}
export interface Album {
  data: Date
  nome: string;
  url: string;
}