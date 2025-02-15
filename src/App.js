import React, { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [googleResults, setGoogleResults] = useState([]);
  const [pdfText, setPdfText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [excelData, setExcelData] = useState(null);
  const [flowchartSteps, setFlowchartSteps] = useState("");
  const [flowchartUrl, setFlowchartUrl] = useState("");

  // Wikipedia Search
  const searchWikipedia = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/wikipedia/${query}`);
      setResult(response.data.summary);
    } catch (error) {
      setResult("Error fetching Wikipedia data");
    }
  };

  // Google Search
  const searchGoogle = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/google/${query}`);
      setGoogleResults(response.data.organic_results || []);
    } catch (error) {
      setGoogleResults(["Error fetching Google data"]);
    }
  };

  // OpenAI Query
  const queryOpenAI = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/openai/${query}`);
      setResult(response.data.response);
    } catch (error) {
      setResult("Error fetching AI response");
    }
  };

  // Upload & Analyze PDF
  const handlePDFUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload-pdf/", formData);
      setPdfText(response.data.text);
    } catch (error) {
      setPdfText("Error processing PDF");
    }
  };

  // Generate Image
  const generateImage = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/generate-image/${query}`);
      setImageUrl(response.data);
    } catch (error) {
      setImageUrl("Error generating image");
    }
  };

  // Upload & Analyze Excel
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload-excel/", formData);
      setExcelData(response.data);
    } catch (error) {
      setExcelData("Error processing Excel file");
    }
  };

  // Generate Flowchart & Export as PDF
  const generateFlowchart = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/generate-flowchart/", { steps: flowchartSteps });
      setFlowchartUrl(response.data);
    } catch (error) {
      setFlowchartUrl("Error generating flowchart");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>AI Agent</h1>

      {/* Input Box */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter query..."
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      
      {/* Wikipedia Search */}
      <button onClick={searchWikipedia} style={{ padding: "10px", marginRight: "10px" }}>
        Search Wikipedia
      </button>

      {/* Google Search */}
      <button onClick={searchGoogle} style={{ padding: "10px", marginRight: "10px" }}>
        Google Search
      </button>

      {/* OpenAI Query */}
      <button onClick={queryOpenAI} style={{ padding: "10px" }}>
        Ask AI
      </button>

      <h2>Results:</h2>
      <p>{result}</p>

      {/* Google Search Results */}
      <h3>Google Search Results:</h3>
      <ul>
        {googleResults.map((item, index) => (
          <li key={index}>
            <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
          </li>
        ))}
      </ul>

      {/* Image Generation */}
      <button onClick={generateImage} style={{ padding: "10px", marginTop: "20px" }}>
        Generate Image
      </button>
      {imageUrl && <img src={imageUrl} alt="Generated" style={{ width: "300px", marginTop: "20px" }} />}

      {/* PDF Upload */}
      <h2>Upload PDF:</h2>
      <input type="file" onChange={handlePDFUpload} />
      <p>{pdfText}</p>

      {/* Excel Upload */}
      <h2>Upload Excel:</h2>
      <input type="file" onChange={handleExcelUpload} />
      <p>{JSON.stringify(excelData, null, 2)}</p>

      {/* Flowchart Generation */}
      <h2>Enter Steps for Flowchart:</h2>
      <textarea
        value={flowchartSteps}
        onChange={(e) => setFlowchartSteps(e.target.value)}
        placeholder="Step 1, Step 2, Step 3..."
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={generateFlowchart} style={{ padding: "10px", marginTop: "10px" }}>
        Generate Flowchart
      </button>
      {flowchartUrl && <a href={flowchartUrl} download="flowchart.pdf">Download Flowchart PDF</a>}
    </div>
  );
}

export default App;
