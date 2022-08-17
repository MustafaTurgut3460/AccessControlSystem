import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-erisim-noktalari',
  templateUrl: './erisim-noktalari.component.html',
  styleUrls: ['./erisim-noktalari.component.css']
})
export class ErisimNoktalariComponent implements OnInit {

  constructor(private service: ApiService, private router:ActivatedRoute) { }

  erisim_noktalari:any;
  mac:string;

  errorMsg:any;
  tableSuccessMsg:any;
  formSuccessMsg:any
  dataExist:boolean

  infoForm = false;

  isAddForm = true; // eger ekleme formu gorunecekse true diger durumda false

  ngOnInit(): void {
    this.mac = this.router.snapshot.paramMap.get("id")

    if(this.mac){
      this.isAddForm = false;

      // fill the update form
      this.service.getSingleData(this.mac).subscribe(res => {

        this.updateForm.setValue({
          "mac": res.data.mac,
          "kapi_ismi": res.data.kapi_ismi,
          "erisim": res.data.erisim,
          "baslangic_saat": res.data.baslangic_saat,
          "bitis_saat": res.data.bitis_saat,
          "gunler": res.data.gunler
        })
      })
    }
    else{
      this.isAddForm = true;
    }

    this.service.getErisimNoktalari().subscribe((res) => {
      this.erisim_noktalari = res.data;

      this.dataExist = this.erisim_noktalari == undefined
    })
  }

  addForm = new FormGroup({
    "mac": new FormControl("", Validators.required),
    "kapi_ismi": new FormControl("", Validators.required),
    "erisim": new FormControl("", Validators.required),
    "baslangic_saat": new FormControl("", Validators.required),
    "bitis_saat": new FormControl("", Validators.required),
    "gunler": new FormControl("", Validators.required)
  });

  updateForm = new FormGroup({
    "mac": new FormControl("", Validators.required),
    "kapi_ismi": new FormControl("", Validators.required),
    "erisim": new FormControl("", Validators.required),
    "baslangic_saat": new FormControl("", Validators.required),
    "bitis_saat": new FormControl("", Validators.required),
    "gunler": new FormControl("", Validators.required)
  });

  searchForm = new FormGroup({
    "searchTerm": new FormControl(""),
    "filter": new FormControl("")
  })

  onAdd(){
    if(this.addForm.valid){
      // tüm bileşenler doldurulmuş devam edebilirsin
      this.service.addErisimNoktasi(this.addForm.value).subscribe((res) => {
        // verileri tekrar çağıyoruz
        console.log("Burası çalıştı")
        this.service.getErisimNoktalari().subscribe((res) => {
          this.erisim_noktalari = res.data;
          this.addForm.reset();
          this.formSuccessMsg = "Erişim Noktası Başarıyla Eklendi"
        });
      })

      this.errorMsg="";
      this.formSuccessMsg="";
    }
    else{
      this.errorMsg = "Lütfen tüm bileşenleri doldurunuz";
    }
  }

  onUpdate(){
    if(this.updateForm.valid){
      // tüm bilesenler dolu guncelleme yap
      this.service.updateErisimNoktasi(this.mac, this.updateForm.value).subscribe(res => {
        window.location.href = "http://localhost:4200/erisim-noktalari";
      })
    }
    else{
      this.errorMsg = "Lütfen tüm bileşenleri doldurunuz"
    }
  }

  // delete

  deleteErisimNoktasi(id:any)
  {
    this.service.deleteErisimNoktasi(id).subscribe(res => {
      this.service.getErisimNoktalari().subscribe(res => {
        this.erisim_noktalari = res.data;
        this.tableSuccessMsg = "Kayıt Başarıyla Silindi";
      })
    })

    this.tableSuccessMsg = "";
  }


  searchErisimNoktasi(){
    this.service.searchErisimNoktasi(this.searchForm.value).subscribe(res => {
      this.erisim_noktalari = res.data
    })
  }

  showInfo(){
    this.infoForm = !this.infoForm;
  }

}
