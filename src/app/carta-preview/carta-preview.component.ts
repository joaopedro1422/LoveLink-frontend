import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription, timer } from 'rxjs';
import { getStorage, ref, listAll, uploadBytes, getDownloadURL } from 'firebase/storage';
@Component({
  selector: 'app-carta-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carta-preview.component.html',
  styleUrl: './carta-preview.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('10000ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CartaPreviewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() cartaData: any;
  cartaId: string | null = null;
  imageUrl: string | null = null;
  
  album: string[] | null = null;
  currentSlide = 0;
  private _indexImagemAtiva: number = 0;
  timerSubs!: Subscription;
  intervalId: any;
  tempoDecorrido: string = '';
  safeMusicaUrl: SafeResourceUrl | null = null;
  safeUrls: SafeResourceUrl[] = [];
  constructor(private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef) {}

 
  async ngOnInit():  Promise<void> {
    
    
    if (this.cartaData?.album) {
      await this.updateAlbumUrls();
    }
    setInterval(() => {
      this.atualizarContador();
    }, 1000);
    this.iniciarTimer();
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
 
  ngOnDestroy(): void {
    this.pararTimer();
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
  get indexImagemAtiva() {
    return this._indexImagemAtiva;
  }
  set indexImagemAtiva(value: number) {
    this._indexImagemAtiva =
      value < this.cartaData.imagens.length ? value : 0;
  }
  
  async ngOnChanges(changes: SimpleChanges): Promise<void> {
     if (this.cartaData?.playlist) { 
      this.safeUrls = this.cartaData.playlist.map((id: string) =>
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`
        )
      );
    }
    if (this.cartaData?.album) {
      await this.updateAlbumUrls();
    }
    setInterval(() => {
      this.atualizarContador();
    }, 1000);
    console.log('Video ID:', this.cartaData.videoId);
    
  
      this.safeMusicaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.cartaData.videoId}`);
      this.cdRef.detectChanges(); // força a atualização
  
    if (this.cartaData && this.cartaData.imagens) {
      this.currentSlide = 0;
      clearInterval(this.intervalId);
      this.cdRef.detectChanges();
      this.iniciarCarrossel();
    }
  }
  iniciarCarrossel() {
    this.intervalId = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.cartaData.imagens.length;
    }, 11000);
  }
  
  
 
  
  nextSlide() {
    if (this.currentSlide < this.cartaData.imagens.length - 1) {
      this.currentSlide++;
    }
  }
  
  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }
  async updateAlbumUrls(): Promise<void> {
    if (!this.cartaData?.album) return;
    for (let i = 0; i < this.cartaData.album.length; i++) {
    
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
  async getImage(firebasePath: string): Promise<string> {
    try {
      const storage = getStorage(); // pode precisar configurar com app, ex: getStorage(firebaseApp);
      const imageRef = ref(storage, firebasePath);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Erro ao pegar imagem do Firebase:', error);
      return 'path/to/defaultImage.jpg'; // imagem padrão
    }
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
