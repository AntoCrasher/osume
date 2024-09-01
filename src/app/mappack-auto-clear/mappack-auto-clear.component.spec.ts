import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappackAutoClearComponent } from './mappack-auto-clear.component';

describe('MappackAutoClearComponent', () => {
  let component: MappackAutoClearComponent;
  let fixture: ComponentFixture<MappackAutoClearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MappackAutoClearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MappackAutoClearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
