import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-termos',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './termos.component.html',
  styleUrl: './termos.component.css'
})
export class TermosComponent {
  constructor(private router: Router){
  
    }
  
    goToCriarCarta(){
      this.router.navigate(['/criarCarta'])
    }
}
