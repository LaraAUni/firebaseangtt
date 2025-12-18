import { Injectable } from '@angular/core';
import { Sidebids } from '../../../public/data/sidebids';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  protected idList: Sidebids[] = []
  //ids.json andrebbe qui
  constructor() { }
  getAllIds(): Sidebids[] {return this.idList}
}
