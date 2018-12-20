import { Injectable } from '@angular/core';
import { LoaderState } from '../../../shared/model/model';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialLoaderServeService {
  public loaderSubject: BehaviorSubject<any> = new BehaviorSubject(<LoaderState>{ show: false });
  loaderState = this.loaderSubject.asObservable();
  // public spinnerActive: EventEmitter<Boolean>;
  constructor() { }

  show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
    console.log('Spinner init');
  }
  hide() {
    this.loaderSubject.next(<LoaderState>{ show: false });
    console.log('Spinner hide');
  }

  getStatus(): Observable<any> {
    return this.loaderSubject.asObservable();
  }
}
