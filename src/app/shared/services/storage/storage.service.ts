import { Injectable } from '@angular/core';
import { ClearStorageResponse } from '../../model/model';
import * as jwt_decode from 'node_modules/jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setToken(token) {
    localStorage.setItem('userToken', token);
  }

  setUID(uid) {
    localStorage.setItem('uid', uid);
  }

  isTokenPresent() {
    const token = localStorage.getItem('userToken');
    if (token) {
      return  true;
    } else {
      return false;
    }
  }

  getToken() {
    const promise = new Promise((resolve, reject) => {
      const token = localStorage.getItem('userToken');
      if (token) {
        const successResponse = {
          error: false,
          response: {
            tokenValue: token
          }
        };
        resolve(successResponse);
      } else {
        const errorResponse = {
          error: true,
          response: {
            message: 'No token in localstorage'
          }
        };
        reject(errorResponse);
      }
    });
    return promise;
  }

  getDecodeToken() {
    const promise = new Promise((resolve, reject) => {
      const token = localStorage.getItem('userToken');
      if (token) {
        const decodedToken = jwt_decode(token);
        const successResponse = {
          error: false,
          response: {
            rawToken: token,
            decodeTokenValue: decodedToken
          }
        };
        resolve(successResponse);
      } else {
        const errorResponse = {
          error: true,
          reponse: {
            message: 'No token in localstorage'
          }
        };
        reject(errorResponse);
      }
    });
    return promise;
  }

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
