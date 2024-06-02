import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaAdministradorComponent } from './alta-administrador.component';

describe('AltaAdministradorComponent', () => {
  let component: AltaAdministradorComponent;
  let fixture: ComponentFixture<AltaAdministradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaAdministradorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AltaAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
