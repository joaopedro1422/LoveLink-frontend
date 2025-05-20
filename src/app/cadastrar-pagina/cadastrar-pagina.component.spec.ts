import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPaginaComponent } from './cadastrar-pagina.component';

describe('CadastrarPaginaComponent', () => {
  let component: CadastrarPaginaComponent;
  let fixture: ComponentFixture<CadastrarPaginaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarPaginaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarPaginaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
