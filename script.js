// DOM elementlerine erişiyoruz
const gunInput = document.getElementById("dogum-gunu-input");
const aySelect = document.getElementById("dogum-ayi-select");
const yasInput = document.getElementById("yas-input");
const oneriButonu = document.getElementById("oneri-butonu");
const sonucAlani = document.getElementById("sonuc-alani");
const hesaplananBurcAlani = document.getElementById("hesaplanan-burc");
const isimInput = document.getElementById("isim-input");
const temaButonu = document.getElementById("tema-degistir-butonu");
const turSelect = document.getElementById("tur-select");
const favoriGosterButonu = document.getElementById("favori-goster-butonu"); 
const favorilerAlani = document.getElementById("favoriler-alani"); 
const istatistikGizleButonu = document.getElementById('istatistik-gizle-butonu'); 

// YÖNETİCİ PANELİ ELEMENTLERİ
const yoneticiButonu = document.getElementById('yonetici-goster-butonu'); 
const yoneticiPaneli = document.getElementById('yonetici-paneli'); 


// Global Oylama ve Kullanıcı Oyları Değişkenleri
let kitapOylari = {}; // Tüm kitapların oy sayılarını tutar: { "Kitap Adı": { "likes": 5, "dislikes": 2 } }
let kullaniciOylari = {}; // Kullanıcının oy kullandığı kitapları tutar: { "Kitap Adı": "like" }


// Burçlara özgü renk temaları
const burcRenkleri = {
    koc: { ana: '#ff5722', koyu: '#e64a19', baslik: '#ff5722' },
    boga: { ana: '#4caf50', koyu: '#388e3c', baslik: '#4caf50' },
    ikizler: { ana: '#ffc107', koyu: '#ffa000', baslik: '#ffc107' },
    yengec: { ana: '#757575', koyu: '#616161', baslik: '#757575' },
    aslan: { ana: '#ff9800', koyu: '#f57c00', baslik: '#ff9800' },
    basak: { ana: '#689f38', koyu: '#558b2f', baslik: '#689f38' },
    terazi: { ana: '#03a9f4', koyu: '#0288d1', baslik: '#03a9f4' },
    akrep: { ana: '#9c27b0', koyu: '#7b1fa2', baslik: '#9c27b0' },
    yay: { ana: '#e91e63', koyu: '#c2185b', baslik: '#c2185b' },
    oglak: { ana: '#5d4037', koyu: '#4e342e', baslik: '#5d4037' },
    kova: { ana: '#2196f3', koyu: '#1976d2', baslik: '#2196f3' },
    balik: { ana: '#00bcd4', koyu: '#0097a7', baslik: '#0097a7' }
};

// --- YÜKLEME VE TEMA FONKSİYONLARI ---

/**
 * Tarayıcıdaki (Local Storage) verileri okur ve form alanlarına yerleştirir.
 */
function verileriYukle() {
    // Önce oylama verilerini yükle
    oylamaVerileriniYukle();
    kullaniciOylariniYukle();
    
    // Diğer form verilerini yükleme
    const kaydedilenIsim = localStorage.getItem('kitapOneriIsim');
    if (kaydedilenIsim) { isimInput.value = kaydedilenIsim; }
    const kaydedilenYas = localStorage.getItem('kitapOneriYas');
    if (kaydedilenYas) { yasInput.value = kaydedilenYas; }
    const kaydedilenGun = localStorage.getItem('kitapOneriGun');
    const kaydedilenAy = localStorage.getItem('kitapOneriAy');
    const kaydedilenTur = localStorage.getItem('kitapOneriTur');
    if (kaydedilenGun && kaydedilenAy) {
        gunInput.value = kaydedilenGun;
        aySelect.value = kaydedilenAy;
        burcuGoster(); 
    }
    if (kaydedilenTur) { turSelect.value = kaydedilenTur; }
    
    // Tema yükleme
    const kaydedilenTema = localStorage.getItem('kitapOneriTema');
    if (kaydedilenTema === 'dark') {
        document.body.classList.add('dark-mode');
        temaButonu.textContent = '☀️ Gündüz Modu';
    }

    // İstatistikleri göster
    istatistikleriGoster();

    // Footer'daki yılı güncelle
    document.querySelector('footer p:first-child').innerHTML = 
        `&copy; ${new Date().getFullYear()} Kitap Öneri Motoru | Tüm Hakları Saklıdır.`;
}

/**
 * Gece/Gündüz modunu değiştirir.
 */
function temayiDegistir() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        temaButonu.textContent = '☀️ Gündüz Modu';
        body.style.backgroundColor = '#121212'; 
    } else {
        temaButonu.textContent = '🌙 Gece Modu';
        burcuGoster(); 
    }
    // Temayı kaydet
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('kitapOneriTema', 'dark');
    } else {
        localStorage.setItem('kitapOneriTema', 'light');
    }
}


// --- BURÇ HESAPLAMA VE GÖSTERME ---

function burcuHesapla(ay, gun) {
    if (!ay || !gun || gun < 1 || gun > 31 || ay < 1 || ay > 12) { return null; }
    if ((ay == 3 && gun >= 21) || (ay == 4 && gun <= 20)) return "koc";
    if ((ay == 4 && gun >= 21) || (ay == 5 && gun <= 21)) return "boga";
    if ((ay == 5 && gun >= 22) || (ay == 6 && gun <= 21)) return "ikizler";
    if ((ay == 6 && gun >= 22) || (ay == 7 && gun <= 23)) return "yengec";
    if ((ay == 7 && gun >= 24) || (ay == 8 && gun <= 23)) return "aslan";
    if ((ay == 8 && gun >= 24) || (ay == 9 && gun <= 23)) return "basak";
    if ((ay == 9 && gun >= 24) || (ay == 10 && gun <= 23)) return "terazi";
    if ((ay == 10 && gun >= 24) || (ay == 11 && gun <= 22)) return "akrep";
    if ((ay == 11 && gun >= 23) || (ay == 12 && gun <= 21)) return "yay";
    if ((ay == 12 && gun >= 22) || (ay == 1 && gun <= 20)) return "oglak";
    if ((ay == 1 && gun >= 21) || (ay == 2 && gun <= 19)) return "kova";
    if ((ay == 2 && gun >= 20) || (ay == 3 && gun <= 20)) return "balik";
    return null;
}

function burcuGoster() {
    const gun = parseInt(gunInput.value);
    const ay = parseInt(aySelect.value);
    const burcKey = burcuHesapla(ay, gun);
    const body = document.body; 

    if (burcKey) {
        const burcAdlari = { koc: "KOÇ", boga: "BOĞA", ikizler: "İKİZLER", yengec: "YENGEÇ", aslan: "ASLAN", basak: "BAŞAK", terazi: "TERAZİ", akrep: "AKREP", yay: "YAY", oglak: "OĞLAK", kova: "KOVA", balik: "BALIK" };
        hesaplananBurcAlani.innerHTML = `Hesaplanan Burcunuz: ${burcAdlari[burcKey]}`;
        
        const temaRengi = burcRenkleri[burcKey];
        if (!body.classList.contains('dark-mode')) {
            body.style.backgroundColor = temaRengi.ana + '33';
        }
    } else {
         hesaplananBurcAlani.innerHTML = "";
         if (!body.classList.contains('dark-mode')) {
             body.style.backgroundColor = '#f4f4f9';
         }
         // Girdiler silinince tema rengini sıfırla
         document.querySelector('h1').style.color = ''; // CSS'deki varsayılan renge dönsün
         document.getElementById('oneri-butonu').style.backgroundColor = '';
    }
}


// --- FAVORİ YÖNETİMİ VE ARAMA MANTIĞI ---

/**
 * Önerilen kitabı tarayıcı hafızasına (localStorage) kaydeder.
 */
function favorilereEkle(kitapAdi, aciklama, resimDosyasi, burcKey) {
    const favorilerJSON = localStorage.getItem('favoriKitaplar');
    let favoriListesi = favorilerJSON ? JSON.parse(favorilerJSON) : [];
    
    const mevcutMu = favoriListesi.some(kitap => kitap.ad === kitapAdi);

    if (mevcutMu) {
        alert(`${kitapAdi} zaten favorilerinize ekli!`);
        return; 
    }

    const yeniKitap = {
        id: Date.now(), 
        ad: kitapAdi,
        aciklama: aciklama,
        resim: resimDosyasi,
        burc: burcKey 
    };

    favoriListesi.push(yeniKitap);
    localStorage.setItem('favoriKitaplar', JSON.stringify(favoriListesi));
    
    alert(`${kitapAdi} başarıyla favorilerinize eklendi!`);
    
    if (favorilerAlani.classList.contains('goster')) {
        favorileriGoster(true); 
    }
}

/**
 * Belirtilen ID'ye sahip kitabı favoriler listesinden siler ve listeyi günceller.
 */
function favoriSil(kitapId) {
    const onay = confirm("Bu kitabı favorilerden kaldırmak istediğinize emin misiniz?");
    if (!onay) return;

    const favorilerJSON = localStorage.getItem('favoriKitaplar');
    let favoriListesi = favorilerJSON ? JSON.parse(favorilerJSON) : [];
    
    const guncelListe = favoriListesi.filter(kitap => kitap.id !== kitapId);
    
    localStorage.setItem('favoriKitaplar', JSON.stringify(guncelListe));
    
    alert("Kitap favorilerden kaldırıldı.");

    favorileriGoster(true); 
}

/**
 * Verilen kitap adını Google'da arar ve yeni sekmede açar.
 * @param {string} kitapAdi 
 */
function kitapAra(kitapAdi) {
    const aramaURL = `https://www.google.com/search?q=${encodeURIComponent(kitapAdi + " kitap")}`;
    window.open(aramaURL, '_blank');
}

/**
 * Favori kitaplar alanını açar/kapatır ve içeriğini gösterir.
 */
function favorileriGoster(zorlaGoster = false) {
    if (favorilerAlani.classList.contains('goster') && !zorlaGoster) {
        favorilerAlani.classList.remove('goster');
        favoriGosterButonu.textContent = "⭐ Favorileri Görüntüle";
        return;
    }

    // Başka bir panel açıksa kapat
    yoneticiPaneli.classList.remove('goster');
    yoneticiButonu.textContent = "📊 Yönetici Paneli";

    favorilerAlani.classList.add('goster');
    favoriGosterButonu.textContent = "▲ Favorileri Gizle";
    favorilerAlani.innerHTML = '<h3>⭐ Kaydedilen Favorileriniz</h3>';

    const favorilerJSON = localStorage.getItem('favoriKitaplar');
    const favoriListesi = favorilerJSON ? JSON.parse(favorilerJSON) : [];

    if (favoriListesi.length === 0) {
        favorilerAlani.innerHTML += '<p style="text-align: center; color: #777;">Favoriler listeniz boş.</p>';
        return;
    }

    let favoriHTML = '';
    favoriListesi.forEach(kitap => {
        const takimyildizYolu = `img/takimyildizlari/${kitap.burc}.png`;
        
        favoriHTML += `
            <div class="kitap-kart favori-kart"> 
                <img src="${takimyildizYolu}" alt="${kitap.burc.toUpperCase()} Takımyıldızı" class="takimyildiz-kucuk">
                <img src="img/${kitap.resim}" alt="${kitap.ad} Kitap Kapağı" class="kitap-resmi">
                
                <div class="kitap-bilgi">
                    <p>
                        <strong class="arama-basligi" data-kitap-adi="${kitap.ad}">${kitap.ad}</strong>
                    </p>
                    <p>${kitap.aciklama}</p>
                </div>
                
                <button class="sil-butonu" data-id="${kitap.id}">
                    🗑️ Sil
                </button>
            </div>
        `;
    });
    
    favorilerAlani.innerHTML += `<div class="favori-liste">${favoriHTML}</div>`;

    // Yeni eklenen sil butonlarına olay dinleyicisi ata
    document.querySelectorAll('.sil-butonu').forEach(button => {
        button.addEventListener('click', (e) => {
            const kitapId = parseInt(e.currentTarget.getAttribute('data-id'));
            favoriSil(kitapId);
        });
    });

    // Arama Başlıklarına olay dinleyicisi ata
    document.querySelectorAll('.arama-basligi').forEach(baslik => {
        baslik.addEventListener('click', (e) => {
            const kitapAdi = e.currentTarget.getAttribute('data-kitap-adi');
            kitapAra(kitapAdi);
        });
    });
}


// --- OYLAMA VE İSTATİSTİK YÖNETİMİ ---

/**
 * Kitapların oy verilerini Local Storage'dan yükler.
 */
function oylamaVerileriniYukle() {
    const oylarJSON = localStorage.getItem('kitapOylari');
    if (oylarJSON) {
        kitapOylari = JSON.parse(oylarJSON);
    } else {
        kitapOylari = {};
    }
}

/**
 * Kullanıcının hangi kitaplara oy verdiğini Local Storage'dan yükler.
 */
function kullaniciOylariniYukle() {
    const kullaniciOylariJSON = localStorage.getItem('kullaniciOylari');
    if (kullaniciOylariJSON) {
        kullaniciOylari = JSON.parse(kullaniciOylariJSON);
    } else {
        kullaniciOylari = {};
    }
}

/**
 * Oy verilerini Local Storage'a kaydeder.
 */
function oylamaVerileriniKaydet() {
    localStorage.setItem('kitapOylari', JSON.stringify(kitapOylari));
}

/**
 * Kullanıcının oy verdiği kitapları Local Storage'a kaydeder.
 */
function kullaniciOylariniKaydet() {
    localStorage.setItem('kullaniciOylari', JSON.stringify(kullaniciOylari));
}

/**
 * Verilen kitap için oy kullanma işlemini gerçekleştirir.
 * @param {string} kitapAdi 
 * @param {'like' | 'dislike'} oyTuru 
 */
function oyKullan(kitapAdi, oyTuru) {
    
    // Kitap daha önce hiç oylanmamışsa başlangıç verisini oluştur
    if (!kitapOylari[kitapAdi]) {
        kitapOylari[kitapAdi] = { likes: 0, dislikes: 0 };
    }
    
    // Kullanıcı bu kitaba daha önce oy vermiş mi?
    const kullanicininMevcutOyu = kullaniciOylari[kitapAdi];
    
    if (kullanicininMevcutOyu) {
        alert("Bu kitaba zaten oy kullandınız! Önceki oyunuz: " + (kullanicininMevcutOyu === 'like' ? '👍 Beğeni' : '👎 Beğenmeme'));
        return; 
    }
    
    // Oy sayısını güncelle
    if (oyTuru === 'like') {
        kitapOylari[kitapAdi].likes += 1;
        alert(`${kitapAdi} için beğeni oyu kaydedildi!`);
    } else if (oyTuru === 'dislike') {
        kitapOylari[kitapAdi].dislikes += 1;
        alert(`${kitapAdi} için beğenmeme oyu kaydedildi!`);
    }
    
    // Kullanıcının oyunu kaydet
    kullaniciOylari[kitapAdi] = oyTuru;

    // Verileri Local Storage'a kaydet
    oylamaVerileriniKaydet();
    kullaniciOylariniKaydet();
    
    // Sonuç alanını tekrar oluşturarak yeni oy durumunu göster
    kitapOnerisiVer(kitapAdi); 

    // Oylama sonrası istatistikleri güncelle
    istatistikleriGoster(); 
}

/**
 * Önerilen kitabın oylama HTML'ini oluşturur.
 * @param {string} kitapAdi 
 * @returns {string} Oylama butonları ve skorunu içeren HTML
 */
function oylamaHTMLiOlustur(kitapAdi) {
    const oylar = kitapOylari[kitapAdi] || { likes: 0, dislikes: 0 };
    const kullanicininOyu = kullaniciOylari[kitapAdi];
    
    // Oy kullanıldıysa butonları devre dışı bırak
    const disabled = kullanicininOyu ? 'disabled' : '';
    
    return `
        <div class="oylama-alani">
            <span class="oy-sayisi">👍 ${oylar.likes}</span>
            <button class="oy-butonu like-butonu" data-oy-turu="like" ${disabled}>
                👍 Beğen
            </button>
            <button class="oy-butonu dislike-butonu" data-oy-turu="dislike" ${disabled}>
                👎 Beğenme
            </button>
            <span class="oy-sayisi">👎 ${oylar.dislikes}</span>
        </div>
    `;
}

/**
 * Tüm kitap oylarını popülariteye (Net Beğeni) göre sıralar.
 * Popülarite: likes - dislikes
 * @returns {Array<Object>} Sıralanmış kitap listesi.
 */
function populerKitaplariSirala() {
    const siralanabilirListe = [];

    // Oylanan her kitabı listeye ekle
    for (const kitapAdi in kitapOylari) {
        const oylar = kitapOylari[kitapAdi];
        const netBegeni = oylar.likes - oylar.dislikes;
        const toplamOy = oylar.likes + oylar.dislikes;

        // Sadece en az 1 oy almış kitapları dahil et
        if (toplamOy > 0) {
            siralanabilirListe.push({
                ad: kitapAdi,
                likes: oylar.likes,
                dislikes: oylar.dislikes,
                netBegeni: netBegeni,
                toplamOy: toplamOy
            });
        }
    }

    // Listeyi Net Beğeniye (en yüksekten en düşüğe) göre sırala
    siralanabilirListe.sort((a, b) => b.netBegeni - a.netBegeni);

    return siralanabilirListe;
}

/**
 * Sıralanmış kitap listesini alarak İstatistik alanına yazar.
 */
function istatistikleriGoster() {
    const populerListeDiv = document.getElementById('populer-liste');
    const istatistikAlani = document.getElementById('istatistik-alani');
    
    // Eğer istatistik alanı gizlenmişse, içeriği güncelleme
    if (istatistikAlani.classList.contains('gizlendi')) {
        return; 
    }

    const popListe = populerKitaplariSirala();

    if (popListe.length === 0) {
        populerListeDiv.innerHTML = '<p style="text-align: center; color: #777;">Henüz yeterli oy toplanmadı...</p>';
        istatistikGizleButonu.style.display = 'none';
        return;
    }

    // İlk 5 kitabı al
    const ilkBesKitap = popListe.slice(0, 5);
    let listeHTML = '';

    ilkBesKitap.forEach((kitap, index) => {
        listeHTML += `
            <div class="populer-kitap-item">
                <span class="kitap-sira">#${index + 1}</span>
                <span class="kitap-isim arama-basligi" data-kitap-adi="${kitap.ad}">${kitap.ad}</span>
                <div class="oy-detay">
                    <span class="like-count">👍 ${kitap.likes}</span>
                    <span class="dislike-count">👎 ${kitap.dislikes}</span>
                </div>
            </div>
        `;
    });

    populerListeDiv.innerHTML = listeHTML;
    istatistikGizleButonu.style.display = 'block'; 
    
    // Başlıklara Arama Dinleyicisini ata
    document.querySelectorAll('#populer-liste .arama-basligi').forEach(baslik => {
        baslik.addEventListener('click', (e) => {
            const kitapAdi = e.currentTarget.getAttribute('data-kitap-adi');
            kitapAra(kitapAdi);
        });
    });
}

/**
 * İstatistik alanını gösterir/gizler.
 */
function istatistikAlaniniGizleToggle() {
    const alan = document.getElementById('istatistik-alani');
    const buton = document.getElementById('istatistik-gizle-butonu');
    
    // Gizle/Göster sınıfını değiştir
    alan.classList.toggle('gizlendi');
    
    if (alan.classList.contains('gizlendi')) {
        // Gizle durumunda
        buton.textContent = '▼ İstatistikleri Göster';
    } else {
        // Göster durumunda
        buton.textContent = '▲ İstatistikleri Gizle';
        // Görünür hale geldiğinde içeriği güncelle
        istatistikleriGoster(); 
    }
}


// --- VERİ TABANI SİMÜLASYONU (Local Storage) ---

/**
 * Yeni bir ziyaretçiyi ve kaydedilen kullanıcıyı log'lar (Simülasyon).
 * Ziyaretçi sayısını artırır ve kayıt olan kullanıcıyı listeye ekler.
 * @param {string} kullaniciAdi - Kayıt olan kullanıcının adı.
 * @param {string} secilenBurc - Kullanıcının burcu.
 */
function kullaniciVerisiniKaydet(kullaniciAdi, secilenBurc) {
    
    // 2. Kayıt Olan Kullanıcıları Listeye Ekle
    const kayitlarJSON = localStorage.getItem('kayitliKullanicilar');
    let kayitliKullanicilar = kayitlarJSON ? JSON.parse(kayitlarJSON) : [];
    
    // Kullanıcının benzersiz bir ID'si olup olmadığını kontrol et
    const kullaniciID = localStorage.getItem('kullaniciID') || Date.now();
    localStorage.setItem('kullaniciID', kullaniciID); // Kullanıcının tarayıcısında kalıcı ID

    const mevcutKayitIndex = kayitliKullanicilar.findIndex(k => k.id == kullaniciID); 

    const yeniKayit = {
        id: kullaniciID,
        ad: kullaniciAdi || "Anonim",
        burc: secilenBurc,
        tarih: new Date().toLocaleString('tr-TR'),
        ciktigiSayisi: 1 // Kullanıcının öneri aldığı sayıyı tutar
    };
    
    if (mevcutKayitIndex > -1) {
        // Zaten kayıtlıysa, sadece çıkış sayısını artır
        kayitliKullanicilar[mevcutKayitIndex].ciktigiSayisi += 1;
        kayitliKullanicilar[mevcutKayitIndex].tarih = yeniKayit.tarih;
    } else {
        // Yeni kayıt ise listeye ekle
        kayitliKullanicilar.push(yeniKayit);
    }

    localStorage.setItem('kayitliKullanicilar', JSON.stringify(kayitliKullanicilar));
}

/**
 * Sayfa ilk yüklendiğinde ziyaretçi sayısını bir artırır (Simülasyon).
 */
function ziyaretciSayaciniBaslat() {
    // Bu, sayfa her yüklendiğinde (yenilendiğinde) sayıyı artırır.
    // Gerçek bir kullanıcı sayımı için sunucu gerekir. Bu sadece Local Storage simülasyonudur.
    let ziyaretciSayisi = parseInt(localStorage.getItem('ziyaretciSayisi') || 0);
    localStorage.setItem('ziyaretciSayisi', ziyaretciSayisi + 1);
}

// --- YÖNETİCİ PANELİ VE LİSTELEME ---

/**
 * Yönetici panelini açar/kapatır ve verileri listeler.
 */
function yoneticiPaneliniGoster() {
    if (yoneticiPaneli.classList.contains('goster')) {
        yoneticiPaneli.classList.remove('goster');
        yoneticiButonu.textContent = "📊 Yönetici Paneli";
        return;
    }

    // Başka bir panel açıksa kapat
    favorilerAlani.classList.remove('goster');
    favoriGosterButonu.textContent = "⭐ Favorileri Görüntüle";

    yoneticiPaneli.classList.add('goster');
    yoneticiButonu.textContent = "▲ Yönetici Panelini Gizle";
    
    const kayitlarJSON = localStorage.getItem('kayitliKullanicilar');
    const kayitliKullanicilar = kayitlarJSON ? JSON.parse(kayitlarJSON) : [];
    const ziyaretciSayisi = localStorage.getItem('ziyaretciSayisi') || 0;

    // Yönetici Paneli HTML'i
    let panelHTML = `
        <h3>📊 Site İstatistikleri (Simülasyon)</h3>
        <p style="text-align: center; font-size: 1.2em;">Toplam Ziyaretçi Sayısı: <strong>${ziyaretciSayisi}</strong></p>
        <p style="text-align: center; font-size: 1.2em;">Kayıt Oluşturan Kişi Sayısı: <strong>${kayitliKullanicilar.length}</strong></p>
        <hr>
        <h4>Kayıt Oluşturan Kullanıcı Listesi</h4>
    `;

    if (kayitliKullanicilar.length === 0) {
        panelHTML += '<p style="text-align: center; color: #777;">Henüz kayıt oluşturan kimse yok.</p>';
    } else {
        let listeHTML = `
            <div style="overflow-x: auto;">
            <table style="width: 100%; min-width: 500px; border-collapse: collapse; margin-top: 20px; background-color: #fff; color: #333;">
                <thead>
                    <tr style="background-color: #f1f1f1;">
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Adı</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Burcu</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Öneri Sayısı</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Son İşlem</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        kayitliKullanicilar.sort((a, b) => new Date(b.tarih) - new Date(a.tarih)); // Tarihe göre tersten sırala

        kayitliKullanicilar.forEach(kullanici => {
            listeHTML += `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${kullanici.ad}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${kullanici.burc.toUpperCase()}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${kullanici.ciktigiSayisi}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${kullanici.tarih}</td>
                </tr>
            `;
        });

        listeHTML += `
                </tbody>
            </table>
            </div>
        `;
        panelHTML += listeHTML;
    }

    yoneticiPaneli.innerHTML = panelHTML;

    // Dark Mode'da tablo stilini ayarla
    if (document.body.classList.contains('dark-mode')) {
        yoneticiPaneli.querySelector('table').style.backgroundColor = '#333';
        yoneticiPaneli.querySelector('table').style.color = '#eee';
        yoneticiPaneli.querySelectorAll('th, td').forEach(el => el.style.borderColor = '#555');
        yoneticiPaneli.querySelector('thead tr').style.backgroundColor = '#444';
        yoneticiPaneli.querySelector('hr').style.borderColor = '#555';
    }
}

// --- ÖNERİ MANTIĞI VE PAYLAŞMA ---

/**
 * Kullanıcı girdilerine göre kitap önerisi verir ve sonucu ekranda gösterir.
 * @param {string} [kitapAdi] Eğer bir kitap adı verilirse, sadece o kitabın sonucu yeniden çizilir (oylama sonrası gibi).
 */
function kitapOnerisiVer(kitapAdi = null) {
    const gun = parseInt(gunInput.value);
    const ay = parseInt(aySelect.value);
    const secilenYas = parseInt(yasInput.value); 
    const kullaniciAdi = isimInput.value.trim();
    const secilenTur = turSelect.value;
    
    if (!burcuHesapla(ay, gun) || isNaN(secilenYas) || secilenYas <= 0) {
        sonucAlani.innerHTML = "<p style='color: red;'>Lütfen tüm alanları geçerli şekilde doldurun!</p>";
        return; 
    }
    
    // YENİ: Veri kaydını form geçerli olduğunda yap.
    const secilenBurc = burcuHesapla(ay, gun);
    kullaniciVerisiniKaydet(kullaniciAdi, secilenBurc); 
    
    if (kitapAdi === null) {
        sonucAlani.innerHTML = `<p class="loading-text">Öneri Hazırlanıyor<span>.</span><span>.</span><span>.</span></p>`;
        sonucAlani.classList.remove('animated-result');
    }

    setTimeout(() => {
        
        // --- Burç, Yaş ve Tür filtresine göre kitap seçimi ---
        let onerilenKitap = "";
        let aciklama = "";
        let resimDosyasi = "placeholder.jpg"; 
        
        
        switch (secilenBurc) {
            case "koc":
                if (secilenTur === 'fantastik') {
                    onerilenKitap = "Yüzüklerin Efendisi: Yüzük Kardeşliği";
                    aciklama = "Macerayı seven Koçlar için destansı bir fantezi başlangıcı.";
                    resimDosyasi = "yuzuklerin-efendisi.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "Alışkanlıkların Gücü - Charles Duhigg";
                    aciklama = "Liderlik özelliklerinizi ve disiplininizi güçlendirecek bir rehber.";
                    resimDosyasi = "aliskanliklarin-gucu.jpg";
                } else {
                    if (secilenYas < 18) {
                        onerilenKitap = "Percy Jackson & Olimposlular: Şimşek Hırsızı";
                        aciklama = "Genç, maceracı Koçlar için destansı bir macera.";
                        resimDosyasi = "percy-jackson.jpg";
                    } else {
                        onerilenKitap = "Cesur Yeni Dünya - Aldous Huxley";
                        aciklama = "Olgun, lider ruhlu Koçlar için toplumsal düzeni sorgulatan bir klasik.";
                        resimDosyasi = "cesur-yeni-dunya.jpg";
                    }
                }
                break;
             case "boga":
                if (secilenTur === 'fantastik') {
                    onerilenKitap = "Dune - Frank Herbert";
                    aciklama = "Sabırlı ve köklü Boğalar için derinliği olan bir bilim kurgu klasiği.";
                    resimDosyasi = "dune.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "Atomik Alışkanlıklar - James Clear";
                    aciklama = "Pratik ve düzenli Boğaların günlük rutinlerini geliştirmesi için.";
                    resimDosyasi = "atomik-aliskanliklar.jpg";
                } else {
                     if (secilenYas < 25) {
                        onerilenKitap = "Uçurtma Avcısı - Khaled Hosseini";
                        aciklama = "Genç Boğalar için güven ve sadakat üzerine etkileyici bir hikaye.";
                        resimDosyasi = "ucurtma-avcisi.jpg";
                    } else {
                        onerilenKitap = "Gurur ve Önyargı - Jane Austen";
                        aciklama = "Durağanlığı seven Boğalar için romantik ve köklü bir hikaye.";
                        resimDosyasi = "gurur-ve-onyargi.jpg";
                    }
                }
                break;
            case "ikizler":
                 if (secilenTur === 'fantastik') {
                    onerilenKitap = "Otostopçunun Galaksi Rehberi - Douglas Adams";
                    aciklama = "Meraklı ve esprili İkizler için zekice bir bilim kurgu komedisi.";
                    resimDosyasi = "otostopcu.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "Kısa ve İlginç Bir Şey - David Eagleman";
                    aciklama = "Hızlı öğrenen, meraklı İkizler için kısa ama derin konular.";
                    resimDosyasi = "kisa-ve-ilginç.jpg";
                } else {
                    onerilenKitap = "Dönüşüm - Franz Kafka";
                    aciklama = "Değişken İkizler için zihni zorlayacak, kısa ama derin bir eser.";
                    resimDosyasi = "donusum.jpg";
                }
                break;
            case "yengec":
                if (secilenTur === 'fantastik') {
                    onerilenKitap = "Harry Potter Serisi - J.K. Rowling";
                    aciklama = "Yuvasına ve duygularına düşkün Yengeçler için büyüleyici bir dünya.";
                    resimDosyasi = "harry-potter.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "Duygusal Zeka - Daniel Goleman";
                    aciklama = "Duygusallığı yüksek Yengeçler için ilişkileri yönetme ve anlama rehberi.";
                    resimDosyasi = "duygusal-zeka.jpg";
                } else { 
                    if (secilenYas < 20) {
                        onerilenKitap = "Gölge ve Kemik - Leigh Bardugo";
                        aciklama = "Hayal gücü güçlü Yengeçler için fantastik bir dünya.";
                        resimDosyasi = "golge-ve-kemik.jpg";
                    } else {
                        onerilenKitap = "Gazap Üzümleri - John Steinbeck";
                        aciklama = "Ailesine düşkün Yengeçler için aidiyet ve empati dolu bir başyapıt.";
                        resimDosyasi = "gazap-uzumleri.jpg";
                    }
                }
                break;
            case "aslan":
                 if (secilenTur === 'fantastik') {
                    onerilenKitap = "Game of Thrones: Buz ve Ateşin Şarkısı";
                    aciklama = "İhtişam, güç ve yönetim temalarını seven Aslanlar için epik bir seri.";
                    resimDosyasi = "game-of-thrones.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "Liderlik Sanatı - Sun Tzu";
                    aciklama = "Doğuştan lider Aslanlar için stratejik yönetim ve ikna sanatı.";
                    resimDosyasi = "liderlik-sanati.jpg";
                } else { 
                    onerilenKitap = "Muhteşem Gatsby - F. Scott Fitzgerald";
                    aciklama = "Gösterişi ve tutkuyu seven Aslanlar için ihtiras dolu bir hikaye.";
                    resimDosyasi = "muhtesem-gatsby.jpg";
                }
                break;
            case "basak":
                 if (secilenTur === 'fantastik') {
                    onerilenKitap = "Kayıp Sembol - Dan Brown";
                    aciklama = "Analitik ve detaycı Başaklar için karmaşık şifreler ve gizemler.";
                    resimDosyasi = "kayip-sembol.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "Düzenli Ev, Mutlu Hayat - Marie Kondo";
                    aciklama = "Detaycı ve düzenli Başaklar için hayatı sadeleştirme kılavuzu.";
                    resimDosyasi = "duzenli-ev.jpg";
                } else { 
                    onerilenKitap = "Sherlock Holmes'un Maceraları - Arthur Conan Doyle";
                    aciklama = "Zeka dolu bir dedektiflik serisi.";
                    resimDosyasi = "sherlock-holmes.jpg";
                }
                break;
            case "terazi":
                if (secilenTur === 'fantastik') {
                    onerilenKitap = "Alacakaranlık - Stephenie Meyer";
                    aciklama = "Romantik ve estetik Teraziler için fantastik bir aşk hikayesi.";
                    resimDosyasi = "alacakaranlik.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "İnsanları Etkileme ve Kazanma Sanatı - Dale Carnegie";
                    aciklama = "Sosyal ve uyumlu Teraziler için ilişkileri güçlendirme rehberi.";
                    resimDosyasi = "insanlari-etkileme.jpg";
                } else { 
                    onerilenKitap = "Romeo ve Juliet - William Shakespeare";
                    aciklama = "Uyum ve estetik arayan Teraziler için bir aşk hikayesi.";
                    resimDosyasi = "romeo-ve-juliet.jpg";
                }
                break;
            case "akrep":
                if (secilenTur === 'fantastik') {
                    onerilenKitap = "Ejderha Mızrağı Serisi - Margaret Weis & Tracy Hickman";
                    aciklama = "Gizemli ve tutkulu Akrepler için karmaşık bir fantezi serisi.";
                    resimDosyasi = "ejderha-mizragi.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "Güç Sahibi Olmanın 48 Yasası - Robert Greene";
                    aciklama = "Tutkulu ve stratejik Akrepler için güç dinamikleri üzerine bir başvuru kitabı.";
                    resimDosyasi = "guc-sahibi-olmanin-48-yasasi.jpg";
                } else { 
                    onerilenKitap = "Yeraltından Notlar - Dostoyevski";
                    aciklama = "İnsan psikolojisinin derinliklerine inen bir eser.";
                    resimDosyasi = "yeraltindan-notlar.jpg";
                }
                break;
            case "yay":
                if (secilenTur === 'fantastik') {
                    onerilenKitap = "Hobbit - J.R.R. Tolkien";
                    aciklama = "Maceracı ruhlu Yaylar için beklenmedik bir yolculuk.";
                    resimDosyasi = "hobbit.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "Zengin Baba Yoksul Baba - Robert Kiyosaki";
                    aciklama = "Farklı bakış açılarını seven Yaylar için finansal özgürlük rehberi.";
                    resimDosyasi = "zengin-baba.jpg";
                } else { 
                    onerilenKitap = "Yolda - Jack Kerouac";
                    aciklama = "Özgürlüğüne düşkün ve kaşif Yay burçları için bir yolculuk romanı.";
                    resimDosyasi = "yolda.jpg";
                }
                break;
            case "oglak":
                if (secilenTur === 'fantastik') {
                    onerilenKitap = "Vahşi Batı Efsaneleri - Stephen King (Kara Kule Serisi)";
                    aciklama = "Azimli ve uzun soluklu işleri seven Oğlaklar için devasa bir fantezi-western serisi.";
                    resimDosyasi = "kara-kule.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "7 Alışkanlık - Stephen Covey";
                    aciklama = "Disiplinli ve hedefe odaklı Oğlaklar için klasik bir verimlilik kitabı.";
                    resimDosyasi = "7-aliskanlik.jpg";
                } else { 
                    onerilenKitap = "İhtiyar Adam ve Deniz - Ernest Hemingway";
                    aciklama = "Sabır ve dayanıklılık üzerine bir hikaye.";
                    resimDosyasi = "ihtiyar-adam-ve-deniz.jpg";
                }
                break;
            case "kova":
                if (secilenTur === 'fantastik') {
                    onerilenKitap = "Otostopçunun Galaksi Rehberi - Douglas Adams";
                    aciklama = "Özgün ve entelektüel Kovalar için zekice bir bilim kurgu komedisi.";
                    resimDosyasi = "otostopcu.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "Sapiens: İnsan Türünün Kısa Bir Tarihi - Yuval Noah Harari";
                    aciklama = "Yenilikçi Kovalar için insanlığın kökenlerini sorgulatan bir eser.";
                    resimDosyasi = "sapiens.jpg";
                } else { 
                    if (secilenYas < 30) {
                        onerilenKitap = "Cesur Yeni Dünya - Aldous Huxley"; 
                        aciklama = "Toplumsal düzeni sorgulatan distopik bir klasik.";
                        resimDosyasi = "cesur-yeni-dunya.jpg";
                    } else {
                        onerilenKitap = "1984 - George Orwell";
                        aciklama = "Bireyselliği sorgulatan bir klasik.";
                        resimDosyasi = "1984.jpg";
                    }
                }
                break;
            case "balik":
                if (secilenTur === 'fantastik') {
                    onerilenKitap = "Alice Harikalar Diyarında - Lewis Carroll";
                    aciklama = "Hayal gücü yüksek Balıklar için rüya gibi bir dünya.";
                    resimDosyasi = "alice.jpg";
                } else if (secilenTur === 'gelisim') {
                    onerilenKitap = "Yaratıcı Yönünüzü Keşfedin - Julia Cameron";
                    aciklama = "Sanatsal ve sezgisel Balıklar için yaratıcılığı serbest bırakma rehberi.";
                    resimDosyasi = "yaratici-yonunuzu.jpg";
                } else { 
                    if (secilenYas < 18) {
                        onerilenKitap = "Küçük Prens - Antoine de Saint-Exupéry";
                        aciklama = "Genç, hayalperest Balıklar için kalbe dokunan bir eser.";
                        resimDosyasi = "kucuk-prens.jpg";
                    } else {
                        onerilenKitap = "Deniz Feneri - Virginia Woolf";
                        aciklama = "Olgun, duyarlı ve derin Balık burçları için edebi bir başyapıt.";
                        resimDosyasi = "deniz-feneri.jpg";
                    }
                }
                break;
            default:
                if (secilenTur === 'fantastik') {
                    onerilenKitap = "Silmarillion - J.R.R. Tolkien";
                    aciklama = "Tüm fantastik severler için Tolkien'in mitoloji eseri.";
                } else if (secilenTur === 'gelisim') {
                     onerilenKitap = "Düşün ve Zengin Ol - Napoleon Hill";
                    aciklama = "Tüm motivasyon arayanlar için klasik bir rehber.";
                } else {
                    onerilenKitap = "Savaş ve Barış - Lev Tolstoy";
                    aciklama = "Tüm roman severler için evrensel bir klasik.";
                }
                resimDosyasi = "placeholder.jpg";
        }
        
        // Eğer kitap adı parametre olarak geldiyse, bu adı kullan (oylama sonrası yeniden çizim için)
        const gosterilecekKitapAdi = kitapAdi !== null ? kitapAdi : onerilenKitap;

        // Tema ve veri kaydı (sadece ilk çalıştırmada veya manuel tetiklemede yapılır)
        if (kitapAdi === null) {
            const temaRengi = burcRenkleri[secilenBurc];
            const anaBaslik = document.querySelector('h1');
            const oneriButonu = document.getElementById('oneri-butonu'); 

            oneriButonu.style.backgroundColor = temaRengi.ana;
            anaBaslik.style.color = document.body.classList.contains('dark-mode') ? '#eee' : temaRengi.baslik;
            oneriButonu.onmouseover = function() { this.style.backgroundColor = temaRengi.koyu; };
            oneriButonu.onmouseout = function() { this.style.backgroundColor = temaRengi.ana; };
            
            localStorage.setItem('kitapOneriIsim', kullaniciAdi);
            localStorage.setItem('kitapOneriYas', secilenYas);
            localStorage.setItem('kitapOneriGun', gun);
            localStorage.setItem('kitapOneriAy', ay);
            localStorage.setItem('kitapOneriTur', secilenTur);
        }
        
        // --- SONUÇ HTML'i OLUŞTURULUYOR ---
        
        const oylamaAlaniHTML = oylamaHTMLiOlustur(gosterilecekKitapAdi);
        const takimyildizYolu = `img/takimyildizlari/${secilenBurc}.png`;
        
        let sonucBaslik = "İşte Size Özel Öneri:";
        if (kullaniciAdi !== "") {
            const duzeltilmisAd = kullaniciAdi.charAt(0).toUpperCase() + kullaniciAdi.slice(1);
            sonucBaslik = `${duzeltilmisAd}, İşte Sana Özel Öneri:`;
        }
        
        const sonucHTML = `
            <h3>${sonucBaslik}</h3>
            <div class="kitap-kart"> 
                
                <img src="${takimyildizYolu}" alt="${secilenBurc.toUpperCase()} Takımyıldızı" class="takimyildiz-kucuk">
                
                <img src="img/${resimDosyasi}" alt="${gosterilecekKitapAdi} Kitap Kapağı" class="kitap-resmi">
                
                <div class="kitap-bilgi">
                    <p>
                        <strong class="arama-basligi" data-kitap-adi="${gosterilecekKitapAdi}">${gosterilecekKitapAdi}</strong>
                    </p>
                    <p>${aciklama}</p>
                    ${oylamaAlaniHTML} 
                </div>
            </div>
            
            <div class="button-group">
                <button id="favori-ekle-butonu" class="favorite-button">
                    ⭐ Favorilere Ekle
                </button>
            
                <button id="paylas-butonu" class="share-button">
                    Önerimi Paylaş
                </button>
            </div>
        `;
        
        sonucAlani.innerHTML = sonucHTML;
        sonucAlani.classList.add('animated-result');
        
        // Olay Dinleyicilerini ata
        document.getElementById('paylas-butonu').addEventListener('click', () => {
            paylasimiBaslat(gosterilecekKitapAdi, kullaniciAdi);
        });
        
        document.getElementById('favori-ekle-butonu').addEventListener('click', () => {
            favorilereEkle(gosterilecekKitapAdi, aciklama, resimDosyasi, secilenBurc);
        });
        
        document.querySelector('.kitap-kart .arama-basligi').addEventListener('click', (e) => {
            const kitapAdi = e.currentTarget.getAttribute('data-kitap-adi');
            kitapAra(kitapAdi);
        });
        
        // OYLAMA BUTONLARI İÇİN OLAY DİNLEYİCİLERİ
        document.querySelectorAll('.oy-butonu').forEach(button => {
            button.addEventListener('click', (e) => {
                const oyTuru = e.currentTarget.getAttribute('data-oy-turu');
                oyKullan(gosterilecekKitapAdi, oyTuru);
            });
        });
        
    }, kitapAdi === null ? 1000 : 0); 
}

/**
 * Kitap önerisini tarayıcının yerleşik paylaşım mekanizmasıyla paylaşır.
 */
function paylasimiBaslat(kitapAdi, kullaniciAdi) {
    const duzeltilmisAd = kullaniciAdi.charAt(0).toUpperCase() + kullaniciAdi.slice(1);
    const paylasimMetni = `${duzeltilmisAd}! Kitap Öneri Motoru bana "${kitapAdi}" kitabını önerdi. Sen de dene!`;
    const paylasimBasligi = "Kitap Önerimi Paylaşıyorum";
    
    if (navigator.share) {
        navigator.share({
            title: paylasimBasligi,
            text: paylasimMetni,
            url: window.location.href
        })
        .then(() => console.log('Başarıyla paylaşıldı'))
        .catch((error) => console.error('Paylaşım başarısız oldu', error));
    } else {
        navigator.clipboard.writeText(paylasimMetni + " [Sayfa Adresi: " + window.location.href + "]");
        alert('Paylaşım metni panoya kopyalandı!');
    }
}


// --- OLAY DİNLEYİCİLERİ ---
oneriButonu.addEventListener("click", () => kitapOnerisiVer(null)); 
aySelect.addEventListener("change", burcuGoster);
gunInput.addEventListener("input", burcuGoster);
temaButonu.addEventListener("click", temayiDegistir);
favoriGosterButonu.addEventListener("click", () => favorileriGoster());
istatistikGizleButonu.addEventListener('click', istatistikAlaniniGizleToggle);
yoneticiButonu.addEventListener("click", yoneticiPaneliniGoster); // Yönetici Paneli Dinleyicisi

document.addEventListener('DOMContentLoaded', verileriYukle);
document.addEventListener('DOMContentLoaded', ziyaretciSayaciniBaslat);