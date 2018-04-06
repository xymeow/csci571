import { Injectable } from "@angular/core";
import { LocalStorageService } from "ngx-store";
import { Subject } from "rxjs/Subject";

@Injectable()
export class FavoriteService {
  private _favorite = new Subject();
  favorite = this._favorite.asObservable();

  private _isStorageChange = new Subject();
  isStorageChange = this._isStorageChange.asObservable();

  page = 1;

  constructor() {
    window.addEventListener("storage", event => {
      if (event.storageArea == localStorage) {
        // this._favorite.next(this.getAllFavorite());
        this.getAllFavorite(this.page);
      }
    });
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
    for (
      let i = (page - 1) * favPerPage;
      i < localStorage.length && i < page * favPerPage;
      i++, flag--
    ) {
      let key = localStorage.key(i);
      if (key != "NGX-STORE_prefix") {
        let value = JSON.parse(localStorage.getItem(key));
        allFavorite.push(value);
      }
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
    // this._favorite.next(this.getAllFavorite());
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
