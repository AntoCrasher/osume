import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappackClearComponent } from './mappack-clear.component';

describe('MappackClearComponent', () => {
  let component: MappackClearComponent;
  let fixture: ComponentFixture<MappackClearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MappackClearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MappackClearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
