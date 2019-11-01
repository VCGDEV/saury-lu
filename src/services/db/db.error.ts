
export class DBError {
  constructor(private _code: string,
              private _description: string){}

  get code(): string {
    return this._code;
  }

  set code(cd: string) {
    this._code = cd;
  }

  get description(): string {
    return this._description;
  }

  set description(desc: string) {
    this._description = desc;
  }

  public toString (): string {
    return `{ "code": "${this._code}", "description": "${this._description}" }`;
  }
}
