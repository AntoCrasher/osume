import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbParserComponent } from './db-parser.component';

describe('DbParserComponent', () => {
  let component: DbParserComponent;
  let fixture: ComponentFixture<DbParserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DbParserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DbParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
