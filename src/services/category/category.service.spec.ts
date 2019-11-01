import { CategoryService } from "./category.service";
import { Category} from "../model/category";
import { UuidProvider} from "../db/uuid.provider";
import { Observable} from "rxjs";
import {DBError} from "../db/db.error";

describe('CategoryService', () =>{
  let dbSpy, querySpy, dbSpyErr, querySpyErr, idSpy, parseDataSpy, getSpy;
  let categoryService: CategoryService;
  let errCategoryService: CategoryService;
  let idProviderSpy: UuidProvider;
  let translateSpy;
  let errors;
  beforeAll(() => {
    const categories = [
        {'category_id': '1', 'category_name': 'example', 'image_file': '', 'is_active': 'true'}
    ];
    const catRes = { res: { rows: categories}};
    const item = jest.fn().mockImplementation((idx: number) => catRes.res.rows[idx]);

    const result = {
      length: catRes.res.rows.length,
      item: item
    };

    const errCategories = {dbErrors: {
      selectError: new DBError('001','Could not get result from DB'),
        noResults: new DBError('002','No records were found in DB'),
        multipleResults: new DBError('003','Multiple records were found for your query'),
        insertError: new DBError('004','Could not save object into DB'),
        updateError: new DBError('005','Could not update object into DB')
    },
    validations: {
      emptyId: new  DBError('100','Id should not be empty'),
        categoryNameEmpty: new  DBError('101','Category name should not be empty'),
        categoryStatus: new  DBError('102','Category should be set as active or inactive'),
        nullObject: new  DBError('103','Value should not be null'),
    } };

    querySpy = jest.fn().mockImplementation(() => Promise.resolve(catRes));
    querySpyErr = jest.fn().mockImplementation(() => Promise.reject(false));
    parseDataSpy = jest.fn().mockImplementation(() => result);
    getSpy = jest.fn().mockImplementation((key: string) =>
      Observable.create(observer => {
        let result = undefined;
        if(key.indexOf('validations') != -1) {
          result = errCategories.validations[key.split(".")[1]];
        } else {
          result = errCategories.validations[key.split(".")[1]];
        }
        if(result && result.length == 1) {

          observer.next(result[0]);
        }
      })
    );
    idSpy = jest.fn().mockImplementation(() => new Date().getTime().toString());
    dbSpy = {
      query: querySpy,
      parseData: parseDataSpy,
      update: jest.fn().mockImplementation(() => Promise.resolve(true))
    };

    dbSpyErr = {
      query : querySpyErr,
      parseData: parseDataSpy,
      update: jest.fn().mockImplementation(() => Promise.reject(false))
    };

    idProviderSpy = {
      id : idSpy
    };

    translateSpy = { get: getSpy };

    categoryService = new CategoryService(dbSpy, idProviderSpy, translateSpy);
    errCategoryService = new CategoryService(dbSpyErr, idProviderSpy, translateSpy);

    this.errors = categoryService.errors;
  });

  it('save new category into db',() => {
    const category = new Category();
    category.categoryName = 'example';
    category.categoryId = 'cat-uuid';
    category.imageFile = 'food.png';
    category.isActive = true;
    const promise = categoryService.save(category);
    expect.assertions(1);
    promise.then(res => expect(res).toBeTruthy());
  });

  it('return validation errors',() => {
    const category = new Category();
    category.categoryName = '';
    category.categoryId = 'cat-uuid';
    category.imageFile = '';
    category.isActive = undefined;
    const promise = categoryService.save(category);
    const errors = [new DBError('101',`Category name should not be empty`),
                  new DBError('102',`Category should be set as active or inactive`)];
    expect.assertions(1);
    promise.catch(err => expect(err).toEqual(errors));
  });

  it('fail on database insert',() => {
    const category = new Category();
    category.categoryName = 'some category';
    category.categoryId = 'cat-uuid';
    category.imageFile = '';
    category.isActive = false;

    const promise = errCategoryService.save(category);

    expect.assertions(1);
    promise.catch(err => {
      expect(err).toEqual({ error: this.errors.dbErrors.insertError });
    });
  });

  it('should return categories array in promise', () => {
    expect.assertions(1);
    const category = new Category();
    category.categoryId='1';
    category.categoryName='example';
    const categories = [category];
    const promise = categoryService.findAll();
    promise.then((res) => expect(res).toEqual(categories));
  });

  it(`should have validation errors`, () => {
    const category = new Category();
    category.isActive = undefined;

    const errors = [
      new DBError('100',`Id should not be empty`),
      new DBError('101',`Category name should not be empty`),
      new DBError('102',`Category should be set as active or inactive`)];

    const promise = categoryService.update(category);

    expect.assertions(1);

    promise.catch(res => expect(res).toEqual(errors));
  });


  it(`should update category`, () => {
    const category = new Category();
    category.categoryId = '1';
    category.categoryName = 'example';

    const promise = categoryService.update(category);

    expect.assertions(1);
    promise.then(res => expect(res).toEqual(category));
  });

});
