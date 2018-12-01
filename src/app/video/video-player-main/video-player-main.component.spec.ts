import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerMainComponent } from './video-player-main.component';

describe('VideoPlayerMainComponent', () => {
  let component: VideoPlayerMainComponent;
  let fixture: ComponentFixture<VideoPlayerMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoPlayerMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
