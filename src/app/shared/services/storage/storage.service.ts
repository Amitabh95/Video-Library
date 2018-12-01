import { Injectable } from '@angular/core';
import { ClearStorageResponse } from '../../model/model';

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

  removeFromStorage(key) {
    const promise = new Promise((resolve) => {
      localStorage.removeItem(key);
      const response = {
        error: false,
        response: {
          message: 'Removed from stroge successfully'
        }
      };
      resolve(response);
    });
    return promise;
  }

    clearStorage() {
      const promise = new Promise((resolve) => {
        localStorage.clear();
        const response: ClearStorageResponse = {
          error: false,
          reponse: {
            message: 'Removed everything from Storage'
          }
        };
        resolve(response);
      });
      return promise;
    }

  }
