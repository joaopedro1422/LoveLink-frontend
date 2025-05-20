import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdcAlbumComponent } from './modal-adc-album.component';

describe('ModalAdcAlbumComponent', () => {
  let component: ModalAdcAlbumComponent;
  let fixture: ComponentFixture<ModalAdcAlbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAdcAlbumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAdcAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
