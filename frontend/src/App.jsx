import { useState, useEffect, useCallback } from "react";

// ─── Config ───────────────────────────────────────────────────────────────────
const API = "http://localhost:3000";
const ah = (t) => ({ "Content-Type": "application/json", Authorization: `Bearer ${t}` });
const jh = () => ({ "Content-Type": "application/json" });
const req = async (method, path, body, token) => {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: token ? ah(token) : jh(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || `Error ${res.status}`);
  return data;
};

// ─── Global CSS ───────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --w:#fff;--g50:#f9f9f8;--g100:#f2f2f0;--g200:#e8e8e5;--g300:#d4d4cf;
  --g400:#a8a8a0;--g500:#737370;--g700:#3a3a37;--g900:#1a1a18;
  --red:#e5483a;--green:#2d9e6b;--amber:#d97706;--blue:#2563eb;
  --r-sm:8px;--r-md:14px;--r-lg:20px;
  --s-sm:0 2px 8px rgba(0,0,0,.07),0 1px 3px rgba(0,0,0,.05);
  --s-md:0 4px 20px rgba(0,0,0,.08),0 2px 8px rgba(0,0,0,.05);
  --s-lg:0 8px 40px rgba(0,0,0,.10),0 4px 16px rgba(0,0,0,.06);
  --fd:'Instrument Serif',Georgia,serif;--fb:'DM Sans',-apple-system,sans-serif;--tr:.18s ease;
}
html{font-size:16px;-webkit-font-smoothing:antialiased}
body{font-family:var(--fb);background:var(--g50);color:var(--g900);min-height:100vh}
.nav{position:sticky;top:0;z-index:200;background:rgba(255,255,255,.9);backdrop-filter:blur(16px);border-bottom:1px solid var(--g200);height:60px;display:flex;align-items:center}
.nav-in{max-width:1200px;margin:0 auto;padding:0 28px;width:100%;display:flex;align-items:center}
.brand{font-family:var(--fd);font-size:1.25rem;color:var(--g900);cursor:pointer;user-select:none;margin-right:auto;letter-spacing:-.01em}
.brand em{font-style:italic}
.nav-links{display:flex;align-items:center;gap:4px}
.nbtn{font-family:var(--fb);font-size:.875rem;font-weight:500;color:var(--g500);background:none;border:none;padding:7px 14px;border-radius:var(--r-sm);cursor:pointer;transition:color var(--tr),background var(--tr);display:flex;align-items:center;gap:6px}
.nbtn:hover,.nbtn.on{color:var(--g900);background:var(--g100)}
.nbadge{background:var(--g900);color:#fff;font-size:.7rem;font-weight:600;min-width:18px;height:18px;border-radius:99px;display:inline-flex;align-items:center;justify-content:center;padding:0 5px}
.ndiv{width:1px;height:20px;background:var(--g200);margin:0 8px}
.nuser{font-size:.8rem;color:var(--g500);padding:0 8px;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.nadmin{font-size:.7rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase;background:var(--g900);color:#fff;padding:3px 8px;border-radius:99px;margin-right:4px}
.pg{max-width:1200px;margin:0 auto;padding:48px 28px 80px}
.pg-sm{max-width:480px;margin:0 auto;padding:64px 24px}
.pg-md{max-width:760px;margin:0 auto;padding:48px 28px 80px}
.ph{margin-bottom:36px}
.pt{font-family:var(--fd);font-size:2.2rem;font-weight:400;color:var(--g900);letter-spacing:-.02em;line-height:1.15}
.ps{font-size:.95rem;color:var(--g500);margin-top:6px}
.ph-row{display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px;margin-bottom:36px}
.card{background:var(--w);border-radius:var(--r-lg);box-shadow:var(--s-sm);border:1px solid var(--g200);overflow:hidden;transition:box-shadow var(--tr),transform var(--tr)}
.card:hover{box-shadow:var(--s-md)}
.cb{padding:20px}
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px}
.pcard{cursor:pointer}.pcard:hover{transform:translateY(-2px)}
.pthumb{width:100%;aspect-ratio:4/3;background:var(--g100);display:flex;align-items:center;justify-content:center;font-size:3rem;overflow:hidden}
.pthumb img{width:100%;height:100%;object-fit:cover}
.pcat{font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--g400);margin-bottom:4px}
.pname{font-size:.95rem;font-weight:500;color:var(--g900);margin-bottom:4px;line-height:1.35}
.pprice{font-family:var(--fd);font-size:1.1rem;color:var(--g900);font-style:italic}
.prating{font-size:.8rem;color:var(--amber);margin-top:2px}
.pstock{font-size:.75rem;color:var(--g400);margin-top:4px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:var(--fb);font-size:.875rem;font-weight:500;padding:10px 20px;border-radius:var(--r-sm);cursor:pointer;border:none;transition:all var(--tr);white-space:nowrap}
.btn-p{background:var(--g900);color:#fff}.btn-p:hover{background:var(--g700)}.btn-p:disabled{background:var(--g300);cursor:not-allowed}
.btn-s{background:var(--w);color:var(--g700);border:1px solid var(--g200)}.btn-s:hover{background:var(--g50)}
.btn-d{background:#fef2f2;color:var(--red);border:1px solid #fecaca}.btn-d:hover{background:#fee2e2}
.btn-g{background:#f0fdf4;color:var(--green);border:1px solid #bbf7d0}.btn-g:hover{background:#dcfce7}
.btn-sm{font-size:.8rem;padding:7px 14px}
.btn-lg{font-size:1rem;padding:13px 28px;border-radius:var(--r-md)}
.btn-full{width:100%}
.fg{margin-bottom:18px}
.fl{display:block;font-size:.82rem;font-weight:500;color:var(--g700);margin-bottom:7px}
.fi{width:100%;padding:10px 14px;font-family:var(--fb);font-size:.9rem;color:var(--g900);background:var(--w);border:1.5px solid var(--g200);border-radius:var(--r-sm);outline:none;transition:border-color var(--tr),box-shadow var(--tr)}
.fi:focus{border-color:var(--g900);box-shadow:0 0 0 3px rgba(26,26,24,.07)}
.fi::placeholder{color:var(--g400)}
textarea.fi{resize:vertical;min-height:90px}
select.fi{appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23737370' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px;cursor:pointer}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.acard{background:var(--w);border-radius:var(--r-lg);padding:40px;box-shadow:var(--s-md);border:1px solid var(--g200)}
.ahead{text-align:center;margin-bottom:32px}
.atitle{font-family:var(--fd);font-size:1.9rem;color:var(--g900);margin-bottom:6px}
.asub{font-size:.875rem;color:var(--g500)}
.aswitch{text-align:center;font-size:.875rem;color:var(--g500);margin-top:20px}
.aswitch button{background:none;border:none;color:var(--g900);font-weight:500;cursor:pointer;text-decoration:underline;font-size:inherit;font-family:inherit}
.al{padding:12px 16px;border-radius:var(--r-sm);font-size:.875rem;margin-bottom:18px}
.al-e{background:#fef2f2;color:#b91c1c;border:1px solid #fecaca}
.al-s{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}
.al-i{background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe}
.pdgrid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:start}
.pdimg{aspect-ratio:1;background:var(--g100);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;font-size:6rem;border:1px solid var(--g200);overflow:hidden}
.pdimg img{width:100%;height:100%;object-fit:cover}
.pdtitle{font-family:var(--fd);font-size:2rem;color:var(--g900);line-height:1.2;margin-bottom:10px}
.pdprice{font-family:var(--fd);font-size:1.6rem;color:var(--g900);font-style:italic;margin-bottom:6px}
.pddesc{font-size:.95rem;color:var(--g500);line-height:1.7;margin-bottom:24px}
.pdmeta{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:22px}
.tag{font-size:.75rem;font-weight:500;padding:4px 10px;border-radius:99px;background:var(--g100);color:var(--g500)}
.qty{display:flex;align-items:center;border:1.5px solid var(--g200);border-radius:var(--r-sm);width:fit-content;overflow:hidden;margin-bottom:16px}
.qbtn{background:none;border:none;width:36px;height:36px;cursor:pointer;font-size:1.1rem;color:var(--g700);display:flex;align-items:center;justify-content:center;transition:background var(--tr)}
.qbtn:hover{background:var(--g100)}
.qval{font-size:.9rem;font-weight:500;min-width:36px;text-align:center;color:var(--g900);border-left:1px solid var(--g200);border-right:1px solid var(--g200);height:36px;display:flex;align-items:center;justify-content:center}
.ci{display:flex;align-items:center;gap:16px;padding:18px;border-bottom:1px solid var(--g100)}
.ci:last-child{border-bottom:none}
.cimg{width:64px;height:64px;background:var(--g100);border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:1.8rem;flex-shrink:0;overflow:hidden}
.cimg img{width:100%;height:100%;object-fit:cover}
.cname{font-size:.9rem;font-weight:500;color:var(--g900)}
.cqty{font-size:.8rem;color:var(--g500);margin-top:2px}
.cprice{font-family:var(--fd);font-size:1rem;font-style:italic;color:var(--g900);margin-left:auto;margin-right:16px;white-space:nowrap}
.csumm{background:var(--w);border-radius:var(--r-lg);border:1px solid var(--g200);padding:24px}
.csrow{display:flex;justify-content:space-between;font-size:.875rem;color:var(--g500);margin-bottom:10px}
.cstot{display:flex;justify-content:space-between;font-size:1rem;font-weight:600;color:var(--g900);padding-top:14px;border-top:1px solid var(--g200);margin-top:6px}
.cgrid{display:grid;grid-template-columns:1fr 320px;gap:28px;align-items:start}
.cko-grid{display:grid;grid-template-columns:1fr 360px;gap:28px;align-items:start}
.ocard{background:var(--w);border:1px solid var(--g200);border-radius:var(--r-lg);margin-bottom:16px;overflow:hidden}
.ohdr{padding:18px 22px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--g100);flex-wrap:wrap}
.oid{font-size:.8rem;font-weight:600;color:var(--g500);letter-spacing:.05em;text-transform:uppercase}
.odate{font-size:.8rem;color:var(--g400)}
.otot{font-family:var(--fd);font-size:1.1rem;font-style:italic;color:var(--g900);margin-left:auto}
.sbadge{font-size:.75rem;font-weight:500;padding:3px 10px;border-radius:99px}
.s-PENDING{background:#fef9c3;color:#854d0e}
.s-PAID{background:#dbeafe;color:#1e40af}
.s-SHIPPED{background:#ede9fe;color:#5b21b6}
.s-COMPLETED{background:#dcfce7;color:#15803d}
.s-CANCELLED{background:#fee2e2;color:#b91c1c}
.pmethods{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
.pmethod{padding:14px;border:2px solid var(--g200);border-radius:var(--r-md);cursor:pointer;text-align:center;transition:all var(--tr);background:var(--w)}
.pmethod:hover{border-color:var(--g400)}
.pmethod.sel{border-color:var(--g900);background:var(--g50)}
.pmethod-icon{font-size:1.5rem;margin-bottom:4px}
.pmethod-label{font-size:.8rem;font-weight:500;color:var(--g700)}
.rv-sec{margin-top:48px}
.rv-title{font-family:var(--fd);font-size:1.4rem;color:var(--g900);margin-bottom:20px}
.rv-item{padding:18px 0;border-bottom:1px solid var(--g100)}
.rv-author{font-size:.85rem;font-weight:500;color:var(--g900)}
.rv-rating{color:var(--amber);font-size:.85rem;margin:3px 0}
.rv-comment{font-size:.875rem;color:var(--g500);line-height:1.6;margin-top:4px}
.rv-date{font-size:.75rem;color:var(--g400);margin-top:4px}
.rv-form{background:var(--g50);border:1px solid var(--g200);border-radius:var(--r-md);padding:22px;margin-top:20px}
.stars{display:flex;gap:6px;margin-bottom:14px}
.starb{background:none;border:none;font-size:1.4rem;cursor:pointer;transition:transform var(--tr);padding:0;line-height:1}
.starb:hover{transform:scale(1.15)}
.admin-tabs{display:flex;gap:4px;margin-bottom:32px;border-bottom:1px solid var(--g200)}
.atab{font-family:var(--fb);font-size:.875rem;font-weight:500;color:var(--g500);background:none;border:none;padding:10px 18px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all var(--tr)}
.atab:hover{color:var(--g900)}
.atab.on{color:var(--g900);border-bottom-color:var(--g900)}
.atable{width:100%;border-collapse:collapse;font-size:.875rem}
.atable th{text-align:left;padding:10px 14px;font-size:.75rem;font-weight:600;color:var(--g500);letter-spacing:.05em;text-transform:uppercase;border-bottom:1px solid var(--g200);background:var(--g50)}
.atable td{padding:12px 14px;border-bottom:1px solid var(--g100);color:var(--g700);vertical-align:middle}
.atable tr:hover td{background:var(--g50)}
.atable tr:last-child td{border-bottom:none}
.atd-img{width:44px;height:44px;border-radius:var(--r-sm);background:var(--g100);display:flex;align-items:center;justify-content:center;font-size:1.2rem;overflow:hidden;flex-shrink:0}
.atd-img img{width:100%;height:100%;object-fit:cover}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:500;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(4px)}
.modal{background:var(--w);border-radius:var(--r-lg);padding:32px;max-width:540px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:var(--s-lg)}
.modal-title{font-family:var(--fd);font-size:1.5rem;color:var(--g900);margin-bottom:24px}
.modal-footer{display:flex;gap:10px;justify-content:flex-end;margin-top:24px;padding-top:20px;border-top:1px solid var(--g200)}
.empty{text-align:center;padding:72px 24px}
.eicon{font-size:2.8rem;margin-bottom:14px;opacity:.4}
.etitle{font-family:var(--fd);font-size:1.4rem;color:var(--g700);margin-bottom:8px}
.etext{font-size:.9rem;color:var(--g500)}
.div{height:1px;background:var(--g200);margin:32px 0}
.bk{display:inline-flex;align-items:center;gap:6px;font-size:.875rem;color:var(--g500);background:none;border:none;cursor:pointer;margin-bottom:28px;transition:color var(--tr);padding:0;font-family:var(--fb)}
.bk:hover{color:var(--g900)}
.sp{width:16px;height:16px;border:2px solid rgba(255,255,255,.35);border-top-color:currentColor;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;flex-shrink:0}
.sp-d{border-color:var(--g200);border-top-color:var(--g900)}
.ldg{display:flex;align-items:center;justify-content:center;padding:72px;gap:12px;color:var(--g400);font-size:.875rem}
@keyframes spin{to{transform:rotate(360deg)}}
.toast-wrap{position:fixed;bottom:28px;right:28px;z-index:999;display:flex;flex-direction:column;gap:10px;pointer-events:none}
.toast{background:var(--g900);color:#fff;padding:12px 20px;border-radius:var(--r-md);font-size:.875rem;box-shadow:var(--s-lg);animation:sin .25s ease;max-width:320px;pointer-events:all;display:flex;align-items:center;gap:8px}
.toast-s{background:#14532d}.toast-e{background:#7f1d1d}
@keyframes sin{from{transform:translateX(24px);opacity:0}to{transform:translateX(0);opacity:1}}
.chip{font-size:.72rem;font-weight:600;padding:2px 8px;border-radius:99px;background:var(--g100);color:var(--g500);display:inline-block}
@media(max-width:900px){
  .pgrid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
  .pdgrid,.cgrid,.cko-grid{grid-template-columns:1fr}
  .pg{padding:28px 16px 60px}.pt{font-size:1.7rem}
  .nav-in{padding:0 16px}.frow{grid-template-columns:1fr}
}
  `}</style>
);

// ─── Toast ────────────────────────────────────────────────────────────────────
let _tid = 0;
const useToast = () => {
  const [ts, setTs] = useState([]);
  const show = useCallback((msg, type = "d") => {
    const id = _tid++;
    setTs(p => [...p, { id, msg, type }]);
    setTimeout(() => setTs(p => p.filter(t => t.id !== id)), 3400);
  }, []);
  return { ts, show };
};
const Toast = ({ ts }) => (
  <div className="toast-wrap">
    {ts.map(t => (
      <div key={t.id} className={`toast toast-${t.type}`}>
        {t.type === "s" && "✓ "}{t.type === "e" && "✕ "}{t.msg}
      </div>
    ))}
  </div>
);

// ─── Stars ────────────────────────────────────────────────────────────────────
const Stars = ({ val, set }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} className="starb" onClick={() => set && set(n)}>
        <span style={{ color: n <= val ? "#d97706" : "#d4d4cf" }}>★</span>
      </button>
    ))}
  </div>
);
const StarDisplay = ({ val = 0 }) => (
  <span style={{ color: "#d97706" }}>
    {"★".repeat(Math.round(val))}{"☆".repeat(5 - Math.round(val))}
  </span>
);

// ─── SBadge ───────────────────────────────────────────────────────────────────
const SBadge = ({ s }) => <span className={`sbadge s-${s || "PENDING"}`}>{s || "PENDING"}</span>;

// ─── Thumb helpers ────────────────────────────────────────────────────────────
const Thumb = ({ url }) => (
  <div className="pthumb">
    {url ? <img src={url} alt="" onError={e => { e.target.style.display = "none"; }} /> : "🛍️"}
  </div>
);
const CImg = ({ url }) => (
  <div className="cimg">
    {url ? <img src={url} alt="" onError={e => { e.target.style.display = "none"; }} /> : "🛍️"}
  </div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal-title">{title}</div>
      {children}
    </div>
  </div>
);
const Confirm = ({ msg, onYes, onNo }) => (
  <Modal title="Confirm action" onClose={onNo}>
    <p style={{ color: "var(--g500)", fontSize: ".9rem", marginBottom: 24 }}>{msg}</p>
    <div className="modal-footer">
      <button className="btn btn-s" onClick={onNo}>Cancel</button>
      <button className="btn btn-d" onClick={onYes}>Confirm delete</button>
    </div>
  </Modal>
);

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN
// ══════════════════════════════════════════════════════════════════════════════
const LoginPage = ({ onLogin, setPage }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async e => {
    e.preventDefault(); setLoading(true); setErr("");
    try {
      const d = await req("POST", "/auth/login", form);
      onLogin(d.token, d.user);
    } catch (ex) { setErr(ex.message); } finally { setLoading(false); }
  };
  return (
    <div className="pg-sm">
      <div className="acard">
        <div className="ahead"><div className="atitle">Welcome back</div><div className="asub">Sign in to continue</div></div>
        {err && <div className="al al-e">{err}</div>}
        <form onSubmit={submit}>
          <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
          <button className="btn btn-p btn-full btn-lg" disabled={loading}>{loading ? <span className="sp" /> : "Sign in"}</button>
        </form>
        <div className="aswitch">Don&apos;t have an account? <button onClick={() => setPage("register")}>Create one</button></div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// REGISTER
// ══════════════════════════════════════════════════════════════════════════════
const RegisterPage = ({ onLogin, setPage }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async e => {
    e.preventDefault(); setLoading(true); setErr("");
    try {
      const d = await req("POST", "/auth/register", form);
      if (d.token) onLogin(d.token, d.user); else setPage("login");
    } catch (ex) { setErr(ex.message); } finally { setLoading(false); }
  };
  return (
    <div className="pg-sm">
      <div className="acard">
        <div className="ahead"><div className="atitle">Create account</div><div className="asub">Join us and start shopping</div></div>
        {err && <div className="al al-e">{err}</div>}
        <form onSubmit={submit}>
          {[["name", "Full name", "text", "Jane Smith"], ["email", "Email", "email", "you@example.com"], ["password", "Password", "password", "••••••••"]].map(([k, l, t, p]) => (
            <div className="fg" key={k}><label className="fl">{l}</label><input className="fi" type={t} placeholder={p} value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} required /></div>
          ))}
          <button className="btn btn-p btn-full btn-lg" disabled={loading}>{loading ? <span className="sp" /> : "Create account"}</button>
        </form>
        <div className="aswitch">Already have an account? <button onClick={() => setPage("login")}>Sign in</button></div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCTS
// ══════════════════════════════════════════════════════════════════════════════
const ProductsPage = ({ setPage, setProd }) => {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catF, setCatF] = useState("");

  useEffect(() => {
    setProducts([]);
    setCats([]);
    setLoading(true);
    Promise.all([
      fetch(`${API}/products`).then(r => r.json()),
      fetch(`${API}/categories`).then(r => r.json()).catch(() => []),
    ]).then(([p, c]) => {
      setProducts(Array.isArray(p) ? p : []);
      setCats(Array.isArray(c) ? c : []);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p =>
    (!search || p.name?.toLowerCase().includes(search.toLowerCase())) &&
    (!catF || String(p.categoryId) === catF)
  );

  return (
    <div className="pg">
      <div className="ph-row">
        <div><h1 className="pt">Products</h1><p className="ps">{products.length} items available</p></div>
        <div style={{ display: "flex", gap: 10 }}>
          {cats.length > 0 && (
            <select className="fi" style={{ width: 160 }} value={catF} onChange={e => setCatF(e.target.value)}>
              <option value="">All categories</option>
              {cats.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
            </select>
          )}
          <input className="fi" style={{ width: 220 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      {loading ? <div className="ldg"><span className="sp sp-d" /> Loading products…</div>
        : filtered.length === 0 ? <div className="empty"><div className="eicon">📦</div><div className="etitle">No products found</div></div>
          : (
            <div className="pgrid">
              {filtered.map(p => (
                <div key={p.id} className="card pcard" onClick={() => { setProd(p); setPage("product"); }}>
                  <Thumb url={p.imageUrl} />
                  <div className="cb">
                    {p.category && <div className="pcat">{p.category.name}</div>}
                    <div className="pname">{p.name}</div>
                    <div className="pprice">฿{Number(p.price).toLocaleString()}</div>
                    {p.avgRating > 0 && <div className="prating"><StarDisplay val={p.avgRating} /> <span style={{ color: "var(--g400)", fontSize: ".75rem" }}>({p.avgRating?.toFixed(1)})</span></div>}
                    <div className="pstock">{p.stock > 0 ? `${p.stock} in stock` : <span style={{ color: "var(--red)" }}>Out of stock</span>}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCT DETAIL
// ══════════════════════════════════════════════════════════════════════════════
const ProductDetailPage = ({ product, token, user, setPage, showToast }) => {
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rvForm, setRvForm] = useState({ rating: 5, comment: "" });
  const [rvBusy, setRvBusy] = useState(false);
  const [hasRv, setHasRv] = useState(false);

  useEffect(() => {
    if (!product) return;
    fetch(`${API}/reviews/${product.id}`).then(r => r.json())
      .then(d => {
        const arr = Array.isArray(d) ? d : [];
        setReviews(arr);
        if (user) setHasRv(arr.some(r => r.userId === user.id));
      }).catch(() => { });
  }, [product, user]);

  if (!product) return null;

  const addCart = async () => {
    if (qty > (product.stock || 0)) {
      showToast(`สินค้าเหลือ ${product.stock} ชิ้น`, "e")
      return
    }
    if (!token) { showToast("Please sign in first", "e"); setPage("login"); return; }
    setAdding(true);
    try {
      await req("POST", "/cart", { userId: user.id, productId: product.id, quantity: qty }, token);
      showToast("Added to cart!", "s");
    } catch (ex) { showToast(ex.message, "e"); } finally { setAdding(false); }
  };

  const submitRv = async () => {
    if (!token) { showToast("Sign in to review", "e"); return; }
    if (!rvForm.comment.trim()) { showToast("Please write a comment", "e"); return; }
    setRvBusy(true);
    try {
      const r = await req("POST", "/reviews", { productId: product.id, userId: user.id, ...rvForm }, token);
      setReviews(p => [r, ...p]);
      setRvForm({ rating: 5, comment: "" });
      setHasRv(true);
      showToast("Review submitted!", "s");
    } catch (ex) { showToast(ex.message, "e"); } finally { setRvBusy(false); }
  };

  return (
    <div className="pg">
      <button className="bk" onClick={() => setPage("products")}>← Back to products</button>
      <div className="pdgrid">
        <div className="pdimg">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : "🛍️"}</div>
        <div>
          {product.category && <div className="pcat" style={{ marginBottom: 8 }}>{product.category.name}</div>}
          <h1 className="pdtitle">{product.name}</h1>
          <div className="pdprice">฿{Number(product.price).toLocaleString()}</div>
          {product.avgRating > 0 && <div style={{ marginBottom: 10 }}><StarDisplay val={product.avgRating} /> <span style={{ color: "var(--g500)", fontSize: ".85rem" }}>{product.avgRating?.toFixed(1)} / 5</span></div>}
          <div className="pdmeta">
            <span className="tag">{product.availableStock > 0 ? `${product.availableStock} in stock` : "Out of stock"}</span>
            {product.category && <span className="tag">{product.category.name}</span>}
          </div>
          {product.description && <p className="pddesc">{product.description}</p>}
          {product.availableStock > 0 ? (
            <>
              <div className="qty">
                <button className="qbtn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span className="qval">{qty}</span>
                <button
                  className="qbtn"
                  onClick={() => setQty(Math.min(product.stock || 0, qty + 1))}
                >
                  +
                </button>
              </div>
              <button className="btn btn-p btn-lg btn-full" onClick={addCart} disabled={adding} style={{ marginTop: 8 }}>
                {adding ? <><span className="sp" /> Adding…</> : "Add to cart"}
              </button>
            </>
          ) : <div className="al al-e" style={{ marginTop: 12 }}>This item is out of stock.</div>}
        </div>
      </div>

      <div className="rv-sec">
        <div className="div" />
        <div className="rv-title">Reviews ({reviews.length})</div>
        {reviews.length === 0
          ? <p style={{ color: "var(--g400)", fontSize: ".875rem" }}>No reviews yet. Be the first!</p>
          : reviews.map((r, i) => (
            <div key={r.id || i} className="rv-item">
              <div className="rv-author">{r.user?.name || "Customer"}</div>
              <div className="rv-rating"><StarDisplay val={r.rating} /></div>
              <div className="rv-comment">{r.comment}</div>
              {r.createdAt && <div className="rv-date">{new Date(r.createdAt).toLocaleDateString("th-TH")}</div>}
            </div>
          ))}
        {token && !hasRv && (
          <div className="rv-form">
            <div style={{ fontSize: ".875rem", fontWeight: 500, marginBottom: 12 }}>Leave a review</div>
            <Stars val={rvForm.rating} set={r => setRvForm({ ...rvForm, rating: r })} />
            <textarea className="fi" placeholder="Share your experience…" value={rvForm.comment} onChange={e => setRvForm({ ...rvForm, comment: e.target.value })} />
            <button className="btn btn-p btn-sm" style={{ marginTop: 10 }} onClick={submitRv} disabled={rvBusy}>
              {rvBusy ? <span className="sp" /> : "Submit review"}
            </button>
          </div>
        )}
        {hasRv && <div className="al al-s" style={{ marginTop: 16 }}>✓ You have already reviewed this product.</div>}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// CART
// ══════════════════════════════════════════════════════════════════════════════
const CartPage = ({ token, user, setPage, showToast }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!user?.id) return;
    fetch(`${API}/cart/${user.id}`, { headers: ah(token) })
      .then(r => r.json()).then(d => setCart(Array.isArray(d) ? d : []))
      .catch(() => setCart([])).finally(() => setLoading(false));
  }, [token, user]);
  useEffect(() => { load(); }, [load]);

  const remove = async id => {
    try { await req("DELETE", `/cart/${id}`, null, token); setCart(p => p.filter(i => i.id !== id)); showToast("Removed"); }
    catch (ex) { showToast(ex.message, "e"); }
  };

  if (!token) return (
    <div className="pg"><div className="empty"><div className="eicon">🔒</div><div className="etitle">Sign in to view cart</div><button className="btn btn-p" style={{ marginTop: 20 }} onClick={() => setPage("login")}>Sign in</button></div></div>
  );

  const total = cart.reduce((s, i) => s + Number(i.product?.price || 0) * i.quantity, 0);

  return (
    <div className="pg">
      <div className="ph-row"><div><h1 className="pt">Your cart</h1><p className="ps">{cart.length} item{cart.length !== 1 ? "s" : ""}</p></div></div>
      {loading ? <div className="ldg"><span className="sp sp-d" /></div>
        : cart.length === 0 ? (
          <div className="empty"><div className="eicon">🛒</div><div className="etitle">Cart is empty</div><button className="btn btn-p" style={{ marginTop: 20 }} onClick={() => setPage("products")}>Browse products</button></div>
        ) : (
          <div className="cgrid">
            <div className="card" style={{ padding: 0 }}>
              {cart.map(item => (
                <div key={item.id} className="ci">
                  <CImg url={item.product?.imageUrl} />
                  <div style={{ flex: 1 }}>
                    <div className="cname">{item.product?.name}</div>
                    <div className="cqty">Qty: {item.quantity} · ฿{Number(item.product?.price || 0).toLocaleString()} each</div>
                  </div>
                  <div className="cprice">฿{(Number(item.product?.price || 0) * item.quantity).toLocaleString()}</div>
                  <button className="btn btn-d btn-sm" onClick={() => remove(item.id)}>Remove</button>
                </div>
              ))}
            </div>
            <div className="csumm">
              <div style={{ fontWeight: 500, marginBottom: 16, fontSize: ".9rem" }}>Order summary</div>
              {cart.map(i => (
                <div key={i.id} className="csrow"><span>{i.product?.name} ×{i.quantity}</span><span>฿{(Number(i.product?.price || 0) * i.quantity).toLocaleString()}</span></div>
              ))}
              <div className="cstot"><span>Total</span><span style={{ fontFamily: "var(--fd)", fontStyle: "italic", fontSize: "1.15rem" }}>฿{total.toLocaleString()}</span></div>
              <button className="btn btn-p btn-full" style={{ marginTop: 20 }} onClick={() => setPage("checkout")}>Proceed to checkout →</button>
            </div>
          </div>
        )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// CHECKOUT
// ══════════════════════════════════════════════════════════════════════════════
const CheckoutPage = ({ token, user, setPage, showToast, setOrderId }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ address: "", phone: "" });
  const [placing, setPlacing] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${API}/cart/${user.id}`, { headers: ah(token) })
      .then(r => r.json()).then(d => setCart(Array.isArray(d) ? d : []))
      .catch(() => { }).finally(() => setLoading(false));
  }, [token, user]);

  const total = cart.reduce((s, i) => s + Number(i.product?.price || 0) * i.quantity, 0);

  const placeOrder = async e => {
    e.preventDefault(); setErr("");
    if (!form.address.trim() || !form.phone.trim()) { setErr("Please fill address and phone"); return; }
    setPlacing(true);
    try {
      const order = await req("POST", "/orders", {
        userId: user.id,
        address: form.address,
        phone: form.phone,
        totalPrice: total,
        items: cart.map(i => ({ productId: i.productId || i.product?.id, quantity: i.quantity, price: i.product?.price })),
      }, token);
      setOrderId(order.id || order.orderId);
      setPage("payment");
    } catch (ex) { setErr(ex.message); } finally { setPlacing(false); }
  };

  if (!token) return null;

  return (
    <div className="pg">
      <button className="bk" onClick={() => setPage("cart")}>← Back to cart</button>
      <div className="ph"><h1 className="pt">Checkout</h1><p className="ps">Enter delivery details to place your order</p></div>
      {loading ? <div className="ldg"><span className="sp sp-d" /></div> : (
        <form onSubmit={placeOrder}>
          <div className="cko-grid">
            <div>
              <div className="card" style={{ padding: 0, marginBottom: 24 }}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--g100)", fontSize: ".85rem", fontWeight: 500 }}>Order items ({cart.length})</div>
                {cart.map(item => (
                  <div key={item.id} className="ci" style={{ padding: "14px 20px" }}>
                    <CImg url={item.product?.imageUrl} />
                    <div style={{ flex: 1 }}><div className="cname">{item.product?.name}</div><div className="cqty">Qty: {item.quantity}</div></div>
                    <div className="cprice">฿{(Number(item.product?.price || 0) * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="card cb">
                <div style={{ fontWeight: 500, marginBottom: 18, fontSize: ".9rem" }}>Delivery information</div>
                {err && <div className="al al-e">{err}</div>}
                <div className="fg"><label className="fl">Delivery address</label><textarea className="fi" rows={3} placeholder="123 Main St, Bangkok 10100" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required /></div>
                <div className="fg"><label className="fl">Phone number</label><input className="fi" type="tel" placeholder="0812345678" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required /></div>
              </div>
            </div>
            <div className="csumm" style={{ position: "sticky", top: 80 }}>
              <div style={{ fontWeight: 500, marginBottom: 16, fontSize: ".9rem" }}>Order summary</div>
              {cart.map(i => (
                <div key={i.id} className="csrow"><span>{i.product?.name} ×{i.quantity}</span><span>฿{(Number(i.product?.price || 0) * i.quantity).toLocaleString()}</span></div>
              ))}
              <div className="cstot"><span>Total</span><span style={{ fontFamily: "var(--fd)", fontStyle: "italic", fontSize: "1.15rem" }}>฿{total.toLocaleString()}</span></div>
              <button className="btn btn-p btn-full btn-lg" type="submit" disabled={placing} style={{ marginTop: 20 }}>
                {placing ? <><span className="sp" /> Placing order…</> : "Place order →"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// PAYMENT
// ══════════════════════════════════════════════════════════════════════════════
const METHODS = [
  { key: "credit_card", icon: "💳", label: "Credit Card" },
  { key: "promptpay", icon: "📱", label: "PromptPay" },
  { key: "bank_transfer", icon: "🏦", label: "Bank Transfer" },
];

const PaymentPage = ({ token, orderId, setPage, showToast }) => {
  const [method, setMethod] = useState("credit_card");
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId || !token) return;
    fetch(`${API}/orders/detail/${orderId}`, { headers: ah(token) })
      .then(r => r.json()).then(setOrder).catch(() => { });
  }, [orderId, token]);

  const pay = async () => {
    setPaying(true);
    try {
      await req("POST", "/payments", { orderId, method, amount: order?.totalPrice || 0 }, token);
      setDone(true);
      showToast("Payment successful!", "s");
    } catch (ex) { showToast(ex.message, "e"); } finally { setPaying(false); }
  };

  if (done) return (
    <div className="pg">
      <div className="empty" style={{ paddingTop: 96 }}>
        <div className="eicon" style={{ opacity: 1, fontSize: "3.5rem" }}>✅</div>
        <div className="etitle">Payment confirmed!</div>
        <div className="etext" style={{ marginBottom: 28 }}>Your order has been placed and payment received.</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn btn-s" onClick={() => setPage("orders")}>View orders</button>
          <button className="btn btn-p" onClick={() => setPage("products")}>Continue shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pg-sm">
      <div className="acard">
        <div className="ahead">
          <div className="atitle">Payment</div>
          <div className="asub">Order #{orderId} · {order ? `฿${Number(order.totalPrice).toLocaleString()}` : "Loading…"}</div>
        </div>
        <div style={{ fontWeight: 500, fontSize: ".85rem", marginBottom: 14 }}>Select payment method</div>
        <div className="pmethods">
          {METHODS.map(m => (
            <div key={m.key} className={`pmethod ${method === m.key ? "sel" : ""}`} onClick={() => setMethod(m.key)}>
              <div className="pmethod-icon">{m.icon}</div>
              <div className="pmethod-label">{m.label}</div>
            </div>
          ))}
        </div>
        {method === "credit_card" && (
          <>
            <div className="fg"><label className="fl">Card number</label><input className="fi" placeholder="1234 5678 9012 3456" /></div>
            <div className="frow">
              <div className="fg"><label className="fl">Expiry</label><input className="fi" placeholder="MM/YY" /></div>
              <div className="fg"><label className="fl">CVV</label><input className="fi" placeholder="123" /></div>
            </div>
          </>
        )}
        {method === "promptpay" && <div className="al al-i" style={{ marginBottom: 18 }}>📱 Scan PromptPay QR — Amount: {order ? `฿${Number(order.totalPrice).toLocaleString()}` : "…"}</div>}
        {method === "bank_transfer" && <div className="al al-i" style={{ marginBottom: 18 }}>🏦 Transfer to Kasikorn Bank <strong>123-456-7890</strong> — Amount: {order ? `฿${Number(order.totalPrice).toLocaleString()}` : "…"}</div>}
        <button className="btn btn-p btn-full btn-lg" onClick={pay} disabled={paying}>
          {paying ? <><span className="sp" /> Processing…</> : `Pay ${order ? `฿${Number(order.totalPrice).toLocaleString()}` : ""}`}
        </button>
        <button className="btn btn-s btn-full" style={{ marginTop: 10 }} onClick={() => setPage("orders")}>Pay later</button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS
// ══════════════════════════════════════════════════════════════════════════════
const OrdersPage = ({ token, user, setPage, setOrderId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${API}/orders/${user.id}`, { headers: ah(token) })
      .then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setOrders([])).finally(() => setLoading(false));
  }, [token, user]);

  if (!token) return (
    <div className="pg"><div className="empty"><div className="eicon">🔒</div><div className="etitle">Sign in to view orders</div><button className="btn btn-p" style={{ marginTop: 20 }} onClick={() => setPage("login")}>Sign in</button></div></div>
  );

  return (
    <div className="pg-md">
      <div className="ph"><h1 className="pt">Your orders</h1><p className="ps">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p></div>
      {loading ? <div className="ldg"><span className="sp sp-d" /></div>
        : orders.length === 0 ? (
          <div className="empty"><div className="eicon">📋</div><div className="etitle">No orders yet</div><button className="btn btn-p" style={{ marginTop: 20 }} onClick={() => setPage("products")}>Browse products</button></div>
        ) : orders.map(o => (
          <div key={o.id} className="ocard">
            <div className="ohdr">
              <div><div className="oid">Order #{String(o.id).padStart(6, "0")}</div><div className="odate">{o.createdAt ? new Date(o.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" }) : "Recently"}</div></div>
              <SBadge s={o.status} />
              {o.payment && <span className={`sbadge s-${o.payment.status}`}>💳 {o.payment.status}</span>}
              <div className="otot">฿{Number(o.totalPrice).toLocaleString()}</div>
            </div>
            <div style={{ padding: "12px 22px" }}>
              {o.address && <div style={{ fontSize: ".8rem", color: "var(--g500)", marginBottom: 8 }}>📍 {o.address} · 📞 {o.phone}</div>}
              {o.items?.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: ".875rem", color: "var(--g500)", padding: "4px 0" }}>
                  <span>{item.product?.name || "Item"} ×{item.quantity}</span>
                  <span>฿{(Number(item.price || 0) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              {o.status === "PENDING" && !o.payment && (
                <button className="btn btn-g btn-sm" style={{ marginTop: 10 }} onClick={() => { setOrderId(o.id); setPage("payment"); }}>Pay now</button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN — PRODUCT FORM
// ══════════════════════════════════════════════════════════════════════════════
const ProductForm = ({ initial, token, cats, onDone, onCancel }) => {
  const [form, setForm] = useState(initial || { name: "", description: "", price: "", stock: "", imageUrl: "", categoryId: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const isEdit = !!initial?.id;

  const submit = async e => {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      const body = { ...form, price: Number(form.price), stock: Number(form.stock), categoryId: Number(form.categoryId) };
      if (isEdit) await req("PUT", `/products/${initial.id}`, body, token);
      else await req("POST", "/products", body, token);
      onDone();
    } catch (ex) { setErr(ex.message); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit}>
      {err && <div className="al al-e">{err}</div>}
      <div className="fg"><label className="fl">Product name</label><input className="fi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
      <div className="fg"><label className="fl">Description</label><textarea className="fi" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
      <div className="frow">
        <div className="fg"><label className="fl">Price (฿)</label><input className="fi" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
        <div className="fg"><label className="fl">Stock</label><input className="fi" type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required /></div>
      </div>
      <div className="fg"><label className="fl">Image URL</label><input className="fi" placeholder="https://…" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} /></div>
      <div className="fg">
        <label className="fl">Category</label>
        <select className="fi" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
          <option value="">Select category…</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-s" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-p" disabled={loading}>{loading ? <span className="sp" /> : isEdit ? "Save changes" : "Add product"}</button>
      </div>
    </form>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
const AdminPage = ({ token, showToast }) => {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const loadProducts = useCallback(() => {
    fetch(`${API}/products`).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => { });
  }, []);
  const loadOrders = useCallback(() => {
    fetch(`${API}/orders`, { headers: ah(token) }).then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : [])).catch(() => {
      fetch(`${API}/orders`, { headers: ah(token) }).then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : [])).catch(() => { });
    });
  }, [token]);
  const loadCats = useCallback(() => {
    fetch(`${API}/categories`).then(r => r.json()).then(d => setCats(Array.isArray(d) ? d : [])).catch(() => { });
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/products`).then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => { }),
      fetch(`${API}/orders`, { headers: ah(token) }).then(r => r.json()).then(d => setOrders(Array.isArray(d) ? d : [])).catch(() => { }),
      fetch(`${API}/categories`).then(r => r.json()).then(d => setCats(Array.isArray(d) ? d : [])).catch(() => { }),
    ]).finally(() => setLoading(false));
  }, [token]);

  const delProduct = async id => {
    try {
      await req("DELETE", `/products/${id}`, null, token);
      setProducts(p => p.filter(x => x.id !== id));
      showToast("Product deleted", "s");
    } catch (ex) { showToast(ex.message, "e"); }
    setConfirm(null);
  };

  const updateStatus = async (id, status) => {
    try {
      await req("PATCH", `/orders/${id}/status`, { status }, token);
      setOrders(p => p.map(o => o.id === id ? { ...o, status } : o));
      showToast("Status updated", "s");
    } catch (ex) { showToast(ex.message, "e"); }
  };

  const STATUSES = ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"];

  return (
    <div className="pg">
      {confirm && <Confirm msg={confirm.msg} onYes={confirm.onYes} onNo={() => setConfirm(null)} />}
      {modal?.type === "add" && (
        <Modal title="Add product" onClose={() => setModal(null)}>
          <ProductForm token={token} cats={cats} onDone={() => { loadProducts(); setModal(null); showToast("Product added!", "s"); }} onCancel={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "edit" && (
        <Modal title="Edit product" onClose={() => setModal(null)}>
          <ProductForm initial={modal.data} token={token} cats={cats} onDone={() => { loadProducts(); setModal(null); showToast("Product updated!", "s"); }} onCancel={() => setModal(null)} />
        </Modal>
      )}

      <div className="ph-row">
        <div><h1 className="pt">Admin</h1><p className="ps">Manage your store</p></div>
        {tab === "products" && <button className="btn btn-p" onClick={() => setModal({ type: "add" })}>+ Add product</button>}
      </div>

      <div className="admin-tabs">
        {[["products", "🛍️ Products"], ["orders", "📦 Orders"]].map(([k, l]) => (
          <button key={k} className={`atab ${tab === k ? "on" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {loading ? <div className="ldg"><span className="sp sp-d" /></div>
        : tab === "products" ? (
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table className="atable">
              <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td><div className="atd-img">{p.imageUrl ? <img src={p.imageUrl} alt="" onError={e => { e.target.style.display = "none"; }} /> : "🛍️"}</div></td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td><span className="chip">{p.category?.name || "—"}</span></td>
                    <td style={{ fontFamily: "var(--fd)", fontStyle: "italic" }}>฿{Number(p.price).toLocaleString()}</td>
                    <td><span style={{ color: p.stock === 0 ? "var(--red)" : "inherit" }}>{p.stock}</span></td>
                    <td>{p.avgRating > 0 ? <><StarDisplay val={p.avgRating} /> {p.avgRating?.toFixed(1)}</> : "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-s btn-sm" onClick={() => setModal({ type: "edit", data: { ...p } })}>Edit</button>
                        <button className="btn btn-d btn-sm" onClick={() => setConfirm({ msg: `Delete "${p.name}"? This cannot be undone.`, onYes: () => delProduct(p.id) })}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table className="atable">
              <thead><tr><th>Order #</th><th>Date</th><th>Customer</th><th>Address</th><th>Total</th><th>Payment</th><th>Status</th><th>Update</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 500 }}>#{String(o.id).padStart(6, "0")}</td>
                    <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString("th-TH") : "—"}</td>
                    <td>{o.user?.name || o.user?.email || "—"}</td>
                    <td style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.address || "—"}</td>
                    <td style={{ fontFamily: "var(--fd)", fontStyle: "italic" }}>฿{Number(o.totalPrice).toLocaleString()}</td>
                    <td>{o.payment ? <span className={`sbadge s-${o.payment.status}`}>{o.payment.status}</span> : <span className="chip">None</span>}</td>
                    <td><SBadge s={o.status} /></td>
                    <td>
                      <select className="fi" style={{ padding: "6px 10px", fontSize: ".8rem", width: 140 }} value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════════════════════════════════════
const Navbar = ({ page, setPage, token, user, onLogout, cartCount }) => {
  const isAdmin = user?.role === "ADMIN";
  return (
    <nav className="nav">
      <div className="nav-in">
        <span className="brand" onClick={() => setPage("products")}><em>North</em>Amulet</span>
        <div className="nav-links">
          <button className={`nbtn${page === "products" ? " on" : ""}`} onClick={() => setPage("products")}>Products</button>
          {token && (
            <>
              <button className={`nbtn${page === "cart" ? " on" : ""}`} onClick={() => setPage("cart")}>
                Cart {cartCount > 0 && <span className="nbadge">{cartCount}</span>}
              </button>
              <button className={`nbtn${page === "orders" ? " on" : ""}`} onClick={() => setPage("orders")}>Orders</button>
              {isAdmin && <button className={`nbtn${page === "admin" ? " on" : ""}`} onClick={() => setPage("admin")}>Admin</button>}
            </>
          )}
          <div className="ndiv" />
          {token ? (
            <>
              {isAdmin && <span className="nadmin">Admin</span>}
              <span className="nuser">{user?.name || user?.email}</span>
              <button className="nbtn" onClick={onLogout}>Sign out</button>
            </>
          ) : (
            <>
              <button className={`nbtn${page === "login" ? " on" : ""}`} onClick={() => setPage("login")}>Sign in</button>
              <button className="btn btn-p btn-sm" onClick={() => setPage("register")}>Register</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("products");
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } });
  const [prod, setProd] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const { ts, show } = useToast();

  const login = (tok, usr) => {
    setToken(tok); setUser(usr);
    localStorage.setItem("token", tok);
    localStorage.setItem("user", JSON.stringify(usr));
    setPage(usr?.role === "ADMIN" ? "admin" : "products");
    show("Welcome back, " + (usr?.name || usr?.email) + "!", "s");
  };

  const logout = () => {
    setToken(""); setUser(null);
    localStorage.removeItem("token"); localStorage.removeItem("user");
    setPage("products"); show("Signed out");
  };

  useEffect(() => {
    if (!token || !user?.id) { setCartCount(0); return; }
    fetch(`${API}/cart/${user.id}`, { headers: ah(token) })
      .then(r => r.json()).then(d => setCartCount(Array.isArray(d) ? d.length : 0)).catch(() => { });
  }, [token, user, page]);

  const render = () => {
    switch (page) {
      case "login": return <LoginPage onLogin={login} setPage={setPage} />;
      case "register": return <RegisterPage onLogin={login} setPage={setPage} />;
      case "product": return <ProductDetailPage product={prod} token={token} user={user} setPage={setPage} showToast={show} />;
      case "cart": return <CartPage token={token} user={user} setPage={setPage} showToast={show} />;
      case "checkout": return <CheckoutPage token={token} user={user} setPage={setPage} showToast={show} setOrderId={setOrderId} />;
      case "payment": return <PaymentPage token={token} orderId={orderId} setPage={setPage} showToast={show} />;
      case "orders": return <OrdersPage token={token} user={user} setPage={setPage} setOrderId={setOrderId} />;
      case "admin": return <AdminPage token={token} showToast={show} />;
      default: return <ProductsPage setPage={setPage} setProd={setProd} />;
    }
  };

  return (
    <>
      <G />
      <Navbar page={page} setPage={setPage} token={token} user={user} onLogout={logout} cartCount={cartCount} />
      <main>{render()}</main>
      <Toast ts={ts} />
    </>
  );
}