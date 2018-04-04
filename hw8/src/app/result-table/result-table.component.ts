import { Component, OnInit, HostBinding } from '@angular/core';
import { SearchService } from '../search.service';
import { DetailsService } from '../details.service';

declare var google: any;

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit {
  
  showResult = true;
  resultJson = null;
  nextPage = '';
  service:any;
  selectedRow = -1;
  geoJson:any;

  constructor(
    private sService: SearchService,
    private dService: DetailsService
  ) {
    this.sService.resultJson.subscribe(data => {
      console.log(data);
      this.resultJson = data["results"];
      this.nextPage = data["next_page_token"];
      this.geoJson = data["geoJson"];
      this.showResult = true;
    });
   }

  getNextPage() {
    this.sService.getNextPage(this.nextPage);
    console.log('next');
  }

  highlightRow(index) {
    this.selectedRow = index;
  }

  getDetails(index) {
    // this.sService.getDetails(index);
    let req = {
      // placeId: this.resultJson[index]["place_id"]
      placeId: "ChIJV2O_5jTGwoARk4eD0_v-Xm8"
    };
    
    this.service.getDetails(req, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        // console.log(place);
        // let name = this.resultJson[index]['name'];
        let geo = {"lat":34.0093,"lng":-118.2584};
        let name = "USC"
        this.dService.setDetails(place, name, geo);
      }
    })
    this.highlightRow(index);
    console.log('details');
  }

  initService() {
    let map = new google.maps.Map(document.createElement('div'));
    this.service = new google.maps.places.PlacesService(map);
  }

  ngOnInit() {
    this.initService();
  }

}
