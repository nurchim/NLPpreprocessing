"use client";

import { useMemo, useState } from "react";
import type { PipelineOptions, PreprocessResult } from "@/lib/preprocessing";

const SAMPLE = "GAESSS!!! 😭🔥 Timnas U-23 nggak jelek2 amat lho... Menang 3-0!!! #SemangatGaruda @PSSI lanjutkan!!! 🇮🇩";

const DEFAULT_OPTIONS: PipelineOptions = {
  removeUrls: true,
  removeMentions: false,
  lowercase: true,
  normalizeRepeated: true,
  normalizeSlang: true,
  removePunctuation: true,
  keepEmoji: true,
  keepHashtag: true,
  keepNumbers: true,
  removeStopwords: false,
  stemming: false,
};

const PRESETS: Record<string, PipelineOptions> = {
  minimal: {
    removeUrls: true, removeMentions: false, lowercase: false, normalizeRepeated: false,
    normalizeSlang: false, removePunctuation: true, keepEmoji: true, keepHashtag: true,
    keepNumbers: true, removeStopwords: false, stemming: false,
  },
  sentiment: {
    removeUrls: true, removeMentions: true, lowercase: true, normalizeRepeated: true,
    normalizeSlang: true, removePunctuation: true, keepEmoji: true, keepHashtag: true,
    keepNumbers: true, removeStopwords: false, stemming: false,
  },
  ner: {
    removeUrls: true, removeMentions: true, lowercase: false, normalizeRepeated: true,
    normalizeSlang: false, removePunctuation: true, keepEmoji: false, keepHashtag: true,
    keepNumbers: true, removeStopwords: false, stemming: false,
  },
  agresif: {
    removeUrls: true, removeMentions: true, lowercase: true, normalizeRepeated: true,
    normalizeSlang: true, removePunctuation: true, keepEmoji: false, keepHashtag: false,
    keepNumbers: false, removeStopwords: true, stemming: true,
  },
};

const OPTION_META: Array<{
  key: keyof PipelineOptions;
  label: string;
  description: string;
  group: string;
}> = [
  { key: "removeUrls", label: "Hapus URL", description: "Menghilangkan alamat web dari teks.", group: "Pembersihan" },
  { key: "removeMentions", label: "Hapus sebutan pengguna", description: "Menghilangkan token seperti @nama.", group: "Pembersihan" },
  { key: "removePunctuation", label: "Hapus tanda baca", description: "Menyaring tanda baca setelah tokenisasi.", group: "Pembersihan" },
  { key: "lowercase", label: "Seragamkan huruf kecil", description: "Mengubah huruf kapital menjadi huruf kecil.", group: "Normalisasi" },
  { key: "normalizeRepeated", label: "Normalkan pengulangan huruf", description: "Contoh: menanggg → menang.", group: "Normalisasi" },
  { key: "normalizeSlang", label: "Normalkan bahasa informal", description: "Contoh: nggak → tidak, bgt → sangat.", group: "Normalisasi" },
  { key: "keepEmoji", label: "Pertahankan emoji", description: "Berguna ketika emoji membawa makna atau emosi.", group: "Pelestarian informasi" },
  { key: "keepHashtag", label: "Pertahankan tagar", description: "Tagar dapat menjadi unit semantik penting.", group: "Pelestarian informasi" },
  { key: "keepNumbers", label: "Pertahankan angka", description: "Skor, tanggal, harga, dan ukuran dapat informatif.", group: "Pelestarian informasi" },
  { key: "removeStopwords", label: "Hapus kata henti", description: "Gunakan secara hati-hati karena negasi dapat ikut terhapus.", group: "Reduksi" },
  { key: "stemming", label: "Gunakan stemming", description: "Mengubah kata berimbuhan menuju bentuk dasar.", group: "Reduksi" },
];

const PRESET_META: Record<string, { label: string; note: string }> = {
  minimal: { label: "Minimal", note: "Menjaga sebanyak mungkin informasi asli." },
  sentiment: { label: "Sentimen", note: "Menjaga emoji dan negasi; menormalkan bahasa informal." },
  ner: { label: "NER", note: "Menjaga kapitalisasi dan angka; menghindari stemming." },
  agresif: { label: "Agresif", note: "Membersihkan dan mereduksi teks secara kuat untuk bahan diskusi." },
};

const CHALLENGES = [
  {
    title: "Tantangan 1 · Analisis Sentimen",
    text: "Produk ini nggak jelek kok 😭🔥",
    question: "Informasi apa yang sebaiknya dipertahankan agar polaritas tidak berubah?",
    hint: "Perhatikan kata negasi dan emoji.",
  },
  {
    title: "Tantangan 2 · Pengenalan Entitas Bernama",
    text: "Cristiano Ronaldo bermain untuk Al Nassr pada 2026.",
    question: "Apakah huruf kapital dan angka boleh dihapus?",
    hint: "Nama orang, organisasi, dan tahun dapat menjadi sinyal entitas.",
  },
  {
    title: "Tantangan 3 · Klasifikasi Topik",
    text: "Timnas Indonesia menang 3-0 pada laga malam ini!!! #Garuda",
    question: "Bagian mana yang mungkin menjadi derau dan bagian mana yang tetap informatif?",
    hint: "Bandingkan kebutuhan klasifikasi topik dengan sentimen atau NER.",
  },
];

type Tab = "playground" | "compare" | "challenge" | "guide";

async function runPipeline(text: string, options: PipelineOptions) {
  const response = await fetch("/api/preprocess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, options }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Gagal memproses teks.");
  return data as PreprocessResult;
}

function Toggle({ checked, onChange, label, description }: {
  checked: boolean;
  onChange: () => void;
  label: string;
  description: string;
}) {
  return (
    <button type="button" className={`toggle-row ${checked ? "is-on" : ""}`} onClick={onChange} aria-pressed={checked}>
      <span className="toggle-copy">
        <strong>{label}</strong>
        <small>{description}</small>
      </span>
      <span className="switch" aria-hidden="true"><span /></span>
    </button>
  );
}

function ResultPanel({ result }: { result: PreprocessResult | null }) {
  if (!result) {
    return (
      <div className="empty-state">
        <strong>Belum ada hasil.</strong>
        <p>Pilih konfigurasi, buat prediksi, lalu tekan <b>Proses Teks</b>.</p>
      </div>
    );
  }

  return (
    <div className="result-stack">
      <section className="result-card final-card">
        <div className="result-head">
          <div>
            <span className="eyebrow">Hasil akhir</span>
            <h3>Teks siap dianalisis</h3>
          </div>
          <span className="metric">{result.stats.tokenCount} token</span>
        </div>
        <div className="final-output">{result.finalText || "∅"}</div>
        <div className="token-list">
          {result.tokens.map((token, index) => <span className="token" key={`${token}-${index}`}>{token}</span>)}
        </div>
      </section>

      {result.warnings.length > 0 && (
        <section className="warning-card">
          <strong>Zona perhatian</strong>
          <ul>{result.warnings.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      )}

      <section>
        <div className="section-title compact">
          <div>
            <span className="eyebrow">Jejak proses</span>
            <h3>Apa yang berubah pada setiap tahap?</h3>
          </div>
        </div>
        <div className="trace-list">
          {result.traces.map((trace, index) => (
            <article className="trace-card" key={`${trace.id}-${index}`}>
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{trace.label}</strong>
                <code>{trace.value}</code>
                {trace.note && <p>{trace.note}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function NlpLab({ repoUrl }: { repoUrl: string }) {
  const [tab, setTab] = useState<Tab>("playground");
  const [text, setText] = useState(SAMPLE);
  const [options, setOptions] = useState<PipelineOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<PreprocessResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prediction, setPrediction] = useState("");
  const [compareText, setCompareText] = useState("Messi GAK main bagus hari ini 😭🔥 #SepakBola");
  const [leftPreset, setLeftPreset] = useState("agresif");
  const [rightPreset, setRightPreset] = useState("sentiment");
  const [compareResult, setCompareResult] = useState<{ left: PreprocessResult; right: PreprocessResult } | null>(null);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [reflection, setReflection] = useState("");

  const groupedOptions = useMemo(() => {
    return OPTION_META.reduce<Record<string, typeof OPTION_META>>((acc, item) => {
      (acc[item.group] ||= []).push(item);
      return acc;
    }, {});
  }, []);

  const process = async () => {
    setLoading(true);
    setError("");
    try {
      setResult(await runPipeline(text, options));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const compare = async () => {
    setLoading(true);
    setError("");
    try {
      const [left, right] = await Promise.all([
        runPipeline(compareText, PRESETS[leftPreset]),
        runPipeline(compareText, PRESETS[rightPreset]),
      ]);
      setCompareResult({ left, right });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const challenge = CHALLENGES[challengeIndex];
  const repoConfigured = !repoUrl.includes("USERNAME");

  return (
    <main>
      <header className="topbar">
        <a href="#utama" className="brand" aria-label="Beranda Laboratorium NLP">
          <span className="brand-mark">NLP</span>
          <span><strong>Laboratorium Prapemrosesan</strong><small>Belajar melalui eksperimen</small></span>
        </a>
        <a className={`github-link ${repoConfigured ? "" : "muted-link"}`} href={repoConfigured ? repoUrl : "#panduan-github"} target={repoConfigured ? "_blank" : undefined} rel="noreferrer">
          GitHub Kelas ↗
        </a>
      </header>

      <section className="hero" id="utama">
        <div className="hero-copy">
          <span className="kicker">Media Pembelajaran NLP · Bahasa Indonesia</span>
          <h1>Prapemrosesan teks bukan sekadar membersihkan data.</h1>
          <p>
            Uji setiap keputusan, lihat informasi yang hilang, lalu pertahankan pilihan Anda dengan alasan yang dapat diuji.
          </p>
          <div className="hero-actions">
            <button onClick={() => setTab("playground")} className="primary-btn">Mulai Eksperimen</button>
            <button onClick={() => setTab("guide")} className="secondary-btn">Lihat Alur Perkuliahan</button>
          </div>
        </div>
        <div className="hero-panel">
          <span className="eyebrow">Pertanyaan pemantik</span>
          <blockquote>“Apakah teks yang lebih bersih selalu menghasilkan model NLP yang lebih baik?”</blockquote>
          <div className="mini-flow">
            <span>Prediksi</span><b>→</b><span>Proses</span><b>→</b><span>Amati</span><b>→</b><span>Jelaskan</span>
          </div>
        </div>
      </section>

      <nav className="tabbar" aria-label="Menu laboratorium">
        <button className={tab === "playground" ? "active" : ""} onClick={() => setTab("playground")}>Laboratorium</button>
        <button className={tab === "compare" ? "active" : ""} onClick={() => setTab("compare")}>Perbandingan Alur</button>
        <button className={tab === "challenge" ? "active" : ""} onClick={() => setTab("challenge")}>Tantangan Kelas</button>
        <button className={tab === "guide" ? "active" : ""} onClick={() => setTab("guide")}>Panduan</button>
      </nav>

      {error && <div className="error-banner" role="alert">{error}</div>}

      {tab === "playground" && (
        <section className="workspace">
          <div className="control-column">
            <div className="section-title">
              <div><span className="eyebrow">Langkah 1</span><h2>Masukkan teks nyata</h2></div>
              <button className="text-btn" onClick={() => { setText(SAMPLE); setResult(null); }}>Gunakan contoh</button>
            </div>
            <textarea value={text} onChange={(e) => setText(e.target.value)} aria-label="Teks masukan" />
            <div className="input-meta"><span>{text.length} karakter</span><span>Maksimum 10.000 karakter</span></div>

            <div className="section-title spaced">
              <div><span className="eyebrow">Langkah 2</span><h2>Rancang pipeline</h2></div>
              <button className="text-btn" onClick={() => setOptions(DEFAULT_OPTIONS)}>Atur ulang</button>
            </div>

            {Object.entries(groupedOptions).map(([group, items]) => (
              <div className="option-group" key={group}>
                <h3>{group}</h3>
                {items.map((item) => (
                  <Toggle
                    key={item.key}
                    checked={options[item.key]}
                    onChange={() => setOptions((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                    label={item.label}
                    description={item.description}
                  />
                ))}
              </div>
            ))}

            <div className="prediction-box">
              <label htmlFor="prediction"><strong>Prediksi sebelum menjalankan</strong><span>Apa yang menurut Anda akan hilang atau berubah?</span></label>
              <textarea id="prediction" className="small-textarea" value={prediction} onChange={(e) => setPrediction(e.target.value)} placeholder="Contoh: kata 'nggak' akan menjadi 'tidak', sedangkan emoji tetap dipertahankan..." />
            </div>

            <button className="primary-btn full" disabled={loading || !text.trim()} onClick={process}>{loading ? "Memproses..." : "Proses Teks"}</button>
          </div>

          <div className="output-column">
            <div className="section-title"><div><span className="eyebrow">Langkah 3</span><h2>Amati hasil</h2></div></div>
            <ResultPanel result={result} />
          </div>
        </section>
      )}

      {tab === "compare" && (
        <section className="panel-section">
          <div className="section-title wide-title">
            <div><span className="eyebrow">Eksperimen komparatif</span><h2>Bandingkan dua keputusan prapemrosesan</h2></div>
            <p>Gunakan teks yang sama agar perbedaan hasil benar-benar berasal dari pipeline.</p>
          </div>
          <textarea value={compareText} onChange={(e) => setCompareText(e.target.value)} aria-label="Teks perbandingan" />
          <div className="compare-controls">
            <label>Alur A<select value={leftPreset} onChange={(e) => setLeftPreset(e.target.value)}>{Object.entries(PRESET_META).map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}</select><small>{PRESET_META[leftPreset].note}</small></label>
            <span className="versus">VS</span>
            <label>Alur B<select value={rightPreset} onChange={(e) => setRightPreset(e.target.value)}>{Object.entries(PRESET_META).map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}</select><small>{PRESET_META[rightPreset].note}</small></label>
          </div>
          <button className="primary-btn" disabled={loading || !compareText.trim()} onClick={compare}>Bandingkan Hasil</button>

          {compareResult && (
            <div className="compare-grid">
              {[["A", leftPreset, compareResult.left], ["B", rightPreset, compareResult.right]].map(([letter, preset, data]) => {
                const res = data as PreprocessResult;
                const key = preset as string;
                return (
                  <article className="compare-card" key={String(letter)}>
                    <span className="pipeline-badge">Alur {String(letter)} · {PRESET_META[key].label}</span>
                    <h3>{res.finalText || "∅"}</h3>
                    <div className="token-list">{res.tokens.map((t, i) => <span className="token" key={`${t}-${i}`}>{t}</span>)}</div>
                    {res.warnings.length > 0 && <ul className="mini-warning">{res.warnings.map((w) => <li key={w}>{w}</li>)}</ul>}
                  </article>
                );
              })}
            </div>
          )}
          {compareResult && (
            <div className="discussion-prompt">
              <strong>Diskusikan secara langsung:</strong>
              <p>Alur mana yang lebih sesuai dengan tugas NLP Anda? Sebutkan <b>klaim, bukti, contoh, dan keputusan</b>.</p>
            </div>
          )}
        </section>
      )}

      {tab === "challenge" && (
        <section className="panel-section">
          <div className="challenge-nav">
            {CHALLENGES.map((_, index) => <button className={challengeIndex === index ? "active" : ""} key={index} onClick={() => { setChallengeIndex(index); setReflection(""); }}>{index + 1}</button>)}
          </div>
          <div className="challenge-card">
            <span className="eyebrow">{challenge.title}</span>
            <div className="challenge-text">{challenge.text}</div>
            <h2>{challenge.question}</h2>
            <p className="hint">Petunjuk dosen: {challenge.hint}</p>
            <label className="reflection-label" htmlFor="reflection">Argumentasi mahasiswa</label>
            <textarea id="reflection" value={reflection} onChange={(e) => setReflection(e.target.value)} placeholder="Tulis dengan pola: Klaim → Bukti → Contoh → Keputusan." />
            <div className="rubric-mini">
              <span>✓ Klaim jelas</span><span>✓ Bukti relevan</span><span>✓ Contoh konkret</span><span>✓ Keputusan terkait tugas NLP</span>
            </div>
          </div>
          <div className="discussion-prompt">
            <strong>Gunakan GitHub untuk diskusi lanjutan.</strong>
            <p>Salin argumentasi ke GitHub Discussions atau Pull Request agar teman sekelas dapat menanggapi secara terdokumentasi.</p>
            <a href={repoConfigured ? repoUrl : "#panduan-github"} target={repoConfigured ? "_blank" : undefined} rel="noreferrer" className="secondary-btn">Buka GitHub Kelas</a>
          </div>
        </section>
      )}

      {tab === "guide" && (
        <section className="panel-section" id="panduan-github">
          <div className="section-title wide-title"><div><span className="eyebrow">Skenario 100 menit</span><h2>Perkuliahan sinkron yang berbasis eksperimen</h2></div></div>
          <div className="timeline">
            {[
              ["00–10", "Pemantik", "Tampilkan teks nyata. Minta mahasiswa mengidentifikasi derau tanpa memberi definisi terlebih dahulu."],
              ["10–25", "Prediksi & demo", "Mahasiswa memprediksi hasil, lalu dosen menjalankan laboratorium interaktif dan menelaah jejak proses."],
              ["25–45", "Diskusi kelompok", "Setiap kelompok memilih pipeline untuk tugas yang berbeda: sentimen, NER, atau klasifikasi topik."],
              ["45–70", "Eksperimen GitHub", "Kelompok mengubah konfigurasi atau kode pada branch, lalu membuat Pull Request dengan argumentasi."],
              ["70–90", "Perbandingan", "Buka versi pratinjau Vercel tiap kelompok dan bandingkan hasil pada teks yang sama."],
              ["90–100", "Refleksi", "Mahasiswa menulis exit ticket: prapemrosesan apa yang berisiko menghilangkan informasi penting?"],
            ].map(([time, title, desc]) => <article key={time}><span>{time}</span><div><strong>{title}</strong><p>{desc}</p></div></article>)}
          </div>
          <div className="guide-grid">
            <article><span className="eyebrow">GitHub</span><h3>Ruang kerja kolaboratif</h3><p>Gunakan branch untuk eksperimen, Pull Request untuk meninjau perubahan, dan Discussions untuk debat konseptual.</p></article>
            <article><span className="eyebrow">Vercel</span><h3>Laboratorium yang dapat dibuka bersama</h3><p>Hubungkan repositori ke Vercel. Setiap perubahan dapat diuji melalui versi pratinjau sebelum digabungkan.</p></article>
            <article><span className="eyebrow">Prinsip</span><h3>Jangan mencari satu alur terbaik</h3><p>Tujuan kelas adalah membuktikan bahwa pilihan prapemrosesan harus sesuai dengan data, bahasa, dan tugas NLP.</p></article>
          </div>
          {!repoConfigured && (
            <div className="config-note"><strong>Konfigurasi GitHub belum diisi.</strong><p>Salin <code>.env.example</code> menjadi <code>.env.local</code>, lalu ganti <code>USERNAME</code> dengan alamat repositori kelas Anda.</p></div>
          )}
        </section>
      )}

      <footer>
        <strong>Laboratorium Prapemrosesan Teks NLP</strong>
        <span>Dirancang untuk pembelajaran sinkron: Prediksi → Proses → Amati → Jelaskan → Revisi.</span>
      </footer>
    </main>
  );
}
