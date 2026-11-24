# Лабораторийн ажил №1: UI автомат тест (Playwright)

Нэр: Д.Нурсолтан 
Код: В232270039


## 1. Зорилго

Playwright ашиглан веб хуудасны функционал тестийг автоматжуулж, Selenium-тэй
харьцуулан давуу талыг ойлгох.

## 2. Ажлын орчин

- OS: Debian 13 (trixie)
- Node.js: LTS (nvm-ээр суулгасан)
- Playwright төсөл: `npm init playwright@latest my-first-test` (TypeScript)
- Хөтөчүүд: Chromium, Firefox

## 3. Суулгалт

```bash
npm init playwright@latest my-first-test
cd my-first-test
npx playwright install
npx playwright test
npx playwright show-report
```

### WebKit-тэй холбоотой асуудал

Анхны жишээ тест chromium, firefox дээр 4/4 амжилттай болсон бол WebKit дээр
`Test timeout of 30000ms exceeded while setting up "page"` алдаа гарсан.
`install-deps webkit` ажиллуулж системийн сангууд бүгд суусан гэдгийг баталгаажуулсан
боловч алдаа хэвээр байсан. Тестийн код биш, Debian 13 орчинд WebKit-ийн
ажиллагаа тогтворгүй байгаатай холбоотой гэж үзэж `playwright.config.ts`-ээс
WebKit төслийг comment хийсэн (47-50-р мөр). Өөрчлөлтийн өмнөх хувилбарыг
`playwright.config.ts.bak` файлд хадгалсан.

## 4. Тестийн скрипт

Файл: `tests/mytest.spec.ts`. Тестлэсэн сайт: https://www.saucedemo.com

| № | Тест | Шалгах зүйл |
|---|------|-------------|
| 1 | Амжилттай нэвтрэх | standard_user / secret_sauce, `inventory.html` руу шилжиж "Products" харагдах |
| 2 | Буруу нууц үгээр нэвтрэх | Алдааны мессеж гарах |
| 3 | Бараа сагсанд нэмж захиалах | Сагсны badge "1", checkout, "Thank you for your order!" |
| 4 | Системээс гарах | Цэснээс Logout дарж нэвтрэх хуудас руу буцах |

### Ашигласан locator-ууд

- `getByPlaceholder`: Username, Password, First Name гэх мэт талбарууд
- `getByRole('button', { name })`: Login, Checkout, Continue, Finish
- `getByText`: "Products", "Your Cart", "Thank you for your order!"
- `getByTestId`: `test.use({ testIdAttribute: 'data-test' })`-ээр тохируулсан
  (saucedemo нь `data-testid` биш `data-test` атрибут ашигладаг)

`getByLabel`-ийг ашиглаагүй. Saucedemo-ийн оролтын талбарууд `<label>`-гүй,
placeholder-тай тул `getByPlaceholder` ашигласан.

## 5. XPath-аас яагаад зайлсхийх вэ

- **Эмзэг:** DOM бүтэц (div-ийн давхарга, дараалал) өөрчлөгдөхөд XPath эвдэрнэ.
  Role, текст, test id нь UI-ийн бүтцээс хамааралгүй.
- **Уншигдах чадвар муу:** `//div[2]/form/button[1]` гэхээс
  `getByRole('button', { name: 'Login' })` нь юу хийж буйгаа шууд илэрхийлнэ.
- **Хэрэглэгчийн өнцөг:** `getByRole` нь хэрэглэгч, screen reader элементийг хэрхэн
  хардагтай адил олдог тул accessibility-г дам шалгана.
- **Тогтвортой байдал:** Playwright-ийн auto-wait болон дахин оролдлоготой сайн
  ажилладаг тул flaky тест цөөрнө.

## 6. Тестийн явцад гарсан алдаа ба засвар

Эхний ажиллуулалтаар 8 тестийн 6 нь амжилттай, "системээс гарах" тест
chromium, firefox дээр унасан:


## Алхам 3: Assertions

Файл: `tests/assertions.spec.ts`

| № | Тест | Төрөл | Ашигласан assertion |
|---|------|-------|---------------------|
| 1 | Амжилттай нэвтрэх | Эерэг | toHaveURL, toHaveText, toBeVisible, toHaveCount |
| 2 | Буруу нууц үг | Сөрөг | toHaveURL, toBeVisible, toContainText |
| 3 | Хоосон талбар | Сөрөг | toHaveText |
| 4 | Бараа сагслах | Нэвтэрсний дараах үйлдэл | toHaveText, toBeVisible, toHaveURL, toHaveCount |

Playwright-ийн `expect` нь web-first assertion тул нөхцөл биелтэл автоматаар дахин
шалгадаг. Иймд гараар `sleep` бичих шаардлагагүй.



## Алхам 4: Codegen ба Trace viewer

### Codegen
`npx playwright codegen saucedemo.com -o tests/codegen.spec.ts` командаар нэвтрэх,
сагслах үйлдлийг бичүүлсэн. Харьцуулалт:

| Шинж | Codegen | Өөрийн бичсэн |
|------|---------|----------------|
| Locator | (codegen-ий сонгосныг энд бичнэ) | getByRole, getByPlaceholder, getByTestId |
| Assertion | (байгаа/байхгүйг бичнэ) | toHaveURL, toHaveText, toBeVisible |
| Бүтэц | Нэг урт тест | Тусдаа тестүүд, login() туслах функц |

Дүгнэлт: Codegen нь эхний ноорог, locator олоход хурдан. Харин утга учиртай assertion-ыг
өөрөө нэмж, давтагдах кодыг функц болгох шаардлагатай.

### Trace viewer
`npx playwright test --trace on`-оор бүх тестийн trace бичсэн. Алхам бүрийн DOM snapshot,
network, console-ийг цагийн шугам дээр үзэж болно.

### Санаатай унагасан тест
`tests/fail.spec.ts`-д гарчгийн текстийг "Бараанууд" гэж буруу хүлээлгэсэн. Trace viewer дээр
унасан алхам улаанаар тэмдэглэгдэж, Expected "Бараанууд" / Received "Products" гэсэн
зөрүү шууд харагдсан. Тухайн мөчийн DOM snapshot-оос хуудсанд яг юу байсныг харж,
шалтгааныг (хүлээсэн текст буруу) хурдан олсон.
## Алхам 5: Logout ба test isolation

Файл: `tests/final.spec.ts`, туслах функцууд: `tests/helpers.ts`.

- `test.beforeEach`: тест бүр өөрөө `login()` хийнэ.
- `test.afterEach`: тест бүрийг `logout()`-оор төгсгөнө. Унасан тест дээр ч ажиллана.
- Playwright нь тест бүрт шинэ browser context (cookie, storage цэвэр) үүсгэдэг тул
  тестүүд анхнаасаа тусгаарлагдсан. Үүнийг "сагс эхлэхдээ хоосон" тестээр баталсан.
- Дангаар ажиллуулах (`-g`), `--workers=1`, `--repeat-each=3 --fully-parallel`
  горимуудад ижил үр дүн гарсан.



Энэ лабораторид Playwright-ийн auto-wait нь тестийг гараар `sleep` эсвэл explicit wait
бичихгүйгээр тогтвортой ажиллуулсан. Хөтчүүдийг нэг командаар (`npx playwright install`)
суулгасан бөгөөд Selenium-ийн адил хөтөч бүрт тусдаа driver тохируулах шаардлагагүй
байсан. `getByRole`, `getByText` зэрэг locator нь XPath-аас уншигдахуйц, DOM-ийн бүтцээс
бага хамаардаг. Codegen нь тестийн ноорогийг хурдан үүсгэсэн боловч утга учиртай
assertion-ыг өөрөө нэмэх шаардлагатай байсан. Trace viewer нь унасан алхмын DOM snapshot,
Expected/Received зөрүүг шууд харуулсан нь Selenium-ийн лог, скриншотоор мөшгөхөөс
хурдан байлаа. Харин Debian 13 дээр WebKit ажиллаагүй нь Playwright-ийн суулгасан
хөтөчүүд орчноос хамаарах хязгаарлалттай гэдгийг харуулсан. Selenium нь олон хэл,
хуучин төслүүдэд өргөн дэмжлэгтэй хэвээр, харин шинэ төсөлд Playwright илүү хурдан
эхэлж, дебаг хийхэд тохиромжтой гэж дүгнэв.
