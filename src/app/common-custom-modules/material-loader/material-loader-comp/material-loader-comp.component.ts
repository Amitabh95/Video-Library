import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderState } from 'src/app/shared/model/model';
import { MaterialLoaderServeService } from '../material-loader-serve/material-loader-serve.service';

@Component({
  selector: 'app-material-loader-comp',
  templateUrl: './material-loader-comp.component.html',
  styleUrls: ['./material-loader-comp.component.css']
})
export class MaterialLoaderCompComponent implements OnInit, OnDestroy {
  show: boolean;
  private subscription: Subscription;

  constructor(
    private loaderService: MaterialLoaderServeService
  ) { }

  ngOnInit() {
    this.initLoader();
  }

  initLoader() {
    this.subscription = this.loaderService.getStatus()
      .subscribe((state: any) => {
        this.show = state.show;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
