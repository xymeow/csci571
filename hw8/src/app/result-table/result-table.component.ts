import { Component, OnInit, HostBinding } from '@angular/core';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit {
  
  // @HostBinding('class.show')
  showResult = false;
  resultJson = null;
  nextPage = '';
  // resultJson = [{
  //  'icon': '',
  //   'name': 'aaa',
  //   'vicinity': 'bbb'
  // },{
  //   'icon': '',
  //    'name': 'aaa',
  //    'vicinity': 'bbb'
  //  },{
  //   'icon': '',
  //    'name': 'aaa',
  //    'vicinity': 'bbb'
  //  }];

  constructor(
    private sService: SearchService
  ) {
    this.sService.resultJson$.subscribe(data => {
      console.log(data);
      this.resultJson = data["results"];
      this.nextPage = data["next_page_token"];
      this.showResult = true;
    })
   }

  getNextPage() {
    
  }

  ngOnInit() {
    // this.sService.change.subscribe(showResult => {
    //   this.showResult = showResult;
    // })
  }

}
