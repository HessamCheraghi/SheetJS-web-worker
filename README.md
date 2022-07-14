# SheetJS-web-worker

export sheets in background using web workers

you can see live example [here](https://hessamcheraghi.github.io/SheetJS-web-worker/).

```javascript
// main.js
import { generator } from "./utils";

const form = document.querySelector("#test");

if (window.Worker) {
  // spawn a new web worker!
  const myWorker = new Worker(new URL("web-worker.js", import.meta.url), {
    type: "module",
    // type module is for parcel bundler, so we can use ES modules in web worker
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // generating dummy data
    const rawData = generator();

    // sending data to web worker
    myWorker.postMessage(rawData);
  });

  myWorker.addEventListener("message", function (e) {
    if (e && e.data && e.data.t == "export") {
      e.stopPropagation();
      e.preventDefault();
      // data will be the Uint8Array from the worker
      const data = e.data.v;

      // exporting to file using HTML5 download attribute trick
      const blob = new Blob([data], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = "sheet.xlsx";
      a.href = url;
      document.body.appendChild(a);
      a.click();
    }
  });
} else {
  console.log("%cYour browser doesn't support web workers.", "color: red;");
}
```

```javascript
// web-worker.js
import * as XLSX from "xlsx";
import { reshaper } from "./utils";

onmessage = function (e) {
  // doing conversion and internationalization and other heavy tasks...
  const rows = reshaper(e.data);

  //converting to xlsx
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "sheet");
  worksheet["!cols"] = [{ wch: 18 }];
  const u8 = XLSX.write(workbook, { type: "array", bookType: "xlsx" });

  // sending data to main thread
  postMessage({ t: "export", v: u8 });
};
```
