import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { valuteI } from '../interfaces/valuteI';
import { Observable, map} from 'rxjs';

export type curValuteObj = 'USD' | 'EUR' | 'UAH';

@Injectable({
  providedIn: 'root'
})
export class ValutService {

  

  constructor(private http: HttpClient) {}

  getValuteData(): Observable<valuteI[]>{
    return this.http.get<valuteI[]>('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')
      .pipe(
        map((data: valuteI[]) => {
          let obj = {ccy: 'UAH', base_ccy: 'UAH', buy: 1, sale: 1}
          data.push(obj)
          return data
        })
    )
  }

  getCurValuteObj(valute: curValuteObj): Observable<valuteI>{
    return this.getValuteData().pipe(
      map((el: valuteI[]) => 
        el.filter((el: valuteI) => {
          return el.ccy === valute
        })[0])
    )
  }



  
}
