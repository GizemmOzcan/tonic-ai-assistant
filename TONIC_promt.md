TONIC — Marka Ses Tonu Asistanı: Tam Uygulama Geliştirme Promptu

====================================================================



GÖREV

\-----

"Tonic" adında, tek sayfalık (single-page), çalışan bir web uygulaması geliştir. Uygulama, kullanıcının tanımladığı bir markanın ses tonunu analiz eder ve herhangi bir ham metni o markanın ses tonuna uygun şekilde yeniden yazar. Sayfa geçişi/yönlendirme YOK — tüm işlem tek ekranda gerçekleşir.



UYGULAMANIN İŞLEVSEL AKIŞI

\---------------------------

İki panelli tek sayfa:



PANEL 1 — "Markanızın Sesini Tanımlayın" (her zaman görünür, üstte)

\- Girdi alanı 1: Marka adı (kısa metin kutusu)

\- Girdi alanı 2: "Örnek marka cümlesi" (çok satırlı metin kutusu, kullanıcı markanın gerçek/örnek bir cümlesini yapıştırır)

\- Bu panelin gönderimi arka planda ANALİZ PROMPTU'nu tetikler ve bir "ses tonu profili" üretir (kullanıcıya küçük bir özet kartı olarak gösterilir: 5 madde + karakter kartı)



PANEL 2 — "Metni Dönüştür" (Panel 1'in altında, Panel 1 doldurulmadan pasif/disabled durur)

\- Sol: "Ham metninizi buraya yapıştırın" — çok satırlı girdi kutusu

\- Orta: "Dönüştür" butonu (Panel 1 boşsa disabled/gri, doluysa aktif/mor)

\- Sağ: Çıktı kutusu — dönüştürülmüş metin burada görünür

\- Buton tıklanınca arka planda sırasıyla DÖNÜŞTÜRME PROMPTU, sonra SELF-CHECK PROMPTU otomatik çalışır (kullanıcı bunu görmez, sadece son/düzeltilmiş metni görür). Çıktının hemen altında küçük gri yazıyla: "İçerik AI ile üretilmiştir, yayın öncesi gözden geçiriniz."



PROMPT ZİNCİRİ (arka planda sırayla, bir öncekinin çıktısı bir sonrakine girdi olarak verilir)

\-------------------------------------------------------------------------------------------------



\[PROMPT 1 — ANALİZ] (Panel 1 gönderildiğinde çalışır)

Sistem/prompt metni:

"Sen bir marka ses tonu uzmanısın. Aşağıda örnek bir analiz var, sonra senden aynı formatta yeni bir marka analiz etmeni isteyeceğim.



\[ÖRNEK]

Marka: Apple

Örnek cümle: 'İnovasyon bizim DNA'mızda var. Her ürün, sınırları zorlamanın bir ifadesi.'

Analiz:

\- Duygu Tonu: İlham verici, minimalist

\- Dil Zenginliği: Sade, seçkin, az kelime çok anlam

\- Cümle Yapısı: Kısa, vurgulu, ritmik

\- İkna Stratejisi: Deneyim odaklı, duygu yaratma

\- Hedef Kitle Yaklaşımı: Güçlendirici, yaratıcılığa hitap eden

\- Karakter Kartı: Apple konuşurken teknik özellik saymaz; deneyimi ve duyguyu öne çıkarır, kısa ve vurgulu cümleler kurar.



\[ŞİMDİ SIRA SENDE]

Marka: {marka\_adi}

Örnek cümle: {ornek\_cumle}



Yukarıdaki 5 boyutta bu markayı analiz et, aynı formatta bir Karakter Kartı oluştur. Sadece bu formatta yanıt ver, başka açıklama ekleme."



Çıktı, Panel 1'in altında küçük bir "Ses Tonu Profili" kartında gösterilir ve state'te saklanır (bir sonraki adımda kullanılmak üzere).



\[PROMPT 2 — DÖNÜŞTÜRME] ("Dönüştür" butonuna basıldığında çalışır)

Sistem/prompt metni:

"Sen bir marka ses tonu uzmanısın. Aşağıdaki marka ses tonu profiline göre verilen metni yeniden yazacaksın.



MARKA SES TONU PROFİLİ:

{prompt\_1\_ciktisi}



ADIM ADIM DÜŞÜN:

1\. Orijinal metnin ana mesajını ve amacını belirle

2\. Bu mesajı markanın ses tonuna nasıl aktarabilirsin?

3\. Hangi kelimeler değişmeli? (teknik/jenerik ifadeler → markanın diline uygun ifadeler)

4\. Cümle yapısını profile uygun şekilde ayarla

5\. Sonucu kontrol et: ton tutarlı mı?



KISIT (Etik): Orijinal metinde olmayan hiçbir iddia, istatistik ya da abartılı ifade ('kanıtlanmış', 'en iyi', 'garantili' vb.) EKLEME. Sadece tonu ve ifade biçimini değiştir, içeriği uydurma.



Girdi: {kullanicinin\_ham\_metni}



Sadece dönüştürülmüş metni ver, açıklama ekleme."



\[PROMPT 3 — SELF-CHECK] (Prompt 2'nin hemen ardından otomatik, arka planda çalışır — kullanıcıya gösterilmez)

Sistem/prompt metni:

"Aşağıdaki metnin, verilen marka ses tonu profiline uygun olup olmadığını değerlendir.



MARKA SES TONU PROFİLİ:

{prompt\_1\_ciktisi}



Metin: {prompt\_2\_ciktisi}



Her boyut için EVET/HAYIR ve 1 cümle açıklama ver:

\- Duygu Tonu uyumlu mu?

\- Dil Zenginliği uyumlu mu?

\- Cümle Yapısı uyumlu mu?

\- İkna Stratejisi uyumlu mu?

\- Hedef Kitle Yaklaşımı uyumlu mu?



Toplam Uygunluk: X/5

Eğer 3/5'in altındaysa, metni profile daha uygun şekilde düzelt ve SADECE son/düzeltilmiş halini ayrı bir satırda 'SON HALİ:' etiketiyle ver. 3/5 veya üzerindeyse mevcut metni 'SON HALİ:' etiketiyle aynen tekrarla."



Uygulama, "SON HALİ:" etiketinden sonraki metni Panel 2'nin çıktı kutusunda kullanıcıya gösterir.



TEKNİK UYGULAMA NOTLARI

\------------------------

\- Tek bir HTML dosyası olarak geliştir (HTML + CSS + JS aynı dosyada), sayfa yenilemesi/yönlendirme olmadan çalışsın.

\- LLM çağrıları için fetch ile bir API endpoint'ine istek at (endpoint ve model, geliştirici tarafından doldurulacak — şimdilik placeholder bırak, örn. `callLLM(promptText)` adında tek bir yardımcı fonksiyon yaz, üç prompt da bu fonksiyonu çağırsın).

\- "Dönüştür" butonuna basıldığında: buton disabled olsun, çıktı kutusunda kısa bir "..." / yükleniyor animasyonu göster, cevap gelince buton tekrar aktif olsun.

\- Panel 1 boşken Panel 2'deki "Dönüştür" butonu disabled ve gri görünsün.

\- Hata durumunda (API çağrısı başarısız olursa) çıktı kutusunda kullanıcı dostu bir hata mesajı göster, uygulamayı çökertme.



GÖRSEL TASARIM SPESİFİKASYONU

\-------------------------------

Genel mood: Koyu modda çalışan, sade ama premium hisli bir SaaS aracı. Hackathon'da acele yapılmış gibi değil, gerçek bir startup ürünü gibi görünmeli — az öğe, çok boşluk, net hiyerarşi. Gradient yok, glow/neon efekt yok, emoji/ikon fazlalığı yok.



Renk paleti:

\- Ana zemin: #14151F

\- İkincil zemin (kartlar): #1E2030

\- Ana vurgu (butonlar, aktif öğeler): #7C5CFC

\- Vurgu hover hali: #9478FF

\- Birincil metin: #F4F3F8

\- İkincil metin (placeholder, etiket): #8B8AA3

\- Kenarlık (border): #2E3044

\- Başarı/onay rengi: #4ADE80

\- Devre dışı (disabled) buton: #3A3B4A



Tipografi (Google Fonts: Inter):

\- H1 ("Tonic" logosu): 28px, weight 700, letter-spacing -0.02em

\- Panel başlıkları: 18px, weight 600

\- Gövde/input metni: 15px, weight 400

\- Etiketler/placeholder: 13px, weight 500, renk #8B8AA3

\- Buton yazısı: 15px, weight 600, letter-spacing 0.01em



Layout:

\- Sayfa max-width: 960px, ortalanmış

\- Panel arası boşluk: 24px dikey

\- Panel iç padding: 32px

\- Kart köşe yuvarlaklığı: 16px

\- Input köşe yuvarlaklığı: 10px

\- Buton köşe yuvarlaklığı: 10px

\- Panel 2 içinde masaüstünde 3 sütun (girdi %45 / buton ortada / çıktı %45), mobilde tek sütun alt alta



Bileşen detayları:

\- Kartlar: zemin #1E2030, border 1px solid #2E3044, gölge 0 8px 24px rgba(0,0,0,0.25)

\- Input kutuları: zemin #14151F, border 1px solid #2E3044 (focus'ta #7C5CFC), iç padding 12px 16px

\- Ana buton: zemin #7C5CFC (hover #9478FF), metin #F4F3F8, padding 14px 32px; disabled: zemin #3A3B4A, metin #8B8AA3

\- Çıktı kutusu: zemin #14151F, sol kenarda 3px mor şerit (#7C5CFC), boşken ortada soluk "Sonuç burada görünecek" yazısı



Mikro-etkileşimler:

\- Buton hover: 2px yukarı kalkma + gölge artışı

\- Yükleniyor durumunda: çıktı kutusunda mor renkte 3 noktalı "typing" animasyonu

\- Sonuç geldiğinde: 150ms fade-in



HEADER

\------

Sol: "Tonic" yazı logosu (ikon yok). 



ÇIKTI OLARAK İSTEDİĞİM

\------------------------

Yukarıdaki her şeyi karşılayan, tek dosyalık, çalışan bir HTML/CSS/JS prototipi üret.

