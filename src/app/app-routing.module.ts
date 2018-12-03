import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthguardService } from './shared/services/security/authGuard/authguard.service';
import { AccessGuardService } from './shared/services/security/accessGuard/access-guard.service';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: '', loadChildren: './module/video/video.module#VideoModule', canActivate: [AuthguardService] },
  { path: 'login', loadChildren: './module/auth/auth.module#AuthModule', canActivate: [AccessGuardService] },
  { path: 'admin', loadChildren: './module/admin/admin.module#AdminModule', canActivate: [AuthguardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
