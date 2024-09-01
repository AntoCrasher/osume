import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpGraphComponent } from './pp-graph.component';

describe('PpGraphComponent', () => {
  let component: PpGraphComponent;
  let fixture: ComponentFixture<PpGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PpGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PpGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
