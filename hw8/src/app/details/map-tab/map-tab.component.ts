import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { DetailsService } from "../../details.service";
import { Directions } from "./direction";
import { LoaderService } from "../../loader/loader.service";

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
  private startInput: string = "Your location";
  private panorama: any;
  private buttonImgUrl: string = "http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png";
  private modes = [
    { text: "Driving", value: "DRIVING" },
    { text: "Walking", value: "WALKING" },
    { text: "Bicycling", value: "BICYCLING" },
    { text: "Transit", value: "TRANSIT" }
  ];
  private placeLatLng: any;
  private geocoder = new google.maps.Geocoder();

  ngOnChanges() {
    this.startInput = this.directions.start.text;
    this.setMap();
  }

  constructor(private loader: LoaderService) {}

  setMap() {
    let lat = this.directions.end.lat();
    let lng = this.directions.end.lng();
    this.placeLatLng = new google.maps.LatLng(lat, lng);
    var mapOpt = {
      zoom: 13,
      center: this.placeLatLng,
      gestureHandling: 'cooperative'
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
      this.buttonImgUrl =
        "http://cs-server.usc.edu:45678/hw/hw8/images/Pegman.png";
    } else {
      this.panorama.setVisible(true);
      this.buttonImgUrl =
        "http://cs-server.usc.edu:45678/hw/hw8/images/Map.png";
    }
  }

  calcRoute(mode, startLatLng) {
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
    this.loader.hide();
  }

  onSubmit() {
    this.loader.show();
    let startLatLng = new google.maps.LatLng(
      this.directions.start.lat,
      this.directions.start.lng
    );
    if (this.startInput.toLowerCase() != "your location") {
      this.geocoder.geocode({ address: this.startInput }, (results, status) => {
        if (status == "OK") {
          this.calcRoute(this.modeChosen, results[0].geometry.location);
        } else {
          alert("Unable to get start geocode!");
        }
      });
    } 
    else {
      this.calcRoute(this.modeChosen, startLatLng);
    }
  }

  ngOnInit() {}
}
