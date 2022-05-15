import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function ExportCSV(Title, Subject, Username, JsonData) {
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: Title,
    Subject: Subject,
    Author: Username,
    CreatedDate: new Date(),
  };
  wb.SheetNames.push(Subject);
  const ws = XLSX.utils.json_to_sheet(JsonData);
  wb.Sheets[Subject] = ws;
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  FileSaver.saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "" + Title + ".xlsx");
}

// function generateXLSFromJson(Title, Subject, Username, JsonData) {
//     const wb = XLSX.utils.book_new();
//     wb.Props = {
//         Title: Title,
//         Subject: Subject,
//         Author: Username,
//         CreatedDate: new Date()
//     }
//     wb.SheetNames.push(Subject);
//     const ws = XLSX.utils.json_to_sheet(JsonData)
//     wb.Sheets[Subject] = ws;
//     const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
//     function s2ab(s) {
//         const buf = new ArrayBuffer(s.length);
//         const view = new Uint8Array(buf);
//         for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
//         return buf;
//     }
//     saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), '' + Title + '.xlsx')
// }
