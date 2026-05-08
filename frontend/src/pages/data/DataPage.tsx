import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DataPage.css";

import DashboardHeader from "../../components/DashboardHeader";
import Footer from "../../components/Footer";

type Dataset = {
  id: number;
  dataset_name: string;
  is_locked: boolean;
};

export default function DataPage() {

  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [showData, setShowData] = useState(false); // KEEP

  // ---------------- FETCH HISTORY ----------------
  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/datasets/history`,
        { credentials: "include" }
      );

      if (!res.ok) return;

      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("History error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ---------------- SEARCH ----------------
  const handleSearch = async () => {

    if (!query.trim()) {
      alert("Please enter search text");
      return;
    }

    setShowData(true); // KEEP
    setLoading(true);
    setError("");
    setDatasets([]);
    setSelectedDataset(null);
    setPreviewData([]);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/datasets/search?q=${query}`,
        { credentials: "include" }
      );

      if (res.status === 401) {
        setError("Please login first");
        return;
      }

      if (res.status === 403) {
        const err = await res.json();
        setError(err.detail || "No subscription found");
        return;
      }

      const data = await res.json();
      setDatasets(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
      setError("Search failed");
    }

    setLoading(false);
  };

  // ---------------- PREVIEW ----------------
  const handleSelect = async (dataset: Dataset) => {

    if (dataset.is_locked) {
      alert("🔒 Please upgrade your plan to access this dataset");
      return;
    }

    setSelectedDataset(dataset);
    setPreviewData([]);
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/datasets/preview?dataset_id=${dataset.id}`,
        { credentials: "include" }
      );

      if (res.status === 403) {
        const err = await res.json();
        alert(err.detail || "Upgrade required");
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Preview failed");
        return;
      }

      const data = await res.json();
      setPreviewData(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
      setError("Preview error");
    }
  };

  // ---------------- DOWNLOAD ----------------
  const handleDownload = () => {

    if (!selectedDataset) return;

    if (selectedDataset.is_locked) {
      alert("🔒 Please upgrade your plan");
      return;
    }

    window.open(
      `${import.meta.env.VITE_API_BASE_URL}/api/datasets/download?dataset_id=${selectedDataset.id}`,
      "_blank"
    );

    setTimeout(fetchHistory, 1000);
  };

  return (
    <>
      <DashboardHeader />

      <div className="data-modal">

        <div className="data-container">

          {/* ================= LEFT BIG BOX ================= */}
          <div className="dataset-box">

            {/* SEARCH */}
            <div onClick={() => setShowData(true)}>
              <h2>Dataset</h2>

              <div className="data-search">
                <input
                  placeholder="Search datasets (healthcare, finance...)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
              </div>

              {!showData && (
                <p className="empty-text">Click to explore datasets</p>
              )}
            </div>

            {/* DATA SECTION */}
            {showData && (
              <div className="data-section">

                {/* TABLE */}
                <div className="data-table">

                  {loading && <p>Loading datasets...</p>}

                  {!loading && datasets.length === 0 && !error && (
                    <p>No datasets found</p>
                  )}

                  {!loading && datasets.length > 0 && (
                    <table>
                      <thead>
                        <tr>
                          <th></th>
                          <th>Dataset Name</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {datasets.map((d) => (
                          <tr
                            key={d.id}
                            className={`
                              ${selectedDataset?.id === d.id ? "selected-row" : ""}
                              ${d.is_locked ? "locked-row" : ""}
                            `}
                            onClick={() => handleSelect(d)}
                          >
                            <td>
                              <input
                                type="radio"
                                checked={selectedDataset?.id === d.id}
                                readOnly
                              />
                            </td>

                            <td>{d.dataset_name}</td>

                            <td>
                              {d.is_locked
                                ? "🔒 Upgrade Required"
                                : "✅ Available"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                </div>

                {/* PREVIEW + HISTORY */}
                <div className="data-preview">

                  {!selectedDataset ? (
                    <>
                      <p className="placeholder-text">
                        Select a dataset to preview
                      </p>

                      <div className="history-box">
                        <h3>Recent Activity</h3>
                        {history.length === 0 ? (
                          <p>No activity yet</p>
                        ) : (
                          <table className="preview-table">
                            <thead>
                              <tr>
                                <th>Dataset</th>
                                <th>Action</th>
                                <th>Size (MB)</th>
                                <th>Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {history.map((h, i) => (
                                <tr key={i}>
                                  <td>{h.dataset_name}</td>
                                  <td>{h.action}</td>
                                  <td>{h.size_mb}</td>
                                  <td>{h.created_at}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3>{selectedDataset.dataset_name}</h3>

                      {previewData.length === 0 ? (
                        <p>No preview available</p>
                      ) : (
                        <table className="preview-table">
                          <thead>
                            <tr>
                              {Object.keys(previewData[0]).map((k) => (
                                <th key={k}>{k}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {previewData.map((row, i) => (
                              <tr key={i}>
                                {Object.values(row).map((val: any, idx) => (
                                  <td key={idx}>{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      <button onClick={handleDownload}>
                        Download Dataset
                      </button>
                    </>
                  )}

                </div>

              </div>
            )}

          </div>

          {/* ================= RIGHT SMALL BOX ================= */}
          <div className="capture-box">

            <h2>📥 Capture Request Portal</h2>

            <p>
              This is the Capture Request portal. No subscription required.
              Request custom datasets tailored to your needs.
              Pricing will be based on your requirements.
            </p>

            <button
              className="capture-btn"
              onClick={() => navigate("/capture-request")}
            >
              Create Capture Request
            </button>

          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}