import { environment } from './../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {HttpClient} from "@angular/common/http";
import {Socket} from "ngx-socket-io";

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
  zoom = 3;

  cbAddress: EventEmitter<any> = new EventEmitter<any>();
  wayPoints: Array<any> = [];
  markerDriver: any = null;

  constructor(private httpClient: HttpClient) { 
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
            accessToken: mapboxgl.accessToken, 
            mapboxgl:this.map,
            marker:false
          });

          geocoder.on('result', ($event) => {
            const {result} = $event;
            console.log('*********', result);
            //limpio la direccion buscada en el imput
            //geocoder.clear();

            /**SI IMPRIMO EL RESULT QUE ME DEVUELVE EL $event ME RETORNA MUCHOS DATOS 
             * ENTRE ELLOS LAS COORDENADAS - MIRAR LA CONSOLA */
            
            this.cbAddress.emit(result);
          })
  
        resolve({
          map: this.map, geocoder
        });
      }catch(e)
      {
        reject(e)
      }
    });
  }

  loadCoords(coords:any): void {
    console.log("COORDENADAS: ", coords);
    const url = [
      `https://api.mapbox.com/directions/v5/mapbox/driving/`,
      `${coords[0][0]},${coords[0][1]};${coords[1][0]},${coords[1][1]}`,
      `?steps=true&geometries=geojson&access_token=${environment.mapPK}`,
    ].join('');
    console.log(url);

    this.httpClient.get(url).subscribe((res: any) => {

      const data = res.routes[0];
      const route = data.geometry.coordinates;

      this.map?.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        }
      });

      this.map?.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': 'red',
          'line-width': 5
        }
      }); 

      this.wayPoints = route;
      //fitbounds ajusta mi mapa al tamaño de la ruta
      this.map?.fitBounds([route[0], route[route.length - 1]], {
        padding: 100
      })

      //this.socket.emit('find-driver', {points: route});

    });//fin del httpclient

  }

  addMarkerCustom(coords:any): void {
    console.log('----->', coords)
    const el = document.createElement('div');
    el.className = 'marker';
    
    if (!this.markerDriver) {
      this.markerDriver = new mapboxgl.Marker(el);
    } else {
      this.markerDriver.setLngLat(coords).addTo(this.map);
    }
  }
}//fin de la clase
