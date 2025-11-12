// ==========================================================
// 1. FIREBASE YAPILANDIRMASI (SİZİN BİLGİLERİNİZ)
// ==========================================================

const firebaseConfig = {
    // BURAYA KENDİ GERÇEK FIREBASE BİLGİLERİNİZİ YAPIŞTIRIN!
    apiKey: "AIzaSyCRCFgjybvfnpdB4U2nL2u3vg5nH9fzJzs", 
    authDomain: "kitap-oneri-motoru-canli-b7b8f.firebaseapp.com",
    projectId: "kitap-oneri-motoru-canli-b7b8f",
    storageBucket: "kitap-oneri-motoru-canli-b7b8f.firebasestorage.app",
    messagingSenderId: "289804477639",
    appId: "1:289804477639:web:f609dd649e40d25d1acae2",
    measurementId: "G-V0LREF2YQL"
};

// Firebase Uygulamasını Başlat
const app = firebase.initializeApp(firebaseConfig);
const database = app.database();
const kitaplarRef = database.ref('kitaplar'); // Tüm kitap verilerini tutacağımız ana referans

// ==========================================================
// 2. KİTAP VE BURÇ VERİLERİ (RESİM SORUNU DÜZELTİLDİ)
// ==========================================================

const kitapVerileri = {
    terazi: {
        genel: { isim: "Bilinmeyen Bir Kadının Mektubu", yazar: "Stefan Zweig", resim: "", aciklama: "Romantizm ve denge arayan Teraziler için, tutkulu ve hüzünlü bir klasik.", tur: "genel" },
        fantastik: { isim: "Dune", yazar: "Frank Herbert", resim: "", aciklama: "Sabırlı ve köklü Teraziler için derinliği olan bir bilim kurgu klasiği", tur: "fantastik" },
        gelisim: { isim: "Atomik Alışkanlıklar", yazar: "James Clear", resim: "", aciklama: "Pratik ve düzenli Boğaların günlük rutinlerini geliştirmesi için.", tur: "gelisim" }
    },
    akrep: {
        genel: { isim: "Suç ve Ceza", yazar: "Dostoyevski", resim: "", aciklama: "Gizemli ve derin Akreplerin ruh hallerine uygun, psikolojik bir başyapıt.", tur: "genel" },
        fantastik: { isim: "Yüzüklerin Efendisi", yazar: "J.R.R. Tolkien", resim: "", aciklama: "Yoğun duygusal yolculukları seven Akrepler için epik bir macera.", tur: "fantastik" },
        gelisim: { isim: "Duygusal Zeka", yazar: "Daniel Goleman", resim: "", aciklama: "Yoğun duyguları yönetmek isteyen Akrepler için bir rehber.", tur: "gelisim" }
    },
    yay: {
        genel: { isim: "Yol", yazar: "Jack Kerouac", resim: "", aciklama: "Özgürlüğüne düşkün ve maceraperest Yaylar için bir kült klasik.", tur: "genel" },
        fantastik: { isim: "Otostopçunun Galaksi Rehberi", yazar: "Douglas Adams", resim: "", aciklama: "Mizahı ve felsefi sorgulamayı seven Yaylar için komik bir bilim kurgu.", tur: "fantastik" },
        gelisim: { isim: "Homo Deus", yazar: "Yuval Noah Harari", resim: "", aciklama: "Geleceği ve felsefeyi merak eden Yaylar için derin bir eser.", tur: "gelisim" }
    },
    oglak: {
        genel: { isim: "Büyük Umutlar", yazar: "Charles Dickens", resim: "", aciklama: "Hırslı ve ciddi Oğlakların hayat yolculuğuna dair büyük bir roman.", tur: "genel" },
        fantastik: { isim: "V for Vendetta", yazar: "Alan Moore", resim: "", aciklama: "Disiplinli ve eleştirel Oğlaklar için distopik bir çizgi roman klasiği.", tur: "fantastik" },
        gelisim: { isim: "7 Etkili İnsan", yazar: "Stephen Covey", resim: "", aciklama: "Hedef odaklı Oğlakların verimliliğini artıracak temel bir rehber.", tur: "gelisim" }
    },
    kova: {
        genel: { isim: "1984", yazar: "George Orwell", resim: "", aciklama: "Toplumsal düzeni sorgulayan Kovalar için distopik bir başyapıt.", tur: "genel" },
        fantastik: { isim: "Cesur Yeni Dünya", yazar: "Aldous Huxley", resim: "", aciklama: "Yenilikçi ve farklı Kovalar için dikkat çekici bir bilim kurgu.", tur: "fantastik" },
        gelisim: { isim: "Sapiens", yazar: "Yuval Noah Harari", resim: "", aciklama: "İnsanlığın tarihini merak eden Kovalar için geniş kapsamlı bir eser.", tur: "gelisim" }
    },
    balik: {
        genel: { isim: "Uçurtma Avcısı", yazar: "Khaled Hosseini", resim: "", aciklama: "Duygusal ve hayal gücü yüksek Balıklar için kalpleri ısıtan bir hikaye.", tur: "genel" },
        fantastik: { isim: "Harry Potter ve Felsefe Taşı", yazar: "J.K. Rowling", resim: "", aciklama: "Hayalperest Balıkların kaçış dünyası, büyülü bir başlangıç.", tur: "fantastik" },
        gelisim: { isim: "Yaratıcı Eylem", yazar: "Brenda Ueland", resim: "", aciklama: "Sanatsal yönü güçlü Balıkların yaratıcılığını serbest bırakması için.", tur: "gelisim" }
    },
    koc: {
        genel: { isim: "Simyacı", yazar: "Paulo Coelho", resim: "", aciklama: "Maceracı ve öncü Koçların yolculuk arzularına hitap eden ilham verici bir eser.", tur: "genel" },
        fantastik: { isim: "Silmarillion", yazar: "J.R.R. Tolkien", resim: "", aciklama: "Kapsamlı mitoloji ve yaratılış hikayelerini seven Koçlar için.", tur: "fantastik" },
        gelisim: { isim: "Motivasyon", yazar: "Daniel H. Pink", resim: "", aciklama: "İçgüdüsel Koçların nasıl motive olduğunu anlaması için bilimsel bir yaklaşım.", tur: "gelisim" }
    },
    boga: {
        genel: { isim: "Gurur ve Önyargı", yazar: "Jane Austen", resim: "", aciklama: "Zevkine düşkün ve sabit fikirli Boğaların keyifle okuyacağı bir aşk klasiği.", tur: "genel" },
        fantastik: { isim: "Sır", yazar: "Rhonda Byrne", resim: "", aciklama: "Maddi güvenceye önem veren Boğaların zenginlik psikolojisini anlaması için.", tur: "fantastik" }, // Tür Düzeltildi
        gelisim: { isim: "Zengin Baba Yoksul Baba", yazar: "Robert Kiyosaki", resim: "", aciklama: "Finansal istikrarı önemseyen Boğalar için yatırım bilgeliği.", tur: "gelisim" }
    },
    ikizler: {
        genel: { isim: "Ulysses", yazar: "James Joyce", resim: "", aciklama: "Çok yönlü ve hızlı düşünen İkizlerin zekasına meydan okuyan modern bir başyapıt.", tur: "genel" },
        fantastik: { isim: "Kum Saati", yazar: "Neil Gaiman", resim: "", aciklama: "Hikaye anlatımının farklı katmanlarını seven İkizler için karmaşık bir eser.", tur: "fantastik" },
        gelisim: { isim: "Hızlı ve Yavaş Düşünme", yazar: "Daniel Kahneman", resim: "", aciklama: "Analitik ve meraklı İkizlerin karar mekanizmalarını incelemesi için.", tur: "gelisim" }
    },
    yengec: {
        genel: { isim: "Küçük Prens", yazar: "Antoine de Saint-Exupéry", resim: "", aciklama: "Duyarlı ve evine düşkün Yengeçlerin içindeki çocuğu ortaya çıkaran zamansız bir klasik.", tur: "genel" },
        fantastik: { isim: "Narnia Günlükleri", yazar: "C.S. Lewis", resim: "", aciklama: "Aile ve ev temalarını seven Yengeçler için sıcak bir fantastik seri.", tur: "fantastik" },
        gelisim: { isim: "Mindfulness", yazar: "Jon Kabat-Zinn", resim: "", aciklama: "Duygusal dalgalanmaları yönetmek isteyen Yengeçler için farkındalık rehberi.", tur: "gelisim" }
    },
    aslan: {
        genel: { isim: "Muhteşem Gatsby", yazar: "F. Scott Fitzgerald", resim: "", aciklama: "Görkemli ve dikkat çekici Aslanların ihtişam ve aşk hikayesi.", tur: "genel" },
        fantastik: { isim: "Taht Oyunları", yazar: "George R.R. Martin", resim: "", aciklama: "İktidar, liderlik ve drama seven Aslanlar için epik bir seri.", tur: "fantastik" },
        gelisim: { isim: "Liderlik", yazar: "John C. Maxwell", resim: "", aciklama: "Doğuştan lider Aslanların yeteneklerini geliştirmesi için temel bir eser.", tur: "gelisim" }
    },
    basak: {
        genel: { isim: "Gazap Üzümleri", yazar: "John Steinbeck", resim: "", aciklama: "Analitik ve detaycı Başakların toplumsal gerçeklere odaklanması için.", tur: "genel" },
        fantastik: { isim: "Kayıp Şehir Z", yazar: "David Grann", resim: "", aciklama: "Gizemleri çözmeyi seven Başakların okuyacağı gerçek olaylardan esinlenen bir macera.", tur: "fantastik" },
        gelisim: { isim: "Düzenli Olmanın Sanatı", yazar: "Marie Kondo", resim: "", aciklama: "Detaycı ve düzenli Başakların hayatlarını sadeleştirmesi için pratik bir rehber.", tur: "gelisim" }
    }
};

const burcIsimleri = {
    "koc": "Koç", "boga": "Boğa", "ikizler": "İkizler", "yengec": "Yengeç",
    "aslan": "Aslan", "basak": "Başak", "terazi": "Terazi", "akrep": "Akrep",
    "yay": "Yay", "oglak": "Oğlak", "kova": "Kova", "balik": "Balık"
};

// ==========================================================
// 3. DOM ELEMANLARI
// ==========================================================

const isimInput = document.getElementById('isim-input');
const dogumGunuInput = document.getElementById('dogum-gunu-input');
const dogumAyiSelect = document.getElementById('dogum-ayi-select');
const yasInput = document.getElementById('yas-input');
const turSelect = document.getElementById('tur-select');
const oneriButonu = document.getElementById('oneri-butonu');
const hesaplananBurcAlani = document.getElementById('hesaplanan-burc');
const sonucAlani = document.getElementById('sonuc-alani');
const favoriGosterButonu = document.getElementById('favori-goster-butonu');
const favorilerAlani = document.getElementById('favoriler-alani');
const temaDegistirButonu = document.getElementById('tema-degistir-butonu');
const istatistikAlani = document.getElementById('istatistik-alani');
const populerListe = document.getElementById('populer-liste');
const istatistikGizleButonu = document.getElementById('istatistik-gizle-butonu');
const yoneticiGosterButonu = document.getElementById('yonetici-goster-butonu');
const yoneticiPaneli = document.getElementById('yonetici-paneli');


// ==========================================================
// 4. FONKSİYONLAR
// ==========================================================

// --- UTILITY FONKSİYONLARI ---

function burcHesapla(gun, ay) {
    if (!gun || !ay) return null;
    gun = parseInt(gun);
    ay = parseInt(ay);

    if ((ay === 3 && gun >= 21) || (ay === 4 && gun <= 20)) return "koc";
    if ((ay === 4 && gun >= 21) || (ay === 5 && gun <= 21)) return "boga";
    if ((ay === 5 && gun >= 22) || (ay === 6 && gun <= 21)) return "ikizler";
    if ((ay === 6 && gun >= 22) || (ay === 7 && gun <= 23)) return "yengec";
    if ((ay === 7 && gun >= 24) || (ay === 8 && gun <= 23)) return "aslan";
    if ((ay === 8 && gun >= 24) || (ay === 9 && gun <= 23)) return "basak";
    if ((ay === 9 && gun >= 24) || (ay === 10 && gun <= 23)) return "terazi";
    if ((ay === 10 && gun >= 24) || (ay === 11 && gun <= 22)) return "akrep";
    if ((ay === 11 && gun >= 23) || (ay === 12 && gun <= 21)) return "yay";
    if ((ay === 12 && gun >= 22) || (ay === 1 && gun <= 20)) return "oglak";
    if ((ay === 1 && gun >= 21) || (ay === 2 && gun <= 19)) return "kova";
    if ((ay === 2 && gun >= 20) || (ay === 3 && gun <= 20)) return "balik";
    return null;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// --- TEMA FONKSİYONLARI ---

function temaYukle() {
    const darkmode = localStorage.getItem('dark-mode') === 'true';
    document.body.classList.toggle('dark-mode', darkmode);
    temaDegistirButonu.textContent = darkmode ? '☀️ Gündüz Modu' : '🌙 Gece Modu';
}

function temaDegistir() {
    const darkmode = !document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode', darkmode);
    localStorage.setItem('dark-mode', darkmode);
    temaDegistirButonu.textContent = darkmode ? '☀️ Gündüz Modu' : '🌙 Gece Modu';
}

// --- OYLAMA (FIREBASE) FONKSİYONLARI ---

function oyKaydet(kitapAdi, yazarAdi, oyTipi) {
    // Kitap adını key olarak kullanmak için güvenli hale getir
    const key = `${kitapAdi}-${yazarAdi}`.replace(/[\.\#\$\/\[\]]/g, '_');
    const oyRef = kitaplarRef.child(key);

    oyRef.transaction(currentData => {
        if (currentData === null) {
            currentData = {
                isim: kitapAdi,
                yazar: yazarAdi,
                likes: 0,
                dislikes: 0
            };
        }

        if (oyTipi === 'like') {
            currentData.likes = (currentData.likes || 0) + 1;
        } else if (oyTipi === 'dislike') {
            currentData.dislikes = (currentData.dislikes || 0) + 1;
        }

        return currentData;
    }, (error, committed) => {
        if (error) {
            console.error("İşlem başarısız oldu:", error);
            alert("Oylama kaydedilirken bir hata oluştu. (Firebase kurallarınızı kontrol edin)");
        } else if (committed) {
            console.log("Oylama başarıyla kaydedildi.");
        }
    });
}

// --- KİTAP ÖNERİ FONKSİYONLARI ---

function oneriGoster(kitap, burc, isim) {
    const burcAdi = burcIsimleri[bur];
    const isimParcasi = isim ? `${capitalizeFirstLetter(isim)}, ` : '';
    
    // Kitabın key'ini oluştur
    const kitapKey = `${kitap.isim}-${kitap.yazar}`.replace(/[\.\#\$\/\[\]]/g, '_');

    // Takımyıldız resmi için doğru yolu oluştur
    const takimYildizYol = `img/${burc}.png`;
    const takimYildizKucukYol = `img/${burc}_small.png`;

    // Resim var mı kontrolü (Bu kontrol resim yükleme sorununa direkt çözüm olmasa da kartın bozulmasını engeller)
    const resimHtml = kitap.resim 
        ? `<img src="${kitap.resim}" alt="${kitap.isim} Kapak" class="kitap-resmi">`
        : `<img src="${takimYildizYol}" alt="${burcAdi} Takımyıldızı" class="kitap-resmi">`; // Kapak resmi yoksa Takımyıldızı kullan

    sonucAlani.innerHTML = `
        <h3>${isimParcasi}İşte Sana Özel Öneri:</h3>
        <div class="kitap-kart animated-result">
            ${resimHtml}
            <div class="kitap-bilgi">
                <strong>${kitap.isim}</strong>
                <p>Yazar: ${kitap.yazar}</p>
                <p>(${burcAdi} Burcu İçin ${capitalizeFirstLetter(kitap.tur)})</p>
                <p class="kitap-aciklama">${kitap.aciklama}</p>
                <a class="arama-basligi" href="https://www.google.com/search?q=${kitap.isim}+kitap+fiyat" target="_blank">Google'da Fiyatını Ara</a>
            </div>
            <img src="${takimYildizKucukYol}" alt="${burcAdi} Takımyıldızı Küçük" class="takimyildiz-kucuk">
        </div>

        <div class="button-group">
            <button class="favorite-button" data-key="${kitapKey}" onclick="favoriEkle('${kitapKey}', '${kitap.isim}', '${kitap.yazar}', '${burcAdi}', '${kitap.tur}')">
                <i class="fas fa-star"></i> Favorilere Ekle
            </button>
            <button class="share-button" onclick="paylas('${kitap.isim}', '${kitap.yazar}', '${burcAdi}')">
                <i class="fas fa-share-alt"></i> Önerimi Paylaş
            </button>
        </div>

        <div class="oylama-alani">
            <p>Bu kitabı beğendin mi?</p>
            <button class="oy-butonu like-butonu" onclick="oyKaydet('${kitap.isim}', '${kitap.yazar}', 'like')"><i class="fas fa-thumbs-up"></i> Beğen</button>
            <span class="oy-sayisi loading-text"><span>.</span><span>.</span><span>.</span></span> <button class="oy-butonu dislike-butonu" onclick="oyKaydet('${kitap.isim}', '${kitap.yazar}', 'dislike')"><i class="fas fa-thumbs-down"></i> Beğenme</button>
        </div>
    `;

    // Oylama sayılarını gerçek zamanlı olarak güncelle
    const oySayisiAlani = sonucAlani.querySelector('.oy-sayisi');
    kitaplarRef.child(kitapKey).on('value', snapshot => {
        const data = snapshot.val();
        if (data) {
            const likes = data.likes || 0;
            const dislikes = data.dislikes || 0;
            oySayisiAlani.textContent = `${likes} | ${dislikes}`;
        } else {
            oySayisiAlani.textContent = `0 | 0`;
        }
    });
}

// --- İSTATİSTİK GÖRÜNTÜLEME (FIREBASE) FONKSİYONLARI ---

function istatistikleriGuncelle(kitaplar) {
    if (!kitaplar) {
        populerListe.innerHTML = '<p style="text-align: center; color: #777;">Henüz yeterli oy toplanmadı...</p>';
        return;
    }

    const kitapListesi = Object.values(kitaplar).map(kitap => ({
        ...kitap,
        netPuan: (kitap.likes || 0) - (kitap.dislikes || 0)
    }));

    // Net Puana göre sırala
    kitapListesi.sort((a, b) => b.netPuan - a.netPuan);

    populerListe.innerHTML = '';
    
    kitapListesi.slice(0, 5).forEach((kitap, index) => {
        if (kitap.netPuan > -5) { // Sadece çok fazla dislike almayanları göster
            populerListe.innerHTML += `
                <div class="populer-kitap-item">
                    <span class="kitap-sira">#${index + 1}</span>
                    <span class="kitap-isim">${kitap.isim} - ${kitap.yazar}</span>
                    <div class="oy-detay">
                        <span class="like-count"><i class="fas fa-thumbs-up"></i> ${kitap.likes || 0}</span>
                        <span class="dislike-count"><i class="fas fa-thumbs-down"></i> ${kitap.dislikes || 0}</span>
                    </div>
                </div>
            `;
        }
    });

    if (populerListe.innerHTML === '') {
         populerListe.innerHTML = '<p style="text-align: center; color: #777;">Henüz yeterli oy toplanmadı...</p>';
    }
}

// İstatistikleri Gerçek Zamanlı Dinleme
kitaplarRef.on('value', snapshot => {
    const tumKitaplar = snapshot.val();
    istatistikleriGuncelle(tumKitaplar);
});


// --- FAVORİ YÖNETİMİ (LOCAL STORAGE'DA KALACAK) ---

function favoriEkle(key, isim, yazar, burcAdi, tur) {
    let favoriler = JSON.parse(localStorage.getItem('favoriler')) || {};
    
    if (favoriler[key]) {
        alert("Bu kitap zaten favorilerinizde!");
        return;
    }

    favoriler[key] = { isim, yazar, burcAdi, tur, tarih: new Date().toLocaleDateString() };
    localStorage.setItem('favoriler', JSON.stringify(favoriler));
    alert(`${isim} favorilerinize eklendi!`);
    favorileriGoster();
}

function favoriSil(key) {
    if (confirm("Bu favoriyi silmek istediğinizden emin misiniz?")) {
        let favoriler = JSON.parse(localStorage.getItem('favoriler')) || {};
        delete favoriler[key];
        localStorage.setItem('favoriler', JSON.stringify(favoriler));
        favorileriGoster(); // Listeyi yenile
    }
}

function favorileriGoster() {
    favorilerAlani.classList.toggle('goster');
    
    if (!favorilerAlani.classList.contains('goster')) return;
    
    const favoriler = JSON.parse(localStorage.getItem('favoriler')) || {};
    let html = '<h3>⭐ Favori Kitaplarınız</h3>';

    if (Object.keys(favoriler).length === 0) {
        html += '<p style="text-align: center; color: #777; padding: 20px;">Henüz favori kitabınız yok. Bir öneri alıp ekleyebilirsiniz!</p>';
    } else {
        html += '<div class="favori-liste">';
        for (const key in favoriler) {
            const fav = favoriler[key];
            const burcKey = Object.keys(burcIsimleri).find(k => burcIsimleri[k] === fav.burcAdi);
            const takimYildizYol = `img/${burcKey}.png`;
            
            html += `
                <div class="kitap-kart favori-kart">
                    <img src="${takimYildizYol}" alt="${fav.burcAdi} Takımyıldızı" class="kitap-resmi">
                    <div class="kitap-bilgi">
                        <strong>${fav.isim}</strong>
                        <p>Yazar: ${fav.yazar}</p>
                        <p class="uyari-metni">Burç: ${fav.burcAdi} | Tür: ${capitalizeFirstLetter(fav.tur)}</p>
                    </div>
                    <button class="sil-butonu" onclick="favoriSil('${key}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
        }
        html += '</div>';
    }
    
    favorilerAlani.innerHTML = html;
}

// --- YÖNETİCİ PANELİ (SİMÜLASYON) ---

function yoneticiGoster() {
    yoneticiPaneli.classList.toggle('goster');
    if (!yoneticiPaneli.classList.contains('goster')) return;

    yoneticiPaneli.innerHTML = `
        <h3>📊 Yönetici Paneli (Demo)</h3>
        <p style="text-align: center; color: #e53935; font-weight: bold;">UYARI: Bu paneldeki veriler Local Storage'dan değil, Canlı Firebase veritabanından okunmaktadır.</p>
        <p style="text-align: center; color: #555;">Veritabanındaki tüm oylama verilerini sıfırlayabilirsiniz.</p>
        
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="verileriSifirla()" style="padding: 10px 20px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                ❌ Tüm Firebase Oylama Verilerini SIFIRLA
            </button>
        </div>
        
        <p style="margin-top: 20px;">**Firebase Veritabanı Yolu:** ${kitaplarRef.toString()}</p>
    `;
}

function verileriSifirla() {
    if (confirm("DİKKAT! Tüm kullanıcıların oylama verileri (Beğen/Beğenme) KALICI OLARAK silinecektir. Emin misiniz?")) {
        kitaplarRef.remove()
            .then(() => {
                alert("Tüm oylama verileri başarıyla sıfırlandı!");
                yoneticiGoster(); // Paneli yenile
            })
            .catch(error => {
                alert("Veri sıfırlanırken hata oluştu: " + error.message);
            });
    }
}


// --- PAYLAŞIM VE İSTATİSTİK GİZLEME ---

function paylas(isim, yazar, burcAdi) {
    const text = `🎉 Kişisel Kitap Önerim: Burcum ${burcAdi} ve bana özel önerilen kitap ${isim} - ${yazar}! Bu motoru denemelisin.`;
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: 'Kitap Önerisi',
            text: text,
            url: url
        }).catch(error => console.error('Sharing failed', error));
    } else {
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    }
}

function istatistikGizleGoster() {
    istatistikAlani.classList.toggle('gizlendi');
    const gizlendi = istatistikAlani.classList.contains('gizlendi');
    istatistikGizleButonu.innerHTML = gizlendi ? '▼ İstatistikleri Göster' : '▲ İstatistikleri Gizle';
}

// ==========================================================
// 5. OLAY DİNLEYİCİLERİ (EVENT LISTENERS)
// ==========================================================

// --- Form Alanları ---

dogumGunuInput.addEventListener('input', () => {
    const burc = burcHesapla(dogumGunuInput.value, dogumAyiSelect.value);
    hesaplananBurcAlani.textContent = bur ? `HESAPLANAN BURCUNUZ: ${burcIsimleri[bur].toUpperCase()}` : '';
});

dogumAyiSelect.addEventListener('change', () => {
    const burc = burcHesapla(dogumGunuInput.value, dogumAyiSelect.value);
    hesaplananBurcAlani.textContent = bur ? `HESAPLANAN BURCUNUZ: ${burcIsimleri[bur].toUpperCase()}` : '';
});

oneriButonu.addEventListener('click', () => {
    const gun = dogumGunuInput.value;
    const ay = dogumAyiSelect.value;
    const tur = turSelect.value;
    const isim = isimInput.value.trim();

    if (!gun || !ay || !tur || !yasInput.value) {
        alert("Lütfen tüm alanları (Gün, Ay, Yaş ve Tür) doldurun.");
        return;
    }

    const burcKey = burcHesapla(gun, ay);
    if (burcKey && kitapVerileri[burcKey] && kitapVerileri[burcKey][tur]) {
        const kitap = kitapVerileri[burcKey][tur];
        oneriGoster(kitap, burcKey, isim);
    } else {
        alert("Üzgünüz, bu burç ve tür kombinasyonu için bir öneri bulunamadı.");
    }
});

// --- Butonlar ---

temaDegistirButonu.addEventListener('click', temaDegistir);
favoriGosterButonu.addEventListener('click', favorileriGoster);
istatistikGizleButonu.addEventListener('click', istatistikGizleGoster);
yoneticiGosterButonu.addEventListener('click', yoneticiGoster);


// ==========================================================
// 6. BAŞLANGIÇ AYARLARI
// ==========================================================

window.onload = () => {
    temaYukle();
    // Sayfa yüklendiğinde istatistikler Firebase'den otomatik çekilir.
};
