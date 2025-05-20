import { Component, Input, OnInit, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { ControlContainer, FormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgForOf, NgIf } from '@angular/common';
import { YoutubeService } from '../youtube.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog'; 
import { CartaPreviewComponent } from '../carta-preview/carta-preview.component';
import { ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { CadastroService } from '../services/cadastro.service';
import { ModalComponent } from '../modal/modal.component';
import { getStorage, ref, listAll,deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IndexedDbServiceService } from '../services/indexed-db-service.service';
import { SpotifyService } from '../services/spotify.service';
import { Pagina } from '../models/pagina';
import { PaginaServiceService } from '../services/pagina-service.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
{FooterComponent}
declare var MercadoPago: any;
@Component({
  selector: 'app-cadastrar-pagina',
  standalone: true,
  imports: [ FormsModule,NgFor, NgForOf, CommonModule, MatDialogModule,CartaPreviewComponent, ModalComponent, HeaderComponent, FooterComponent],
  templateUrl: './cadastrar-pagina.component.html',
  styleUrl: './cadastrar-pagina.component.css'
})



export class CadastrarPaginaComponent implements OnInit {
  currentStep = 0;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];

  steps = [
    { label: 'Nome do Casal', icon: 'coracaostep.png' },
    { label: 'Fotos para seção inicial', icon: 'camerastep.png' },
    { label: 'Mensagem especial', icon: 'mensagemstep.png' },
    { label: 'Música ou vídeo', icon: 'musicastep.png' },
    { label: 'Álbum de fotos dinâmico', icon: 'albumstep.png' },
    { label: 'Playlist especial', icon: 'spotifystep.png' }
  ];

  codigo: string[] = ['', '', '', '', '', ''];
  codigoArray = Array(6).fill(0);
  emailEnviado: boolean = false;
  emailConfirmado: boolean = false;
  novaPagina: boolean = false;
  codigoGerado: string = '';
  reenviarTimer: number = 0;
  interval: any;
  searchQuery = '';
  youtubeResults: any[] = [];
  activeVideos: Map<string, SafeResourceUrl> = new Map();
  selectedVideoId: string | null = null; 
  planoSelecionado: string = '';
  searchTerm: string = '';
  searchResults: any[] = [];
  searchSpotify ='';
  accessToken: string | null = null;
  spotifyCode: string | null = null;
  valorAtualPlanoAnual: number | null = null;
  valorAntigoPlanoAnual: number | null = null;
  valorAtualPlanoVitalicio: number | null = null;
 planos: any[] = [];
  valorAntigoPlanoVitalicio: number | null = null;
  clientId = "1ea6c6459eb94120ace724ce71ca234e";
  musicsPreview: any[] = []
  firebasePaths: string[] = [];
  carregandoEnvio = false;
  emailValido: boolean =  true;
  novaFoto = {
    file: null as File | null,
    url: '',
    descricao: '',
    data: ''
  };
  
    beneficios = [
    'Mensagem Especial',
    'Contador em tempo real',
    'Até 3 fotos na Seção Inicial',
    'Vídeo/Música',
    'Álbum dinâmico <b>ilimitado</b>',
    'Descrição e data no álbum',
    'Playlist Spotify',
    'QR Code',
    'Títulos Personalizáveis',
    'Suporte 24 horas 7/7'
  ];
  albumRascunho: { url: string, descricao: string, data: Date }[] = [];
  form = {
    nomeCasal: '',
    musica: '',
    email: '',
    mensagem: '',
    autor: '',
    planoSelecionadoForm: '',
    data: null,
    titulo: '',
    videoId: '',
    imagens: [] as string[],
    album: [] as { url: string; descricao: string; data: Date }[],
    playlist: [] as string[],
  };
  addToPlaylist(track: any) {
    if (this.musicsPreview.length >= 5) {
      alert("Você só pode adicionar até 5 músicas na playlist.");
      return;
    }
    const jaAdicionada = this.musicsPreview.find(t => t.id === track.id);
    if (jaAdicionada) {
      alert("Essa música já está na playlist.");
      return;
    }
    this.form = {
      ...this.form,
      playlist: [...this.form.playlist, track.id]
    };
    console.log(this.form)
    this.musicsPreview.push(track);
  }
  removeFromPlaylist(index: number) {
  this.musicsPreview.splice(index, 1);
}
   acaoPrimaria() {
    console.log('Ação primária disparada');
  }
  @ViewChild('modal') modal!: ModalComponent;
  ngAfterViewInit(): void {
     const sessionId = localStorage.getItem('sessionId');
    const dadosSalvos = localStorage.getItem('dadosCadastro_' + sessionId);
    if (dadosSalvos) {
      this.modal.toggle(); // Agora this.modal está definido
    }
  }
 ngOnInit(): void {
  const sessionId = localStorage.getItem('sessionId');
  const dadosSalvos = localStorage.getItem('dadosCadastro_' + sessionId);
  this.loadValoresPlanos();
  console.log(dadosSalvos)
   if (!Array.isArray(this.form.playlist)) {
    this.form.playlist = [];
  }
    this.route.queryParams.subscribe(params => {
      this.spotifyCode = params['code'] || null;

      if (this.spotifyCode) {
        this.currentStep = 5;
        this.spotifyService.trocaCodigoPorToken(this.spotifyCode);
      
      }
    });
  if(dadosSalvos){   
    console.log(dadosSalvos + "entrou aqui em")
   if(!this.novaPagina) {
     console.log(this.novaPagina + "entrou aqui no novapagina em")
      const formStorage = JSON.parse(dadosSalvos);
      this.form.nomeCasal = formStorage.nomeCasal;
      this.form.email = formStorage.email;
      this.form.mensagem = formStorage.mensagem;
      this.form.musica = formStorage.musica;
      this.form.autor = formStorage.autor;
      this.form.data = formStorage.data;
      this.form.titulo = formStorage.titulo;
      this.form.videoId = formStorage.videoId;
      this.form.playlist = formStorage.playlist;
      this.form.imagens = formStorage.imagens;
      this.form.album = formStorage.album;
    this.form = {
      ...this.form, // mantém os valores padrão em caso de erro
      ...formStorage,
      playlist: Array.isArray(formStorage.playlist) ? formStorage.playlist : [],
      imagens: Array.isArray(formStorage.imagens) ? formStorage.imagens : [],
      album: Array.isArray(formStorage.album) ? formStorage.album : [],
    };
    } 
  }
  else{
    let sessionId = sessionStorage.getItem('sessionId') || localStorage.getItem('sessionId');
    let dadosSalvos = sessionStorage.getItem('dadosCadastro_' + sessionId) || localStorage.getItem('dadosCadastro_' + sessionId);
    if(dadosSalvos)
     if(!this.novaPagina) {
     console.log(this.novaPagina + "entrou aqui no novapagina em")
      const formStorage = JSON.parse(dadosSalvos);
      this.form.nomeCasal = formStorage.nomeCasal;
      this.form.email = formStorage.email;
      this.form.mensagem = formStorage.mensagem;
      this.form.musica = formStorage.musica;
      this.form.autor = formStorage.autor;
      this.form.data = formStorage.data;
      this.form.titulo = formStorage.titulo;
      this.form.videoId = formStorage.videoId;
      this.form.playlist = formStorage.playlist;
      this.form.imagens = formStorage.imagens;
      this.form.album = formStorage.album;
    this.form = {
      ...this.form, // mantém os valores padrão em caso de erro
      ...formStorage,
      playlist: Array.isArray(formStorage.playlist) ? formStorage.playlist : [],
      imagens: Array.isArray(formStorage.imagens) ? formStorage.imagens : [],
      album: Array.isArray(formStorage.album) ? formStorage.album : [],
    };
    } 




  }

  this.preencherAlbumPadrao();
     const mp = new MercadoPago('SUA_PUBLIC_KEY', {
      locale: 'pt-BR'
    });
 }

 loadValoresPlanos(){
 
  this.http.get<any[]>('http://192.168.159.1:8080/planos').subscribe((res)=> {
    this.planos = res
    for(let i=0; i < this.planos.length; i++){
      if(this.planos[i].nome === "Anual"){
        this.valorAntigoPlanoAnual = this.planos[i].precoAntigo
        this.valorAtualPlanoAnual = this.planos[i].preco
      }
      else if(this.planos[i].nome === "Acesso-vitalicio"){
        this.valorAntigoPlanoVitalicio = this.planos[i].precoAntigo
        this.valorAtualPlanoVitalicio = this.planos[i].preco
      }
    }

  })
 }

 setContinuarPagina(){
  this.novaPagina = false;
  this.modal.toggle();
 }
 setCriarNova(){
  this.novaPagina = true;
     this.form.nomeCasal = ''
      this.form.email = ''
      this.form.mensagem = ''
      this.form.musica = ''
      this.form.autor = ''
      this.form.data = null
      this.form.titulo = ''
      this.form.planoSelecionadoForm = ''
      this.form.videoId = ''   
      this.form.playlist = [] as string[];  
      this.form.imagens = [] as string[];
      this.form.album = [] as { url: string; descricao: string; data: Date }[];
      this.preencherAlbumPadrao();
 }
   realizarPagamento() {
    const preferenceId = 'ID_DA_PREFERENCE_CRIADA_NO_BACKEND'; // Exemplo: "123456789-abcdefg"

    const mp = new MercadoPago('SUA_PUBLIC_KEY');
    mp.checkout({
      preference: {
        id: preferenceId
      },
      autoOpen: true
    });
  }
  onFileSelectedAlbum(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.novaFoto.file = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.novaFoto.url = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  goToCheckout(){
     const formStorage = {
    nomeCasal: this.form.nomeCasal,
    email: this.form.email,
    mensagem: this.form.mensagem,
    musica: this.form.musica,
    autor: this.form.autor,
    data: this.form.data,
    titulo: this.form.titulo,
    videoId: this.form.videoId,
    playlist: this.form.playlist,
    imagens: this.form.imagens,
    planoSelecionado: this.planoSelecionado,
    album: []
  } ;
    this.paginaService.setDadosPagina(formStorage);
    this.router.navigate(['/checkout']);
  }
  constructor( private youtubeService: YoutubeService,
    private sanitizer: DomSanitizer , private cdRef: ChangeDetectorRef, private router: Router ,private cadastroService: CadastroService,public dialog: MatDialog, private http: HttpClient, private route: ActivatedRoute, private spotifyService: SpotifyService, private paginaService: PaginaServiceService) {
       const urlParams = new URLSearchParams(window.location.search);
      this.accessToken = urlParams.get('access_token');
    }
  
    getSafeUrl(videoId: string): SafeResourceUrl {
      return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
    }
    selectVideo(videoId: string): void {    
      this.form.videoId = videoId;
      this.form = { ...this.form };
    }
   playVideo(videoId: string): void {
    // Cria o URL de embed sem autoplay
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);

    this.activeVideos.set(videoId, safeUrl);
  }
  
  selecionarPlano(plano: string) {
    this.planoSelecionado = plano;
    this.form.planoSelecionadoForm = plano;
  }
  searchYoutube() {
    if (!this.searchQuery.trim()) return;
    this.youtubeService.searchVideos(this.searchQuery).subscribe((res: any) => {
      this.youtubeResults = res.items;
    });
  }
  escolherVideo(video: any) {
    this.form.videoId = `https://www.youtube.com/watch?v=${video.id.videoId}`;
  }
  async onFileSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const newFiles = Array.from(input.files);

    for (let file of newFiles) {
      const storage = getStorage();
      const path = `imagens/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      try {
        await uploadBytes(storageRef, file); 
        const url = await getDownloadURL(storageRef); 
        this.form.imagens.push(url); 
         this.firebasePaths.push(path);  
      } catch (error) {
        console.error("Erro ao enviar imagem:", error);
      }
    }
  }
}
@ViewChildren('codigoInput') inputs!: QueryList<ElementRef>;

onInput(index: number) {
  const input = this.codigo[index];
  if (input && input.length === 1 && index < this.codigoArray.length - 1) {
    this.inputs.toArray()[index + 1].nativeElement.focus();
  }
}
validaEmail(email : string){
  if(email.includes("@") && email.includes(".com") && email.length >12){
    return true;
  }
  else{
    return false;
  }
 
}
 enviarCodigo() {
   if (!this.form.email) {
    alert('Informe um email válido!');
    return;
  }
  if(!this.validaEmail(this.form.email)){
    this.emailValido= false
    return
  }

     this.carregandoEnvio = true;
    this.http.post('http://192.168.159.1:8080/api/confirmacao-email/enviar-codigo', { email: this.form.email}).subscribe({
      next: response => {
       this.emailEnviado = true;
        this.codigo = ['', '', '', '', '', ''];
        this.startReenviarTimer();
        console.log('Código enviado para', this.form.email);
        this.carregandoEnvio = false;
      },
      error: err => {
        const mensagem = err.error?.message || 'Erro inesperado ao enviar o código.';
        alert('Erro ao enviar código: ' + mensagem);
        console.error('Erro detalhado:', err);
      },
      complete: () => {
        console.log('Requisição finalizada');
      }
    });
}

 verificarCodigo() {
  const codigoDigitado = this.codigo.join('');
  console.log(codigoDigitado)
  this.http.post('http://localhost:8080/api/confirmacao-email/validar-codigo', { email: this.form.email, codigo: codigoDigitado })
    .subscribe(() => {
      this.emailConfirmado = true;
      clearInterval(this.interval);
     
    }, () => {
      alert('Código inválido!');
    });
}

reenviarCodigo() {
  if (this.reenviarTimer === 0) {
    this.enviarCodigo();
  }
}
startReenviarTimer() {
  this.reenviarTimer = 60;
  clearInterval(this.interval);

  this.interval = setInterval(() => {
    this.reenviarTimer--;
    if (this.reenviarTimer <= 0) {
      clearInterval(this.interval);
    }
  }, 1000);
}

  
 
 async removeImage(index: number): Promise<void> {
  const storage = getStorage();
  const path = this.firebasePaths[index]; // Pega o caminho salvo

  try {
    const imageRef = ref(storage, path);
    await deleteObject(imageRef); // Remove do Firebase
    console.log('Imagem removida do Firebase com sucesso');
  } catch (error) {
    console.error('Erro ao remover imagem do Firebase:', error);
  }

  // Remove da interface e dos arrays locais
  this.form.imagens.splice(index, 1);
  this.firebasePaths.splice(index, 1);
}

  nextStep() {
    const formStorage = {
    nomeCasal: this.form.nomeCasal,
    mensagem: this.form.mensagem,
    musica: this.form.musica,
    autor: this.form.autor,
    data: this.form.data,
    titulo: this.form.titulo,
    videoId: this.form.videoId,
    playlist: this.form.playlist,
    imagens: this.form.imagens,
 
  } ;
   localStorage.removeItem('dadosCadastro');
    const sessionId = Date.now().toString();
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('dadosCadastro_' + sessionId, JSON.stringify(formStorage));
    if(this.currentStep ===6){
      if(!this.emailConfirmado){
        //alert("Verifique o seu Email para poder avançar.")
        this.currentStep++;
      }
      else{
         this.currentStep++;
      }
    }
    else if (this.currentStep < 8) {
      this.currentStep++;
    }
  }

  prevStep() {
    if(this.currentStep === 0){
      this.router.navigate(['/inicio']);
    }
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
   loginWithSpotify(): void {
    const formStorage = {
    nomeCasal: this.form.nomeCasal,
    mensagem: this.form.mensagem,
    musica: this.form.musica,
    autor: this.form.autor,
    data: this.form.data,
    titulo: this.form.titulo,
    videoId: this.form.videoId,
    playlist: this.form.playlist,
    imagens: this.form.imagens,
 
  } ;
 
    const sessionId = Date.now().toString();
    
    // Salva apenas no localStorage para manter após o redirect
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('dadosCadastro_' + sessionId, JSON.stringify(formStorage));
    setTimeout(() => {
    window.location.href = `http://accounts.spotify.com/authorize?response_type=code&client_id=${this.clientId}&scope=app-remote-control streaming&redirect_uri=http://127.0.0.1:4200/criarCarta`;
  }, 300)
  }

  async searchMusic(){
    this.searchResults = await this.spotifyService.searchTracks(this.searchSpotify);
   }

   



   preencherAlbumPadrao() {
    this.albumRascunho =  [
  { url: 'gs://lovelink-imagens.firebasestorage.app/imagens/image-pedido.jpg', descricao: 'Foto exemplo 1', data: new Date('2024-12-31') },
  { url: 'gs://lovelink-imagens.firebasestorage.app/imagens/fotoexemplo3.jpg', descricao: 'Foto exemplo 3', data: new Date('2024-03-01') },
  { url: 'gs://lovelink-imagens.firebasestorage.app/imagens/image7.jpg', descricao: 'Foto exemplo 2', data: new Date('2024-03-02') },
  { url: 'gs://lovelink-imagens.firebasestorage.app/imagens/fotoexemplo2.jpg', descricao: 'Foto exemplo 4', data: new Date('2024-04-19') },
  { url: 'gs://lovelink-imagens.firebasestorage.app/imagens/fotoexemplo5.jpg', descricao: 'Foto exemplo 5', data: new Date('2024-05-01') },
  { url: 'gs://lovelink-imagens.firebasestorage.app/imagens/image1.jpg', descricao: 'Foto exemplo 1', data: new Date('2024-05-28') },
  { url: 'gs://lovelink-imagens.firebasestorage.app/imagens/image3.jpg', descricao: 'Foto exemplo 1', data: new Date('2024-08-13') },
  { url: 'gs://lovelink-imagens.firebasestorage.app/imagens/image4.jpg', descricao: 'Foto exemplo 1', data: new Date('2024-10-02') },
  { url: 'gs://lovelink-imagens.firebasestorage.app/imagens/image5.jpg', descricao: 'Foto exemplo 1', data: new Date('2024-10-14') },
  { url: 'gs://lovelink-imagens.firebasestorage.app/imagens/image6.jpg', descricao: 'Foto exemplo 2', data: new Date('2025-01-16') },
],
    this.form = { ...this.form, album: [...this.albumRascunho] };
  }
}
