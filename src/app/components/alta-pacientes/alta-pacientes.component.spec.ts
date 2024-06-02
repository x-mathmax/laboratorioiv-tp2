import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaPacientesComponent } from './alta-pacientes.component';

describe('AltaPacientesComponent', () => {
  let component: AltaPacientesComponent;
  let fixture: ComponentFixture<AltaPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaPacientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AltaPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
