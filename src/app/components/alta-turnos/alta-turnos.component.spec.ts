import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaTurnosComponent } from './alta-turnos.component';

describe('AltaTurnosComponent', () => {
  let component: AltaTurnosComponent;
  let fixture: ComponentFixture<AltaTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaTurnosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AltaTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
