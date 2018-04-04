import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Info } from "./details/info-tab/info";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable()
export class DetailsService {
  private _infoJson = new Subject();
  infoJson = this._infoJson.asObservable();

  private _placeName = new Subject();
  placeName = this._placeName.asObservable();

  private _photos = new Subject();
  photos = this._photos.asObservable();

  private _direction = new Subject();
  direction = this._direction.asObservable();

  private _reviews = new Subject();
  reviews = this._reviews.asObservable();

  private _details = new Subject();
  details = this._details.asObservable();

  detailJson: any;

  constructor(private http: HttpClient) {}

 






  getYelpReviews() {
    let addrComponent = this.detailJson.address_components;
    let httpParams = new HttpParams()
      .set("name", this.detailJson.name)
      .set(
        "address",
        addrComponent[0].short_name + " " + addrComponent[1].short_name
      )
      .set("city", addrComponent[3].short_name)
      .set("state", addrComponent[5].short_name)
      .set("country", addrComponent[6].short_name);
    return this.http.get("/api/yelp_review", { params: httpParams });
  }



  setDetails(data, name, geo) {
    let tmpJson = data;
    tmpJson["geo"] = geo;
    this._details.next(tmpJson);
    this.detailJson = tmpJson;
    // this.setInfo(data);
    // this._placeName.next(name);
    // this.setPhotosURL(data);
    // this.setDirection(data, geo);
    // this.setReview(data);
  }
}
