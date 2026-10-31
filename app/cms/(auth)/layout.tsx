import type { ReactNode } from "react";
import "../cms.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="cms cms-auth">
      <div className="cms-auth__card">
        <div className="cms-auth__brand">
          <img src="/brand/logo-mark-white.png" alt="Air Dive Alor" />
          <span>Content management</span>
        </div>
        {children}
      </div>
    </div>
  );
}
