import { Component, OnInit, NgZone } from "@angular/core";
import { SearchService } from "../search.service";
import { Info } from "./info-tab/info";
import { DetailsService } from "../details.service";
import { WindowRefService } from "../window-ref.service";
import { Directions } from "./map-tab/direction";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.css"]
})
export class DetailsComponent implements OnInit {
  private tabs = [
    { id: "info-tab", title: "Info" },
    { id: "photos-tab", title: "Photos" },
    { id: "map-tab", title: "Map" },
    { id: "reviews-tab", title: "Review" }
  ];

  details: any;

  private activeId = "info-tab";

  nativeWindow: any;

  infoJson: Info;
  mapJson: Directions;
  photoJson: any;
  reviewJson: any;

  setActive(id) {
    this.activeId = id;
  }

  tweet() {
    let url = "https://twitter.com/intent/tweet?text=";
    url += `Check out ${this.details.name} at ${this.details.formatted_address}. Website: ${this.details.website}`
    url += "&hashtags=TravelAndEntertainmentSearch";
    url += "&url=" + this.details.website;
    var newWin = this.nativeWindow.open(url, "tweet", "height=600, width=600");
  }

  setInfo(data) {
    let tmpJson = new Info();
    if (data["formatted_address"]) {
      tmpJson.address = data["formatted_address"];
    }
    if (data["international_phone_number"]) {
      tmpJson.phoneNumber = data["international_phone_number"];
    }
    if (data["price_level"]) {
      tmpJson.priceLevel = data["price_level"];
    }
    if (data["rating"]) {
      tmpJson.rating = data["rating"];
    }
    if (data["url"]) {
      tmpJson.ggPage = data["url"];
    }
    if (data["website"]) {
      tmpJson.website = data["website"];
    }
    if (data["opening_hours"]) {
      tmpJson.hours = data["opening_hours"];
    }
    if (data["utc_offset"]) {
      tmpJson.utcOffset = data["utc_offset"];
    }
    this.infoJson = tmpJson;
    console.log(this.infoJson);
  }

  setDirection(data) {
    let tmpJson = new Directions();
    tmpJson.start = data.geo;
    tmpJson.end = data.geometry.location;
    this.mapJson = tmpJson;
    console.log(this.mapJson);
  }

  setPhotos(data) {
    this.photoJson = data.photos;
  }

  setReview(data) {
    this.reviewJson = data.reviews;
  }

  constructor(
    private dService: DetailsService,
    private zone: NgZone,
    private winRef: WindowRefService
  ) {
    this.dService.details.subscribe(data => {
      this.zone.run(() => {
        console.log(data);
        this.details = data;
        console.log(this.details);
        this.setInfo(data);
        this.setDirection(data);
        this.setPhotos(data);
        this.setReview(data);
      });
    });
    this.nativeWindow = winRef.getNativeWindow();
  }

  ngOnInit() {}
}
