import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialLoaderCompComponent } from './material-loader-comp/material-loader-comp.component';
import { MaterialLoaderServeService } from './material-loader-serve/material-loader-serve.service';
import { MaterialCoreModule } from 'src/app/material.module';

export * from './material-loader-comp/material-loader-comp.component';
export * from './material-loader-serve/material-loader-serve.service';

@NgModule({
  declarations: [MaterialLoaderCompComponent],
  imports: [
    CommonModule,
    MaterialCoreModule
  ],
  providers: [MaterialLoaderServeService],
  exports: [MaterialLoaderCompComponent]
})

export class MaterialLoaderModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MaterialLoaderModule,
      providers: [MaterialLoaderServeService]
    };
  }
}
