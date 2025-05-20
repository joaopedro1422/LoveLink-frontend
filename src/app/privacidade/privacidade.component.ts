import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-privacidade',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './privacidade.component.html',
  styleUrl: './privacidade.component.css'
})
export class PrivacidadeComponent {
  constructor(private router: Router){

  }

  goToCriarCarta(){
    this.router.navigate(['/criarCarta'])
  }
}
