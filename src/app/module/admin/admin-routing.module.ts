import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';
import { VideoComponent } from './video/video.component';

const routes: Routes = [
  {path: '', component: AdminLandingComponent},
  { path: 'video', component: VideoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
