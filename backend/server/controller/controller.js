const firebase = require("../../db");
const firestore = firebase.firestore();

const Erisim = require("../../models/erisim");
const ErisimNoktasi = require("../../models/erisim_noktasi");
const Kart = require("../../models/kart");


var countAccess, countAccessPoint, countCard;

// GET  METHODS

exports.viewDashboard = (req, res) => {
    getCountAccess();
    getCountAccessPoint();
    getCountCard();

    var data = {
        countAccess: countAccess,
        countAccessPoint: countAccessPoint,
        countCard: countCard
    }

    res.send({
        message: "Dashboard görüntülendi",
        data: data
    })
}

exports.viewErisimKayitlari = async (req, res) => {

    try {
        const erisimler = await firestore.collection("erisim_kayitlari")
        const data = await erisimler.get();
        const erisimlerArr = [];

        if (data.empty) {
            res.send({message:"Veri bulunamadı"})
        }
        else {
            data.forEach(doc => {
                const erisim = new Erisim(
                    doc.data().id,
                    doc.data().ad_soyad,
                    doc.data().kart_id,
                    doc.data().zaman,
                    doc.data().rol,
                    doc.data().durum,
                    doc.data().kapi
                )

                erisimlerArr.push(erisim);
            });

            res.send({ data: erisimlerArr })
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
}

exports.viewErisimNoktalari = async (req, res) => {
    try {
        const erisim_noktalari = await firestore.collection("erisim_noktalari");
        const data = await erisim_noktalari.get();
        const erisimNoktalariArr = []

        if (data.empty) {
            res.send({ message: "Veri bulunumadı" });
        }
        else {
            data.forEach(doc => {
                const erisimNoktasi = new ErisimNoktasi(
                    doc.data().mac,
                    doc.data().kapi_ismi,
                    doc.data().erisim,
                    doc.data().baslangic_saat,
                    doc.data().bitis_saat,
                    doc.data().gunler
                )
                erisimNoktalariArr.push(erisimNoktasi);
            })

            res.send({ data: erisimNoktalariArr })
        }

    } catch (error) {
        res.send({ message: error.message })
    }
}

exports.viewKartlar = async (req, res) => {
    try {
        const kartlar = await firestore.collection("kartlar");
        const data = await kartlar.get();
        const kartlarArr = [];

        if (data.empty) {
            res.send({ message: "Veri bulunamadı" })
        }
        else {
            data.forEach(doc => {
                const kart = new Kart(
                    doc.data().id,
                    doc.data().kart_sahibi,
                    doc.data().kart_turu
                )

                kartlarArr.push(kart);
            })

            res.send({ data: kartlarArr });
        }

    } catch (error) {
        res.send({ message: error.message })
    }
}

exports.viewIstatistikler = async (req, res) => {

    /**
     * variables:
     * izin_verilenler:data -> veritabanındaki izin verilen erişim sayısı günlere göre.
     * dataIzinVerilen:array -> bu verilerin icine atilacagi array
     * 
     * * izin_verilmeyenler:data -> veritabanındaki izin verilmeyen erişim sayısı günlere göre.
     * dataIzinVerilmeyen:array -> bu verilerin icine atilacagi array
     */

    try {
        const izin_verilenler = await firestore.collection("gun_verileri").doc("izin_verildi").get();
        const dataIzinVerilen = [];

        dataIzinVerilen.push(izin_verilenler.data().pazartesi);
        dataIzinVerilen.push(izin_verilenler.data().sali);
        dataIzinVerilen.push(izin_verilenler.data().carsamba);
        dataIzinVerilen.push(izin_verilenler.data().persembe);
        dataIzinVerilen.push(izin_verilenler.data().cuma);
        dataIzinVerilen.push(izin_verilenler.data().cumartesi);
        dataIzinVerilen.push(izin_verilenler.data().pazar);


        const izin_verilmeyenler = await firestore.collection("gun_verileri").doc("izin_verilmedi").get();
        const dataIzinVerilmeyen = [];

        dataIzinVerilmeyen.push(izin_verilmeyenler.data().pazartesi);
        dataIzinVerilmeyen.push(izin_verilmeyenler.data().sali);
        dataIzinVerilmeyen.push(izin_verilmeyenler.data().carsamba);
        dataIzinVerilmeyen.push(izin_verilmeyenler.data().persembe);
        dataIzinVerilmeyen.push(izin_verilmeyenler.data().cuma);
        dataIzinVerilmeyen.push(izin_verilmeyenler.data().cumartesi);
        dataIzinVerilmeyen.push(izin_verilmeyenler.data().pazar);

        res.send({
            data: [dataIzinVerilen, dataIzinVerilmeyen]
        });

    } catch (error) {
        res.send({message:error.message})
        console.log(error.message)
    }
}

exports.viewUpdatePage = async (req, res) => {

    var mac = req.params.id;

    const doc = await firestore.collection("erisim_noktalari").doc(mac).get();

    res.send({
        message: "Güncelleme sayfasına yönlendirildi",
        data: doc.data()
    })

}

exports.viewUpdateCard = async (req, res) => {

    var id = req.params.id;

    const doc = await firestore.collection("kartlar").doc(id).get();

    res.send({
        data: doc.data()
    })
}

// POST METHODS

exports.addErisimNoktasi = async (req, res) => {

    try {

        const data = req.body;
        await firestore.collection("erisim_noktalari").doc(data.mac).set(data);
        res.send({ message: "Veri eklendi" });

    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.addKart = async (req, res) => {
    try {

        const data = req.body;
        await firestore.collection("kartlar").doc(data.id).set(data);
        res.send({ message: "Veri eklendi" });

    } catch (error) {
        res.status(400).send(error.message);
    }
}

// search methods

exports.findErisim = async (req, res) => {

    const { searchTerm, filter } = req.body
    const erisimRef = firestore.collection("erisim_kayitlari");
    const erisimlerArr = []
    var snapshot;

    if (filter === "") {
        snapshot = await erisimRef.where("ad_soyad", "==", searchTerm).get();
    }
    else {
        snapshot = await erisimRef.where(filter, "==", searchTerm).get();
    }

    if(searchTerm == "")
        snapshot = await erisimRef.get();

    if (snapshot.empty) {
        res.send({ message: "Veri bulunamadı" })
    }
    else {
        snapshot.forEach(doc => {
            const erisim = new Erisim(
                doc.data().id,
                doc.data().ad_soyad,
                doc.data().kart_id,
                doc.data().zaman,
                doc.data().rol,
                doc.data().durum,
                doc.data().kapi
            )

            erisimlerArr.push(erisim);
        })

        res.send({data:erisimlerArr});
    }
}

exports.findErisimNoktasi = async (req, res) => {

    const { searchTerm, filter } = req.body

    const ref = firestore.collection("erisim_noktalari");
    const erisimNoktalariArr = [];
    var snapshot;

    if (filter === "") {
        snapshot = await ref.where("mac", "==", searchTerm).get();
    }
    else {
        snapshot = await ref.where(filter, "==", searchTerm).get();
    }

    if(searchTerm == "")
        snapshot = await ref.get();

    if(snapshot.empty){
        res.send({message:"Veri bulunamadi"});
    }
    else{
        snapshot.forEach(doc => {
            const erisimNoktasi = new ErisimNoktasi(
                doc.data().mac,
                doc.data().kapi_ismi,
                doc.data().erisim,
                doc.data().baslangic_saat,
                doc.data().bitis_saat,
                doc.data().gunler
            )

            erisimNoktalariArr.push(erisimNoktasi);
        })

        res.send({data:erisimNoktalariArr});
    }
}

exports.findCards = async    (req, res) => {
    const { searchTerm, filter } = req.body

    const ref = firestore.collection("kartlar");
    const kartlarArr = [];
    var snapshot;

    if (filter === "") {
        snapshot = await ref.where("kart_sahibi", "==", searchTerm).get();
    }
    else {
        snapshot = await ref.where(filter, "==", searchTerm).get();
    }

    if(searchTerm == "")
        snapshot = await ref.get();

    if(snapshot.empty){
        res.send({message:"Veri bulunamadi"});
    }
    else{
        snapshot.forEach(doc => {
            const kart = new Kart(
                doc.data().id,
                doc.data().kart_sahibi,
                doc.data().kart_turu
            )

            kartlarArr.push(kart);
        })

        res.send({data:kartlarArr});
    }
}

// delete methods

exports.deleteErisim = async (req, res) => {

    const result = await firestore.collection("erisim_kayitlari").doc(req.params.id).delete();

    res.send({message: "Erişim Silindi"});
}

exports.deleteErisimNoktasi = async (req, res) => {

    const result = await firestore.collection("erisim_noktalari").doc(req.params.id).delete();

    res.send({message: "Erişim Noktası Silindi!"});
}

exports.deleteKart = async (req, res) => {
    const result = await firestore.collection("kartlar").doc(req.params.id).delete();

    res.send({message: "Kart Silindi"});
}

exports.updateErisimNoktasi = (req, res) => {
    const { mac, kapi_ismi, erisim, baslangic_saat, bitis_saat, gunler } = req.body

    const ref = firestore.collection("erisim_noktalari").doc(mac);

    ref.update({
        kapi_ismi: kapi_ismi,
        erisim: erisim,
        baslangic_saat: baslangic_saat,
        bitis_saat: bitis_saat,
        gunler: gunler
    })

    res.send({message: "Kapı Güncellendi"});

}

exports.updateCard = (req, res) => {
    const { id, kart_sahibi, kart_turu } = req.body

    const ref = firestore.collection("kartlar").doc(id);

    ref.update({
        kart_sahibi: kart_sahibi,
        kart_turu: kart_turu
    })

    res.send({message: "Kart Güncellendi"});
}



var getCountAccess = () => {
    firestore.collection("erisim_kayitlari").get().then(snap => {
        countAccess = snap.size;
    })
}

var getCountAccessPoint = () => {
    
    firestore.collection("erisim_noktalari").get().then(snap => {
        countAccessPoint = snap.size;
    })
}

var getCountCard = () => {
    
    firestore.collection("kartlar").get().then(snap => {
        countCard = snap.size;
    })
}