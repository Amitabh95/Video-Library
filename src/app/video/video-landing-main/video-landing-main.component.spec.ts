import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLandingMainComponent } from './video-landing-main.component';

describe('VideoLandingMainComponent', () => {
  let component: VideoLandingMainComponent;
  let fixture: ComponentFixture<VideoLandingMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoLandingMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLandingMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
