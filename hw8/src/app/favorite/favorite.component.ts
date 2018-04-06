import {
  Component,
  OnInit,
  OnChanges,
  Output,
  Input,
  EventEmitter
} from "@angular/core";
import { FavoriteService } from "../favorite.service";
import { DetailsService } from "../details.service";

@Component({
  selector: "app-favorite",
  templateUrl: "./favorite.component.html",
  styleUrls: ["./favorite.component.css"],
  
})
export class FavoriteComponent implements OnInit {
  @Output() slide = new EventEmitter<any>();
  nextPage: boolean = false;
  prevPage: boolean = false;
  favorites: any;
  @Input('place')
  selectedPlace: any;
  // @Input('btn')
  // disableButton = true;
  private curPage = 1;

  constructor(
    private fService: FavoriteService,
    private dService: DetailsService
  ) {
    this.fService.favorite.subscribe(data => {
      this.favorites = data["allFav"];
      if (!data["flag"]) {
        this.nextPage = true;
      }
      else {
        this.nextPage = false;
      }
      console.log(data);
    });
  }

  highLightRow(placeId) {
    this.selectedPlace = placeId;
  }

  getDetails(key) {
    // console.log(key)
    // console.log(this.selectedPlace);
    this.highLightRow(key);
    // this.disableButton = false;
    // this.setButton(false);
    // console.log(this.selectedPlace);
    this.dService.getDetails(key);
    // this.highlightRow(index);
    this.slide.emit({ 'slide':'left', 'place':key});
    // console.log("details");
  }

  removeFavorite(key) {
    this.fService.removeFavorite(key);
  }

  getNextPage() {
    this.fService.getAllFavorite(this.curPage+1);
    this.curPage ++;
    if (this.curPage > 1) {
      this.prevPage = true;
    }
  }

  getPrevPage() {
    this.fService.getAllFavorite(this.curPage-1);
    this.curPage --;
    if (this.curPage == 1) {
      this.prevPage = false;
    }
  }

  loadFavorite() {
    this.fService.getAllFavorite(this.curPage);
    // console.log(this.favorites);
  }

  ngOnInit() {
    this.loadFavorite();
  }
}
