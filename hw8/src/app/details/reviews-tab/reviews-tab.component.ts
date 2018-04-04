import { Component, OnInit, Input } from "@angular/core";
import { DetailsService } from "../../details.service";

@Component({
  selector: "app-reviews-tab",
  templateUrl: "./reviews-tab.component.html",
  styleUrls: ["./reviews-tab.component.css"]
})
export class ReviewsTabComponent implements OnInit {
  @Input() ggReviews: any;

  yelpReviews: any;
  private reviewTypes = ["Google Reviews", "Yelp Reviews"];
  private selectedReviewType: number = 0;

  private orderTypes = [
    "Default Order",
    "Highest Rating",
    "Lowest Rating",
    "Most Recent",
    "Least Recent"
  ];

  private selectedOrderType: number = 0;

  setReviewType(type) {
    this.selectedReviewType = type;
    if (!this.yelpReviews) {
      let response = this.dService.getYelpReviews();
      response.subscribe(data => {
        console.log(data);
        this.yelpReviews = data;
      });
    }
  }

  setOrderType(type) {
    this.selectedOrderType = type;
  }

  constructor(private dService: DetailsService) {}

  ngOnInit() {}
}
