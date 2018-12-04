import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoLandingMainComponent } from './video-landing-main/video-landing-main.component';
import { VideoPlayerMainComponent } from './video-player-main/video-player-main.component';

const routes: Routes = [
  { path: '', component: VideoLandingMainComponent},
  { path: 'player', component: VideoPlayerMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
