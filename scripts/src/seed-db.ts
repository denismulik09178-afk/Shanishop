import { db, pool, perfumesTable, categoriesTable } from "@workspace/db";

const categories = [
  { name: "Свіжі, цитрусові та акватичні", slug: "fresh", description: "Легкі й освіжаючі аромати з нотами цитрусів, морської свіжості та зелені", imageUrl: "/perfumes/IMG_2924.jpeg", sortOrder: 1 },
  { name: "Деревні та фужерні", slug: "woody", description: "Теплі та елегантні аромати з нотами деревини, мосу та гіркого зеленого", imageUrl: "/perfumes/IMG_2925.jpeg", sortOrder: 2 },
  { name: "Солодкі, пряні та гурманські", slug: "sweet", description: "Чуттєві аромати з нотами ванілі, амбри, прянощів і солодощів", imageUrl: "/perfumes/IMG_2923.jpeg", sortOrder: 3 },
  { name: "Димні, шкіряні та східні", slug: "smoky", description: "Глибокі й загадкові аромати з нотами смоли, шкіри і уду", imageUrl: "/perfumes/IMG_2927.jpeg", sortOrder: 4 },
];

const PERFUMES = [
  { name: "Le Beau Le Parfum", brand: "Jean Paul Gaultier", pricePerMl: 59, description: "Акватичний тропічний аромат — кокос, гваяк і морський бриз.", notes: "Кокос · Гваяк · Бергамот · Морський акорд", imageUrl: "/perfumes/IMG_2901.jpeg", categorySlug: "fresh", isFeatured: true },
  { name: "Bleu de Chanel", brand: "Chanel", pricePerMl: 65, description: "Дерево-ароматичний аромат, що поєднує свіжість цитрусів з глибиною деревних нот.", notes: "Лимон · Мята · Джинджер · Сандал · Ладан", imageUrl: "/perfumes/IMG_2904.jpeg", categorySlug: "fresh", isFeatured: true },
  { name: "Terre d'Hermès", brand: "Hermès", pricePerMl: 55, description: "Мінеральний фужерний аромат про зв'язок між людиною та землею.", notes: "Апельсин · Грейпфрут · Кремінь · Ветівер · Кедр", imageUrl: "/perfumes/IMG_2905.jpeg", categorySlug: "fresh", isFeatured: false },
  { name: "Y Eau de Parfum", brand: "Yves Saint Laurent", pricePerMl: 59, description: "Сміливий сучасний аромат для чоловіка без правил.", notes: "Яблуко · Шавлія · Лаванда · Кедр · Амбра", imageUrl: "/perfumes/IMG_2908.jpeg", categorySlug: "fresh", isFeatured: false },
  { name: "Iced Cologne", brand: "Yves Saint Laurent", pricePerMl: 65, description: "Крижана свіжість з нотами мандарину та бергамоту.", notes: "Мандарин · Бергамот · Ялівець · Мускус", imageUrl: "/perfumes/IMG_2909.jpeg", categorySlug: "fresh", isFeatured: false },
  { name: "Megamare", brand: "Orto Parisi", pricePerMl: 115, description: "Радикально морський аромат — глибина океану, солоність та водорості.", notes: "Морська сіль · Водорості · Деревний мускус · Амбра", imageUrl: "/perfumes/IMG_2913.jpeg", categorySlug: "fresh", isFeatured: true },
  { name: "Blue Talisman", brand: "Ex Nihilo", pricePerMl: 179, description: "Свіжий морський аромат з паризьким шармом.", notes: "Бергамот · Морський акорд · Ветівер · Кедр · Амброксан", imageUrl: "/perfumes/IMG_2924.jpeg", categorySlug: "fresh", isFeatured: false },
  { name: "Aventus", brand: "Creed", pricePerMl: 139, description: "Легендарний аромат з нотами ананасу, берези і мускусу. Символ успіху.", notes: "Ананас · Береза · Пачулі · Мускус · Дубовий мох", imageUrl: "/perfumes/IMG_2926.jpeg", categorySlug: "fresh", isFeatured: true },
  { name: "L12.12 Blanc", brand: "Lacoste", pricePerMl: 35, description: "Чистий, свіжий і легкий — як білосніжна пікейна сорочка.", notes: "Мандарин · Рожевий перець · Лаванда · Кедр", imageUrl: "/perfumes/IMG_2933.jpeg", categorySlug: "fresh", isFeatured: false },
  { name: "This Is Not GABA", brand: "Hormone", pricePerMl: 129, description: "Молекулярний парфум нового покоління. Мінімалістичний, але надзвичайно стійкий.", notes: "Амброксан · Мускус · Молекула · Білий мускус", imageUrl: "/perfumes/IMG_2930.jpeg", categorySlug: "fresh", isFeatured: false },
  { name: "Layton", brand: "Parfums de Marly", pricePerMl: 119, description: "Квітково-деревний шедевр — свіжий і елегантний одночасно.", notes: "Яблуко · Лаванда · Ваніль · Сандал · Мускус", imageUrl: "/perfumes/IMG_2929.jpeg", categorySlug: "fresh", isFeatured: false },
  { name: "L'Homme", brand: "Yves Saint Laurent", pricePerMl: 35, description: "Витончений сучасний чоловічий аромат з нотами імбиру та базиліку.", notes: "Імбир · Базилік · Лаванда · Кедр · Тонка боб", imageUrl: "/perfumes/IMG_2934.jpeg", categorySlug: "fresh", isFeatured: false },
  { name: "Born In Roma Intense", brand: "Valentino", pricePerMl: 75, description: "Деревно-пряний аромат для тих, хто народжений для пристрасті.", notes: "Бергамот · Кардамон · Ветівер · Сандал · Ладан", imageUrl: "/perfumes/IMG_2903.jpeg", categorySlug: "woody", isFeatured: false },
  { name: "Stronger With You Powerfully", brand: "Giorgio Armani", pricePerMl: 69, description: "Насичений і сміливий — аромат для чоловіка, що знає свою силу.", notes: "Кардамон · Шавлія · Кашемірне дерево · Ветівер", imageUrl: "/perfumes/IMG_2906.jpeg", categorySlug: "woody", isFeatured: false },
  { name: "Stronger With You Absolutely", brand: "Giorgio Armani", pricePerMl: 69, description: "Магнетична версія Stronger With You — з нотами смоли і кардамону.", notes: "Смола берези · Шавлія · Кардамон · Ветівер · Мускус", imageUrl: "/perfumes/IMG_2907.jpeg", categorySlug: "woody", isFeatured: false },
  { name: "Homme Intense", brand: "Dior", pricePerMl: 75, description: "Порошковий ірисовий аромат з деревними нотами.", notes: "Ірис · Лаванда · Амброксан · Кедр · Ветівер", imageUrl: "/perfumes/IMG_2914.jpeg", categorySlug: "woody", isFeatured: false },
  { name: "Bois Impérial", brand: "Essential Parfums", pricePerMl: 79, description: "Сандал, ветівер і рожевий перець — королівське деревне тріо.", notes: "Сандал · Ветівер · Рожевий перець · Пачулі · Амброксан", imageUrl: "/perfumes/IMG_2917.jpeg", categorySlug: "woody", isFeatured: true },
  { name: "Viride", brand: "Orto Parisi", pricePerMl: 145, description: "Зелено-деревний аромат від культового нішевого будинку.", notes: "Зелений акорд · Трава · Деревний мускус · Ветівер", imageUrl: "/perfumes/IMG_2912.jpeg", categorySlug: "woody", isFeatured: false },
  { name: "Oud Maracujá", brand: "Maison Crivelli", pricePerMl: 289, description: "Унікальне поєднання уду та маракуї — екзотичний і дивовижний аромат.", notes: "Маракуя · Уд · Ветівер · Амбра · Мускус", imageUrl: "/perfumes/IMG_2925.jpeg", categorySlug: "woody", isFeatured: false },
  { name: "Torino23", brand: "Xerjoff", pricePerMl: 119, description: "Флоральний деревний аромат від одного з найрозкішніших парфумерних домів.", notes: "Бергамот · Троянда · Іланг-іланг · Пачулі · Сандал", imageUrl: "/perfumes/IMG_2932.jpeg", categorySlug: "woody", isFeatured: false },
  { name: "Le Male Le Parfum", brand: "Jean Paul Gaultier", pricePerMl: 59, description: "Солодкий і чуттєвий — ваніль і лаванда в ідеальній гармонії.", notes: "Лаванда · Ваніль · Карамель · Мускус · Амбра", imageUrl: "/perfumes/IMG_2900.jpeg", categorySlug: "sweet", isFeatured: true },
  { name: "Le Male Elixir", brand: "Jean Paul Gaultier", pricePerMl: 59, description: "Східна насичена версія Le Male — ваніль, кориця і солодка смола.", notes: "Ваніль · Кориця · Сандал · Смола · Мускус", imageUrl: "/perfumes/IMG_2902.jpeg", categorySlug: "sweet", isFeatured: false },
  { name: "Tobacco Vanille", brand: "Tom Ford", pricePerMl: 89, description: "Тютюн і ваніль — по-справжньому чуттєвий і розкішний аромат.", notes: "Тютюн · Ваніль · Какао · Тонка боб · Сухофрукти", imageUrl: "/perfumes/IMG_2916.jpeg", categorySlug: "sweet", isFeatured: false },
  { name: "No.4 Elixir Charnels", brand: "Thomas Kosmala", pricePerMl: 75, description: "Кремова солодка і інтенсивна — ваніль та сандал у найрозкішнішому виконанні.", notes: "Ваніль · Сандал · Мускус · Бензоїн · Амбра", imageUrl: "/perfumes/IMG_2910.jpeg", categorySlug: "sweet", isFeatured: false },
  { name: "Angels' Share", brand: "Kilian", pricePerMl: 169, description: "Коньяк і дубовий бочонок — аромат натхнений ритуалом витримки коньяку.", notes: "Коньяк · Кориця · Кардамон · Сандал · Ваніль", imageUrl: "/perfumes/IMG_2918.jpeg", categorySlug: "sweet", isFeatured: true },
  { name: "Baccarat Rouge 540 Extrait", brand: "Maison Francis Kurkdjian", pricePerMl: 149, description: "Один з найвпізнаваніших ароматів у світі. Жасмін, шафран і амброксан.", notes: "Шафран · Жасмін · Кедр · Амброксан · Фуранол", imageUrl: "/perfumes/IMG_2923.jpeg", categorySlug: "sweet", isFeatured: true },
  { name: "Bade'e Al Oud Amethyst", brand: "Lattafa", pricePerMl: 25, description: "Доступний але розкішний аромат у стилі Baccarat Rouge.", notes: "Шафран · Флоральні ноти · Уд · Мускус · Амбра", imageUrl: "/perfumes/IMG_2922.jpeg", categorySlug: "sweet", isFeatured: false },
  { name: "Remember Me", brand: "Jovoy", pricePerMl: 99, description: "Чуттєвий і загадковий — квіткові ноти зустрічаються з деревним серцем.", notes: "Малина · Троянда · Ваніль · Сандал · Амбра", imageUrl: "/perfumes/IMG_2931.jpeg", categorySlug: "sweet", isFeatured: false },
  { name: "God of Fire", brand: "Stéphane Humbert Lucas", pricePerMl: 229, description: "Натхнений стародавнім богом вогню — квіти, мед і солодкий дим.", notes: "Мед · Жасмін · Бджолиний віск · Смола · Гвоздика", imageUrl: "/perfumes/IMG_2928.jpeg", categorySlug: "sweet", isFeatured: false },
  { name: "Ombré Leather", brand: "Tom Ford", pricePerMl: 79, description: "Чорна шкіра, кардамон і квіти пачулі — фетишний магнетичний аромат.", notes: "Кардамон · Пачулі · Шкіра · Флоральні ноти · Мускус", imageUrl: "/perfumes/IMG_2915.jpeg", categorySlug: "smoky", isFeatured: false },
  { name: "Smoking Hot", brand: "Kilian", pricePerMl: 249, description: "Сигарна шкіра і солодкий мигдаль — провокаційний і непоборний аромат.", notes: "Тютюн · Шкіра · Мигдаль · Пачулі · Сандал", imageUrl: "/perfumes/IMG_2919.jpeg", categorySlug: "smoky", isFeatured: false },
  { name: "Terroni", brand: "Orto Parisi", pricePerMl: 145, description: "Земляний, сирний і провокативний. Незабутній для кожного хто відчує.", notes: "Земля · Сир · Шкіра · Пачулі · Мускус", imageUrl: "/perfumes/IMG_2911.jpeg", categorySlug: "smoky", isFeatured: false },
  { name: "Hedonistic", brand: "Clive Christian", pricePerMl: 349, description: "Ультрарозкішний аромат від одного з найдорожчих парфумерних домів світу.", notes: "Тютюн · Уд · Ваніль · Шкіра · Пачулі", imageUrl: "/perfumes/IMG_2921.jpeg", categorySlug: "smoky", isFeatured: true },
  { name: "Atlas Fever", brand: "Ex Nihilo", pricePerMl: 349, description: "Золотий і таємничий — смола, амброксан і важке дерево. Аромат-афродизіак.", notes: "Смола · Амброксан · Уд · Ладан · Сандал", imageUrl: "/perfumes/IMG_2920.jpeg", categorySlug: "smoky", isFeatured: false },
  { name: "Tygar Extrait", brand: "Bvlgari", pricePerMl: 189, description: "Чорний і золотий — уд, шкіра і деревне серце в найчистішому вигляді.", notes: "Уд · Шкіра · Кедр · Амбра · Мускус", imageUrl: "/perfumes/IMG_2927.jpeg", categorySlug: "smoky", isFeatured: false },
];

async function seed() {
  console.log("🌱 Starting seed...");
  await db.delete(perfumesTable);
  await db.delete(categoriesTable);
  console.log("🗑️  Cleared existing data");

  const insertedCategories = await db.insert(categoriesTable).values(categories).returning();
  console.log(`✅ Inserted ${insertedCategories.length} categories`);

  const catMap = new Map<string, number>();
  for (const cat of insertedCategories) catMap.set(cat.slug, cat.id);

  const perfumeValues = PERFUMES.map((p) => ({
    name: p.name,
    brand: p.brand,
    pricePerMl: p.pricePerMl,
    description: p.description,
    notes: p.notes,
    imageUrl: p.imageUrl,
    categoryId: catMap.get(p.categorySlug) ?? null,
    inStock: true,
    isFeatured: p.isFeatured,
  }));

  const inserted = await db.insert(perfumesTable).values(perfumeValues).returning();
  console.log(`✅ Inserted ${inserted.length} perfumes`);
  console.log("🎉 Seed complete!");
  await pool.end();
}

seed().catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); });
