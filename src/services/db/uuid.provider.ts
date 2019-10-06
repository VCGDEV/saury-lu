import uuid  from 'uuid/v4';
import {Injectable} from "@angular/core";

@Injectable()
export class UuidProvider {
  id(): string {
    return uuid();
  }
}
