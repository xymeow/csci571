import { Component, OnInit } from '@angular/core';
import { SearchForm } from './search-form';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { SearchService } from '../search.service';
// import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  geo: Object;
  private gotgeojson: boolean = false;
  category = 'default';
  form = SearchForm;


  constructor(
    private sService: SearchService
  ) { }

  getGeo() {
    this.sService.getGeolocation()
      .subscribe(data => {
        this.geo = {
          lat: data['lat'],
          lng: data['lon']
        };
        this.form.geoJson = this.geo;
        this.gotgeojson = true;
      });
  }

  onSubmit() {
    this.sService.search(this.form);
    console.log('submit');
    // console.log()
  }

  private searchTypes = [
    'Default',
    'Airport',
    'Amusement Park',
    'Aquarium',
    'Art Gallery',
    'Bakery',
    'Bar',
    'Beauty Salon',
    'Bowling Alley',
    'Bus Station',
    'Cafe',
    'Campground',
    'Car Rental',
    'Casino',
    'Lodging',
    'Movie Theater',
    'Museum',
    'Night Club',
    'Park',
    'Parking',
    'Restaurant',
    'Shopping Mall',
    'Stadium',
    'Subway Station',
    'Taxi Stand',
    'Train Station',
    'Transit Station',
    'Travel Agency',
    'Zoo'
  ]

  ngOnInit() {
    // this.form.category = 'default';
    this.getGeo();
  }

}
