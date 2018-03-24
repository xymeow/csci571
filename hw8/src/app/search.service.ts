import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SearchService {

  showResult = false;
  // response = new Observable<any>();
  private resultJson = new Subject();
  resultJson$ = this.resultJson.asObservable();

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient) { }
  
  search(form) {
    if (!form.distance) {
      form.distance = '10';
    }
    let body = JSON.stringify(form);
    console.log(body);
    this.showResult = true;
    this.change.emit(this.showResult);
    let response = this.http.post('/api/search', body, httpOptions);
    response.subscribe(data => {
      this.resultJson.next(data);
    })
  }

  getNextPage(pagetoken: string) {
    let response = this.http.get('/api/nextpage', httpOptions);
    response.subscribe(data => {
      this.resultJson.next(data);
    })
  }

  private url:string = 'http://ip-api.com/json';

  getGeolocation() {
    return this.http.get(this.url);
  }
}
