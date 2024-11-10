import * as XLSX from 'xlsx';

export const addU = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      let rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const columnTitles = ["运单号", "FBA NO.", "PO#", "目的地", "派送方式", "备注"];
      const outputData = [];

      rows.forEach((row) => {
        if (row[3] && !isNaN(row[3])) {
          const count = parseInt(row[3], 10);
          const prefix = row[1];

          for (let i = 1; i <= count; i++) {
            const newRow = [
              row[0],
              `${prefix}U${i.toString().padStart(6, '0')}`,
              row[2],
              row[4],
              row[5],
              row[6]
            ];
            outputData.push(newRow);
          }
        }
      });

      const newSheet = XLSX.utils.aoa_to_sheet([columnTitles, ...outputData]);
      const newWorkbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Sheet1");

      // Adjust column widths
      const wscols = [
        { wch: 20 }, // "运单号" column width
        { wch: 30 }, // "FBA NO." column width
        { wch: 20 }, // "PO#" column width
        { wch: 20 }, // "目的地" column width
        { wch: 20 }, // "派送方式" column width
        { wch: 30 }  // "备注" column width
      ];
      newSheet['!cols'] = wscols;

      // Write the workbook to an array buffer
      const arrayBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });

      // Convert the array buffer to a blob
      const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });

      // Create a URL for the Blob and resolve the download link
      const fileUrl = URL.createObjectURL(blob);
      resolve(fileUrl);
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
};
