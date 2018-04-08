import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { SearchService } from "../search.service";
import { DetailsService } from "../details.service";

@Component({
  selector: "app-result-container",
  templateUrl: "./result-container.component.html",
  styleUrls: ["./result-container.component.css"],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("slideAnimation", [
      transition("* => right", [
        style({right: '-100%'}),
        animate('1s ease-in', style({right:0}))
      ]),
      transition("* => left", [
        style({left: '-100%'}),
        animate('1s ease-in', style({left:0}))
      ]),
    ])
  ]
})
export class ResultContainerComponent implements OnInit {

  active:any;
  clear = false;
  constructor(private sService: SearchService, private dService: DetailsService) {
    this.sService.isClear.subscribe(data => {
      this.showResult();
      this.isShowResult = false;
      this.clear = true;
      this.place = null;
      console.log('clear view')
    });
    this.sService.isDataget.subscribe(data => {
      this.showResult();
      this.isShowResult = true;
      this.clear = false;
      console.log('show result')
    })
    // this.dService.slide.subscribe(data => {
    //   this.active = data;
    //   console.log(this.active);
    // })
  }
  isShowResult = true;
  isShowFavorite = false;

  resultShowClass = "btn btn-primary";
  favoriteShowClass = "btn btn-outline-primary";

  // btn = true;
  place = "";

  slideRight(panel) {
    // console.log(panel);
    this.clear = false;
    this.active = panel;
  }

  slideLeft(event) {
    this.clear = false;
    this.active = event.slide;
    // this.btn = event.btn;
    this.place = event.place;
  }

  showResult() {
    this.clear = false;
    this.isShowFavorite = false;
    this.isShowResult = true;
    this.active = 'right';
    this.resultShowClass = "btn btn-primary";
    this.favoriteShowClass = "btn btn-outline-primary";
  }

  showFavorite() {
    this.clear = false;
    this.isShowResult = false;
    this.isShowFavorite = true;
    this.active = 'right';
    this.resultShowClass = "btn btn-outline-primary";
    this.favoriteShowClass = "btn btn-primary";
  }

  ngOnInit() {
    // this.active = "right";
  }
}
