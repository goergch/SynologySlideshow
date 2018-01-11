import { Injectable } from '@angular/core';

import { Headers, Http, Response, } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PhotoService {
  private albumUrl = 'api/albums';
  private photoUrl = 'api/photos';
  constructor(private http: HttpClient) {}

  getPhotoList(albumId: string): Observable<any> {
    const url = `${this.albumUrl}/${albumId}/photos`;
    return this.http.get<any>(url);
  }

  getPhoto(photoId: string): Observable<any> {
    const url = `${this.photoUrl}/${photoId}`;
    return this.http.get<any>(url);
  }

}
