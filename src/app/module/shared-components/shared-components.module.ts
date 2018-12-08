import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsRoutingModule } from './shared-components-routing.module';
import { MaterialDialogComponent } from './material-dialog/material-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialCoreModule } from 'src/app/material.module';
@NgModule({
  declarations: [MaterialDialogComponent],
  entryComponents: [MaterialDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsRoutingModule,
    MaterialCoreModule
  ]
})
export class SharedComponentsModule { }
