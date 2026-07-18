import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';

export default function Results({ user, onLogout, dark, setDark }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [gradcamView, setGradcamView] = useState('circled'); // 'circled' | 'heatmap'
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, [user, navigate]);

  if (!user) return null;

  function handleFile(selectedFile) {
    if (!selectedFile || !selectedFile.type.startsWith('image/')) return;
    setFile(selectedFile);
    setError('');
    setResult(null);
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

  function handleViewFullReport() {
    navigate('/results/report', { state: { result, preview } });
  }

  const isPneumonia = result?.prediction === 'PNEUMONIA';
  const confidence = result ? Math.round(result.confidence) : 0;
  const gradcamSrc = result
    ? `data:image/png;base64,${gradcamView === 'circled' ? result.circled_image_base64 : result.heatmap_image_base64}`
    : null;

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={onLogout} dark={dark} setDark={setDark} />

      <main className="mx-auto max-w-5xl px-5 md:px-8 pt-10 pb-20">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-ink dark:text-white">
            Analyze a Chest X-Ray
          </h1>
          <p className="text-muted mt-2">
            Upload an image to get an AI-assisted screening result.
          </p>
        </div>

        {/* Dono columns same height le lete hain (default items-stretch), fixed height se pin kiya hai */}
        <div className="grid md:grid-cols-2 gap-6 md:h-[560px]">
          {/* LEFT: Upload */}
          <div className="rounded-3xl bg-white/85 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/15 p-5 flex flex-col h-full overflow-hidden">
            <h2 className="font-display font-bold text-ink dark:text-white mb-3 text-sm shrink-0">
              Upload X-Ray
            </h2>

            <div
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex-1 min-h-0 rounded-2xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-black/10 dark:border-white/15'
              }`}
            >
              {preview ? (
                <img src={preview} alt="X-ray preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl mb-2">
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
              <div className="mt-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm px-4 py-2 shrink-0">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className="mt-4 rounded-full text-white font-semibold text-sm uppercase tracking-wider py-3 transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:translate-y-0 shrink-0"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 5px 20px rgba(102, 126, 234, 0.4)',
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze X-Ray'}
            </button>
          </div>

          {/* RIGHT: Results */}
          <div className="rounded-3xl bg-white/85 dark:bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(124,111,240,0.12)] border border-white/60 dark:border-white/15 p-5 flex flex-col h-full overflow-hidden">
            <h2 className="font-display font-bold text-ink dark:text-white mb-3 text-sm shrink-0">
              Result
            </h2>

            {!result ? (
              <div className="flex-1 flex items-center justify-center text-center text-muted text-sm">
                Upload an X-ray to see the screening result here.
              </div>
            ) : (
              <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pr-1">
                <div className="flex items-center justify-between shrink-0">
                  <div>
                    <p className="text-[11px] text-muted">Diagnosis</p>
                    <p className={`text-xl font-bold ${isPneumonia ? 'text-coral-dark' : 'text-emerald-600'}`}>
                      {result.prediction}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-muted">Confidence</p>
                    <p className="text-xl font-bold text-ink dark:text-white">{confidence}%</p>
                  </div>
                </div>

                <div className="rounded-xl bg-black/[0.03] dark:bg-white/5 px-3 py-2.5 flex flex-col gap-1.5 text-xs shrink-0">
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Normal</span>
                    <span className="font-semibold text-ink dark:text-white">{result.normal_prob}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted font-medium">Pneumonia</span>
                    <span className="font-semibold text-ink dark:text-white">{result.pneumonia_prob}%</span>
                  </div>
                </div>

                {isPneumonia && (
                  <div className="flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center justify-between mb-2 shrink-0">
                      <p className="text-xs font-semibold text-ink dark:text-white">Infected Area (Grad-CAM)</p>
                      <div className="flex gap-1 bg-black/[0.04] dark:bg-white/5 rounded-full p-0.5">
                        <button
                          onClick={() => setGradcamView('circled')}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                            gradcamView === 'circled' ? 'bg-primary text-white' : 'text-muted'
                          }`}
                        >
                          Circled
                        </button>
                        <button
                          onClick={() => setGradcamView('heatmap')}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                            gradcamView === 'heatmap' ? 'bg-primary text-white' : 'text-muted'
                          }`}
                        >
                          Heatmap
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[140px] rounded-xl overflow-hidden">
                      <img src={gradcamSrc} alt="Grad-CAM visualization" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleViewFullReport}
                  className="mt-1 rounded-full border-2 border-primary text-primary text-center font-semibold text-xs uppercase tracking-wider py-2.5 hover:bg-primary hover:text-white transition-colors shrink-0"
                >
                  View Full Report
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-muted mt-10">
          This result is an AI-assisted screening aid and does not replace a professional medical diagnosis.
        </p>
      </main>

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