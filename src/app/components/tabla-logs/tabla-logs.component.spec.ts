import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaLogsComponent } from './tabla-logs.component';

describe('TablaLogsComponent', () => {
  let component: TablaLogsComponent;
  let fixture: ComponentFixture<TablaLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaLogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
