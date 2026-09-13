import {
  ShieldCheck,
  CheckCircle2,
  Download,
  LockKeyhole,
  AlertCircle,
} from "lucide-react";
import AppShell from "../components/AppShell";
import MobileNav from "../components/MobileNav";
import Card from "../components/Card";
import Button from "../components/Button";
const steps = [
  [
    "Install the extension",
    "Download the approved BalRaksha Guardian package from the Extension page. If your team provides a ZIP, extract it first.",
  ],
  [
    "Open the browser extensions page",
    "In Chrome or Edge, open the Extensions menu → Manage extensions. You can also enter chrome://extensions in the address bar.",
  ],
  [
    "Enable Developer mode",
    "Turn on Developer mode only if your team gave you an unpacked extension folder for the hackathon.",
  ],
  [
    "Load the extension",
    "Choose Load unpacked and select the extracted extension folder containing manifest.json. For a store release, use Add to Chrome instead.",
  ],
  [
    "Pin BalRaksha Guardian",
    "Open the puzzle-piece Extensions menu and pin BalRaksha so the shield is easy to access.",
  ],
  [
    "Use supported chat websites",
    "Open a supported chat website and use it normally. Detection is performed locally by the extension.",
  ],
  [
    "Review and report safely",
    "If a warning appears, review it. Only select Report Safely when you want to send structured risk information to the backend.",
  ],
];
export default function ExtensionGuide() {
  return (
    <AppShell>
      <div className="page narrow">
        <div className="page-header">
          <div>
            <span className="eyebrow">BalRaksha Guardian</span>
            <h1>Extension User Guide</h1>
            <p>
              Install the browser extension and understand how privacy-first
              protection works.
            </p>
          </div>
        </div>
        <Card>
          <div className="privacy-banner">
            <ShieldCheck size={22} />
            <div>
              <strong>No report → no conversation leaves the device.</strong>
              <p>
                Local detection happens inside the browser extension. The
                website does not continuously scan or upload conversations.
              </p>
            </div>
          </div>
          <div className="guide-steps">
            {steps.map(([title, text], i) => (
              <div className="guide-step" key={title}>
                <div className="setting-icon">
                  <span>{i + 1}</span>
                </div>
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="form-heading">
            <span className="eyebrow">Privacy & safety</span>
            <h2>Before you use it</h2>
          </div>
          {[
            "Install only the extension package or store listing approved by your team.",
            "Do not share passwords, private keys, or backend credentials.",
            "The extension sends a report only after you deliberately choose Report Safely.",
            "Do not include unnecessary personal information in a report or evidence file.",
            "If the extension is not working, refresh the page, check permissions, and contact your coordinator.",
          ].map((t) => (
            <div className="guide-bullet" key={t}>
              <CheckCircle2 size={17} />
              <span>{t}</span>
            </div>
          ))}
        </Card>
        <Card>
          <div className="form-heading">
            <span className="eyebrow">Troubleshooting</span>
            <h2>Extension not appearing?</h2>
          </div>
          <p className="description">
            Confirm that the extension folder contains manifest.json, Developer
            mode is enabled for an unpacked build, and the browser has no
            extension errors. For a published build, install it from the
            official store link provided by your team.
          </p>
        </Card>
      </div>
      <MobileNav />
    </AppShell>
  );
}
