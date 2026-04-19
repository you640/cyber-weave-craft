
Najlepšie to použiť na 3 miestach, lebo každý text má inú úlohu:

1. Landing / marketing
- Použiť krátky text.
- Najvhodnejšie miesto v tomto projekte je nová sekcia na homepage medzi `Services` a `WatchedThreats` alebo hneď pod `WatchedThreats`.
- Cieľ: dôveryhodnosť a metodológia pre návštevníka.
- Alternatíva: krátky riadok aj pod nadpisom v `src/components/landing/Services.tsx`.

2. About page
- Použiť technickejšie znenie v skrátenej forme.
- V `src/pages/AboutPage.tsx` doplniť samostatný blok „Metodológia“ alebo „Autoritatívne zdroje dát“.
- Cieľ: vysvetliť, z čoho vychádza vaše hodnotenie zraniteľností.

3. Privacy / legal
- Použiť formálny text.
- Najvhodnejšie v `src/pages/PrivacyPage.tsx` ako nová sekcia o externých zdrojoch vulnerability dát.
- Dáva zmysel uviesť, že ide o verejný referenčný zdroj a že sa tam neposielajú osobné údaje klientov.
- Do `src/pages/TermsPage.tsx` by som dal len krátku vetu, nie celý blok.

Odporúčaný minimálny rozsah teraz
- `Index.tsx` + nová landing sekcia „Data Sources“
- `AboutPage.tsx` + metodológia
- `PrivacyPage.tsx` + formálna sekcia o NVD/NIST

Ako rozdeliť tvoje 3 texty
- Krátky text: homepage / produktové bloky
- Technická poznámka: About / metodológia / budúce reporty
- Formálny text: Privacy page, prípadne DPA alebo Terms len ako stručná zmienka

Čo by som zatiaľ nedával
- DPA: len ak naozaj potrebujete zmluvne riešiť externé zdroje používané pri analýzach; inak je to skôr zbytočne ťažké právne znenie.
- Dashboard Overview: až keď tam bude reálny NVD sync, cache alebo telemetry stav; zatiaľ by to pôsobilo ako placeholder.

Implementačný plán
1. Pridať novú sekciu na landing page s krátkym textom o NVD/NIST.
2. Doplniť na About page metodologický blok s technickou verziou textu.
3. Pridať do Privacy page formálnu sekciu o použití NVD ako verejného zdroja.
4. Voliteľne doplniť jednu vetu do Terms page o používaní autoritatívnych vulnerability zdrojov.

Technické detaily
- Nový komponent napr. `src/components/landing/DataSources.tsx`
- Zapojenie do `src/pages/Index.tsx`
- Úprava `src/pages/AboutPage.tsx`
- Úprava `src/pages/PrivacyPage.tsx`
- Voliteľne úprava `src/pages/TermsPage.tsx`

Obsahovo odporúčam doplniť ešte jednu dôležitú vetu
- že NVD používate ako referenčný zdroj na obohatenie a koreláciu,
- ale výsledné hodnotenie nevychádza výlučne z NVD, skôr z kombinácie NVD + interných dát + lokálneho overenia.
To je vhodné hlavne do About a reportov.

Ak to schváliš, v ďalšom kroku by som pripravil presné umiestnenie a finálne texty pre:
- homepage,
- About,
- Privacy,
- a prípadne aj Terms.
