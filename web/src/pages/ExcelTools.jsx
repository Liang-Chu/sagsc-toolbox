import React, { useState } from "react"
import { addU } from "../util/AddU" // Assuming you have the addU function as a utility
import { UnMerge } from "../util/UnMerge" // Assuming you have the addU function as a utility

const ExcelTools = () => {
  const [file, setFile] = useState(null)
  const [fileType, setFileType] = useState("Unloading Plan") // Store selected file type

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (
      selectedFile &&
      (selectedFile.type === "application/vnd.ms-excel" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      setFile(selectedFile)
    } else {
      alert("Please upload a valid Excel (.xls or .xlsx) file.")
    }
  }
  // New function to handle UnMerge
  const handleUnmerge = async (ignoreRow = 0, ignoreCol = 0) => {
    if (!file) {
      alert("Please upload a file first.")
      return
    }
    try {
      const downloadLink = await UnMerge(file, ignoreRow, ignoreCol)
      const a = document.createElement("a")
      a.href = downloadLink
      a.download = `${file.name.replace(".xlsx", "")}_Unmerged.xlsx`
      a.click()
    } catch (error) {
      console.error("Error unmerging the file:", error)
      alert("An error occurred while processing the file.")
    }
  }
  const handleFileTypeChange = (e) => {
    setFileType(e.target.value) // Update the selected file type
  }

  const handleAddU = async () => {
    if (!file) {
      alert("Please upload a file first.")
      return
    }
    if (fileType === "Unloading Plan") {
      try {
        const downloadLink = await addU(file) // Call the addU function
        const a = document.createElement("a")
        a.href = downloadLink
        a.download = `${file.name.replace(".xlsx", "")}_withUnit#.xlsx` // Generate download filename
        a.click()
      } catch (error) {
        console.error("Error processing the file:", error)
        alert("An error occurred while processing the file.")
      }
    } else {
      alert("File type not supported for this action.")
    }
  }

  return (
    <div className="body-container">
      <h1>ExcelTools</h1>
      <div className="file-upload ">
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          className="file-input"
        />
        <select
          value={fileType}
          onChange={handleFileTypeChange}
          className="file-type-select"
        >
          <option value="Unloading Plan">Unloading Plan</option>
          <option value="Others">Others</option>
        </select>
      </div>

      {file && <p>Selected file: {file.name}</p>}

      {/* Show the additional options if "Unloading Plan" is selected */}
      {fileType === "Unloading Plan" && (
        <div className=" w-100 p-0 m-0 d-flex row mt-4  ">
          <div className="col-6 p-0">
            <button className="option-button" onClick={handleAddU}>
              Add U#
            </button>
          </div>
          {/*<button className="option-button">Find Missing</button>*/}
          <div className="col-6 p-0">
            <button className="option-button" onClick={() => handleUnmerge(6)}>
              Unmerge
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExcelTools
