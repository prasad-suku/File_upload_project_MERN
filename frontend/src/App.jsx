import React, { useEffect, useState } from "react";
// import axios from "axios"
import axios from "axios";
const App = () => {
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [message, setMessage] = useState("");
  const handleGetFile = (e) => {
    const newFiles = Array.from(e.target.files);
    console.log(newFiles);
    setFiles(newFiles);

    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  // handle remove preiveiw img

  const removePreview = (i) => {
    const removedFiles = files.filter((_, ind) => i !== ind);
    const removedPreviews = preview.filter((_, ind) => i !== ind);
    setFiles(removedFiles);
    setPreview(removedPreviews);
    URL.revokeObjectURL(preview[i]);
  };

  // handle upload file through api
  const handleUpload = async () => {
    if (files.length == 0) {
      setMessage("No File yet uploaded!");
      return;
    }
    const formData = new FormData();

    // Append each file to formData
    files.forEach((file) => {
      formData.append("files", file); // 'files' is the key your backend will use
    });
    console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful:", response.data);
      //  once uploaded clear state
      setFiles([]);
      setPreview([]);
      setMessage("Files Uploaded");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };
  return (
    <div className="container">
      <h2>Image Upload & Preview</h2>

      <div className="input-file-uploader">
        <input
          type="file"
          onChange={(e) => handleGetFile(e)}
          name="file"
          id="input-file"
          accept=".jpg,.png"
          multiple
        />
        <label htmlFor="input-file">Browse File</label>
      </div>
      {/* file count */}
      <p className="fileCount">
        {files.length > 0
          ? `${files.length} File${files.length == 1 ? "" : "s"} uploaded`
          : "No Files Uploaded"}{" "}
      </p>
      {/* preview image */}
      <div className="previewContainer">
        {preview?.map((src, ind) => (
          <div className="wrapPreview" key={ind}>
            <img src={src} alt=".." />
            <button onClick={() => removePreview(ind)} className="removebtn">
              x
            </button>
          </div>
        ))}
      </div>

      {/* upload button */}
      <button className="uploadbtn" onClick={() => handleUpload()}>
        Upload Files
      </button>
      <h6 style={{ textAlign: "center", marginTop: "1rem" }}>{message}</h6>
    </div>
  );
};

export default App;
