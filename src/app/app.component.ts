import { MapCustomService } from './map-custom.service';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('asGeoCoder') asGeoCoder?: ElementRef;

  constructor(private MapCustomService: MapCustomService, private renderer2: Renderer2){}
  ngOnInit(): void {
    this.MapCustomService.buildMap()
    .then(({geocoder, map})=>{

      //this.asGeoCoder
      this.renderer2.appendChild(this.asGeoCoder?.nativeElement, geocoder.onAdd(map));

      console.log('TODO BIEN');
    })
    .catch((error)=>{
      console.log('**************** ERROR **************', error);
    })
  }
}
