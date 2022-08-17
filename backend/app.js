const app = require("express")();
const bodyParser = require("body-parser");
const mqtt = require("mqtt");
const cors = require("cors");

const firebase = require("./db");
const firestore = firebase.firestore();

const http = require("http").createServer(app);
const io = require("socket.io")(http);

require("dotenv").config();

// yeni bir erisim geldiginde porta gonderilecek veriyi tanimladik
let newAccessData = {
    kart_sahibi: "",
    kart_id: "",
    zaman: "",
    kapi_mac: "",
    kapi_ismi: "",
    durum: false,
    mesaj: ""
}


app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const routes = require("./server/routes/routes.js");
app.use("/", routes);

app.use(cors());

var client = mqtt.connect("mqtt://a2.pr14.bakelor.com");

client.on("connect", () => {
    client.subscribe("bakelor/product/pr14/device/wiegand/item")
    console.log("bakelor/product/pr14/device/wiegand/item konusuna abone olundu, veri bekleniyor...");
});

client.on("message", async (topic, message) => {

    /**
     * Bu method mqtt üzerindeki abone olunan konudan bir mesaj geldiginde calisir.
     * params:
     * topic:str -> abone olunan konunun ismini dondurur.
     * message:str -> abone olunan konudan gelen mesaj verisidir.
     */

    var data = JSON.parse(message); // gelen veriyi json formatına donduruyoruz

    console.log(data);

    const timeData = await firestore.collection("time").doc("time").get(); // QR Code 30 saniye kontrolu icin zamanı cekiyoruz

    // Gelen veri:
    /*
    {
        "Host": "AC:0B:FB:56:44:D0",
        "ReaderId": 1,  
        "ContentType": 20,
        "Value": "0001046a",
        "ReadAt": "2022-07-29T08:03:35.5999965Z"
    }
    */

    // sistem zamanını çekiyoruz
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "."
        + (currentdate.getMonth() + 1) + "."
        + currentdate.getFullYear() + "  "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes();


    let kapi_ismi;


    /**
     * variables:
     * result1:query -> kartlar veritabanından istenen karti ariyoruz eger varsa islemlere devam ediyoruz
     * result2:query -> erisim_noktalari veritabanından istenen mac adresli veri var mi, varsa cekiyoruz.
     * result3:query -> kart_erisim veritabanından kart turu ile istenen kartın erisim seviyesini aliyoruz
     */
    const result1 = await firestore.collection("kartlar").doc(data.Value).get();

    if (result1.data() != undefined) {

        const result2 = await firestore.collection("erisim_noktalari").doc(data.Host).get();

        if (result2.data() != undefined) {

            const result3 = await firestore.collection("kart_erisim").where("kart_turu", "==", result1.data().kart_turu).get();

            if (result3 != undefined) {
                result3.forEach(result3 => {

                    var kart_erisim = result3.data().kart_erisim;
                    var kapi_erisim = result2.data().erisim;

                    var durum = "Bilinmiyor";

                    kapi_ismi = result2.data().kapi_ismi;

                    var currentTime = currentdate.getHours() + ":" + currentdate.getMinutes();

                    if (isSuccess(kart_erisim, kapi_erisim, currentTime, result2.data().baslangic_saat, result2.data().bitis_saat, result2.data().gunler, timeData.data().time)) {
                        // erisim basarili
                        durum = "İzin Verildi";
                    }
                    else {
                        durum = "İzin Verilmedi";
                    }


                    const newData = {
                        id: (Math.floor(Math.random() * 10000)).toString(),
                        ad_soyad: result1.data().kart_sahibi,
                        kart_id: data.Value,
                        zaman: datetime,
                        rol: result1.data().kart_turu,
                        durum: durum,
                        kapi: result2.data().kapi_ismi
                    }

                    firestore.collection("erisim_kayitlari").doc(newData.id).set(newData);

                    // kapi acma komutu yolla
                    client.publish("access", "open door")

                    // gunlere gore de veriyi tutuyoruz bugune bir kayit daha ekle
                    updateDayData(getDay(), durum);

                    loadNewAccessData(result1.data().kart_sahibi, data.Value, datetime, data.Host, result2.data().kapi_ismi, durum, "")

                    io.sockets.emit("new_access", newAccessData); // veriyi porta gonder
                    resetNewAccessData();


                });
            }
            else {
                console.log("Kapı Türü tanımlı değil veya hatalı!");
            }
        }
        else {
            console.log("kapi id tanımlı değil")
            loadNewAccessData(result1.data().kart_sahibi, data.Value, datetime, data.Host, "", "", "kapi")

            const eksikData = {
                id: (Math.floor(Math.random() * 10000)).toString(),
                ad_soyad: result1.data().kart_sahibi,
                kart_id: data.Value,
                zaman: datetime,
                mac: data.Host,
                durum: "İzin Verilmedi",
                kapi: "Bilinmiyor"
            }

            firestore.collection("eksik_erisim").doc(eksikData.id).set(eksikData);

            io.sockets.emit("new_access", newAccessData); // veriyi porta gonder
            resetNewAccessData();
        }
    }
    else {
        console.log("kart id tanımlı değil")
        loadNewAccessData("", data.Value, datetime, data.Host, kapi_ismi, "", "kart")

        const eksikData = {
            id: (Math.floor(Math.random() * 10000)).toString(),
            ad_soyad: "Bilinmiyor",
            kart_id: data.Value,
            zaman: datetime,
            mac: data.Host,
            durum: "İzin Verilmedi",
            kapi: "Bilinmiyor"
        }

        firestore.collection("eksik_erisim").doc(eksikData.id).set(eksikData);

        io.sockets.emit("new_access", newAccessData); // veriyi porta gonder
        resetNewAccessData();
    }
});

// socket portumuzu dinliyoruz, ekranda anlik olarak erisimi gostermek icin
http.listen(3000, () => { console.log("3000 portu dinleniyor...") })

// api portumuzu dinliyoruz, backend islemleri icin
app.listen(5000, () => { console.log("5000 portu dinleniyor...") })

// 3000 portuna herhangi bir client baglandi zaman uyari veriyor
io.on("connection", (socket) => {
    console.log("Client connected")
})


let resetNewAccessData = () => {
    /**
     * Bu method json formatındaki datanın icini temizler
     */
    newAccessData.durum = false;
    newAccessData.kapi_ismi = ""
    newAccessData.kapi_mac = ""
    newAccessData.kart_id = ""
    newAccessData.kart_sahibi = ""
    newAccessData.mesaj = ""
    newAccessData.zaman = ""
}

let loadNewAccessData = (kart_sahibi, kart_id, zaman, kapi_mac, kapi_ismi, durum, mesaj) => {
    /**
     * Bu method gonderilen veriler ile bir json formatındaki veriyi gonderilmek uzere doldurur.
     */
    newAccessData.kart_sahibi = kart_sahibi;
    newAccessData.kart_id = kart_id;
    newAccessData.zaman = zaman;
    newAccessData.kapi_mac = kapi_mac;
    newAccessData.kapi_ismi = kapi_ismi;
    newAccessData.durum = durum == "İzin Verildi" // eger izin verildi ise true diger durumda false dondurur.
    newAccessData.mesaj = mesaj
}

var isSuccess = (kart_erisim, erisim, currentTime, startTime, endTime, days, timeData) => {
    /**
     * Bu foknsiyon bazı şartları kontrol ederek geçiş isteğinin sonucunu belirler, olumlu ya da olumsuz olarak.
     * 
     * params:
     * kart_erisim:int, erisim:int -> bu iki degisken karsilastirilarak erisim durumu kontrol edilecek.
     * currentTime:str, startTime:str, endTime:str -> şuanki zamanın bu iki zaman arasında olma durumuna gore izin verilecektir.
     * days:str -> eger bugun bu gunlerin icinde varsa izin verilecektir.
     * timeData:str -> QR Code 30 saniyelik ömrü kontrol edilip ona göre izin verilecektir.
     */
    var result1, result2, result3, result4 = false;

    result1 = kart_erisim >= erisim; // erisim seviyesi yeterli mi?

    //----------------------------------
    // result 2

    // time type = "13:07
    // her birini saat ve dakika olarak bolduk buna gore karsilastirmalar yapilacaktir.
    var [currentHour, currentMinute] = currentTime.split(":");
    var [startHour, startMinute] = startTime.split(":");
    var [endHour, endMinute] = endTime.split(":");

    [currentHour, currentMinute] = [parseInt(currentHour), parseInt(currentMinute)];
    [startHour, startMinute] = [parseInt(startHour), parseInt(startMinute)];
    [endHour, endMinute] = [parseInt(endHour), parseInt(endMinute)];

    if (currentHour > startHour) {
        // şuanki saat daha buyuk
        if (currentHour < endHour) {
            // istenilen zaman araliginda
            result2 = true;
        }
        else if (currentHour == endHour) {

            result2 = currentMinute < endMinute;
        }
        else {
            result2 = false;
        }
    }
    else if (currentHour == startHour) {
        result2 = currentMinute > startMinute;
    }
    else {
        result2 = false;
    }

    //-----------------------------------------------
    // result 3

    var daysArr = days.split("-");
    var weekday = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

    const d = new Date();
    var currentDay = weekday[d.getDay()];

    for (var i = 0; i < daysArr.length; i++) {
        if (currentDay == daysArr[i]) {
            result3 = true;
            break;
        }
    }

    //---------------------------------------------------
    // result 4

    const timestamp = Math.floor(Date.now()/1000);
    result4 = timestamp - timeData < 30;

    console.log(timestamp - timeData);

    return result1 && result2 && result3 & result4;
}

function getDay() {
    const d = new Date();

    var weekday = ["pazar", "pazartesi", "sali", "carsamba", "persembe", "cuma", "cumartesi"];

    return weekday[d.getDay()];
}


async function updateDayData (day, durum) {

    if(durum == "İzin Verildi"){
        const result1 = await firestore.collection("gun_verileri").doc("izin_verildi").get();
        var count;

        switch (day) {
            case "pazartesi":
                count = result1.data().pazartesi;
                firestore.collection("gun_verileri").doc("izin_verildi").update({pazartesi:count+1});
                break;
    
            case "sali":
                count = result1.data().sali;
                firestore.collection("gun_verileri").doc("izin_verildi").update({sali:count+1});
                break
    
            case "carsamba":
                count = result1.data().carsamba;
                firestore.collection("gun_verileri").doc("izin_verildi").update({carsamba:count+1});
                break;
    
            case "persembe":
                count = result1.data().persembe;
                firestore.collection("gun_verileri").doc("izin_verildi").update({persembe:count+1});
                break;
    
            case "cuma":
                count = result1.data().cuma;
                firestore.collection("gun_verileri").doc("izin_verildi").update({cuma:count+1});
                break;
    
            case "cumartesi":
                count = result1.data().cumartesi;
                firestore.collection("gun_verileri").doc("izin_verildi").update({cumartesi:count+1});
                break;
    
            case "pazar":
                count = result1.data().pazar;
                firestore.collection("gun_verileri").doc("izin_verildi").update({pazar:count+1});
                break;
        }
    }
    else{
        const result1 = await firestore.collection("gun_verileri").doc("izin_verilmedi").get();
        var count;

        switch (day) {
            case "pazartesi":
                count = result1.data().pazartesi;
                firestore.collection("gun_verileri").doc("izin_verilmedi").update({pazartesi:count+1});
                break;
    
            case "sali":
                count = result1.data().sali;
                firestore.collection("gun_verileri").doc("izin_verilmedi").update({sali:count+1});
                break
    
            case "carsamba":
                count = result1.data().carsamba;
                firestore.collection("gun_verileri").doc("izin_verilmedi").update({carsamba:count+1});
                break;
    
            case "persembe":
                count = result1.data().persembe;
                firestore.collection("gun_verileri").doc("izin_verilmedi").update({persembe:count+1});
                break;
    
            case "cuma":
                count = result1.data().cuma;
                firestore.collection("gun_verileri").doc("izin_verilmedi").update({cuma:count+1});
                break;
    
            case "cumartesi":
                count = result1.data().cumartesi;
                firestore.collection("gun_verileri").doc("izin_verilmedi").update({cumartesi:count+1});
                break;
    
            case "pazar":
                count = result1.data().pazar;
                firestore.collection("gun_verileri").doc("izin_verilmedi").update({pazar:count+1});
                break;
        }
    }

}