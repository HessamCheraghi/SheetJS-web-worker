import { generator, counter } from "./utils";

const form = document.querySelector("#test");

if (window.Worker) {
  console.log("%cYour Browser Supports Web Workers!", "color: lightblue;");

  const myWorker = new Worker(new URL("web-worker.js", import.meta.url), {
    type: "module",
  });

  console.log("%cWeb worker spawned successfully.", "color: lightblue;");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const rawData = generator();
    myWorker.postMessage(rawData);

    console.log("%cMessage posted to worker", "color: darkgrey;");
  });

  myWorker.addEventListener("message", function (e) {
    console.log("%cMessage received from worker", "color: darkgrey;");
    console.log("%cexporting into file in main thread...", "color: khaki;");
    console.time("exporting to file");

    if (e && e.data && e.data.t == "export") {
      e.stopPropagation();
      e.preventDefault();
      const data = e.data.v;
      const blob = new Blob([data], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = "sheet.xlsx";
      a.href = url;
      document.body.appendChild(a);
      a.click();

      console.timeEnd("exporting to file");
    }
  });
} else {
  console.log("%cYour browser doesn't support web workers.", "color: red;");
}

counter();
