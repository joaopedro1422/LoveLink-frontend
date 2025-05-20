import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartaPreviewComponent } from './carta-preview.component';

describe('CartaPreviewComponent', () => {
  let component: CartaPreviewComponent;
  let fixture: ComponentFixture<CartaPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartaPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartaPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
