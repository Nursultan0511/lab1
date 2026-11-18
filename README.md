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


