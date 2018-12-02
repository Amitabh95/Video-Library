import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthguardService } from './shared/services/security/authGuard/authguard.service';
import { AccessGuardService } from './shared/services/security/accessGuard/access-guard.service';

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: '', loadChildren: './video/video.module#VideoModule', canActivate: [AuthguardService] },
  { path: 'login', loadChildren: './auth/auth.module#AuthModule', canActivate: [AccessGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
