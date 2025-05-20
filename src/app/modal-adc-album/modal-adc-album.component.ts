import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'app-modal-adc-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-adc-album.component.html',
  styleUrl: './modal-adc-album.component.css',
  exportAs: 'modalAdc',
 
})
export class ModalAdcAlbumComponent {
  mostrar: boolean = false;

    toggle () {
      this.mostrar = !this.mostrar;
    }

}
