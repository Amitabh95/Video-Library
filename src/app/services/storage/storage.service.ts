import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setInStorage(key, value) {
    const stringifiedValue = JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
  }

  getFromStorage(key) {
    const promise = new Promise((resolve) => {
      const value = localStorage.getItem(key);
      const response = {
        error: false,
        value: JSON.parse(value)
      };
      resolve(response);
    });
    return promise;
  }

  removeFromStorage() {

  }
}
