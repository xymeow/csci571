import { Component, OnChanges, ChangeDetectorRef, Input } from "@angular/core";
import { DetailsService } from "../../details.service";

@Component({
  selector: "app-photos-tab",
  templateUrl: "./photos-tab.component.html",
  styleUrls: ["./photos-tab.component.css"]
})
export class PhotosTabComponent implements OnChanges {
  @Input() photos: any;

  private _resized = false;

  constructor() {}

  ngOnChanges() {
    this.resizeAllGridItems();
  }

  onResize(event) {
    this.resizeAllGridItems();
  }

  resizeGridItem(item) {
    var rowHeight = 10;
    var rowGap = 10;
    var rowSpan = Math.ceil(
      (item.querySelector(".img-thumbnail").height + rowGap) /
        (rowHeight + rowGap)
    );
    item.style.gridRowEnd = "span " + rowSpan;
  }

  resizeAllGridItems() {
    var all = document.getElementsByClassName("photo-container");
    for (let i = 0; i < all.length; i++) {
      this.resizeGridItem(all[i]);
    }
  }
}
