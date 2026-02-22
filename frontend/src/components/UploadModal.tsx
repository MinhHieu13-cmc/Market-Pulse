import React, { useState } from 'react';
import { X, Upload, FileText, Globe, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { chatService } from '../services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, sessionId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [scope, setScope] = useState<'global' | 'session'>('session');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success?: boolean, message?: string } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      if (ext !== 'pdf' && ext !== 'txt') {
        alert('Chỉ hỗ trợ file .pdf hoặc .txt');
        return;
      }
      setFile(selectedFile);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);
    try {
      const result = await chatService.uploadDocument(file, scope, sessionId);
      setUploadStatus({ success: true, message: result.message });
      setFile(null);
      // Optional: Close after success
      // setTimeout(onClose, 2000);
    } catch (error: any) {
      console.error("Upload failed:", error);
      setUploadStatus({ success: false, message: error.message || 'Tải lên thất bại' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-fintech-accent rounded-lg flex items-center justify-center">
              <Upload className="text-white" size={18} />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">AI Knowledge Base</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Selector */}
          <div 
            onClick={() => document.getElementById('file-upload')?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
              file ? 'border-fintech-accent bg-fintech-accent/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              accept=".pdf,.txt"
              onChange={handleFileChange}
            />
            {file ? (
              <>
                <FileText size={40} className="text-fintech-accent mb-3" />
                <span className="text-sm font-bold text-white text-center truncate max-w-full px-4">{file.name}</span>
                <span className="text-[10px] text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</span>
              </>
            ) : (
              <>
                <Upload size={40} className="text-slate-600 mb-3" />
                <span className="text-sm font-bold text-slate-300">Click to select file</span>
                <span className="text-xs text-slate-500 mt-1">Supports PDF & TXT (Max 10MB)</span>
              </>
            )}
          </div>

          {/* Scope Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setScope('session')}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center space-y-2 ${
                scope === 'session' 
                  ? 'border-fintech-accent bg-fintech-accent/10 text-white' 
                  : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <MessageSquare size={20} />
              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-wider">Session Scope</div>
                <div className="text-[9px] opacity-60">Chỉ dùng cho chat này</div>
              </div>
            </button>
            <button 
              onClick={() => setScope('global')}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center space-y-2 ${
                scope === 'global' 
                  ? 'border-fintech-accent bg-fintech-accent/10 text-white' 
                  : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <Globe size={20} />
              <div className="text-center">
                <div className="text-xs font-bold uppercase tracking-wider">Global Scope</div>
                <div className="text-[9px] opacity-60">Dùng cho mọi phiên chat</div>
              </div>
            </button>
          </div>

          {uploadStatus && (
            <div className={`p-4 rounded-xl flex items-center space-x-3 ${uploadStatus.success ? 'bg-fintech-up/10 text-fintech-up' : 'bg-fintech-down/10 text-fintech-down'}`}>
              {uploadStatus.success ? <CheckCircle2 size={18} /> : <X size={18} />}
              <span className="text-xs font-bold">{uploadStatus.message}</span>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all ${
              !file || isUploading 
                ? 'bg-white/5 text-slate-600 cursor-not-allowed' 
                : 'bg-fintech-accent text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20'
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Đang xử lý tài liệu...</span>
              </>
            ) : (
              <span>Tải lên và Phân tích</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
