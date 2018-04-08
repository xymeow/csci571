import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchFormComponent } from "./search-form/search-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { GeolocationService } from "./geolocation.service";
import { CapToVarPipe } from "./cap-to-var.pipe";
import { SearchService } from "./search.service";
import { ResultTableComponent } from "./result-table/result-table.component";
// import { AgmCoreModule } from '@agm/core';
import { AutocompleteDirective } from "./autocomplete.directive";
import { DetailsComponent } from "./details/details.component";
import { InfoTabComponent } from "./details/info-tab/info-tab.component";
import { PhotosTabComponent } from "./details/photos-tab/photos-tab.component";
import { MapTabComponent } from "./details/map-tab/map-tab.component";
import { ReviewsTabComponent } from "./details/reviews-tab/reviews-tab.component";
import { DetailsService } from "./details.service";
import { WindowRefService } from "./window-ref.service";
import { LoaderComponent } from "./loader/loader.component";
import { LoaderInterceptor } from "./loader/loader.interceptor";
import { LoaderService } from "./loader/loader.service";
import { ResultContainerComponent } from "./result-container/result-container.component";
import { FavoriteComponent } from "./favorite/favorite.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { StarComponent } from "./star/star.component";
import { FavoriteService } from "./favorite.service";
import { WhitespaceDirective } from './whitespace.directive';
import { DateTimePipe } from './date-time.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    CapToVarPipe,
    ResultTableComponent,
    AutocompleteDirective,
    DetailsComponent,
    InfoTabComponent,
    PhotosTabComponent,
    MapTabComponent,
    ReviewsTabComponent,
    LoaderComponent,
    ResultContainerComponent,
    FavoriteComponent,
    StarComponent,
    WhitespaceDirective,
    DateTimePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  entryComponents: [
    InfoTabComponent,
    PhotosTabComponent,
    MapTabComponent,
    ReviewsTabComponent
  ],
  providers: [
    GeolocationService,
    SearchService,
    DetailsService,
    WindowRefService,
    LoaderService,
    FavoriteService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
