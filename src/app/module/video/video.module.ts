import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { EmbedVideoService } from 'ngx-embed-video';

import { VideoRoutingModule } from './video-routing.module';
import { VideoLandingMainComponent } from './video-landing-main/video-landing-main.component';
import { VideoPlayerMainComponent } from './video-player-main/video-player-main.component';
import { MaterialCoreModule } from 'src/app/material.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  declarations: [VideoLandingMainComponent, VideoPlayerMainComponent],
  imports: [
    YoutubePlayerModule,
    CommonModule,
    VideoRoutingModule,
    MaterialCoreModule,
    SharedComponentsModule
  ],
  providers: [EmbedVideoService]
})
export class VideoModule { }
