import {ProviderService} from "./provider.service";
import {Observable} from "rxjs";
import {UuidProvider} from "../db/uuid.provider";
import {Provider} from "../model/provider";

describe('ProviderService', () => {

  const providers = [{'provider_id': 'prov-1', 'description': 'A provider name', 'is_active': 'true'}];
  const providersResult = { res: { rows: providers } };
  let providerService: ProviderService;
  let providerErrorService: ProviderService;
  let idProviderSpy: UuidProvider;
  let dbSpy, dbErrorSpy;
  let getKeySpy, translateSpy;
  let errors: any;
  beforeAll(() => {

    const item = jest.fn().mockImplementation((idx: number) => providersResult.res.rows[idx]);

    const result = {
      length: providersResult.res.rows.length,
      item: item
    };

    // translate service, return same value
    getKeySpy = jest.fn().mockImplementation((key: string | Array<string>, interpolateParams?: Object) =>
      Observable.create(observer => observer.next(key))
    );
    translateSpy = { get: getKeySpy };

    // db mock methods
    dbSpy = {
      query: jest.fn().mockImplementation(() => Promise.resolve(providersResult)),
      save: jest.fn().mockImplementation(() => Promise.resolve(true)),
      update: jest.fn().mockImplementation(() => Promise.resolve(true)),
      parseData: jest.fn().mockImplementation(() => result),
      findOne: jest.fn().mockImplementation(() => Promise.resolve(providersResult))
    };

    dbErrorSpy = {
      query: jest.fn().mockImplementation(() => Promise.reject({err: 'Error'})),
      save: jest.fn().mockImplementation(() => Promise.reject({err: 'Error'})),
      update: jest.fn().mockImplementation(() => Promise.reject({err: 'Error'})),
      parseData: jest.fn().mockImplementation(() => result),
      findOne: jest.fn().mockImplementation(() => Promise.reject({err: 'Error'}))
    };

    //uuid mock
    idProviderSpy = { id: jest.fn().mockImplementation(() => new Date().getTime().toString()) };

    providerService = new ProviderService(dbSpy, idProviderSpy, translateSpy);
    errors = providerService.errors;
    providerErrorService = new ProviderService(dbErrorSpy, idProviderSpy, translateSpy);
  });

  it('Should return all providers from database', () => {
      expect.assertions(1);

      const provider: Provider = new Provider();
      provider.description = 'A provider name';
      provider.isActive = true;
      provider.providerId = 'prov-1';

      const promise = providerService.findAll();

      promise.then(result => expect(result).toEqual([provider]));

  });

  it('Should fail db access', () => {
    expect.assertions(1);
    providerErrorService.findAll()
      .catch(err => expect(err).toEqual({ error: errors.dbErrors.selectError }));
  });

  it('Should find the Provider using Id', () => {
    expect.assertions(1);
    const provider: Provider = new Provider();
    provider.description = 'A provider name';
    provider.isActive = true;
    provider.providerId = 'prov-1';

    const promise = providerService.findById('prov-1');
    promise.then(result => expect(result).toEqual(provider));

  });

  it('Should fail db access when searching by id', () => {
    expect.assertions(1);
    providerErrorService.findById('prov-1')
      .catch(err => expect(err).toEqual({ error: errors.dbErrors.selectError }));
  });

  it('Should fail db access when searching by empty id', () => {
    expect.assertions(1);
    providerErrorService.findById('    ')
      .catch(err => expect(err).toEqual({ error: errors.validations.emptyId }));
  });

});
