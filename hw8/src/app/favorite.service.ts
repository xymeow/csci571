import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";

@Injectable()
export class FavoriteService {
  private _favorite = new Subject();
  favorite = this._favorite.asObservable();

  private _isStorageChange = new Subject();
  isStorageChange = this._isStorageChange.asObservable();

  page = 1;

  constructor() {
  }

  saveFavorite(
    name: string,
    vicinity: string,
    place_id: string,
    icon_url: string,
    key: string
  ) {
    let favJson = {
      name: name,
      address: vicinity,
      placeId: place_id,
      icon: icon_url
    };
    localStorage.setItem(key, JSON.stringify(favJson));
    this.getAllFavorite(this.page);
  }

  getFavorite(key: string) {
    // return this.resourse.setPath(key).value;
    return JSON.parse(localStorage.getItem(key));
  }

  getAllFavorite(page) {
    this.page = page;
    let favPerPage = 20;
    let allFavorite = [];
    let flag = favPerPage;
    if ((page - 1) * favPerPage == localStorage.length) {
      // last item
      this.page--;
      page--;
      if (this.page == 0) {
        this.page = 1;
        this._favorite.next({allFav: null, flag: null});
        this._isStorageChange.next(true);
        return;
      }
    }

    for (
      let i = (page - 1) * favPerPage;
      i < localStorage.length && i < page * favPerPage;
      i++, flag--
    ) {
      let key = localStorage.key(i);
      let value = this.getFavorite(key);
      allFavorite.push(value);
    }

    // return allFavorite;
    console.log(allFavorite);
    let returnJson = {
      allFav: allFavorite,
      flag: flag
    };
    this._favorite.next(returnJson);
    this._isStorageChange.next(true);
  }

  removeFavorite(key: string) {
    localStorage.removeItem(key);
    this.getAllFavorite(this.page);
  }

  isFavorited(place_id_arr: Array<string>) {
    let result = [];
    for (let place_id of place_id_arr) {
      if (!localStorage.getItem(place_id)) {
        result.push(false);
      } else {
        result.push(true);
      }
    }
    console.log(result);
    return result;
  }
}
