import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoLandingMainComponent } from './video-landing-main/video-landing-main.component';

const routes: Routes = [
  { path: '', component: VideoLandingMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }
