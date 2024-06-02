import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaEspecialistasComponent } from './alta-especialistas.component';

describe('AltaEspecialistasComponent', () => {
  let component: AltaEspecialistasComponent;
  let fixture: ComponentFixture<AltaEspecialistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaEspecialistasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AltaEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
