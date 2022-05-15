import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function ExportCSVMultiple(Title, Subject, Username, JsonData) {

  const wb = XLSX.utils.book_new();

  wb.Props = {
    Title: Title,
    Subject: "Salary export",
    Author: Username,
    CreatedDate: new Date(),
  };
  
  Subject.forEach((e, index) => {
    wb.SheetNames.push(e);
    wb.Sheets[e] = XLSX.utils.json_to_sheet(JsonData[index]);
  });

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  FileSaver.saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    "" + Title + ".xlsx"
  );
}
