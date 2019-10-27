import {ProviderService} from "./provider.service";
import {Observable} from "rxjs";
import {UuidProvider} from "../db/uuid.provider";
import {Provider} from "../model/provider";

describe('ProviderService', () => {

  const providers = [{'provider_id': 'prov-1', 'description': 'A provider name', 'is_active': 'true'}];
  const providersResult = { res: { rows: providers } };
  let providerService: ProviderService;
  let idProviderSpy: UuidProvider;
  let dbSpy;
  let getKeySpy, translateSpy;
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

    //uuid mock
    idProviderSpy = { id: jest.fn().mockImplementation(() => new Date().getTime().toString()) };

    providerService = new ProviderService(dbSpy, idProviderSpy, translateSpy);
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

});
