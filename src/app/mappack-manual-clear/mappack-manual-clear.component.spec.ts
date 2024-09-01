import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappackManualClearComponent } from './mappack-manual-clear.component';

describe('MappackManualClearComponent', () => {
  let component: MappackManualClearComponent;
  let fixture: ComponentFixture<MappackManualClearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MappackManualClearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MappackManualClearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
