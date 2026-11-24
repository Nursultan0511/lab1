# Лабораторийн ажил №1: UI автомат тест (Playwright)

- Нэр: Д.Нурсолтан
- Код: В232270039

## 1. Зорилго

Playwright ашиглан веб хуудасны функционал тестийг автоматжуулж, Selenium-тэй
харьцуулан давуу талыг ойлгох.

## 2. Ажлын орчин

- OS: Debian 13 (trixie)
- Node.js: LTS (nvm-ээр суулгасан)
- Playwright төсөл: `npm init playwright@latest` (TypeScript)
- Хөтөчүүд: Chromium, Firefox

### WebKit-тэй холбоотой асуудал

Анхны жишээ тест chromium, firefox дээр 4/4 амжилттай болсон бол WebKit дээр
`Test timeout of 30000ms exceeded while setting up "page"` алдаа гарсан.
`install-deps webkit` ажиллуулж системийн сангууд бүгд суусан гэдгийг баталгаажуулсан
боловч алдаа хэвээр байсан. Playwright-ийн албан ёсны дэмжлэг Debian 13-ыг бүрэн
хамраагүй байж магадгүй гэж үзэж, `playwright.config.ts`-ээс WebKit төслийг
comment хийсэн (шалтгааныг би дэлгэрэнгүй шалгаагүй). Тестүүд Chromium, Firefox дээр ажилладаг.

## 4. Алхам 2: Тестийн скрипт

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
- `getByLabel`: Saucedemo-ийн талбарууд `<label>`-гүй тул `tests/label.spec.ts`-д
  https://demo.playwright.dev/todomvc дээр тусад нь ашигласан

### XPath-аас яагаад зайлсхийх вэ

- **Эмзэг:** DOM бүтэц (div-ийн давхарга, дараалал) өөрчлөгдөхөд XPath эвдэрнэ.
  Role, текст, test id нь UI-ийн бүтцээс хамааралгүй.
- **Уншигдах чадвар муу:** `//div[2]/form/button[1]` гэхээс
  `getByRole('button', { name: 'Login' })` нь юу хийж буйгаа шууд илэрхийлнэ.
- **Хэрэглэгчийн өнцөг:** `getByRole` нь хэрэглэгч, screen reader элементийг хэрхэн
  хардагтай адил олдог тул accessibility-г дам шалгана.
- **Тогтвортой байдал:** Playwright-ийн auto-wait болон дахин оролдлоготой сайн
  ажилладаг тул flaky тест цөөрнө.

### Тестийн явцад гарсан алдаа ба засвар

Эхний ажиллуулалтаар 8 тестийн 6 нь амжилттай болж, "системээс гарах" тест
chromium, firefox дээр унасан:

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Logout' })
```

`Open Menu` дарсны дараа `getByRole('link', { name: 'Logout' })` элементийг 30 секундэд
олж чадаагүй. Энэ нь тестийн логик биш, locator-ийн асуудал байсан. Яг ямар шалтгаанаар
role-оор олдоогүйг би тусад нь шалгаж баталгаажуулаагүй.

- **Засвар:** Logout линкийг `getByTestId('logout-sidebar-link')`-ээр сольсон.
- **Үр дүн:** Засварын дараа бүх тест давсан.
- **Сургамж:** `getByRole`-ийг эхлээд ашиглах нь зөв ч олдохгүй үед `getByTestId`
  найдвартай нөөц хувилбар болно.

## 5. Алхам 3: Assertions

Файл: `tests/assertions.spec.ts`

| № | Тест | Төрөл | Ашигласан assertion |
|---|------|-------|---------------------|
| 1 | Амжилттай нэвтрэх | Эерэг | toHaveURL, toHaveText, toBeVisible, toHaveCount |
| 2 | Буруу нууц үг | Сөрөг | toHaveURL, toBeVisible, toContainText |
| 3 | Хоосон талбар | Сөрөг | toHaveText |
| 4 | Бараа сагслах | Нэвтэрсний дараах үйлдэл | toHaveText, toBeVisible, toHaveURL, toHaveCount |

Playwright-ийн `expect` нь web-first assertion тул нөхцөл биелтэл автоматаар дахин
шалгадаг. Иймд гараар `sleep` бичих шаардлагагүй.

## 6. Алхам 4: Codegen ба Trace viewer

### Codegen

`npx playwright codegen saucedemo.com -o tests/codegen.spec.ts` командыг хэд хэдэн удаа
ажиллуулж, хөтөч дээр нэвтрэх, сагслах үйлдэл хийсэн. Гэвч үр дүнд `tests/codegen.spec.ts`
файлд зөвхөн `page.goto('https://www.saucedemo.com/')` бичигдсэн, үйлдлүүд бичигдээгүй.
Шалтгааныг (Debian дээрх орчны асуудал эсвэл бичлэгийн горим) би тогтоож чадаагүй.

| Шинж | Codegen (миний гарсан үр дүн) | Өөрийн бичсэн |
|------|-------------------------------|----------------|
| Locator | Бичигдээгүй, зөвхөн `page.goto` | getByRole, getByPlaceholder, getByTestId |
| Assertion | Байхгүй | toHaveURL, toHaveText, toBeVisible |
| Бүтэц | Нэг хоосон тест (зөвхөн goto) | Тусдаа тестүүд, `login()` туслах функц |

Энэ нь codegen-ийн ерөнхий чадвар биш, миний орчин дахь үр дүн. Өөрийн тестүүдийг
гараар бичсэн.

### Trace viewer

`npx playwright test --trace on`-оор бүх тестийн trace бичсэн. Алхам бүрийн DOM snapshot,
network, console-ийг цагийн шугам дээр үзэж болно. Trace-үүд `docs/traces/` дотор байна:

| Файл | Агуулга |
|------|---------|
| `trace-login-success.zip` | Амжилттай нэвтрэх |
| `trace-login-failure.zip` | Буруу нууц үгээр нэвтрэх |
| `trace-add-to-cart.zip` | Нэвтэрсний дараа бараа сагслах |
| `trace-intentional-fail.zip` | Санаатай унасан тест |

Нээх: `npx playwright show-trace docs/traces/trace-login-success.zip`

### Санаатай унагасан тест

`tests/fail.spec.ts`-д гарчгийн текстийг "Бараанууд" гэж буруу хүлээлгэсэн. Ажиллуулахад:

```
Expected: "Бараанууд"
Received: "Products"
```

Trace viewer дээр унасан алхам улаанаар тэмдэглэгдэж, Expected/Received зөрүү шууд
харагдсан. Тухайн мөчийн DOM snapshot-оос хуудсанд яг юу байсныг харж болно.

Энэ тест анхдагчаар skip болдог (энгийн ажиллуулалтыг эвдэхгүйн тулд). Унагаж trace авах:

```bash
RUN_FAIL_DEMO=1 npx playwright test tests/fail.spec.ts --project=chromium --trace on
npx playwright show-trace docs/traces/trace-intentional-fail.zip
```

## 7. Алхам 5: Logout ба test isolation

Файл: `tests/final.spec.ts`, туслах функцууд: `tests/helpers.ts`.

- `test.beforeEach`: тест бүр өөрөө `login()` хийнэ.
- `test.afterEach`: тест бүрийг `logout()`-оор төгсгөнө.
- Playwright нь тест бүрт шинэ browser context (cookie, storage цэвэр) үүсгэдэг тул
  тестүүд анхнаасаа тусгаарлагдсан. "Сагс эхлэхдээ хоосон" тест нь өмнөх тест сагсанд
  бараа нэмсэн ч хамааралгүй гэдгийг шалгадаг.
- Тест бүр 8 worker-тэй зэрэг ажиллахад давсан нь тэдний хоорондоо хамааралгүйг
  дам харуулдаг.

## 8. Эцсийн үр дүн

`npx playwright test --reporter=list` (chromium + firefox):

```

Running 34 tests using 8 workers

  -   1 [chromium] › tests/fail.spec.ts:8:1 › санаатай унах тест
  ✓   6 [chromium] › tests/codegen.spec.ts:3:1 › test (861ms)
  ✓   9 [chromium] › tests/assertions.spec.ts:25:3 › Алхам 3: Assertions › амжилтгүй нэвтрэх: буруу нууц үг (1.0s)
  ✓   5 [chromium] › tests/assertions.spec.ts:35:3 › Алхам 3: Assertions › амжилтгүй нэвтрэх: хоосон талбар (1.2s)
  ✓   8 [chromium] › tests/assertions.spec.ts:16:3 › Алхам 3: Assertions › амжилттай нэвтрэх: URL, гарчиг, бараа харагдах (1.3s)
  ✓   2 [chromium] › tests/assertions.spec.ts:44:3 › Алхам 3: Assertions › нэвтэрсний дараа: бараа сагслах (1.5s)
  ✓   3 [chromium] › tests/example.spec.ts:3:1 › has title (1.6s)
  ✓   4 [chromium] › tests/final.spec.ts:20:3 › Алхам 5: Logout-оор төгсгөх, test isolation › бараа сагслаад гарах (2.2s)
  ✓  15 [chromium] › tests/mytest.spec.ts:19:3 › Saucedemo › буруу нууц үгээр нэвтрэхэд алдаа харуулах (805ms)
  ✓  14 [chromium] › tests/mytest.spec.ts:9:3 › Saucedemo › амжилттай нэвтрэх (1.1s)
  ✓   7 [chromium] › tests/example.spec.ts:10:1 › get started link (2.9s)
  ✓  10 [chromium] › tests/final.spec.ts:25:3 › Алхам 5: Logout-оор төгсгөх, test isolation › сагс эхлэхдээ хоосон (өмнөх тестээс хамааралгүй) (2.1s)
  ✓  13 [chromium] › tests/label.spec.ts:3:1 › getByLabel: todo дуусгах (1.6s)
  ✓  11 [chromium] › tests/final.spec.ts:29:3 › Алхам 5: Logout-оор төгсгөх, test isolation › бараа эрэмбэлэх (2.0s)
  ✓  16 [chromium] › tests/mytest.spec.ts:28:3 › Saucedemo › бараа сагсанд нэмж, захиалга хийх (1.2s)
  ✓  12 [chromium] › tests/final.spec.ts:34:3 › Алхам 5: Logout-оор төгсгөх, test isolation › logout хийсний дараа inventory руу шууд орох боломжгүй (2.6s)
  ✓  17 [chromium] › tests/mytest.spec.ts:53:3 › Saucedemo › системээс гарах (1.9s)
  -  25 [firefox] › tests/fail.spec.ts:8:1 › санаатай унах тест
  ✓  18 [firefox] › tests/assertions.spec.ts:16:3 › Алхам 3: Assertions › амжилттай нэвтрэх: URL, гарчиг, бараа харагдах (2.0s)
  ✓  19 [firefox] › tests/assertions.spec.ts:25:3 › Алхам 3: Assertions › амжилтгүй нэвтрэх: буруу нууц үг (1.8s)
  ✓  22 [firefox] › tests/codegen.spec.ts:3:1 › test (1.7s)
  ✓  21 [firefox] › tests/assertions.spec.ts:44:3 › Алхам 3: Assertions › нэвтэрсний дараа: бараа сагслах (1.9s)
  ✓  20 [firefox] › tests/assertions.spec.ts:35:3 › Алхам 3: Assertions › амжилтгүй нэвтрэх: хоосон талбар (2.0s)
  ✓  23 [firefox] › tests/example.spec.ts:3:1 › has title (2.4s)
  ✓  24 [firefox] › tests/example.spec.ts:10:1 › get started link (2.3s)
  ✓  30 [firefox] › tests/label.spec.ts:3:1 › getByLabel: todo дуусгах (1.4s)
  ✓  27 [firefox] › tests/final.spec.ts:25:3 › Алхам 5: Logout-оор төгсгөх, test isolation › сагс эхлэхдээ хоосон (өмнөх тестээс хамааралгүй) (2.4s)
  ✓  28 [firefox] › tests/final.spec.ts:29:3 › Алхам 5: Logout-оор төгсгөх, test isolation › бараа эрэмбэлэх (2.5s)
  ✓  31 [firefox] › tests/mytest.spec.ts:9:3 › Saucedemo › амжилттай нэвтрэх (1.5s)
  ✓  26 [firefox] › tests/final.spec.ts:20:3 › Алхам 5: Logout-оор төгсгөх, test isolation › бараа сагслаад гарах (3.0s)
  ✓  29 [firefox] › tests/final.spec.ts:34:3 › Алхам 5: Logout-оор төгсгөх, test isolation › logout хийсний дараа inventory руу шууд орох боломжгүй (3.1s)
  ✓  32 [firefox] › tests/mytest.spec.ts:19:3 › Saucedemo › буруу нууц үгээр нэвтрэхэд алдаа харуулах (1.6s)
  ✓  33 [firefox] › tests/mytest.spec.ts:28:3 › Saucedemo › бараа сагсанд нэмж, захиалга хийх (1.8s)
  ✓  34 [firefox] › tests/mytest.spec.ts:53:3 › Saucedemo › системээс гарах (2.3s)

  2 skipped
  32 passed (10.5s)
```

HTML report: `docs/html-report/` (`npx playwright show-report docs/html-report`)

## 9. Playwright ба Selenium: ажиглалт

Энэ лабораторид Playwright-ийн auto-wait нь тестийг гараар `sleep` эсвэл explicit wait
бичихгүйгээр тогтвортой ажиллуулсан. Хөтчүүдийг нэг командаар (`npx playwright install`)
суулгасан бөгөөд Selenium-ийн адил хөтөч бүрт тусдаа driver тохируулах шаардлагагүй байсан.
`getByRole`, `getByText` зэрэг locator нь XPath-аас уншигдахуйц, DOM-ийн бүтцээс бага
хамаардаг. Trace viewer нь унасан алхмын DOM snapshot, Expected/Received зөрүүг шууд
харуулсан нь лог, скриншотоор гараар мөшгөхөөс хурдан байлаа. Codegen нь миний
Debian орчинд зөвхөн `goto` бичсэн тул түүний тухай дүгнэлт хийж чадсангүй. WebKit нь
Debian 13 дээр ажиллаагүй нь Playwright-ийн суулгасан хөтөчүүд орчноос хамаарах
хязгаарлалттай гэдгийг харуулсан. Selenium нь олон хэл, хуучин төслүүдэд өргөн
дэмжлэгтэй хэвээр, харин шинэ төсөлд Playwright илүү хурдан эхэлж, дебаг хийхэд
тохиромжтой гэж дүгнэв.
