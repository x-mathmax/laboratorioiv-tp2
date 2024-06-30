import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosEspecialistaComponent } from './horarios-especialista.component';

describe('HorariosEspecialistaComponent', () => {
  let component: HorariosEspecialistaComponent;
  let fixture: ComponentFixture<HorariosEspecialistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosEspecialistaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HorariosEspecialistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
