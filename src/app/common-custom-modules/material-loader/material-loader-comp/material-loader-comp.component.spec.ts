import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialLoaderCompComponent } from './material-loader-comp.component';

describe('MaterialLoaderCompComponent', () => {
  let component: MaterialLoaderCompComponent;
  let fixture: ComponentFixture<MaterialLoaderCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialLoaderCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialLoaderCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
