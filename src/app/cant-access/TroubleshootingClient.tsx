"use client";

import React, { useState } from 'react';
import { 
  Terminal, 
  RefreshCw, 
  Trash2, 
  Globe, 
  Copy, 
  Check, 
  Laptop,
  Smartphone,
  Server,
  ShieldAlert
} from 'lucide-react';

export function TroubleshootingClient() {
  // Tabs State
  const [activeBrowser, setActiveBrowser] = useState<'chrome' | 'firefox' | 'safari' | 'edge'>('chrome');
  const [activeFlushOS, setActiveFlushOS] = useState<'windows' | 'macos' | 'linux' | 'mobile'>('windows');
  const [activeDnsOS, setActiveDnsOS] = useState<'windows' | 'macos' | 'android' | 'ios'>('windows');
  
  // Copy Status State
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const flushCommands = {
    windows: 'ipconfig /flushdns',
    macos: 'sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder',
    linux: 'sudo resolvectl flush-caches'
  };

  return (
    <section className="container mx-auto px-4 max-w-4xl font-sans text-slate">
      {/* Header section with gradient and visual indicators */}
      <div className="text-center mb-12 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-10" />
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-ink mb-4 tracking-tight">
          Can't Access Singulariti?
        </h1>
        <p className="text-lg text-slate max-w-2xl mx-auto">
          If the site is online but you cannot load the page, it is likely a caching or DNS routing issue. Follow this interactive guide to get back on track.
        </p>
      </div>

      {/* Warning/Alert Info Box */}
      <div className="bg-surface border-l-4 border-amber-500 rounded-r-xl p-6 mb-10 flex gap-4 shadow-sm items-start">
        <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-ink text-sm sm:text-base mb-1">Check Connection First</h4>
          <p className="text-xs sm:text-sm text-slate leading-relaxed">
            Verify that your device is connected to the internet. If other websites load fine but Singulariti doesn't, follow the steps below. Since Singulariti runs entirely client-side, local browser cache and DNS are the most common points of failure.
          </p>
        </div>
      </div>

      {/* Section 1: Quick Force Refresh */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-ink">
            1. Force a Full Refresh
          </h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed">
          Standard browser refreshes load static files from the local browser cache. A force refresh tells the browser to bypass local storage and request the latest resources.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Windows / Linux</span>
              <p className="text-[13px] text-slate mt-1 mb-4">Applies to Google Chrome, Firefox, Opera, and Microsoft Edge.</p>
            </div>
            <div className="flex gap-2 items-center">
              <kbd className="px-3 py-1.5 bg-surface border border-border rounded text-sm text-ink font-mono font-bold shadow-sm">Ctrl</kbd>
              <span className="text-slate font-mono">+</span>
              <kbd className="px-3 py-1.5 bg-surface border border-border rounded text-sm text-ink font-mono font-bold shadow-sm">F5</kbd>
              <span className="text-xs text-slate ml-2">or <code className="font-mono bg-surface px-1 border border-border rounded">Ctrl+Shift+R</code></span>
            </div>
          </div>

          <div className="bg-background border border-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">macOS (Apple Safari & Others)</span>
              <p className="text-[13px] text-slate mt-1 mb-4">Applies to Safari, Chrome, Firefox, and other macOS browsers.</p>
            </div>
            <div className="flex gap-2 items-center">
              <kbd className="px-3 py-1.5 bg-surface border border-border rounded text-sm text-ink font-mono font-bold shadow-sm">Cmd ⌘</kbd>
              <span className="text-slate font-mono">+</span>
              <kbd className="px-3 py-1.5 bg-surface border border-border rounded text-sm text-ink font-mono font-bold shadow-sm">Shift</kbd>
              <span className="text-slate font-mono">+</span>
              <kbd className="px-3 py-1.5 bg-surface border border-border rounded text-sm text-ink font-mono font-bold shadow-sm">R</kbd>
              <span className="text-xs text-slate ml-1">or <code className="font-mono bg-surface px-1 border border-border rounded">Cmd+Option+E</code> (Safari)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Browser Cache & Cookies */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Trash2 className="w-5 h-5" />
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-ink">
            2. Clear Browser Cache & Cookies
          </h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed">
          If a full refresh doesn't work, local files stored by the browser might be corrupted. Clear temporary files and cookies to ensure your browser downloads fresh scripts.
        </p>

        {/* Browser Selector Tabs */}
        <div className="flex border-b border-border mb-6 overflow-x-auto gap-2 scrollbar-none">
          {(['chrome', 'firefox', 'safari', 'edge'] as const).map((browser) => (
            <button
              key={browser}
              onClick={() => setActiveBrowser(browser)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeBrowser === browser 
                  ? 'border-primary text-primary-text' 
                  : 'border-transparent text-slate hover:text-ink'
              }`}
            >
              <span className="capitalize">{browser}</span>
            </button>
          ))}
        </div>

        {/* Browser Details */}
        <div className="bg-background border border-border rounded-xl p-5 text-sm leading-relaxed text-slate">
          {activeBrowser === 'chrome' && (
            <ol className="list-decimal pl-5 space-y-3">
              <li>Click the <strong>three vertical dots</strong> (More menu) in the top-right corner.</li>
              <li>Hover over <strong>Delete browsing data</strong> or select <strong>Settings</strong> &gt; <strong>Privacy and security</strong> &gt; <strong>Delete browsing data</strong>.</li>
              <li>Set the time range to <strong>All time</strong>.</li>
              <li>Check the boxes for <strong>Cookies and other site data</strong> and <strong>Cached images and files</strong>.</li>
              <li>Click <strong>Delete data</strong>, then restart your browser.</li>
            </ol>
          )}

          {activeBrowser === 'firefox' && (
            <ol className="list-decimal pl-5 space-y-3">
              <li>Click the <strong>three horizontal lines</strong> (menu button) in the top-right corner.</li>
              <li>Navigate to <strong>Settings</strong> &gt; <strong>Privacy & Security</strong>.</li>
              <li>Scroll down to the <strong>Cookies and Site Data</strong> section.</li>
              <li>Click the <strong>Clear Data...</strong> button.</li>
              <li>Select both <strong>Cookies and Site Data</strong> and <strong>Cached Web Content</strong>, then click <strong>Clear</strong>.</li>
            </ol>
          )}

          {activeBrowser === 'safari' && (
            <ol className="list-decimal pl-5 space-y-3">
              <li>Open the <strong>Safari</strong> menu in the top menu bar.</li>
              <li>Select <strong>Settings...</strong> (or <strong>Preferences...</strong>) and click the <strong>Privacy</strong> tab.</li>
              <li>Click <strong>Manage Website Data...</strong>, search for <code>singulariti.in</code>, select it, and click <strong>Remove</strong>.</li>
              <li>To fully clear cache: Click the <strong>Advanced</strong> tab and check <strong>Show features for web developers</strong>.</li>
              <li>In the main menu bar, choose <strong>Develop</strong> &gt; <strong>Empty Caches</strong>.</li>
            </ol>
          )}

          {activeBrowser === 'edge' && (
            <ol className="list-decimal pl-5 space-y-3">
              <li>Click the <strong>three horizontal dots</strong> (Settings and more) in the top-right corner.</li>
              <li>Go to <strong>Settings</strong> &gt; <strong>Privacy, search, and services</strong>.</li>
              <li>Scroll to <strong>Clear browsing data</strong> and click <strong>Choose what to clear</strong>.</li>
              <li>Set the time range to <strong>All time</strong>.</li>
              <li>Select <strong>Cookies and other site data</strong> and <strong>Cached images and files</strong>.</li>
              <li>Click <strong>Clear now</strong>.</li>
            </ol>
          )}
        </div>
      </div>

      {/* Section 3: Fix DNS Problems (Flush DNS) */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Terminal className="w-5 h-5" />
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-ink">
            3. Clear Your Local DNS Cache
          </h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed">
          The Domain Name System (DNS) translates human-readable names like <code>singulariti.in</code> to numerical IP addresses. Operating systems cache these translations. If Singulariti changed its server IPs, flushing this local cache grabs the updated records.
        </p>

        {/* OS Tabs for DNS Flush */}
        <div className="flex border-b border-border mb-6 overflow-x-auto gap-2 scrollbar-none">
          {(['windows', 'macos', 'linux', 'mobile'] as const).map((os) => (
            <button
              key={os}
              onClick={() => setActiveFlushOS(os)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeFlushOS === os 
                  ? 'border-primary text-primary-text' 
                  : 'border-transparent text-slate hover:text-ink'
              }`}
            >
              {os === 'windows' && <Laptop className="w-4 h-4 text-slate" />}
              {os === 'macos' && <Laptop className="w-4 h-4 text-slate" />}
              {os === 'linux' && <Server className="w-4 h-4 text-slate" />}
              {os === 'mobile' && <Smartphone className="w-4 h-4 text-slate" />}
              <span className="capitalize">{os === 'mobile' ? 'Mobile (iOS/Android)' : os}</span>
            </button>
          ))}
        </div>

        {/* Command Line / Action Blocks */}
        <div>
          {activeFlushOS !== 'mobile' ? (
            <div className="space-y-4">
              <p className="text-sm">Run the following command in your terminal/command prompt to flush the DNS:</p>
              
              <div className="relative bg-dark rounded-xl p-4 font-mono text-sm text-emerald-400 border border-border flex justify-between items-center overflow-x-auto">
                <span className="whitespace-pre select-all pr-12">
                  {flushCommands[activeFlushOS as keyof typeof flushCommands]}
                </span>
                <button
                  onClick={() => handleCopy(flushCommands[activeFlushOS as keyof typeof flushCommands], activeFlushOS)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded p-1.5 transition-colors cursor-pointer"
                  title="Copy command"
                  aria-label="Copy command"
                >
                  {copiedText === activeFlushOS ? (
                    <Check className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="text-[13px] bg-background border border-border rounded-xl p-4 text-slate space-y-2">
                {activeFlushOS === 'windows' && (
                  <p><strong>To open Terminal:</strong> Press <kbd className="bg-surface border border-border px-1 rounded shadow-sm text-ink text-xs font-mono">Win + R</kbd>, type <code>cmd</code>, and press Enter.</p>
                )}
                {activeFlushOS === 'macos' && (
                  <p><strong>To open Terminal:</strong> Open Spotlight (<kbd className="bg-surface border border-border px-1 rounded shadow-sm text-ink text-xs font-mono">Cmd + Space</kbd>), search for <code>Terminal</code>, and open it. Enter your administrator password when prompted.</p>
                )}
                {activeFlushOS === 'linux' && (
                  <p>Open your system terminal window. Depending on your Linux distribution and network manager daemon, you may need root/sudo access.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-background border border-border rounded-xl p-5 text-sm space-y-3">
              <p className="font-semibold text-ink">Resetting mobile cache is simple:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Toggle Airplane Mode:</strong> Turn on Airplane Mode in your Quick Settings / Control Center, wait for 10-15 seconds, and turn it off again. This forces your mobile hardware to reset its DNS connections.</li>
                <li><strong>Restart the Device:</strong> A system reboot clears all localized application cache, including system-wide routing settings.</li>
                <li><strong>Reset Wi-Fi:</strong> Turn off your Wi-Fi interface, wait 10 seconds, and reconnect.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Alternative DNS Configuration */}
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Globe className="w-5 h-5" />
          </div>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-ink">
            4. Switch to Alternative DNS Servers
          </h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed">
          If you can access Singulariti at your office or via mobile data, but not on your home/office computer, your Internet Service Provider's (ISP) DNS server is likely blocked, outdated, or down. Switching to public DNS servers like Google Public DNS or Cloudflare increases loading speeds and reliability.
        </p>

        {/* Public DNS Table */}
        <div className="overflow-x-auto border border-border rounded-xl mb-8">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-ink">Provider</th>
                <th className="px-4 py-3 text-left font-bold text-ink">Primary IPv4</th>
                <th className="px-4 py-3 text-left font-bold text-ink">Secondary IPv4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface text-slate">
              <tr>
                <td className="px-4 py-3 font-semibold text-ink">Google Public DNS</td>
                <td className="px-4 py-3 font-mono">8.8.8.8</td>
                <td className="px-4 py-3 font-mono">8.8.4.4</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-ink">Cloudflare DNS</td>
                <td className="px-4 py-3 font-mono">1.1.1.1</td>
                <td className="px-4 py-3 font-mono">1.0.0.1</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-ink">OpenDNS</td>
                <td className="px-4 py-3 font-mono">208.67.222.222</td>
                <td className="px-4 py-3 font-mono">208.67.220.220</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-display font-semibold text-lg text-ink mb-4">
          How to Change Your DNS Settings
        </h3>

        {/* OS Tabs for DNS Changes */}
        <div className="flex border-b border-border mb-6 overflow-x-auto gap-2 scrollbar-none">
          {(['windows', 'macos', 'android', 'ios'] as const).map((os) => (
            <button
              key={os}
              onClick={() => setActiveDnsOS(os)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                activeDnsOS === os 
                  ? 'border-primary text-primary-text' 
                  : 'border-transparent text-slate hover:text-ink'
              }`}
            >
              {os === 'windows' && <Laptop className="w-4 h-4 text-slate" />}
              {os === 'macos' && <Laptop className="w-4 h-4 text-slate" />}
              {os === 'android' && <Smartphone className="w-4 h-4 text-slate" />}
              {os === 'ios' && <Smartphone className="w-4 h-4 text-slate" />}
              <span className="capitalize">{os === 'ios' ? 'iOS' : os}</span>
            </button>
          ))}
        </div>

        {/* Step-by-step instructions */}
        <div className="bg-background border border-border rounded-xl p-5 text-sm leading-relaxed">
          {activeDnsOS === 'windows' && (
            <ol className="list-decimal pl-5 space-y-3">
              <li>Open <strong>Settings</strong> (<kbd className="bg-surface border border-border px-1 rounded shadow-sm text-ink text-xs font-mono">Win + I</kbd>).</li>
              <li>Navigate to <strong>Network & internet</strong> &gt; <strong>Wi-Fi</strong> (or <strong>Ethernet</strong>).</li>
              <li>Click on your active connection properties.</li>
              <li>Scroll down to find <strong>DNS server assignment</strong> and click <strong>Edit</strong>.</li>
              <li>Select <strong>Manual</strong>, toggle <strong>IPv4</strong> to ON, and enter:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Preferred DNS: <code>8.8.8.8</code> (or <code>1.1.1.1</code>)</li>
                  <li>Alternate DNS: <code>8.8.4.4</code> (or <code>1.0.0.1</code>)</li>
                </ul>
              </li>
              <li>Click <strong>Save</strong>.</li>
            </ol>
          )}

          {activeDnsOS === 'macos' && (
            <ol className="list-decimal pl-5 space-y-3">
              <li>Click the <strong>Apple Menu</strong> in the top-left and select <strong>System Settings</strong>.</li>
              <li>Click <strong>Network</strong> in the sidebar.</li>
              <li>Select your active network interface (Wi-Fi or Ethernet) and click <strong>Details...</strong>.</li>
              <li>Click the <strong>DNS</strong> tab in the left column.</li>
              <li>Under the DNS Servers box, click the <strong>+</strong> (Add) button and add:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><code>8.8.8.8</code></li>
                  <li><code>8.8.4.4</code></li>
                </ul>
              </li>
              <li>Click <strong>OK</strong> and then <strong>Apply</strong>.</li>
            </ol>
          )}

          {activeDnsOS === 'android' && (
            <ol className="list-decimal pl-5 space-y-3">
              <li>Go to <strong>Settings</strong> &gt; <strong>Network & Internet</strong> &gt; <strong>Wi-Fi</strong>.</li>
              <li>Press and hold or tap the settings cog next to your active network.</li>
              <li>Select <strong>Modify Network</strong> (or Advanced options).</li>
              <li>Change IP Settings from DHCP to <strong>Static</strong>.</li>
              <li>Enter DNS addresses:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>DNS 1: <code>8.8.8.8</code></li>
                  <li>DNS 2: <code>8.8.4.4</code></li>
                </ul>
              </li>
              <li>Click <strong>Save</strong>. Note: On newer versions, you can use <strong>Private DNS</strong>: select Private DNS provider hostname and type <code>dns.google</code>.</li>
            </ol>
          )}

          {activeDnsOS === 'ios' && (
            <ol className="list-decimal pl-5 space-y-3">
              <li>Open <strong>Settings</strong> &gt; <strong>Wi-Fi</strong>.</li>
              <li>Tap the blue <strong>"i" icon</strong> next to your active network name.</li>
              <li>Scroll down to the bottom and tap <strong>Configure DNS</strong>.</li>
              <li>Change from Automatic to <strong>Manual</strong>.</li>
              <li>Delete existing servers and tap <strong>Add Server</strong> to enter:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><code>8.8.8.8</code></li>
                  <li><code>8.8.4.4</code></li>
                </ul>
              </li>
              <li>Tap <strong>Save</strong> in the top-right corner.</li>
            </ol>
          )}
        </div>
      </div>
      
      {/* Help info for users */}
      <div className="text-center mt-12 text-sm text-slate">
        <p>Still having issues accessing Singulariti? Get in touch with us at <a href="mailto:singulariti.contact@gmail.com" className="text-primary hover:underline font-medium">singulariti.contact@gmail.com</a>.</p>
      </div>
    </section>
  );
}
