import { Component, OnInit, ChangeDetectorRef, Input } from "@angular/core";
import { Info } from "./info";
import { SearchService } from "../../search.service";
import { DetailsService } from "../../details.service";

@Component({
  selector: "app-info-tab",
  templateUrl: "./info-tab.component.html",
  styleUrls: ["./info-tab.component.css"]
})
export class InfoTabComponent implements OnInit {
  @Input()
  info: Info;

  private priceLevelMap = ["", "$", "$$", "$$$", "$$$$", "$$$$$"];

  constructor(
    // private cdRef: ChangeDetectorRef,
    // private dService: DetailsService
  ) {
    // this.dService.infoJson.subscribe(data => {
    //   this.info = data;
    //   console.log(this.info);
    //   this.cdRef.detectChanges();
    // });
  }

  ngOnInit() {}
}
