import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
//import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

@Injectable({
  providedIn: 'root'
})
export class MapCustomService {

  mapbox = (mapboxgl as typeof mapboxgl);
  map?:mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 40.416906;
  long = -3.7056721;
  zoom = 3

  constructor() { 
    this.mapbox.accessToken = environment.mapPK;
  }

  buildMap():Promise<any>{
    return new Promise((resolve, reject)=>{
      try{
        this.map = new mapboxgl.Map({
          container:'map',
          style:this.style,
          zoom: this.zoom,
          center:[this.long, this.lat]
        });
        /**AGREGAR BOTONES DE ZOOM PERO ESTOS SE PISAN CON LOS ESTILOS DE NUESTRO STYLE */
        //this.map.addControl(new mapboxgl.NavigationControl());

         /**
         *  TODO: Aqui construimos el input buscador de direcciones
         */
          const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken, mapboxgl:undefined
          });
  
        resolve({
          map: this.map, geocoder
        });
      }catch(e)
      {
        reject(e)
      }
    });
  }
}
