import {
  Component,
  OnInit,
  HostBinding,
  Output,
  EventEmitter,
  OnChanges,
  Input
} from "@angular/core";
import { SearchService } from "../search.service";
import { DetailsService } from "../details.service";
import { FavoriteService } from "../favorite.service";
import { error } from "selenium-webdriver";

declare var google: any;

@Component({
  selector: "app-result-table",
  templateUrl: "./result-table.component.html",
  styleUrls: ["./result-table.component.css"]
})
export class ResultTableComponent implements OnInit {
  @Output() slide = new EventEmitter<any>();

  showResult = false;
  resultJson = null;
  nextPage:any;
  prevPage: any = false;
  curPage = 1;
  service: any;
  @Input('place')
  selectedRow :any;
  geoJson: any;
  isFavorite: any;
  error: boolean = false;

  constructor(
    private sService: SearchService,
    private dService: DetailsService,
    private fService: FavoriteService
  ) {
    this.sService.resultJson.subscribe(data => {
      console.log(data);
      if (data===null) {
        this.error = true;
        this.showResult = true;
      }
      else if(data === undefined){
      } 
      else {
        this.resultJson = data["results"];
        this.checkFavorite();
        // console.log(this.isFavorite);
        this.nextPage = data["next_page_token"];
        this.geoJson = data["geoJson"];
        this.error = false;
        this.showResult = true;
      }
      
    });
    this.fService.isStorageChange.subscribe(data => {
      this.checkFavorite();
    })
  }

  getNextPage() {
    this.sService.getNextPage(this.nextPage);
    this.curPage ++;
    this.prevPage = true;
    console.log("next");
  }

  getPrevPage() {
    this.sService.getPrevPage();
    this.curPage --;
    if(this.curPage==1){
      this.prevPage = false;
    }
  }

  highlightRow(placeId) {
    this.selectedRow = placeId;
  }

  slideLeft() {
    this.slide.emit({ slide: "left",  place: this.selectedRow })
  }

  getDetails(placeId) {
    // this.sService.getDetails(index);
    // let placeId = this.resultJson[index]["place_id"];
    this.dService.getDetails(placeId, this.geoJson);
    // this.dService.getDetails("ChIJV2O_5jTGwoARk4eD0_v-Xm8", this.geoJson);
    this.highlightRow(placeId);
    this.slide.emit({ slide: "left", place: placeId });
    console.log("details");
  }

  setFavorite(index) {
    if (this.isFavorite[index]) {
      this.fService.removeFavorite(this.resultJson[index]["place_id"]);
      this.isFavorite[index] = false;
    } else {
      this.fService.saveFavorite(
        this.resultJson[index]["name"],
        this.resultJson[index]["vicinity"],
        this.resultJson[index]["place_id"],
        this.resultJson[index]["icon"],
        this.resultJson[index]["place_id"]
      );
      this.isFavorite[index] = true;
    }
  }

  checkFavorite() {
    let place_id_arr = this.resultJson.map(data => data.place_id);
    this.isFavorite = this.fService.isFavorited(place_id_arr);
  }

  ngOnInit() {
    this.sService.loadSearchResult();
  }
}
