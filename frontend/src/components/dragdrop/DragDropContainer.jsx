import { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import "./DragDropContainer.css";
import { SpeechToText } from "../../api/textToSpeech";

function FileUpload({ isLoading, handleSave, cardText, onExtractedText }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const extractTextFromFile = async (file) => {
    if (file.type.startsWith("audio/")) {
      console.log("Uploading audio to STT:", file);
      const transcription = await SpeechToText(file); // calls backend
      return transcription?.text || "";
    }

    if (file.type === "text/plain") {
      return file.text();
    }

    if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textContent = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        textContent += content.items.map((it) => it.str).join(" ") + "\n";
      }
      return textContent;
    }

    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    return "";
  };

  const handleProcessFiles = async () => {
    for (const file of files) {
      const text = await extractTextFromFile(file);
      if (text && onExtractedText) {
        onExtractedText(text);
      }
    }
    handleSave(files, cardText);
  };

  return (
    <div className="file-upload-container">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileSelect}
        accept=".txt,.pdf,.docx,.mp3,.wav,.m4a,.mp4"
      />
      <div
        className={`dropzone ${dragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        {files.length === 0 ? (
          "Drag & drop files here or click to select"
        ) : (
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name}
                <button
                  className="remove-file"
                  onClick={() => removeFile(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {files.length > 0 && (
        <button onClick={handleProcessFiles}>
          {isLoading ? "Saving..." : "Save & Speak"}
        </button>
      )}
    </div>
  );
}

export default FileUpload;
