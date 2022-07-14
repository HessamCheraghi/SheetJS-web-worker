import * as XLSX from "xlsx";
import { reshaper } from "./utils";

onmessage = function (e) {
  console.log("%cMessage received from main script", "color: darkgrey;");
  const rows = reshaper(e.data);

  console.log("%cstart converting to excel", "color: khaki;");
  console.time("converting to excel");

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "sheet");
  worksheet["!cols"] = [{ wch: 18 }];
  const u8 = XLSX.write(workbook, { type: "array", bookType: "xlsx" });

  console.timeEnd("converting to excel");
  console.log("%cPosting message back to main script", "color: darkgrey;");
  postMessage({ t: "export", v: u8 });
};
