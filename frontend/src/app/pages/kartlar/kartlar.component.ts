import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import {ActivatedRoute} from "@angular/router"

@Component({
  selector: 'app-kartlar',
  templateUrl: './kartlar.component.html',
  styleUrls: ['./kartlar.component.css']
})
export class KartlarComponent implements OnInit {

  constructor(private service: ApiService, private router:ActivatedRoute) { }

  kartlar:any;
  id:any;

  errorMsg:any;
  tableSuccessMsg:any
  formSuccessMsg:any
  dataExist:boolean

  isAddForm = true;

  ngOnInit(): void {

    this.id = this.router.snapshot.paramMap.get("id"); // adres cubugundaki id degerini aldik

    if(this.id){
      this.isAddForm = false; // eger id degeri varsa update formu gosterilecek

      this.service.getDataUpdateCard(this.id).subscribe(res => {
        // eger id degeri varsa guncellenecek veriyi forma at
        /*
        params:
        res:any -> api den gelen veridir. res.data =
        {
          id:any,
          kart_sahibi:any,
          kart_turu:any
        }
        */

        this.updateForm.controls["id"].setValue(res.data.id);
        this.updateForm.controls["kart_sahibi"].setValue(res.data.kart_sahibi);
        this.updateForm.controls["kart_turu"].setValue(res.data.kart_turu);
      })
    }
    else{
      this.isAddForm = true;
    }

    // get cards data
    this.service.getKartlar().subscribe((res) => {
      /**
       * params:
       * res:any -> api den gelen veridir. res.data =
       * {
       *    id:any,
       *    kart_sahibi:any,
       *    kart_turu:any
       * }
       */
      this.kartlar = res.data;

      this.dataExist = this.kartlar == undefined
    })
  }

  addForm = new FormGroup({
    "id": new FormControl("", Validators.required),
    "kart_sahibi": new FormControl("", Validators.required),
    "kart_turu": new FormControl("", Validators.required)
  })

  updateForm = new FormGroup({
    "id": new FormControl("", Validators.required),
    "kart_sahibi": new FormControl("", Validators.required),
    "kart_turu": new FormControl("", Validators.required)
  })

  searchForm = new FormGroup({
    "searchTerm": new FormControl(""),
    "filter": new FormControl("")
  })

  onAdd(){
    if(this.addForm.valid){
      // t??m bile??enler dolu devam et

      this.service.addKart(this.addForm.value).subscribe((res) => {
        this.service.getKartlar().subscribe((res) => {
          this.kartlar = res.data;
          this.addForm.reset();
          this.formSuccessMsg = "Kart Ba??ar??yla Eklendi";
        })
      })

      this.errorMsg = "";
      this.formSuccessMsg = "";
    }
    else{
      this.errorMsg = "L??tfen t??m bile??enleri doldurunuz";
    }
  }

  onUpdate(){
    console.log(this.updateForm.value);
    if(this.updateForm.valid){
      // tum degerler dolu ise guncellemeyi gerceklestir.
      this.service.updateCard(this.id, this.updateForm.value).subscribe(res => {
        window.location.href = "http://localhost:4200/kartlar";
      })

      this.errorMsg = "";
      this.formSuccessMsg = "";
    }
    else{
      this.errorMsg = "L??fen t??m bile??enleri doldurunuz";
    }
  }

  deleteKart(id:any){
    this.service.deleteKart(id).subscribe(res => {
      this.service.getKartlar().subscribe(res => {
        this.kartlar = res.data;
        this.tableSuccessMsg = "Kay??t Ba??ar??yla Silindi";
      })
    })

    this.tableSuccessMsg = "";
  }

  searchKart(){
    this.service.searchKart(this.searchForm.value).subscribe(res => {
      this.kartlar = res.data
    })
  }

}
