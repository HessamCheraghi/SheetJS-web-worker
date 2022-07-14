export function reshaper(rawData) {
  console.log(
    "%cstart doing heavy conversion and internationalization",
    "color: khaki;"
  );
  console.time("conversion");

  const { dataNo1, dataNo2 } = rawData;
  const i18n = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "medium",
  });
  const result = dataNo1.map((_, index) => {
    return {
      time: i18n.format(dataNo1[index].x),
      "line 1": dataNo1[index].y,
      "line 2": dataNo2[index].y,
    };
  });

  console.timeEnd("conversion");
  return result;
}

export function generator() {
  console.log("%cstart generating dummy data", "color: khaki;");
  console.time("generating data");
  const numberOfData = Number(document.querySelector("#row").value);
  const startDate = 1656573712206;
  const dataNo1 = [];
  const dataNo2 = [];
  let prev = 100;
  let prev2 = 80;
  for (let i = 0; i < numberOfData; i++) {
    prev += 5 - Math.random() * 10;
    prev2 += 5 - Math.random() * 10;
    const time = startDate + 10000 * i;
    dataNo1.push({ x: time, y: prev });
    dataNo2.push({ x: time, y: prev2 });
  }
  console.timeEnd("generating data");
  return { dataNo1, dataNo2 };
}

export function counter() {
  const btnAdd = document.querySelector("#counter-add");
  const btnSub = document.querySelector("#counter-sub");
  const counter = document.querySelector("#count");
  btnAdd.addEventListener("click", () => {
    counter.textContent = Number(counter.textContent) + 1;
  });

  btnSub.addEventListener("click", () => {
    counter.textContent = Number(counter.textContent) - 1;
  });
}
