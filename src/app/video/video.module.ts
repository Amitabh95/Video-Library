import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { VideoLandingMainComponent } from './video-landing-main/video-landing-main.component';
import { VideoPlayerMainComponent } from './video-player-main/video-player-main.component';

@NgModule({
  declarations: [VideoLandingMainComponent, VideoPlayerMainComponent],
  imports: [
    CommonModule,
    VideoRoutingModule
  ]
})
export class VideoModule { }
