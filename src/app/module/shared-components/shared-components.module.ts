import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsRoutingModule } from './shared-components-routing.module';
import { MaterialDialogComponent } from './material-dialog/material-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialCoreModule } from 'src/app/material.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
@NgModule({
  declarations: [
    // MaterialDialogComponent,
     HeaderComponent, FooterComponent],
  // entryComponents: [MaterialDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentsRoutingModule,
    MaterialCoreModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  providers: []
})
export class SharedComponentsModule { }
