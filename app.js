const { useState } = React;

const COLOR = "#47482b";
const COLOR_DARK = "#33341f";
const COLOR_LIGHT = "#c49d57";

const LANG = {
  pt: {
    title: "Tag de Mala", subtitle: "Escaneie para ver informações de contato",
    name: "Nome completo", email: "E-mail", phone: "WhatsApp / Telefone", destination: "Endereço",
    pin: "PIN (4 dígitos)", confirmPin: "Confirmar PIN",
    save: "Salvar", edit: "Editar meus dados", logout: "Sair",
    login: "Entrar para editar", loginBtn: "Entrar",
    firstAccess: "Primeiro acesso? Cadastre seus dados",
    register: "Cadastrar", back: "Voltar",
    contact: "Informações de contato", foundBag: "Encontrou esta mala? Entre em contato:",
    ownerArea: "Área do proprietário", pinMismatch: "Os PINs não coincidem",
    pinLength: "O PIN deve ter 4 dígitos", wrongPin: "PIN incorreto",
    wrongEmail: "E-mail não encontrado para esta tag", fillAll: "Preencha todos os campos",
    savedSuccess: "Dados salvos com sucesso!", tagId: "Tag",
    adminPanel: "Painel Admin — QR Codes", printAll: "Imprimir todos",
    scanInstruction: "Cada QR Code é único por pessoa",
    notRegistered: "Esta tag ainda não foi cadastrada.",
    pinInfo: "O PIN protege seus dados. Guarde-o bem.",
    editData: "Editar dados", updateSuccess: "Dados atualizados!",
  },
  en: {
    title: "Luggage Tag", subtitle: "Scan to see contact information",
    name: "Full name", email: "E-mail", phone: "WhatsApp / Phone", destination: "Address",
    pin: "PIN (4 digits)", confirmPin: "Confirm PIN",
    save: "Save", edit: "Edit my info", logout: "Log out",
    login: "Log in to edit", loginBtn: "Log in",
    firstAccess: "First time? Register your info",
    register: "Register", back: "Back",
    contact: "Contact information", foundBag: "Found this bag? Get in touch:",
    ownerArea: "Owner area", pinMismatch: "PINs don't match",
    pinLength: "PIN must be 4 digits", wrongPin: "Incorrect PIN",
    wrongEmail: "E-mail not found for this tag", fillAll: "Please fill all fields",
    savedSuccess: "Info saved successfully!", tagId: "Tag",
    adminPanel: "Admin Panel — QR Codes", printAll: "Print all",
    scanInstruction: "Each QR Code is unique per person",
    notRegistered: "This tag hasn't been registered yet.",
    pinInfo: "Your PIN protects your data. Keep it safe.",
    editData: "Edit info", updateSuccess: "Info updated!",
  }
};

const TOTAL_TAGS = 20;
const TAG_NAMES = [
  "Simone", "Luis", "Viviane", "Lívia", "Silvia",
  "Fernanda", "Rodrigo", "Juliana", "Aurora", "Andrea",
  "Lars", "Antonio", "Helena", "Laura", "Alice",
  "Marcelo", "Wallace", "Joana", "Reserva 1", "Reserva 2"
];

const storageKey = id => `luggage_tag_${id}`;

function loadTag(id) {
  try { const v = localStorage.getItem(storageKey(id)); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function saveTag(id, data) {
  localStorage.setItem(storageKey(id), JSON.stringify(data));
}

const QRImg = ({ value, size = 120 }) =>
  React.createElement("img", {
    src: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&color=47482b`,
    alt: "QR Code", width: size, height: size
  });

const inpStyle = {
  width: "100%", border: "1px solid #d1d5db", borderRadius: "8px",
  padding: "8px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box"
};

function Field({ label, value, onChange, type = "text", maxLength }) {
  return React.createElement("input", {
    style: inpStyle, placeholder: label, value, type,
    maxLength, onChange: e => onChange(e.target.value)
  });
}

const btnPrimary = {
  width: "100%", marginTop: "16px", backgroundColor: COLOR,
  color: "white", borderRadius: "8px", padding: "10px", fontWeight: "600",
  border: "none", cursor: "pointer", fontSize: "14px"
};
const btnSecondary = {
  width: "100%", marginTop: "8px", background: "none",
  border: "none", cursor: "pointer", fontSize: "13px",
  color: "#6b7280", textDecoration: "underline"
};

function PublicView({ tag, lang, onOwnerClick }) {
  const t = LANG[lang];
  if (!tag) return React.createElement("div", { style: { textAlign: "center", padding: "40px 0", color: "#6b7280" } },
    React.createElement("p", { style: { fontSize: "40px", marginBottom: "12px" } }, "🏷️"),
    React.createElement("p", null, t.notRegistered),
    React.createElement("button", { onClick: onOwnerClick, style: { ...btnSecondary, color: COLOR, marginTop: "16px" } }, t.firstAccess)
  );
  return React.createElement("div", null,
    React.createElement("div", {
      style: {
        background: `linear-gradient(135deg, ${COLOR}, ${COLOR_DARK})`,
        borderRadius: "16px", padding: "20px", color: "white", marginBottom: "16px",
        boxShadow: "0 4px 12px rgba(71,72,43,0.3)"
      }
    },
      React.createElement("p", { style: { fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", opacity: 0.7, marginBottom: "4px" } }, t.foundBag),
      React.createElement("p", { style: { fontSize: "22px", fontWeight: "700", marginBottom: "12px" } }, tag.name),
      React.createElement("div", { style: { fontSize: "13px", lineHeight: "1.8" } },
        React.createElement("p", null, "📧 " + tag.email),
        React.createElement("p", null, "📱 " + tag.phone),
        React.createElement("p", null, "🏠 " + tag.destination),
      )
    ),
    React.createElement("button", { onClick: onOwnerClick, style: btnSecondary }, t.ownerArea)
  );
}

function RegisterView({ tagId, lang, onSaved, onBack }) {
  const t = LANG[lang];
  const [f, setF] = useState({ name: "", email: "", phone: "", destination: "", pin: "", confirmPin: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const set = k => v => setF(p => ({ ...p, [k]: v }));

  function submit() {
    setErr("");
    if (!f.name || !f.email || !f.phone || !f.destination || !f.pin) return setErr(t.fillAll);
    if (f.pin.length !== 4) return setErr(t.pinLength);
    if (f.pin !== f.confirmPin) return setErr(t.pinMismatch);
    saveTag(tagId, { name: f.name, email: f.email, phone: f.phone, destination: f.destination, pin: f.pin });
    setOk(true);
    setTimeout(onSaved, 1200);
  }

  return React.createElement("div", null,
    React.createElement("button", { onClick: onBack, style: { ...btnSecondary, textAlign: "left", width: "auto", marginTop: 0, marginBottom: "12px" } }, "← " + t.back),
    React.createElement("p", { style: { fontWeight: "600", color: "#374151", marginBottom: "12px" } }, t.firstAccess),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } },
      React.createElement(Field, { label: t.name, value: f.name, onChange: set("name") }),
      React.createElement(Field, { label: t.email, value: f.email, onChange: set("email") }),
      React.createElement(Field, { label: t.phone, value: f.phone, onChange: set("phone") }),
      React.createElement(Field, { label: t.destination, value: f.destination, onChange: set("destination") }),
      React.createElement(Field, { label: t.pin, value: f.pin, onChange: set("pin"), type: "password", maxLength: 4 }),
      React.createElement(Field, { label: t.confirmPin, value: f.confirmPin, onChange: set("confirmPin"), type: "password", maxLength: 4 }),
      React.createElement("p", { style: { fontSize: "11px", color: "#9ca3af" } }, t.pinInfo),
    ),
    err && React.createElement("p", { style: { color: "#ef4444", fontSize: "13px", marginTop: "8px" } }, err),
    ok && React.createElement("p", { style: { color: "#22c55e", fontSize: "13px", marginTop: "8px" } }, "✅ " + t.savedSuccess),
    React.createElement("button", { onClick: submit, style: btnPrimary }, t.register)
  );
}

function LoginView({ tagId, lang, onLoggedIn, onBack, onRegister }) {
  const t = LANG[lang];
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  function submit() {
    setErr("");
    const tag = loadTag(tagId);
    if (!tag) return setErr(t.notRegistered);
    if (tag.email.toLowerCase() !== email.toLowerCase()) return setErr(t.wrongEmail);
    if (tag.pin !== pin) return setErr(t.wrongPin);
    onLoggedIn(tag);
  }

  return React.createElement("div", null,
    React.createElement("button", { onClick: onBack, style: { ...btnSecondary, textAlign: "left", width: "auto", marginTop: 0, marginBottom: "12px" } }, "← " + t.back),
    React.createElement("p", { style: { fontWeight: "600", color: "#374151", marginBottom: "12px" } }, t.login),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } },
      React.createElement(Field, { label: t.email, value: email, onChange: setEmail }),
      React.createElement(Field, { label: t.pin, value: pin, onChange: setPin, type: "password", maxLength: 4 }),
    ),
    err && React.createElement("p", { style: { color: "#ef4444", fontSize: "13px", marginTop: "8px" } }, err),
    React.createElement("button", { onClick: submit, style: btnPrimary }, t.loginBtn),
    React.createElement("button", { onClick: onRegister, style: btnSecondary }, t.firstAccess)
  );
}

function EditView({ tagId, lang, tag, onSaved, onLogout }) {
  const t = LANG[lang];
  const [f, setF] = useState({ name: tag.name, email: tag.email, phone: tag.phone, destination: tag.destination });
  const [ok, setOk] = useState(false);
  const set = k => v => setF(p => ({ ...p, [k]: v }));

  function submit() {
    saveTag(tagId, { ...f, pin: tag.pin });
    setOk(true);
    setTimeout(() => onSaved({ ...f, pin: tag.pin }), 1000);
  }

  return React.createElement("div", null,
    React.createElement("p", { style: { fontWeight: "600", color: "#374151", marginBottom: "12px" } }, t.editData),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "8px" } },
      React.createElement(Field, { label: t.name, value: f.name, onChange: set("name") }),
      React.createElement(Field, { label: t.email, value: f.email, onChange: set("email") }),
      React.createElement(Field, { label: t.phone, value: f.phone, onChange: set("phone") }),
      React.createElement(Field, { label: t.destination, value: f.destination, onChange: set("destination") }),
    ),
    ok && React.createElement("p", { style: { color: "#22c55e", fontSize: "13px", marginTop: "8px" } }, "✅ " + t.updateSuccess),
    React.createElement("button", { onClick: submit, style: btnPrimary }, t.save),
    React.createElement("button", { onClick: onLogout, style: btnSecondary }, t.logout)
  );
}

function TagSimulator({ tagId, lang }) {
  const [view, setView] = useState("public");
  const [tagData, setTagData] = useState(() => loadTag(tagId));

  if (view === "public") return React.createElement(PublicView, { tag: tagData, lang, onOwnerClick: () => setView(tagData ? "login" : "register") });
  if (view === "register") return React.createElement(RegisterView, { tagId, lang, onBack: () => setView("public"), onSaved: () => { setTagData(loadTag(tagId)); setView("public"); } });
  if (view === "login") return React.createElement(LoginView, { tagId, lang, onBack: () => setView("public"), onRegister: () => setView("register"), onLoggedIn: d => { setTagData(d); setView("edit"); } });
  if (view === "edit") return React.createElement(EditView, { tagId, lang, tag: tagData, onLogout: () => setView("public"), onSaved: d => { setTagData(d); setView("public"); } });
}

function AdminPanel({ lang, base }) {
  const t = LANG[lang];
  return React.createElement("div", null,
    React.createElement("p", { style: { fontSize: "13px", color: "#6b7280", marginBottom: "16px" } }, t.scanInstruction),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" } },
      ...Array.from({ length: TOTAL_TAGS }, (_, i) => {
        const id = i + 1;
        const url = `${base}?tag=${id}`;
        const saved = loadTag(id);
        const displayName = saved ? saved.name.split(" ")[0] : TAG_NAMES[i];
        return React.createElement("div", {
          key: id,
          style: { border: "1px solid #e5e7eb", borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }
        },
          React.createElement("p", { style: { fontSize: "12px", fontWeight: "700", color: COLOR } }, displayName),
          React.createElement(QRImg, { value: url, size: 100 }),
          React.createElement("p", { style: { fontSize: "10px", color: "#9ca3af", textAlign: "center", wordBreak: "break-all" } }, url)
        );
      })
    ),
    React.createElement("button", {
      onClick: () => window.print(),
      style: { ...btnPrimary, marginTop: "24px", backgroundColor: COLOR_DARK }
    }, t.printAll)
  );
}

function App() {
  const params = new URLSearchParams(window.location.search);
  const tagParam = parseInt(params.get("tag"));
  const tagId = tagParam >= 1 && tagParam <= TOTAL_TAGS ? tagParam : null;
  const base = window.location.origin + window.location.pathname;
  const [lang, setLang] = useState("pt");
  const [view, setView] = useState(tagId ? "tag" : "admin");
  const t = LANG[lang];

  return React.createElement("div", { style: { minHeight: "100vh", backgroundColor: COLOR_LIGHT, display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px" } },
    React.createElement("div", { style: { width: "100%", maxWidth: "360px" } },
      // Header
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" } },
        React.createElement("div", null,
          React.createElement("h1", { style: { fontSize: "18px", fontWeight: "700", color: COLOR } }, "🏷️ " + t.title),
          tagId && React.createElement("p", { style: { fontSize: "11px", color: "#6b7280" } }, TAG_NAMES[tagId - 1])
        ),
        React.createElement("div", { style: { display: "flex", gap: "4px" } },
          ["pt", "en"].map(l => React.createElement("button", {
            key: l, onClick: () => setLang(l),
            style: {
              fontSize: "11px", padding: "3px 8px", borderRadius: "20px", cursor: "pointer",
              backgroundColor: lang === l ? COLOR : "transparent",
              color: lang === l ? "white" : "#6b7280",
              border: `1px solid ${lang === l ? COLOR : "#d1d5db"}`
            }
          }, l.toUpperCase()))
        )
      ),
      // Nav
      !tagId && React.createElement("div", { style: { display: "flex", gap: "8px", marginBottom: "16px" } },
        ["admin", "tag"].map(v => React.createElement("button", {
          key: v, onClick: () => setView(v),
          style: {
            flex: 1, fontSize: "13px", padding: "6px", borderRadius: "8px", cursor: "pointer",
            backgroundColor: view === v ? COLOR : "transparent",
            color: view === v ? "white" : "#6b7280",
            border: `1px solid ${view === v ? COLOR : "#d1d5db"}`
          }
        }, v === "admin" ? t.adminPanel : `${t.tagId} (demo)`))
      ),
      // Card
      React.createElement("div", { style: { background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(71,72,43,0.1)", padding: "20px" } },
        view === "admin" && !tagId
          ? React.createElement(AdminPanel, { lang, base })
          : React.createElement(TagSimulator, { tagId: tagId || 1, lang })
      ),
      React.createElement("p", { style: { textAlign: "center", fontSize: "11px", color: "#c4c4a0", marginTop: "16px" } }, "Oxygen Hub · Smart Luggage Tag")
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
