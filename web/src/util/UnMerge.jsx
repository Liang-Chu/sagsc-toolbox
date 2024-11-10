import * as XLSX from "xlsx";

export const UnMerge = (file, ignoreRows = 0, ignoreCols = 0) => {
  console.log(ignoreRows);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;

        // Load workbook using XLSX with cellStyles option
        const workbook = XLSX.read(data, { type: "array", cellStyles: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // If merges exist, process them
        if (sheet["!merges"]) {
          const updatedMerges = []; // Merges to keep

          sheet["!merges"].forEach((mergeRange) => {
            const { s: start, e: end } = mergeRange;

            // Check if merge is within ignored rows/columns
            const withinIgnoredArea =
              start.r < ignoreRows || // Start row is within ignored rows
              start.c < ignoreCols; // Start col is within ignored cols

            if (withinIgnoredArea) {
              // Retain merge in ignored area
              updatedMerges.push(mergeRange);
            } else {
              // Unmerge cells outside ignored area
              const cell = sheet[XLSX.utils.encode_cell(start)];
              const cellValue = cell?.v;
              const cellType = cell?.t || "s"; // Default to "s" (string) if no type
              const cellFormat = cell?.z || undefined; // Original format (for dates or numbers)

              for (let row = start.r; row <= end.r; row++) {
                for (let col = start.c; col <= end.c; col++) {
                  const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
                  if (!sheet[cellAddress]) sheet[cellAddress] = {};
                  sheet[cellAddress].v = cellValue;
                  sheet[cellAddress].t = cellType;
                  if (cellFormat) sheet[cellAddress].z = cellFormat; // Apply original format if available
                }
              }
            }
          });

          // Update the sheet to retain only specified merges
          sheet["!merges"] = updatedMerges;
        }

        // Set column widths based on maximum content width
        const maxColumnWidths = [];
        Object.keys(sheet).forEach((cell) => {
          if (cell[0] === "!") return; // Ignore metadata keys

          const { c: col } = XLSX.utils.decode_cell(cell);
          const cellValue = sheet[cell]?.v;
          const cellText = cellValue ? cellValue.toString() : "";
          const cellWidth = cellText.length * 1.2; // Adjust width factor as needed

          maxColumnWidths[col] = Math.max(maxColumnWidths[col] || 10, cellWidth);
        });

        // Apply column widths to sheet
        sheet["!cols"] = maxColumnWidths.map((width) => ({ wch: width }));

        // Convert to an array buffer and create downloadable Blob
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, sheet, sheetName);
        const arrayBuffer = XLSX.write(newWorkbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([arrayBuffer], {
          type: "application/octet-stream",
        });
        const fileUrl = URL.createObjectURL(blob);

        resolve(fileUrl);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
};
