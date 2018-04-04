import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  showFavorite:boolean = false;
  nextPage:boolean = false;
  constructor() { }

  getDetails(index) {

  }

  getNextPage() {

  }

  ngOnInit() {
  }

}
