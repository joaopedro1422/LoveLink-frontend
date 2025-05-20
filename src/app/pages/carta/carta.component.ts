import { Component,  Input, OnInit, OnChanges, OnDestroy ,ViewChild, ViewEncapsulation , ElementRef} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Carta } from '../../models/carta';
import { CommonModule , NgFor, NgForOf, NgIf} from '@angular/common'; 
import { firebaseConfig } from '../../../environments/firebase';
import { initializeApp } from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, listAll,deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ImageDialogComponent } from '../../image-dialog/image-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // ✅ Importação necessária
import { Album, Pagina } from '../../models/pagina';
import { Subscription, timer } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { ModalAdcAlbumComponent } from '../../modal-adc-album/modal-adc-album.component';
import { ControlContainer, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-carta',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, NgFor, NgForOf,MatDialogModule, ModalAdcAlbumComponent],
  templateUrl: './carta.component.html',
  styleUrl: './carta.component.css',
  encapsulation: ViewEncapsulation.None
})

export class CartaComponent implements OnInit, OnChanges, OnDestroy  {
  cartaId: string | null = null;
  imageUrl: string | null = null;
  slug: string | null = null;
  cartaData: any = {};
  album: string[] | null = null;
  private _indexImagemAtiva: number = 0;
  timerSubs!: Subscription;
  intervalId: any;
  currentSlide = 0;
  tempoDecorrido: string = '';
  fileSelected: string = ''
  safeMusicaUrl: SafeResourceUrl | null = null;
  safeUrls: SafeResourceUrl[] = [];
  novaFoto = {
    imagem: '',
    descricao: '',
    data: ''
  };
  constructor(private route: ActivatedRoute, private http: HttpClient, private dialog: MatDialog , private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef) {
    initializeApp(firebaseConfig.firebase);
    
  }
 
  @ViewChild('albumContainer', { static: true }) albumContainer!: ElementRef;
  openImageDialog(event: MouseEvent,image: string): void {
    const container = document.querySelector('.body-carta') as HTMLElement;
    if (container) {
      container.style.opacity = '0.2'; // Deixa o fundo mais escuro
      container.style.pointerEvents = 'none'; // Opcional: impede interação com o conteúdo
    }
   
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      data: { imagePath: image },
      panelClass: 'custom-fullscreen-dialog',
      width: '65vw',
      disableClose: false,
      backdropClass: 'dark-backdrop', // Escurece o fundo
      hasBackdrop: true, // Garante o fundo escuro
      position: { top: `${160}%`, left: '16%' },
    });
  
    dialogRef.afterOpened().subscribe(() => {
      const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      backdrop.addEventListener('click', () => {
        dialogRef.close();
      });
    });
    // Restaura a opacidade do container quando o Dialog for fechado
    dialogRef.afterClosed().subscribe(() => {
      if (container) {
        container.style.opacity = '1'; // Restaura a opacidade normal
        container.style.pointerEvents = 'auto'; // Restaura a interação com o conteúdo
      }
    });
  }
  
  async ngOnInit(): Promise<void> {

    this.startHeartsAnimation();
  
    this.route.paramMap.subscribe((params) => {
      this.handleRouteParams(params);
    });
  }

  private async handleRouteParams(params: ParamMap): Promise<void> {
    try {
      this.cartaId = params.get('id');
      this.slug = params.get('slug');
      this.http.get<Pagina>(`http://192.168.0.140:8080/paginas/${this.slug}/${this.cartaId}`).subscribe((res) => {
        this.cartaData = res;
        this.safeMusicaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.cartaData.videoId}`);
        this.inicializaPlaylist();
        this.cdRef.detectChanges();
        setInterval(() => {
          this.atualizarContador();
        }, 1000);
        this.iniciarTimer();
        console.log(this.cartaData)
      }, (err)=> {
        alert("Erro ao buscar pagina");
      })
      
      // Verificar e atualizar a imagem principal
      if (this.cartaData.imagens) {
        this.currentSlide = 0;
        clearInterval(this.intervalId);
        this.cdRef.detectChanges();
        this.iniciarCarrossel();
      }
      if (this.cartaData.album) {
        try {
          await this.updateAlbumUrls();
        } catch (error) {
          console.error("Erro ao atualizar URLs do álbum:", error);
        }
      }
      
    }
    catch (error ){
      console.log()
    }
  }

  inicializaPlaylist(){
     if (this.cartaData?.playlist) { 
      this.safeUrls = this.cartaData.playlist.map((id: string) =>
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`
        )
      );
    }
  }
   @ViewChild('modal') private modal?: ElementRef<HTMLDialogElement>
    private get modalElement() {
      return this.modal?.nativeElement as HTMLDialogElement;
    }

  showModal(){
      this.modalElement.showModal();
    }

    closeModal(){
      this.modalElement.close();
    }
   @ViewChild('modal') modalAdc!: ModalAdcAlbumComponent;
    abreAdc(): void {  
        this.modalAdc.toggle(); // Agora this.modal está definido     
    }

    adcAlbum(){

    }
     
   iniciarCarrossel() {
    this.intervalId = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.cartaData.imagens.length;
    }, 11000);
  }
   async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
   if (input.files) {
    const newFiles = Array.from(input.files);

    for (let file of newFiles) {
      const storage = getStorage();
      const path = `imagens/${this.cartaData.nomeCasal}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      try {
        await uploadBytes(storageRef, file); 
        const url = await getDownloadURL(storageRef); 
        this.novaFoto.imagem = url; 
        this.fileSelected = url;
      } catch (error) {
        console.error("Erro ao enviar imagem:", error);
      }
    }
  }
  }
  adicionarFotoAlbum(){
    this.http.post<Pagina>(`http://192.168.0.140:8080/paginas/${this.slug}/${this.cartaId}/adc-album`, this.novaFoto).subscribe((res)=>
    {
      this.cartaData = res;
      this.closeModal();
      console.log(res);;
    })
  }
  iniciarTimer(): void {
    this.timerSubs = timer(11000).subscribe(() => {
      this.ativarImagem(
        this.indexImagemAtiva + 1
      );
    });
  }
  pararTimer(): void {
    this.timerSubs?.unsubscribe();
  }
  ativarImagem(index: number): void {
    this.indexImagemAtiva = index;
    this.iniciarTimer();
  }
  ngOnDestroy(): void {
    this.pararTimer();
  }
  get indexImagemAtiva() {
    return this._indexImagemAtiva;
  }
  set indexImagemAtiva(value: number) {
    this._indexImagemAtiva =
      value < this.cartaData.imagens.length ? value : 0;
  }
   atualizarContador() {
    if (!this.cartaData?.data) return;
  
    const inicio = new Date(this.cartaData.data);
    const agora = new Date();
    let delta = Math.floor((agora.getTime() - inicio.getTime()) / 1000); // em segundos
  
    const anos = Math.floor(delta / (365.25 * 24 * 3600));
    delta -= anos * 365.25 * 24 * 3600;
  
    const meses = Math.floor(delta / (30.44 * 24 * 3600));
    delta -= meses * 30.44 * 24 * 3600;
  
    const dias = Math.floor(delta / (24 * 3600));
    delta -= dias * 24 * 3600;
  
    const horas = Math.floor(delta / 3600);
    delta -= horas * 3600;
  
    const minutos = Math.floor(delta / 60);
    const segundos = delta % 60;
  
    this.tempoDecorrido = `${anos} anos, ${meses} meses, ${dias} dias, ${horas} horas, ${minutos} minutos e ${segundos} segundos`;
  }
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
     
    if (this.cartaData?.album) {
      await this.updateAlbumUrls();
    }
    setInterval(() => {
      this.atualizarContador();
    }, 1000);
    console.log('Video ID:', this.cartaData.videoId);
    if (this.cartaData && this.cartaData.imagens) {
      this.currentSlide = 0;
      clearInterval(this.intervalId);
      this.cdRef.detectChanges();
      this.iniciarCarrossel();
    }
  }
  
  async getImage(url: string): Promise<string> {
    if (!this.cartaData || !this.cartaData.imagem) {
      console.error("cartaData ainda não foi carregado.");
      return 'path/to/defaultImage.jpg'; // Retorne um valor padrão caso os dados não estejam carregados
    }
  
    const storage = getStorage();
    const storageRef = ref(storage, url);
  
    try {
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl; // Retorne a URL acessível
    } catch (error) {
      console.error("Erro ao obter a URL da imagem:", error);
      return 'path/to/defaultImage.jpg'; // Defina uma imagem padrão ou trate o erro adequadamente
    }
  }
  async updateAlbumUrls(): Promise<void> {
    if (!this.cartaData?.album) return;
    for (let i = 0; i < this.cartaData.album.length; i++) {
      console.log(this.cartaData.album[i].url)
      try {
        const firebasePath = this.cartaData.album[i].url;
        const publicUrl = await this.getImage(firebasePath);
        this.cartaData.album[i].url = publicUrl;
      } catch (error) {
        console.error(`Erro ao atualizar imagem ${i}`, error);
      }
    }
  
    this.cdRef.detectChanges(); // força atualização do Angular
  }

  transformYoutubeUrl(url: string): string {
  const videoId = this.extractVideoId(url);
  return `https://www.youtube.com/embed/${videoId}`;
}

extractVideoId(url: string): string {
  let videoId = '';
  const youtubeWatchRegex = /(?:youtube\.com\/watch\?v=)([^&]+)/;
  const youtubeShortRegex = /(?:youtu\.be\/)([^?&]+)/;
  const embedRegex = /youtube\.com\/embed\/([^?&]+)/;

  if (youtubeWatchRegex.test(url)) {
    videoId = url.match(youtubeWatchRegex)?.[1] || '';
  } else if (youtubeShortRegex.test(url)) {
    videoId = url.match(youtubeShortRegex)?.[1] || '';
  } else if (embedRegex.test(url)) {
    videoId = url.match(embedRegex)?.[1] || '';
  }

  return videoId;
}


startHeartsAnimation(): void {
  let heartInterval: any;
  const container = document.querySelector('.body-carta') as HTMLElement;

  function createHeart() {
    console.log("Criando coração..."); // Depuração
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * 100 + 'vw'; // Posição aleatória
    heart.style.animationDuration = Math.random() * 2 + 3 + 's'; // Duração variável
    heart.style.opacity = Math.random().toString(); // Opacidade aleatória

    container.appendChild(heart);
    let left = Math.floor(Math.random()* 400);
    let duration = Math.random() * 0.6;
    heart.style.top = '0'
    heart.style.left = left + 'px'
    heart.style.animationDuration = (1+duration).toString+'s';
    setTimeout(function(){
      heart.removeChild(heart)
    }  ,1000); // Remove o coração após a animação
  }

  const intervalId = setInterval(() => {
    createHeart();
  }, 220); // Cria novos corações periodicamente
  setTimeout(() => {
    clearInterval(intervalId); // Para a criação dos corações após um tempo
    console.log("Parando a criação de corações...");
  }, 5000);
}

}

