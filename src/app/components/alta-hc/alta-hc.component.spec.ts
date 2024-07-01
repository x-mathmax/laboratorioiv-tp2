import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaHcComponent } from './alta-hc.component';

describe('AltaHcComponent', () => {
  let component: AltaHcComponent;
  let fixture: ComponentFixture<AltaHcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaHcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AltaHcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
