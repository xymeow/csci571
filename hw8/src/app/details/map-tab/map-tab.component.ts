import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { DetailsService } from "../../details.service";
import { Directions } from "./direction";

declare var google: any;

@Component({
  selector: "app-map-tab",
  templateUrl: "./map-tab.component.html",
  styleUrls: ["./map-tab.component.css"]
})
export class MapTabComponent implements OnChanges {
  @Input() directions: Directions;

  private marker: any;
  private map: any;
  private directionDisplay: any;
  private directionService: any;
  private modeChosen: string = "DRIVING";
  private startInput: string;
  private panorama: any;
  private modes = [
    { text: "Driving", value: "DRIVING" },
    { text: "Walking", value: "WALKING" },
    { text: "Bicycling", value: "BICYCLING" },
    { text: "Transit", value: "TRANSIT" }
  ];
  private placeLatLng: any;

  ngOnChanges() {
    this.setMap();
  }

  constructor() {}

  setMap() {
    let lat = this.directions.end.lat();
    let lng = this.directions.end.lng();
    this.placeLatLng = new google.maps.LatLng(lat, lng);
    var mapOpt = {
      zoom: 13,
      center: this.placeLatLng
    };
    this.map = new google.maps.Map(document.getElementById("map"), mapOpt);
    this.marker = new google.maps.Marker({
      position: this.placeLatLng,
      map: this.map
    });
    this.directionService = new google.maps.DirectionsService();
    this.directionDisplay = new google.maps.DirectionsRenderer({
      panel: document.getElementById("route-panel")
    });
    this.directionDisplay.setMap(this.map);
    this.panorama = this.map.getStreetView();
    this.panorama.setPosition(this.placeLatLng);
    this.panorama.setVisible(false);
  }

  showPanorama() {
    let flag = this.panorama.getVisible();
    if (flag) {
      this.panorama.setVisible(false);
    } else {
      this.panorama.setVisible(true);
    }
  }

  calcRoute(mode) {
    let startLatLng = new google.maps.LatLng(
      this.directions.start.lat,
      this.directions.start.lng
    );
    var request = {
      origin: startLatLng,
      destination: this.placeLatLng,
      travelMode: google.maps.TravelMode[mode],
      provideRouteAlternatives: true
    };
    this.directionService.route(request, (res, status) => {
      if (status == "OK") {
        this.marker.setMap(null);
        this.directionDisplay.setDirections(res);
        console.log(res);
      }
    });
  }

  onSubmit() {
    this.calcRoute(this.modeChosen);
  }

  ngOnInit() {}
}
