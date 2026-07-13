import { useState, useRef , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Results({ user, onLogout }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Guest ko results page pe rehne nahi dena - redirect hamesha useEffect me honi chahiye
useEffect(() => {
  if (!user) {
    navigate('/login');
  }
}, [user, navigate]);

// Jab tak redirect ho raha hai, kuch render mat karo
if (!user) {
  return null;
}

  function handleFile(selectedFile) {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    setError('');
    setPreview(URL.createObjectURL(selectedFile));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('xray_image', file);

    try {
      const res = await api.post('/results/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const isPneumonia = result?.prediction === 'PNEUMONIA';
  const confidence = result ? Math.round(result.confidence * 100) : 0;

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} />

      <main className="mx-auto max-w-5xl px-5 md:px-8 pt-10 pb-20">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-ink dark:text-white">
            Analyze a Chest X-Ray
          </h1>
          <p className="text-muted mt-2">
            Upload an image to get an AI-assisted screening result.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT: Upload */}
          <div className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/10 p-6 flex flex-col">
            <h2 className="font-display font-semibold text-ink dark:text-white mb-4">
              Upload X-Ray
            </h2>

            <div
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex-1 min-h-[280px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors p-6 ${
                dragOver ? 'border-primary bg-primary/5' : 'border-black/10 dark:border-white/15'
              }`}
            >
              {preview ? (
                <img src={preview} alt="X-ray preview" className="max-h-64 rounded-xl object-contain" />
              ) : (
                <>
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl mb-3">
                    ↑
                  </div>
                  <p className="font-medium text-ink dark:text-white text-sm">
                    Click or drag & drop to upload
                  </p>
                  <p className="text-xs text-muted mt-1">JPG, JPEG, PNG supported</p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {error && (
              <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="mt-5 rounded-full bg-primary text-white font-medium py-3 hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze X-Ray'}
            </button>
          </div>

          {/* RIGHT: Results */}
          <div className="rounded-3xl bg-white/85 dark:bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/10 p-6 flex flex-col">
            <h2 className="font-display font-semibold text-ink dark:text-white mb-4">
              Result
            </h2>

            {!result ? (
              <div className="flex-1 flex items-center justify-center text-center text-muted text-sm">
                Upload an X-ray to see the screening result here.
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xs text-muted mb-1">Diagnosis</p>
                  <p className={`text-2xl font-bold ${isPneumonia ? 'text-coral-dark' : 'text-emerald-600'}`}>
                    {result.prediction}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted mb-1.5">Confidence</p>
                  <div className="h-6 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-end pr-2 transition-all duration-700"
                      style={{ width: `${confidence}%` }}
                    >
                      <span className="text-[10px] text-white font-semibold">{confidence}%</span>
                    </div>
                  </div>
                </div>

                {result.message && (
                  <div className="rounded-xl bg-primary/8 dark:bg-primary/10 px-4 py-3 text-sm text-ink dark:text-white">
                    {result.message}
                  </div>
                )}

                {result.all_probabilities && (
                  <div className="rounded-xl bg-black/[0.03] dark:bg-white/5 px-4 py-3 flex flex-col gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Normal</span>
                      <span className="font-semibold text-ink dark:text-white">
                        {(result.all_probabilities.NORMAL * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Pneumonia</span>
                      <span className="font-semibold text-ink dark:text-white">
                        {(result.all_probabilities.PNEUMONIA * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-muted mt-10">
          This result is an AI-assisted screening aid and does not replace a professional medical diagnosis.
        </p>
      </main>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1D1A33] rounded-3xl px-10 py-8 text-center shadow-xl">
            <div className="h-10 w-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-ink dark:text-white font-medium">AI is analyzing the X-ray...</p>
          </div>
        </div>
      )}
    </div>
  );
}