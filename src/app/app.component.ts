import { MapCustomService } from './map-custom.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private MapCustomService: MapCustomService){}
  ngOnInit(): void {
    this.MapCustomService.buildMap()
    .then((data)=>{
      console.log('TODO BIEN');
    })
    .catch((error)=>{
      console.log('**************** ERROR **************', error);
    })
  }
}
