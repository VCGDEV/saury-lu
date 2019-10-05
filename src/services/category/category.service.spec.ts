import {CategoryService} from "./category.service";
import {Category} from "../model/category";

describe('CategoryService', () =>{
  let dbSpy, querySpy, dbSpyErr, querySpyErr;
  let categoryService: CategoryService;
  let errCategoryService: CategoryService;
  beforeEach(() => {
    querySpy = jest.fn().mockImplementation(() => Promise.resolve(true));
    querySpyErr = jest.fn().mockImplementation(() => Promise.reject(false));

    dbSpy = {
      query: querySpy
    };

    dbSpyErr = {
      query : querySpyErr
    };

    categoryService = new CategoryService(dbSpy);
    errCategoryService = new CategoryService(dbSpyErr);
  });

  it('save new category into db',() => {
    const category = new Category();
    category.categoryName = 'Food';
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
    const errors = [`Category name should not be empty`,
                  `Category should be set as active or inactive`];
    expect.assertions(1);
    promise.catch(err => {
      expect(err).toEqual(errors);
    });
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
      expect(err).toEqual(false);
    });
  });

});
