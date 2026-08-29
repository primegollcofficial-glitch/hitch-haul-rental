import React, { useState } from 'react';
import { NavTab } from '../types';
import { CheckCircle, Upload, X, Loader2, Camera, Video, Phone, MapPin, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import * as api from '../api';

interface ReturnVideoViewProps {
  onNavigate: (tab: NavTab) => void;
}

type SectionKey = 'receiving' | 'delivery';

const SECTIONS: { key: SectionKey; heading: string; note: string; accept: string }[] = [
  {
    key: 'receiving',
    heading: 'Receiving video will be uploaded here',
    note: 'Upload your trailer receiving video (when you receive/deliver the trailer).',
    accept: 'video/*,image/*',
  },
  {
    key: 'delivery',
    heading: 'Delivery video will be uploaded here',
    note: 'Upload your trailer delivery video (when the trailer is delivered).',
    accept: 'video/*,image/*',
  },
];

export const ReturnVideoView: React.FC<ReturnVideoViewProps> = ({ onNavigate }) => {
  const [reference, setReference] = useState('');
  const [uploading, setUploading] = useState<SectionKey | null>(null);
  const [sections, setSections] = useState<Record<SectionKey, { file: File; type: string }[]>>({
    receiving: [],
    delivery: [],
  });
  const [done, setDone] = useState<Record<SectionKey, number | boolean>>({ receiving: false, delivery: false });
  const [error, setError] = useState('');

  const addFiles = (key: SectionKey, list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list).map((file) => ({ file, type: file.type.startsWith('video/') ? 'video' : 'image' }));
    setSections((prev) => ({ ...prev, [key]: [...prev[key], ...incoming].slice(0, 6) }));
    setError('');
  };

  const removeFile = (key: SectionKey, i: number) =>
    setSections((prev) => ({ ...prev, [key]: prev[key].filter((_, idx) => idx !== i) }));

  const submit = async (key: SectionKey) => {
    setError('');
    const ref = reference.trim();
    if (!ref) { setError('Please enter your booking reference.'); return; }
    if (sections[key].length === 0) { setError('Please attach at least one file for this section.'); return; }
    setUploading(key);
    try {
      const res = await api.uploadVideos(ref, key, sections[key].map((s) => s.file));
      setDone((prev) => ({ ...prev, [key]: (res.files || []).length }));
      setSections((prev) => ({ ...prev, [key]: [] }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(null);
    }
  };

  const allDone = done.receiving !== false && done.delivery !== false;

  if (allDone) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-[#181a1a] border border-emerald-500/40 rounded-2xl p-8 text-center space-y-5 shadow-2xl">
          <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">VIDEOS SUBMITTED</span>
            <h2 className="font-display text-3xl text-white uppercase">RECEIVING &amp; DELIVERY LOGGED</h2>
            <p className="text-xs sm:text-sm text-[#bab8b7]">
              Your receiving and delivery videos have been uploaded to the dispatch team for review.
            </p>
          </div>
          <button onClick={() => onNavigate('home')} className="btn-primary py-3 font-bold uppercase tracking-wider w-full cursor-pointer">Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] px-4 py-12 sm:py-16 max-w-3xl mx-auto">
      <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-sm text-[#8e8d8c] hover:text-white mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </button>

      <div className="text-center space-y-3 mb-10">
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#ff6b00] uppercase"><ShieldCheck className="w-4 h-4" /> Trailer Video Uploads</span>
        <h1 className="font-display text-3xl sm:text-5xl text-white uppercase">Upload Videos</h1>
        <p className="text-sm text-[#bab8b7] max-w-md mx-auto">
          Enter your booking reference and upload your trailer receiving and delivery videos.
        </p>
      </div>

      <div className="rounded-2xl bg-[#181a1a] border border-white/10 p-6 sm:p-8 space-y-8">
        <div className="space-y-2">
          <label className="block text-xs font-bold tracking-widest text-[#8e8d8c] uppercase">Booking Reference</label>
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="e.g. HH-XXXXXX"
            className="inp font-mono"
            disabled={!!uploading}
          />
          <p className="text-[11px] text-[#8e8d8c]">This is the tracking reference you received when you booked your trailer.</p>
        </div>

        {SECTIONS.map((sec) => {
          const files = sections[sec.key];
          const isUploading = uploading === sec.key;
          const isDone = done[sec.key] !== false;
          return (
            <div key={sec.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#ff6b00] flex-shrink-0" />
                <h2 className="font-display text-xl text-white uppercase leading-tight">{sec.heading}</h2>
              </div>

              {isDone ? (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-sm font-semibold">
                  <CheckCircle className="w-5 h-5" /> Uploaded ({done[sec.key]} file{done[sec.key] === 1 ? '' : 's'})
                </div>
              ) : (
                <>
                  <label
                    className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/15 rounded-xl p-8 text-center cursor-pointer hover:border-[#ff6b00]/60 hover:bg-white/[0.02] transition"
                  >
                    <span className="h-12 w-12 rounded-full bg-[#ff6b00]/15 flex items-center justify-center text-[#ff6b00]">
                      {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                    </span>
                    <span className="text-sm text-white font-semibold">{isUploading ? 'Uploading...' : 'Click to upload'}</span>
                    <span className="text-xs text-[#8e8d8c]">Video or photos ({sec.note.toLowerCase()} up to 6 files, 50MB each)</span>
                    <input type="file" accept={sec.accept} multiple className="hidden" onChange={(e) => addFiles(sec.key, e.target.files)} disabled={!!uploading} />
                  </label>

                  {files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {files.map((f, i) => (
                        <div key={i} className="inline-flex items-center gap-2 bg-[#121414] border border-white/10 rounded-lg px-3 py-2 text-xs">
                          {f.type === 'video' ? <Video className="w-4 h-4 text-[#ff6b00]" /> : <Camera className="w-4 h-4 text-[#ff6b00]" />}
                          <span className="text-white max-w-[140px] truncate">{f.file.name}</span>
                          {!uploading && (
                            <button onClick={() => removeFile(sec.key, i)} className="text-[#8e8d8c] hover:text-red-400 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => submit(sec.key)}
                    disabled={!!uploading}
                    className="btn-primary py-3 font-bold uppercase tracking-wider w-full cursor-pointer disabled:opacity-60"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} {isUploading ? 'Uploading...' : `Submit ${sec.key === 'receiving' ? 'Receiving' : 'Delivery'} Video`}
                  </button>
                </>
              )}
            </div>
          );
        })}

        {error && <div className="text-sm rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 p-3">{error}</div>}

        <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8e8d8c]">
          <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#ff6b00]" /> Pickup at our yard</span>
          <a href="tel:12178537475" className="inline-flex items-center gap-1.5 text-white hover:text-[#ff6b00]"><Phone className="w-3.5 h-3.5 text-[#ff6b00]" /> (217) 853-7475</a>
        </div>
      </div>
    </div>
  );
};

export default ReturnVideoView;
