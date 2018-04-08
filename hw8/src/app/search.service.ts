import { Injectable, EventEmitter, Output } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
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

  private _isClear = new Subject();
  isClear = this._isClear.asObservable();

  private _isDataGet = new Subject();
  isDataget = this._isDataGet.asObservable();

  private _locationInput = new Subject();
  locationInput = this._isDataGet.asObservable();

  constructor(private http: HttpClient) {}

  private searchResults: any;
  private pageSaved = [];

  curPage = 1;

  search(form) {
    // let body = JSON.stringify(form);
    // console.log(body);
    this.showResult = true;
    let geo = form.geoJson;
    let location = form.location;
    if (!location) {
      location = "Your location";
    }
    // geo.text = location;
    let params = new HttpParams()
      .set("keyword", form.keyword)
      .set("category", form.category || 'default')
      .set("distance", form.distance || '10')
      .set("isUserInput", form.isUserInput || false)
      .set("location", location)
      .set("geoJson", JSON.stringify(form.geoJson));
    // console.log(geo);
    // this.change.emit(this.showResult);
    let response = this.http.get("/api/search", { params: params });
    response.subscribe(
      data => {
        this.jsonData = data;
        this.jsonData.geoJson = geo
        this.jsonData.startLocation = location;
        this._resultJson.next(this.jsonData);
        this._isDataGet.next(true);
        this.searchResults = data["results"];
      },
      err => {
        this._resultJson.next(null);
      }
    );
  }

  loadSearchResult() {
    this._resultJson.next(this.jsonData);
  }

  getNextPage(pagetoken: string) {
    if (this.pageSaved.includes(pagetoken)) {
      let returnData: any = {};
      returnData.results = this.searchResults.slice(
        this.curPage * 20,
        (this.curPage + 1) * 20
      );
      if (this.curPage == 1) {
        returnData.next_page_token = this.pageSaved[1];
      }
      this._resultJson.next(returnData);
    } else {
      this.pageSaved.push(pagetoken);
      let response = this.http.get(
        "/api/nextpage?pagetoken=" + pagetoken,
        httpOptions
      );
      response.subscribe(data => {
        this._resultJson.next(data);
        console.log(this.searchResults);
        console.log(data["results"]);
        this.searchResults = this.searchResults.concat(data["results"]);
        console.log(this.searchResults);
      });
    }
    this.curPage++;
  }

  getPrevPage() {
    this.curPage--;
    console.log(this.searchResults);
    let returnData: any = {};
    returnData.results = this.searchResults.slice(
      (this.curPage - 1) * 20,
      this.curPage * 20
    );
    returnData.next_page_token = this.pageSaved[this.curPage - 1];
    console.log(returnData);
    this._resultJson.next(returnData);
  }

  getGeolocation() {
    let url = "http://ip-api.com/json";
    return this.http.get(url);
  }

  clear() {
    this._resultJson.next('clear');
    this.jsonData = undefined;
    this._isClear.next(true);
  }
}
