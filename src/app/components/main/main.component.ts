import { Component, OnInit, } from '@angular/core';


import { valuteI } from 'src/app/interfaces/valuteI';
import { curValuteObj, ValutService } from 'src/app/services/valute.service';

@Component({
  selector: 'avc-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  valute: valuteI[] = [];
  valuteEur: number = 0;
  valuteUsd: number = 0;
  userInput: any = {userInp: 0, userRes: 0};
  convFrom: string = 'UAH';
  convTo: string = 'UAH'
  constructor(
    private valuteService: ValutService,
) {}
      
  ngOnInit(): void {
    this.valuteService.getValuteData().subscribe((data: valuteI[]) => {
      this.valute = data;
    })
    this.valuteService.getCurValuteObj('EUR').subscribe((obj: valuteI) => this.valuteEur = +obj.buy)
    this.valuteService.getCurValuteObj('USD').subscribe((obj: valuteI) => this.valuteUsd = +obj.buy)
  }

  userInputConvert(e: Event){
    let cur = e.target as HTMLInputElement;
    if(cur.name === 'from'){
      this.userInput.userInp= +cur.value;
      this.convertLogic(this.filtration(this.convFrom) , this.userInput.userInp, cur.name)
    } else {
      this.userInput.userRes = +cur.value;
      this.convertLogic(this.filtration(this.convTo) , this.userInput.userRes, cur.name)
    }
  }

  convertSelect(e: Event){
    let cur = e.target as HTMLSelectElement;
    this.convertSelectLogic(cur)
    if(cur.name === 'selectFrom'){
      this.convertLogic(this.filtration(this.convFrom) , this.userInput.userInp, cur.name)
    } else {
      this.convertLogic(this.filtration(this.convTo) , this.userInput.userRes, cur.name)
    }
  }

  private convertSelectLogic(el: HTMLSelectElement): number{
    let option = el.options[el.selectedIndex].value as curValuteObj;
    if(el.name === 'selectFrom'){
      this.convFrom = option;
      return this.filtration(option)
    } else {
      this.convTo = option;
      return this.filtration(option)
    }
  }

  private filtration(cond: string): number{
    return +this.valute.filter((el) => el.ccy === cond)[0].buy
  }
  
  private convertLogic(coef: number, val: number, condition: string): void{
    
    let key;
    condition === 'from' || condition === 'selecFrom' ? key = 'userRes' : key = 'userInp'

    if(this.convFrom === this.convTo){
      this.userInput[key] = val
    } 
    else if(this.convFrom === 'EUR' && this.convTo === 'USD'){
      this.userInput[key] = +(val* (this.valuteEur / this.valuteUsd)).toFixed(2);
    }
    else if(this.convFrom === 'USD' && this.convTo === 'EUR'){
      this.userInput[key] = +(val * (this.valuteUsd / this.valuteEur)).toFixed(2);
    }
    else {
      this.userInput[key] = val * coef;
    }
  }
}
