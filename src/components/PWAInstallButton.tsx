/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed and running standalone, hide the prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      await install();
      setIsInstalling(false);
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // Fallback guide if browser has not yet fired beforeinstallprompt or is desktop Chrome
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-950 border border-cyan-800/60 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-900/60 border border-cyan-700/80 flex items-center justify-center text-cyan-300 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>Install Noveleta FloodWatch on your Phone</span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-300">
                Access instant hydrologic alerts, live weather, and flood risk offline directly from your home screen.
              </div>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="min-h-[44px] px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-md active:scale-[0.98] w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            <span>Install App</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="min-h-[44px] px-3 sm:px-3.5 py-2 text-xs font-semibold rounded-lg border border-cyan-500/60 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 hover:text-white transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 active:scale-[0.98]"
          title="Install Noveleta FloodWatch as a Progressive Web App"
          aria-label="Install App"
        >
          <Download className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden text-[11px]">Install</span>
        </button>
      )}

      {/* Guided Installation Modal for iOS / Safari / Desktop */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-6 space-y-5 shadow-2xl pb-safe">
            <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto sm:hidden" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img src="/icon.svg" alt="App Icon" className="w-9 h-9 rounded-xl" />
                <div>
                  <h3 className="text-base font-bold text-white">Install FloodWatch</h3>
                  <div className="text-[11px] text-slate-400">Add to Home Screen</div>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white">Step 1:</strong> Tap the <span className="text-cyan-300 font-semibold">Share</span> icon in your browser toolbar (bottom of Safari, or top right in Chrome).
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white">Step 2:</strong> Scroll down and select <span className="text-cyan-300 font-semibold">&quot;Add to Home Screen&quot;</span>.
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white">Step 3:</strong> Tap <span className="text-emerald-300 font-semibold">&quot;Add&quot;</span>. FloodWatch will now run full-screen like a native mobile app!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 font-bold text-xs text-slate-950 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
