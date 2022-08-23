import { Component, OnInit, } from '@angular/core';

import { valuteI } from 'src/app/interfaces/valuteI';
import { ValutService } from 'src/app/services/valute.service';

@Component({
  selector: 'avc-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  valute: valuteI[] = [];
  valuteEur: number = 0;
  valuteUsd: number = 0;
  userInp: number = 0;
  userRes: number = 0;
  convFrom: string = 'UAH';
  convTo: string = 'UAH'
  constructor(
    private valuteService: ValutService) {}
      
  ngOnInit(): void {
    this.valuteService.getValuteData().subscribe((data: valuteI[]) => {
      this.valute = data;
    })
    this.valuteService.getCurValuteObj('EUR').subscribe((obj: valuteI) => this.valuteEur = +obj.buy)
    this.valuteService.getCurValuteObj('USD').subscribe((obj: valuteI) => this.valuteUsd = +obj.buy)
  }

  getUserInp(e: Event): void{
    let cur = e.target as HTMLInputElement
    this.userInp = +cur.value;
    let filtered = this.valute.filter((el) => el.ccy === this.convFrom)[0];
    this.convertFromLogic(filtered.buy)
  }

  getUserInpRes(e: Event): void{
    let cur = e.target as HTMLInputElement
    this.userRes = +cur.value;
    let filtered = this.valute.filter((el) => el.ccy === this.convTo)[0];
    this.convertToLogic(filtered.buy)
  }

  
  convertFrom(e: Event): void{
    let cur = e.target as HTMLSelectElement;
    let option = cur.options[cur.selectedIndex].value;
    this.convFrom = option
    let filtered = this.valute.filter((el) => el.ccy === this.convFrom)[0];
    this.convertFromLogic(filtered.buy)
  }

  convertTo(e: Event): void{
    let cur = e.target as HTMLSelectElement;
    let option = cur.options[cur.selectedIndex].value;
    this.convTo = option
    let filtered = this.valute.filter((el) => el.ccy === this.convTo)[0]
    this.convertToLogic(filtered.buy)
  }


  private convertToLogic(coef: number): void{
    if(this.convFrom === this.convTo){
      this.userInp = this.userRes
    } 
    else if(this.convFrom === 'EUR' && this.convTo === 'USD'){
      this.userInp = +(this.userRes * (this.valuteEur / this.valuteUsd)).toFixed(2)
    }
    else if(this.convFrom === 'USD' && this.convTo === 'EUR'){
      this.userInp = +(this.userRes * (this.valuteUsd / this.valuteEur)).toFixed(2)
    }
    else {
      this.userInp = this.userRes * coef
    }
  }

  private convertFromLogic(coef: number): void{
    if(this.convFrom === this.convTo){
      this.userRes = this.userInp
    }
    else if(this.convFrom === 'EUR' && this.convTo === 'USD'){
      this.userRes = +(this.userInp * (this.valuteEur / this.valuteUsd)).toFixed(2)
    }
    else if(this.convFrom === 'USD' && this.convTo === 'EUR'){
      this.userRes = +(this.userInp * (this.valuteUsd / this.valuteEur)).toFixed(2)
    }
    else {
      this.userRes = this.userInp * coef
    }
  }
}
