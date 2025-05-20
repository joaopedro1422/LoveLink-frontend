export class Carta {
    id: string;
    mensagem: string;
    titulo1: string;
    titulo2: string;
    musica: string;
    autor: string;
    data: Date;
    fotos: string[];
    album: {url: string, descricao: string, data: Date}[];
    playlist: string[];
    constructor(
        id: string,
        titulo1: string,
        titulo2: string,
        mensagem: string,
        imagemUrl: string,
        fotos: string[],
        musicaYoutubeUrl: string,
        dataCriacao: Date,
        autor: string,
        playlist: string[],
        albumFotos: { url: string, descricao: string, data: Date }[]
      ) {
        this.id = id;
        this.titulo1 = titulo1;
        this.titulo2 = titulo2;
        this.mensagem = mensagem;
        this.fotos = fotos;
        this.musica = musicaYoutubeUrl;
        this.data = dataCriacao;
        this.album = albumFotos;
        this.playlist = playlist
        this.autor = autor;
      }
    

}
