--
-- PostgreSQL database dump
--

\restrict mGt9g8OkNQbvsbSP4gazWbWxg6IM4Uxcih5TfCbuQtutgahqglfkaLIS3qEeZ8i

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    image_url text,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    customer_name text NOT NULL,
    customer_phone text NOT NULL,
    customer_address text,
    customer_comment text,
    status text DEFAULT 'pending'::text NOT NULL,
    total real NOT NULL,
    items jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: perfumes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.perfumes (
    id integer NOT NULL,
    name text NOT NULL,
    brand text NOT NULL,
    price_per_ml real NOT NULL,
    description text,
    notes text,
    image_url text,
    category_id integer,
    in_stock boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: perfumes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.perfumes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: perfumes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.perfumes_id_seq OWNED BY public.perfumes.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: perfumes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfumes ALTER COLUMN id SET DEFAULT nextval('public.perfumes_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, description, image_url, sort_order) FROM stdin;
1	Свіжі, цитрусові та акватичні	fresh	Легкі й освіжаючі аромати з нотами цитрусів, морської свіжості та зелені	/perfumes/IMG_2924.jpeg	1
2	Деревні та фужерні	woody	Теплі та елегантні аромати з нотами деревини, мосу та гіркого зеленого	/perfumes/IMG_2925.jpeg	2
3	Солодкі, пряні та гурманські	sweet	Чуттєві аромати з нотами ванілі, амбри, прянощів і солодощів	/perfumes/IMG_2923.jpeg	3
4	Димні, шкіряні та східні	smoky	Глибокі й загадкові аромати з нотами смоли, шкіри і уду	/perfumes/IMG_2927.jpeg	4
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, customer_name, customer_phone, customer_address, customer_comment, status, total, items, created_at) FROM stdin;
\.


--
-- Data for Name: perfumes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.perfumes (id, name, brand, price_per_ml, description, notes, image_url, category_id, in_stock, is_featured, created_at) FROM stdin;
11	Layton	Parfums de Marly	119	Квітково-деревний шедевр — свіжий і елегантний одночасно.	Яблуко · Лаванда · Ваніль · Сандал · Мускус	/perfumes/IMG_2929.jpeg	1	t	f	2026-06-19 15:41:04.360675+00
14	Stronger With You Powerfully	Giorgio Armani	69	Насичений і сміливий — аромат для чоловіка, що знає свою силу.	Кардамон · Шавлія · Кашемірне дерево · Ветівер	/perfumes/IMG_2906.jpeg	2	t	f	2026-06-19 15:41:04.360675+00
21	Le Male Le Parfum	Jean Paul Gaultier	59	Солодкий і чуттєвий — ваніль і лаванда в ідеальній гармонії.	Лаванда · Ваніль · Карамель · Мускус · Амбра	/perfumes/IMG_2900.jpeg	3	t	t	2026-06-19 15:41:04.360675+00
16	Homme Intense	Dior	75	Dior Homme Intense — квінтесенція французького шарму у своєму найсміливішому прояві. Іриси надають йому пудровості та ніжності, тоді як амброва основа і ваніль наповнюють теплом та чуттєвістю. Це аромат, що зачаровує з першого подиху і не відпускає ще довго після зустрічі.	Ірис · Лаванда · Амброксан · Кедр · Ветівер	/perfumes/IMG_2914.jpeg	2	t	f	2026-06-19 15:41:04.360675+00
7	Blue Talisman	Ex Nihilo	179	Blue Talisman від Ex Nihilo — талісман з морської глибини. Аквальні ноти та ірис поєднуються у кришталево чистій симфонії, що очищає розум і заспокоює душу. Цей аромат — ваш особистий оберіг, невидимий, але відчутний усіма навколо.	Бергамот · Морський акорд · Ветівер · Кедр · Амброксан	/perfumes/IMG_2924.jpeg	1	t	f	2026-06-19 15:41:04.360675+00
10	This Is Not GABA	Hormone	129	This Is Not GABA від Hormone — провокація у флаконі. Авангардний аромат, що кидає виклик умовностям і виходить за межі звичного. Незвичайні молекулярні сполуки створюють унікальний парфумерний досвід, який неможливо описати — лише відчути.	Амброксан · Мускус · Молекула · Білий мускус	/perfumes/IMG_2930.jpeg	1	t	f	2026-06-19 15:41:04.360675+00
22	Le Male Elixir	Jean Paul Gaultier	59	Le Male Elixir від Jean Paul Gaultier — найсміливіша та найчуттєвіша інтерпретація легендарного Le Male. Лавандово-медовий початок переходить у теплу суміш ваніль та деревних нот, занурюючи у вир чуттєвості та пристрасті. Це не просто аромат — це ритуал зваблювання.	Ваніль · Кориця · Сандал · Смола · Мускус	/perfumes/IMG_2902.jpeg	3	t	f	2026-06-19 15:41:04.360675+00
19	Oud Maracujá	Maison Crivelli	289	Oud Maracujá від Maison Crivelli — зустріч Сходу та тропіків. Соковита маракуйя танцює з деревним удом у карнавальному пориві радості та спокуси. Цей аромат руйнує межі — він одночасно свіжий і глибокий, тропічний і містичний.	Маракуя · Уд · Ветівер · Амбра · Мускус	/perfumes/IMG_2925.jpeg	2	t	f	2026-06-19 15:41:04.360675+00
6	Megamare	Orto Parisi	115	Megamare від Orto Parisi — море у найрадикальнішому вигляді. Аквальні, йодисті та мінеральні ноти відтворюють відчуття солоного вітру прямо над відкритим океаном. Це не пляжний парфум — це морська стихія у чистому вигляді, для тих, хто не боїться сили природи.	Морська сіль · Водорості · Деревний мускус · Амбра	/perfumes/IMG_2913.jpeg	1	t	t	2026-06-19 15:41:04.360675+00
13	Born In Roma Intense	Valentino	75	Born In Roma Intense від Valentino — вічне місто у своєму найпристраснішому вираженні. Деревна основа і парфумерний ірис поєднані у модерній оді Риму — місту, де краса є єдиним законом. Інтенсивний, безкомпромісний, гідний Вічного міста.	Бергамот · Кардамон · Ветівер · Сандал · Ладан	/perfumes/IMG_2903.jpeg	2	t	f	2026-06-19 15:41:04.360675+00
5	Iced Cologne	Yves Saint Laurent	65	Iced Cologne від Yves Saint Laurent — крига і вогонь в одному подиху. Надзвичайна свіжість цедри та морських нот миттєво занурює у відчуття свободи, ніби стрибок у холодну морську хвилю у розпал літа. Освіжає, бадьорить і нагадує, що жити — це насолода.	Мандарин · Бергамот · Ялівець · Мускус	/perfumes/IMG_2909.jpeg	1	t	f	2026-06-19 15:41:04.360675+00
3	Terre d'Hermès	Hermès	55	Terre d’Hermès — земля, пов’ітря, вогонь у єдиному флаконі. Легендарний аромат Жан-Клода Елленa поєднує свіжість цедри з мінеральною кременевою основою та теплом деревних нот. Це аромат чоловіка, міцно пов’язаного з природою і водночас абсолютно вільного.	Апельсин · Грейпфрут · Кремінь · Ветівер · Кедр	/perfumes/IMG_2905.jpeg	1	t	f	2026-06-19 15:41:04.360675+00
23	Tobacco Vanille	Tom Ford	89	Tobacco Vanille від Tom Ford — найрозкішніша ваніль у парфумерній історії. Тютюн і ваніль обплiтаються у гедоністичному поривi, де кожний вдих — це задоволення, а кожен видих — мрія. Цей аромат носять зіркові ночі, а не буденні дні.	Тютюн · Ваніль · Какао · Тонка боб · Сухофрукти	/perfumes/IMG_2916.jpeg	3	t	f	2026-06-19 15:41:04.360675+00
28	Remember Me	Jovoy	99	Чуттєвий і загадковий — квіткові ноти зустрічаються з деревним серцем.	Малина · Троянда · Ваніль · Сандал · Амбра	/perfumes/IMG_2931.jpeg	3	t	f	2026-06-19 15:41:04.360675+00
32	Terroni	Orto Parisi	145	Земляний, сирний і провокативний. Незабутній для кожного хто відчує.	Земля · Сир · Шкіра · Пачулі · Мускус	/perfumes/IMG_2911.jpeg	4	t	f	2026-06-19 15:41:04.360675+00
35	Tygar Extrait	Bvlgari	189	Tygar Extrait від Bvlgari — це тріумф розкоші та сили. Екзотична суміш деревних нот і смолистих акордів огортає шкіру непроникною аурою могутності. Кожна крапля — немов рикання тигра: стримане, але незабутнє. Цей аромат створений для тих, хто не потребує слів — він говорить сам за себе.	Уд · Шкіра · Кедр · Амбра · Мускус	/perfumes/IMG_2927.jpeg	4	t	f	2026-06-19 15:41:04.360675+00
33	Hedonistic	Clive Christian	349	Hedonistic від Clive Christian — ода чуттєвій насолоді у найчистішому вигляді. Найвишуканіші інгредієнти зі всього світу поєднані у захмарно розкішну композицію, де троянда, жасмин та мускус зливаються в нескінченному танці. Цей парфум не просто чується — він відчувається всією душею.	Тютюн · Уд · Ваніль · Шкіра · Пачулі	/perfumes/IMG_2921.jpeg	4	t	t	2026-06-19 15:41:04.360675+00
8	Aventus	Creed	139	Aventus від Creed — еталон нішевої парфумерії, що став легендою. Диміння березового дьогтю, соковитий ананас та свіжість яблука — це аромат тріумфу, сили і наполеоновських амбіцій. Aventus носять лідери, мрійники та ті, хто залишає слід у цьому світі.	Ананас · Береза · Пачулі · Мускус · Дубовий мох	/perfumes/IMG_2926.jpeg	1	t	t	2026-06-19 15:41:04.360675+00
17	Bois Impérial	Essential Parfums	79	Bois Impérial від Essential Parfums — імператорський ліс у флаконі. Сандал, пачулі та уд утворюють царський тандем, де кожна нота звучить гідно та вагомо. Мінімалістичний у формі, максимальний у змісті — цей аромат для тих, хто обирає глибину над гучністю.	Сандал · Ветівер · Рожевий перець · Пачулі · Амброксан	/perfumes/IMG_2917.jpeg	2	t	t	2026-06-19 15:41:04.360675+00
34	Atlas Fever	Ex Nihilo	349	Atlas Fever від Ex Nihilo — це жага пригод, закодована у парфуму. Пряні акорди кардамону й шафрану розкриваються у теплі деревних нот і мускусу, ніби розповідаючи казку про далекі гори та нескорені горизонти. Ідеальний компаньйон для натур сміливих і пристрасних.	Смола · Амброксан · Уд · Ладан · Сандал	/perfumes/IMG_2920.jpeg	4	t	f	2026-06-19 15:41:04.360675+00
15	Stronger With You Absolutely	Giorgio Armani	69	Stronger With You Absolutely від Giorgio Armani — це пристрасть, підкреслена до максимуму. Каштан, ваніль і дерево — тріада розкоші, що окутує теплом і чуттєвістю. Назва говорить сама за себе: з ним ти стаєш кращою, сильнішою, непереборнішою версією себе.	Смола берези · Шавлія · Кардамон · Ветівер · Мускус	/perfumes/IMG_2907.jpeg	2	t	f	2026-06-19 15:41:04.360675+00
1	Le Beau Le Parfum	Jean Paul Gaultier	59	Le Beau Le Parfum від Jean Paul Gaultier — ода сонцю, морю та безтурботній розкоші. Кокос і тонка ваніль огортають свіжість бергамоту, створюючи аромат незабутніх літніх спогадів. Це парфум-мрія для тих, хто носить сонце у серці навіть у найхмурніший день.	Кокос · Гваяк · Бергамот · Морський акорд	/perfumes/IMG_2901.jpeg	1	t	t	2026-06-19 15:41:04.360675+00
25	Angels' Share	Kilian	169	Angels Share від Kilian — «частка ангелів», та що випаровується з бочок коньяку. Розкішна суміш коньяку, кардамону, ваніліні та кедру занурює у атмосферу аристократичного погреба, де час зупинився, а кожна крапля коштує на вагу золота.	Коньяк · Кориця · Кардамон · Сандал · Ваніль	/perfumes/IMG_2918.jpeg	3	t	t	2026-06-19 15:41:04.360675+00
27	Bade'e Al Oud Amethyst	Lattafa	25	Bade Al Oud Amethyst від Lattafa — скарб Сходу в сучасному прочитанні. Уд, шафран і троянда зливаються у багатошаровій композиції, що розкривається хвилями протягом усього дня. Це аромат таємниці, розкоші та незлічених казкових ночей.	Шафран · Флоральні ноти · Уд · Мускус · Амбра	/perfumes/IMG_2922.jpeg	3	t	f	2026-06-19 15:41:04.360675+00
30	Ombré Leather	Tom Ford	79	Ombrе Leather від Tom Ford — шкіра, пил і пристрасть далекого заходу. Квіти і пачулі обрамляють центральну ноту шкіри, що звучить грубо, сміливо і неприборкано. Для тих, хто не іде прокладеними шляхами і залишає власний слід у цьому світі.	Кардамон · Пачулі · Шкіра · Флоральні ноти · Мускус	/perfumes/IMG_2915.jpeg	4	t	f	2026-06-19 15:41:04.360675+00
31	Smoking Hot	Kilian	249	Smoking Hot від Kilian — провокація та шарм у одному флаконі. Тютюн і деревні ноти переплітаються з квітковим серцем, створюючи сміливий, сексуальний і незабутній шлейф. Цей аромат для тих, хто знає, як запалити весь зал одним лише своїм входом.	Тютюн · Шкіра · Мигдаль · Пачулі · Сандал	/perfumes/IMG_2919.jpeg	4	t	f	2026-06-19 15:41:04.360675+00
9	L12.12 Blanc	Lacoste	35	L12.12 Blanc від Lacoste — свіжість тенісного корту, пляжного вітру та чистого льону. Легкий, бадьорий, абсолютно невимушений — цей аромат ідеально передає дух спортивної елегантності бренду. Його надягають вранці і носять весь день без жодної краплі сумніву.	Мандарин · Рожевий перець · Лаванда · Кедр	/perfumes/IMG_2933.jpeg	1	t	f	2026-06-19 15:41:04.360675+00
26	Baccarat Rouge 540 Extrait	Maison Francis Kurkdjian	149	Baccarat Rouge 540 Extrait від Maison Francis Kurkdjian — культовий шедевр сучасної парфумерії. Деревний амброксан і шафран у кришталевому флаконі створюють гіпнотичний підпис, що залишається на шкірі годинами. Це аромат не просто відомий — він бажаний усіма і недосяжний для більшості.	Шафран · Жасмін · Кедр · Амброксан · Фуранол	/perfumes/IMG_2923.jpeg	3	t	t	2026-06-19 15:41:04.360675+00
20	Torino23	Xerjoff	119	Torino23 від Xerjoff — ода елегантності та досконалості. Бергамот, іриси та сандал утворюють виважену, тонку та бездоганно вивірену симфонію. Кожна нота звучить чисто та цілеспрямовано, як справжній шедевр ювелірного мистецтва.	Бергамот · Троянда · Іланг-іланг · Пачулі · Сандал	/perfumes/IMG_2932.jpeg	2	t	f	2026-06-19 15:41:04.360675+00
12	L'Homme	Yves Saint Laurent	35	L Homme від Yves Saint Laurent — портрет сучасного чоловіка у всій його складності. Імбир, перець та кедр малюють образ впевненого, вільного і трохи загадкового. Незмінна класика, що не виходить з моди, бо справжній стиль — поза часом.	Імбир · Базилік · Лаванда · Кедр · Тонка боб	/perfumes/IMG_2934.jpeg	1	t	f	2026-06-19 15:41:04.360675+00
4	Y Eau de Parfum	Yves Saint Laurent	59	Y Eau de Parfum від Yves Saint Laurent — амбітна декларація для тих, хто відмовляється від обмежень. Свіжий початок з яблуком і бергамотом плавно переходить у серце герані й імбиру, закріплюючись теплим сандалово-амбровим акордом. Парфум для тих, хто обирає власний шлях.	Яблуко · Шавлія · Лаванда · Кедр · Амбра	/perfumes/IMG_2908.jpeg	1	t	f	2026-06-19 15:41:04.360675+00
18	Viride	Orto Parisi	145	Viride від Orto Parisi — зелене у своїй абсолютній первозданності. Свіжі трав’яні та мохові акорди відтворюють запах лісу після грози, вологого листя та зеленого каміння. Цей аромат повертає до природи незалежно від того, де ви перебуваєте.	Зелений акорд · Трава · Деревний мускус · Ветівер	/perfumes/IMG_2912.jpeg	2	t	f	2026-06-19 15:41:04.360675+00
24	No.4 Elixir Charnels	Thomas Kosmala	75	No.4 Elixir Charnels від Thomas Kosmala — таємниця, вкрита оксамитом. Насичена суміш квіткових, деревних і мускусних нот розкривається поступово, немов розгортається загадкова розповідь без початку і кінця. Парфум для тих, хто живе між рядками.	Ваніль · Сандал · Мускус · Бензоїн · Амбра	/perfumes/IMG_2910.jpeg	3	t	f	2026-06-19 15:41:04.360675+00
29	God of Fire	Stéphane Humbert Lucas	229	God of Fire від Stéphane Humbert Lucas — жертвопринесення богу вогню. Ладан, уд та деревний дим переплiтаються у ритуальний аромат, що межує між сакральним і чуттєвим. Це парфум-молитва, що піднімається димом до неба.	Мед · Жасмін · Бджолиний віск · Смола · Гвоздика	/perfumes/IMG_2928.jpeg	3	t	f	2026-06-19 15:41:04.360675+00
2	Bleu de Chanel	Chanel	70	Bleu de Chanel — легендарна класика, що визначила стандарт сучасної чоловічої елегантності. Свіжі цитрусові ноти поступаються місцем теплому деревному серцю, залишаючи на шкірі тонкий, бездоганно вивірений слід. Це запах впевненості, стилю та незаперечного шарму — для чоловіка, який знає собі ціну.	Лимон · Мята · Джинджер · Сандал · Ладан	/perfumes/IMG_2904.jpeg	1	t	t	2026-06-19 15:41:04.360675+00
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 4, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: perfumes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.perfumes_id_seq', 35, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_unique UNIQUE (slug);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: perfumes perfumes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfumes
    ADD CONSTRAINT perfumes_pkey PRIMARY KEY (id);


--
-- Name: perfumes perfumes_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.perfumes
    ADD CONSTRAINT perfumes_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict mGt9g8OkNQbvsbSP4gazWbWxg6IM4Uxcih5TfCbuQtutgahqglfkaLIS3qEeZ8i

