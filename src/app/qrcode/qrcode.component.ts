import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Route } from '@angular/router';
import QRCodeStyling from 'qr-code-styling';
FooterComponent
@Component({
  selector: 'app-qrcode',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './qrcode.component.html',
  styleUrl: './qrcode.component.css'
})
export class QrcodeComponent implements AfterViewInit{
 
  paginaId : string | null = null
  slug: string | null = null
  @ViewChild('qrCodeCanvas', { static: false }) qrCodeCanvas!: ElementRef;

  qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: `http://192.168.0.140:4200/${this.slug}/${this.paginaId}`,
    image: "/coracaoLoveLink.png", // ícone central (adicione no /assets)
    dotsOptions: {
      gradient: {
        type: "linear", // ou "radial"
        rotation: 0, // em radianos (0 = horizontal, Math.PI / 2 = vertical)
        colorStops: [
          { offset: 0, color: "#D72638" },
          { offset: 1, color: "#8B0000" }
        ]
      },
      type: "rounded"
    },
    backgroundOptions: {
      color: "white"
    },
    cornersSquareOptions: {
      type: "extra-rounded", // estilos: "dot", "square", "extra-rounded", etc.
      color: "#D72638"
    },
    cornersDotOptions: {
      type: "dot",
      color: "#D72638"
    },
    imageOptions: {
      crossOrigin: "anonymous",
      imageSize: 0.5,
      margin: 0
    }
  });
  constructor(private route: ActivatedRoute){}
  ngAfterViewInit(): void {
      this.route.paramMap.subscribe((params) => {
      this.handleRouteParams(params);
        console.log('Elemento do canvas:', this.paginaId);
        this.qrCode.update({
            data: `http://192.168.0.140:4200/${this.slug}/${this.paginaId}`
        });


      this.qrCode.append(this.qrCodeCanvas.nativeElement);
    });
      

  }

   private handleRouteParams(params: ParamMap): void {
     
        this.paginaId = params.get('id');
        this.slug = params.get('slug');
       
    }

  
  download(): void {
    const canvas: HTMLCanvasElement = this.qrCodeCanvas.nativeElement.querySelector('canvas');

    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'qr-code.png';
      link.click();
    } else {
      console.error('Canvas não encontrado para download do QR code');
    }
  }
}
