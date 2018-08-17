import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from 'environments/environment';

/**
 * @author hl
 * @date 2018/8/2
 * @Description: 后台管理API
 */
@Injectable()
export class BackApiService {
  baseUrl = environment.baseUrl; // CMS系统接口域名
  fileUrl = environment.fileUrl; // 文件系统接口域名
  articleIdEmitter: EventEmitter<number> = new EventEmitter<number>(); // 文章id分发器
  froalaOptions: object; // 富文本配置

  constructor(private  http: HttpClient) {
    this.froalaOptions = {
      placeholder: 'Edit Me',
      imageMaxSize: 1024 * 1024 * 3, // 图片限制3M
      imageUploadURL: this.fileUrl + '/japi/filesystem/upload',
      imageUploadParams: {
        viewByAnon: true,
        longLife: true,
        maxFileSize: 3145728
      },
      fileMaxSize: 1024 * 1024 * 20, // 文件限制20M
      fileUploadURL: this.fileUrl + '/japi/filesystem/upload',
      fileUploadParams: {
        viewByAnon: true,
        longLife: true,
        maxFileSize: 20971520
      },
      videoMaxSize: 1024 * 1024 * 400, // 视频限制400M
      videoUploadURL: this.fileUrl + '/japi/filesystem/upload',
      videoUploadParams: { // 上传参数
        viewByAnon: true,
        longLife: true,
        maxFileSize: 419430400
      },
      events: {
        'froalaEditor.focus': function (e, editor) {
          console.log(editor.html.get());
        },
        'froalaEditor.image.removed': function (e, editor, img) {
          const src = img.attr('src');
          const index = src.indexOf('?id='); // 获取文件id
          const deleteUrl = this.fileUrl + '/japi/filesystem/delete' + '?fileid=' + src.slice(index + 4);  // 拼接url
          $.ajax({
            method: 'POST',
            url: deleteUrl
          })
            .done((data11) => {
              console.log('image was deleted');
            })
            .fail((err) => {
              console.log('image deleteArticle problem: ' + JSON.stringify(err));
            });
        },
        'froalaEditor.file.unlink': function (e, editor, link) {
          const src = link.getAttribute('href');
          const index = src.indexOf('?id='); // 获取文件id
          const deleteUrl = this.fileUrl + '/japi/filesystem/delete' + '?fileid=' + src.slice(index + 4);  // 拼接url
          $.ajax({
            method: 'POST',
            url: deleteUrl
          })
            .done(function (data1) {
              console.log('file was deleted');
            })
            .fail(function (err) {
              console.log('file deleteArticle problem: ' + JSON.stringify(err.message));
            });
        },
        'froalaEditor.video.removed': function (e, editor, video) {
          const src = video.getAttribute('src');
          const index = src.indexOf('?id='); // 获取文件id
          const deleteUrl = this.fileUrl + '/japi/filesystem/delete' + '?fileid=' + src.slice(index + 4);  // 拼接url
          $.ajax({
            method: 'POST',
            url: deleteUrl
          })
            .done(function (data2) {
              console.log('file was deleted');
            })
            .fail(function (err) {
              console.log('file deleteArticle problem: ' + JSON.stringify(err));
            });
        }
      }
    };
  }

  /**
   *  文件上传
   * @param {FormData} file 文件数据
   * @param {any} params 上传参数
   * @returns {Observable<any[]>} 返回文件路径数组流
   */
  uploadFile(file: FormData, params: any): Observable<any> {
    const header: HttpHeaders = new HttpHeaders();
    header.append('Content-Type', undefined);
    return this.http.post(this.fileUrl + '/japi/filesystem/upload', file, {
      headers: header,
      params: params
    });
  }

  /**********************logo管理api******************************/

  /**********************栏目管理api******************************/
  /**
   * 根据查询参数获取栏目信息
   * @returns {Observable<any>}
   */
  getAllTitles(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/article/type/getBy', params);
  }

  /**
   * 根据id查询栏目
   * @param {string} id
   * @returns {Observable<Object>}
   */
  getTitleById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + '/japi/cms/article/type/getById', {
      params: {
        typeID: id
      }
    });
  }

  /**
   * 根据分类等级获取栏目
   * @param {string} level
   */
  getTitlesByLevel(level: string): Observable<any> {
    const header: HttpHeaders = new HttpHeaders();
    header.append('Access-Control-Allow-Origin', '*');
    return this.http.get(this.baseUrl + '/japi/cms/article/type/getByLevel', {
      params: {
        level: level
      }
    });
  }

  /**
   * 获取栏目树形结构
   * @param params
   * @returns {Observable<any>}
   */
  getTitlesTree(params: any): Observable<any> {
    return this.http.get(this.baseUrl + '/japi/cms/article/type/getTree', {
      params: params
    });
  }

  /**
   * 新增栏目
   * @param {HttpParams} params
   * @returns {Observable<any>} 返回成功消息、栏目id等
   */
  addTitle(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/article/type/newType', params);
  }

  /**
   * 更新栏目信息
   * @param {HttpParams} params
   * @returns {Observable<any>}
   */
  updateTitle(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/article/type/update', params);
  }

  /**
   * 删除对应栏目信息
   * @param {any} params{typeID(栏目ID),toID(文章移动栏目ID)}
   * @returns {Observable<any>}
   */
  deleteTitle(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/article/type/deleteAndMoveTo', params);
  }

  /**********************首页模块管理api******************************/
  /**
   *多条件查询首页模块信息
   * @param params
   * @returns {Observable<any>}
   */
  getModules(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/module/getBy', params);
  }

  /**
   * 根据id查询首页模块信息
   * @param {string} id
   * @returns {Observable<any>}
   */
  getModuleByID(id: string): Observable<any> {
    return this.http.get(this.baseUrl + '/japi/cms/module/getById', {
      params: {
        id: id
      }
    });
  }

  /**
   * 新增首页模块
   * @param params
   * @returns {Observable<any>}
   */
  addModule(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/module/new', params);
  }

  /**
   * 更新首页模块
   * @param params
   * @returns {Observable<any>}
   */
  updateModule(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/module/update', params);
  }

  /**
   * 根据id首页模块
   * @param {string} id
   * @returns {Observable<any>}
   */
  deleteModule(id: string): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/module/deleteArticle', null, {
      params: {id: id}
    });
  }

  /**********************文章管理api******************************/

  /**
   * 获取文章列表
   * @param params
   * @returns {Observable<any>}
   */
  getArticles(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/article/getBy', params);
  }

  /**
   * 根据文章id获取对应文章信息
   * @param {string} id
   * @returns {Observable<any>}
   */
  getArticleById(id: string): Observable<any> {
    return this.http.get(this.baseUrl + '/japi/cms/article/get', {
      params: {articleID: id}
    });
  }

  /**
   * 新增文章内容
   * @param data
   * @returns {Observable<any>}
   */
  addArticle(data: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/article/new', data);
  }

  /**
   * 更新文章内容
   * @param data
   * @returns {Observable<any>}
   */
  updateArticle(data: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/article/update', data);
  }

  /**
   * 根据id删除文章
   * @param {string} id
   * @returns {Observable<any>}
   */
  deleteArticleByID(id: string): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/article/delete', null, {
      params: {
        articleID: id
      }
    });
  }

  /**********************脚注管理api******************************/
  /**
   * 查询链接组
   * @returns {Observable<any>}
   */
  getLinkGroup(): Observable<any> {
    return this.http.get(this.baseUrl + '/japi/cms/tailLinkGroup/getAll');
  }

  /**
   * 新增链接组标签
   * @param params
   * @returns {Observable<any>}
   */
  addLinkGroup(params: any): Observable<any> {
    return this.http.post(this.baseUrl + '/japi/cms/tailLinkGroup/new', null, {
      params: params
    });
  }
}
