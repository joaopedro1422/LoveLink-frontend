import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  imports: [CommonModule],
  styleUrls: ['modal.component.css'],
  exportAs: 'modal',
  standalone: true
})
export class ModalComponent {
  mostrar: boolean = false;

  toggle () {
    this.mostrar = !this.mostrar;
  }
}