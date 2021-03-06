import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminLandingComponent } from './admin-landing/admin-landing.component';
import { VideoComponent } from './video/video.component';
import { MaterialCoreModule } from 'src/app/material.module';
import { SharedComponentsModule } from '../shared-components/shared-components.module';

@NgModule({
  declarations: [AdminLandingComponent, VideoComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialCoreModule,
    SharedComponentsModule
  ]
})
export class AdminModule { }
