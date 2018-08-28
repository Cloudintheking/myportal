import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatSelectChange} from '@angular/material';
import {BackApiService} from '../../../service/back-api.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AddConfirmDialogComponent} from '../../../common-components/add-confirm-dialog/add-confirm-dialog.component';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-add-home-dialog',
  templateUrl: './add-zone-dialog.component.html',
  styleUrls: ['./add-zone-dialog.component.css']
})
export class AddZoneDialogComponent implements OnInit {

  homeMoudelForm: FormGroup; // 模块表单数据
  titleLevel1: Observable<any>; // 一级栏目组
  titleTree: Observable<any>; // 栏目树
  levelON_OFF: Boolean = true; // 栏目等级开关
  doConfirm: EventEmitter<any> = new EventEmitter<any>(); // 确认信号
  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialog: MatDialog, private homeApi: BackApiService) {
    this.homeMoudelForm = new FormBuilder().group({
      id: [],
      name: [],
      articleType: [],
      moduleType: [],
      flex: [],
      pos: [],
      hide: [true],
      showTypeLevel: [],
      route: []
    });
  }

  ngOnInit() {
    this.titleLevel1 = this.homeApi.getTitlesByLevel('1').map(res => res.data);
    this.titleTree = this.homeApi.getTitlesTree({navBar: false}).map(res => res.data);
    if (this.data.id) { // 传id时
      this.homeApi.getModuleByID(this.data.id)
        .map(res => {
          if (res.data.articleTypeVo) {
            res.data.articleTypeVo = res.data.articleTypeVo.id;
          }
          return res;
        })
        .subscribe(
          result => {
            if (result.status === 1) {
              this.homeMoudelForm = new FormBuilder().group({
                id: [result.data.id],
                name: [result.data.name],
                articleType: [result.data.articleTypeVo],
                moduleType: [result.data.moduleType],
                flex: [result.data.flex],
                pos: [result.data.pos],
                hide: [!result.data.hide],
                showTypeLevel: [result.data.showTypeLevel]
              });
              if (result.data.showTypeLevel === 1) {
                this.levelON_OFF = true;
              } else {
                this.levelON_OFF = false;
              }
            } else {
              this.dialog.closeAll();
              this.dialog.open(AddConfirmDialogComponent, {
                width: '50%',
                data: {
                  message: result.message
                }
              });
            }
          },
          error1 => {
            this.dialog.closeAll();
            this.dialog.open(AddConfirmDialogComponent, {
              width: '50%',
              data: {
                message: error1.message
              }
            });
          }
        );
    }
  }

  /**
   * 提交表单数据
   */
  doPost() {
    if (!this.homeMoudelForm.valid) {
      return;
    }
    this.homeMoudelForm.value.hide = !this.homeMoudelForm.value.hide; // 取反
    console.log('首页模块表单提交数据', this.homeMoudelForm.value);
    if (this.data.id) { // 更新首页模块
      this.homeApi.updateModule(this.homeMoudelForm.value).subscribe(
        success => {
          this.dialog.open(AddConfirmDialogComponent, {
            width: '50%',
            data: {
              message: success.message
            }
          });
        },
        error1 => {
          this.dialog.open(AddConfirmDialogComponent, {
            width: '50%',
            data: {
              message: error1.message
            }
          });
        },
        () => {
          this.doConfirm.emit(); // 发送确认信号
        }
      );
    } else { // 新增首页模块
      this.homeApi.addModule(this.homeMoudelForm.value).subscribe(
        success => {
          this.dialog.open(AddConfirmDialogComponent, {
            width: '50%',
            data: {
              message: success.message
            }
          });
        },
        error1 => {
          this.dialog.open(AddConfirmDialogComponent, {
            width: '50%',
            data: {
              message: error1.message
            }
          });
        },
        () => {
          this.doConfirm.emit();
        }
      );
    }
    this.dialog.closeAll();
  }

  /**
   * 等级开关
   * @param $event
   */
  levelOnOff($event: MatSelectChange) {
    console.log($event);
    if ($event.value === 1) {
      this.levelON_OFF = true;
    } else {
      this.levelON_OFF = false;
    }
  }
}
