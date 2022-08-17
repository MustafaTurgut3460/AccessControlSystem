const express = require("express");
const router = express.Router();
const controller = require("../controller/controller.js");

router.get("/", controller.viewDashboard);
router.get("/erisim-kayitlari", controller.viewErisimKayitlari);
router.get("/erisim-noktalari", controller.viewErisimNoktalari);
router.get("/kartlar", controller.viewKartlar);
router.get("/istatistikler", controller.viewIstatistikler)

router.post("/erisim-noktalari/ekle", controller.addErisimNoktasi);
router.post("/kartlar/ekle", controller.addKart);

router.post("/erisim-kayitlari", controller.findErisim);
router.post("/erisim-noktalari", controller.findErisimNoktasi);
router.post("/kartlar", controller.findCards);

router.delete("/erisim-kayitlari/delete/:id", controller.deleteErisim);
router.delete("/erisim-noktalari/delete/:id", controller.deleteErisimNoktasi);
router.delete("/kartlar/delete/:id", controller.deleteKart);

router.get("/erisim-noktalari/update/:id", controller.viewUpdatePage)
router.post("/erisim-noktalari/update/:id", controller.updateErisimNoktasi)

router.get("/kartlar/update/:id", controller.viewUpdateCard)
router.put("/kartlar/update/:id", controller.updateCard)


module.exports = router;