import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

// declare var google:any;

@Injectable()
export class SearchService {

  showResult = false;
  // response = new Observable<any>();
  private _resultJson = new Subject();
  resultJson = this._resultJson.asObservable();
  service: any;
  private jsonData: any;
  private _detailsJson = new Subject();
  detailsJson = this._detailsJson.asObservable();

  

  // @Output() change: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient) {
    // this.service = new google.maps.places.PlacesService(null);
  }

  search(form) {
    if (!form.distance) {
      form.distance = '10';
    }
    let body = JSON.stringify(form);
    console.log(body);
    this.showResult = true;
    var geo = form.geoJson;
    // console.log(geo);
    // this.change.emit(this.showResult);
    let response = this.http.post('/api/search', body, httpOptions);
    response.subscribe(data => {
      this.jsonData = data;
      this.jsonData.geoJson = geo;
      this._resultJson.next(this.jsonData);
    })
  }

  getNextPage(pagetoken: string) {
    let response = this.http.get('/api/nextpage?pagetoken=' + pagetoken, httpOptions);
    response.subscribe(data => {
      this._resultJson.next(data);
    })
  }

  getGeolocation() {
    let url = 'http://ip-api.com/json';
    return this.http.get(url);
  }



  // getDetails(index) {
  //   let req = {
  //     placeId: this.jsonData["results"][index]["place_id"]
  //   };
  //   this.service.getDetails(req, (place, status) => {
  //     if (status === google.maps.places.PlacesServiceStatus.OK) {
  //       console.log(place);
  //     }
  //   });
  // }
}
