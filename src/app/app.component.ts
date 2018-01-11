import {Component, OnInit, ViewChild} from '@angular/core';
import {PhotoService} from './services/photo.service';

import {NgxSiemaOptions} from 'ngx-siema';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import 'rxjs/add/observable/of';
import {NgxSiemaService} from 'ngx-siema';
import * as screenfull from 'screenfull';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PhotoService]
})
export class AppComponent implements OnInit {
  title = 'app';
  private photoList: any;

  options: NgxSiemaOptions = {
    selector: '.siema',
    duration: 2000,
    easing: 'ease-out',
    perPage: 1,
    startIndex: 0,
    draggable: true,
    threshold: 20,
    loop: true,
    onInit: () => {
      // runs immediately after first initialization
      console.log('siema init');
    },
    onChange: () => {
      // runs after slide change
      console.log('siema change');
    },
  };

  constructor(private photoService: PhotoService, private ngxSiemaService: NgxSiemaService) {
  }

  ngOnInit(): void {
    this.updatePhotoList();

    const timer = TimerObservable.create(5000, 5000);
    const timer2 = TimerObservable.create(60000, 60000);
    timer.subscribe(t => this.next());
    timer2.subscribe(t => {
      if (new Date().getMinutes() % 30 === 0){
        location.reload(true);
      }

    });
  }

  private updatePhotoList() {
    console.log('Update Photolist');
    this.photoService.getPhotoList('album_c3966666656e746c6963682f74657374').subscribe((photoList) => {
      console.log('Update Photolist done');
      this.photoList = [];
      this.photoList = photoList;
      // this.imageSources = [];
      // for (const i of this.photoList){
      //   this.imageSources.push('/api/photos/' + this.photoList[i].id);
      // }
    }, error2 => {
      console.log(error2);
    });
  }

  next() {
    this.ngxSiemaService.next(1)
      .subscribe((data: any) => console.log(data));
  }

  siemaclick() {
    if (screenfull.enabled) {
      screenfull.request();
    }
  }
}
