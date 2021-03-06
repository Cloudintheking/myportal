///<reference path="../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BackApiService} from '../../service/back-api.service';
import 'rxjs/add/operator/map';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-title',
  templateUrl: './front-menu.component.html',
  styleUrls: ['./front-menu.component.css']
})
export class FrontMenuComponent implements OnInit {
  categories: Observable<any>; // 栏目组

  constructor(private categoryApi: BackApiService, private  router: Router, private routeInfo: ActivatedRoute) {
  }

  ngOnInit() {
    this.categories = this.categoryApi.getCategoriesAnon({level: 1, show: true}).map(res => res.data);
  }

  /**
   *  栏目id分发
   * @param title
   * @param index 索引(仅仅用于路由刷新)
   */
  showTitle(title) {
    this.router.navigate([title.route], {
      queryParams: {
        L1: title.id,
        L2: title.id
      },
      skipLocationChange: false
    });
  }
}
