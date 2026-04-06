const { useState, useEffect } = React;

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

const TOTAL_TAGS = 16;
const storageKey = id => `luggage_tag_${id}`;

function loadTag(id) {
  try { const v = localStorage.getItem(storageKey(id)); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function saveTag(id, data) {
  localStorage.setItem(storageKey(id), JSON.stringify(data));
}

const QRImg = ({ value, size = 120 }) => (
  React.createElement("img", {
    src: `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`,
    alt: "QR Code", width: size, height: size
  })
);

function inp(extra = "") {
  return `w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${extra}`;
}

function PublicView({ tag, lang, onOwnerClick }) {
  const t = LANG[lang];
  if (!tag) return React.createElement("div", { className: "text-center py-10 text-gray-500" },
    React.createElement("p", { className: "text-4xl mb-3" }, "🏷️"),
    React.createElement("p", null, t.notRegistered),
    React.createElement("button", { onClick: onOwnerClick, className: "mt-4 text-sm underline text-blue-600" }, t.firstAccess)
  );
  return React.createElement("div", null,
    React.createElement("div", { className: "bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-5 text-white mb-4 shadow" },
      React.createElement("p", { className: "text-xs uppercase tracking-widest opacity-70 mb-1" }, t.foundBag),
      React.createElement("p", { className: "text-2xl font-bold mb-3" }, tag.name),
      React.createElement("div", { className: "space-y-1 text-sm" },
        React.createElement("p", null, "📧 " + tag.email),
        React.createElement("p", null, "📱 " + tag.phone),
        React.createElement("p", null, "🏠 " + tag.destination),
      )
    ),
    React.createElement("button", { onClick: onOwnerClick, className: "w-full text-center text-sm text-gray-500 underline" }, t.ownerArea)
  );
}

function Field({ label, value, onChange }) {
  return React.createElement("input", { className: inp(), placeholder: label, value, onChange: e => onChange(e.target.value) });
}

function RegisterView({ tagId, lang, onSaved, onBack }) {
  const t = LANG[lang];
  const [f, setF] = useState({ name: "", email: "", phone: "", destination: "", pin: "", confirmPin: "" });
  const [err, setErr] = useState(""); const [ok, setOk] = useState(false);
  const set = k => v => setF(p => ({ ...p, [k]: v }));
  function submit() {
    setErr("");
    if (!f.name || !f.email || !f.phone || !f.destination || !f.pin) return setErr(t.fillAll);
    if (f.pin.length !== 4) return setErr(t.pinLength);
    if (f.pin !== f.confirmPin) return setErr(t.pinMismatch);
    saveTag(tagId, { name: f.name, email: f.email, phone: f.phone, destination: f.destination, pin: f.pin });
    setOk(true); setTimeout(onSaved, 1200);
  }
  return React.createElement("div", null,
    React.createElement("button", { onClick: onBack, className: "text-sm text-gray-400 mb-3" }, "← " + t.back),
    React.createElement("p", { className: "font-semibold text-gray-700 mb-3" }, t.firstAccess),
    React.createElement("div", { className: "space-y-2" },
      React.createElement(Field, { label: t.name, value: f.name, onChange: set("name") }),
      React.createElement(Field, { label: t.email, value: f.email, onChange: set("email") }),
      React.createElement(Field, { label: t.phone, value: f.phone, onChange: set("phone") }),
      React.createElement(Field, { label: t.destination, value: f.destination, onChange: set("destination") }),
      React.createElement("input", { className: inp(), placeholder: t.pin, maxLength: 4, type: "password", value: f.pin, onChange: e => set("pin")(e.target.value) }),
      React.createElement("input", { className: inp(), placeholder: t.confirmPin, maxLength: 4, type: "password", value: f.confirmPin, onChange: e => set("confirmPin")(e.target.value) }),
      React.createElement("p", { className: "text-xs text-gray-400" }, t.pinInfo),
    ),
    err && React.createElement("p", { className: "text-red-500 text-sm mt-2" }, err),
    ok && React.createElement("p", { className: "text-green-600 text-sm mt-2" }, "✅ " + t.savedSuccess),
    React.createElement("button", { onClick: submit, className: "w-full mt-4 bg-red-600 text-white rounded-lg py-2 font-semibold" }, t.register)
  );
}

function LoginView({ tagId, lang, onLoggedIn, onBack, onRegister }) {
  const t = LANG[lang];
  const [email, setEmail] = useState(""); const [pin, setPin] = useState(""); const [err, setErr] = useState("");
  function submit() {
    setErr("");
    const tag = loadTag(tagId);
    if (!tag) return setErr(t.notRegistered);
    if (tag.email.toLowerCase() !== email.toLowerCase()) return setErr(t.wrongEmail);
    if (tag.pin !== pin) return setErr(t.wrongPin);
    onLoggedIn(tag);
  }
  return React.createElement("div", null,
    React.createElement("button", { onClick: onBack, className: "text-sm text-gray-400 mb-3" }, "← " + t.back),
    React.createElement("p", { className: "font-semibold text-gray-700 mb-3" }, t.login),
    React.createElement("div", { className: "space-y-2" },
      React.createElement("input", { className: inp(), placeholder: t.email, value: email, onChange: e => setEmail(e.target.value) }),
      React.createElement("input", { className: inp(), placeholder: t.pin, maxLength: 4, type: "password", value: pin, onChange: e => setPin(e.target.value) }),
    ),
    err && React.createElement("p", { className: "text-red-500 text-sm mt-2" }, err),
    React.createElement("button", { onClick: submit, className: "w-full mt-4 bg-red-600 text-white rounded-lg py-2 font-semibold" }, t.loginBtn),
    React.createElement("button", { onClick: onRegister, className: "w-full mt-2 text-sm text-gray-500 underline" }, t.firstAccess)
  );
}

function EditView({ tagId, lang, tag, onSaved, onLogout }) {
  const t = LANG[lang];
  const [f, setF] = useState({ name: tag.name, email: tag.email, phone: tag.phone, destination: tag.destination });
  const [ok, setOk] = useState(false);
  const set = k => v => setF(p => ({ ...p, [k]: v }));
  function submit() {
    saveTag(tagId, { ...f, pin: tag.pin });
    setOk(true); setTimeout(() => onSaved({ ...f, pin: tag.pin }), 1000);
  }
  return React.createElement("div", null,
    React.createElement("p", { className: "font-semibold text-gray-700 mb-3" }, t.editData),
    React.createElement("div", { className: "space-y-2" },
      React.createElement(Field, { label: t.name, value: f.name, onChange: set("name") }),
      React.createElement(Field, { label: t.email, value: f.email, onChange: set("email") }),
      React.createElement(Field, { label: t.phone, value: f.phone, onChange: set("phone") }),
      React.createElement(Field, { label: t.destination, value: f.destination, onChange: set("destination") }),
    ),
    ok && React.createElement("p", { className: "text-green-600 text-sm mt-2" }, "✅ " + t.updateSuccess),
    React.createElement("button", { onClick: submit, className: "w-full mt-4 bg-red-600 text-white rounded-lg py-2 font-semibold" }, t.save),
    React.createElement("button", { onClick: onLogout, className: "w-full mt-2 text-sm text-gray-500 underline" }, t.logout)
  );
}

function TagSimulator({ tagId, lang }) {
  const [view, setView] = useState("public");
  const [tagData, setTagData] = useState(() => loadTag(tagId));
  return (() => {
    if (view === "public") return React.createElement(PublicView, { tag: tagData, lang, onOwnerClick: () => setView(tagData ? "login" : "register") });
    if (view === "register") return React.createElement(RegisterView, { tagId, lang, onBack: () => setView("public"), onSaved: () => { setTagData(loadTag(tagId)); setView("public"); } });
    if (view === "login") return React.createElement(LoginView, { tagId, lang, onBack: () => setView("public"), onRegister: () => setView("register"), onLoggedIn: d => { setTagData(d); setView("edit"); } });
    if (view === "edit") return React.createElement(EditView, { tagId, lang, tag: tagData, onLogout: () => setView("public"), onSaved: d => { setTagData(d); setView("public"); } });
  })();
}

function AdminPanel({ lang, base }) {
  const t = LANG[lang];
  return React.createElement("div", null,
    React.createElement("p", { className: "text-sm text-gray-500 mb-4" }, t.scanInstruction),
    React.createElement("div", { className: "grid grid-cols-2 gap-4" },
      ...Array.from({ length: TOTAL_TAGS }, (_, i) => {
        const id = i + 1;
        const url = `${base}?tag=${id}`;
        return React.createElement("div", { key: id, className: "border rounded-xl p-3 flex flex-col items-center gap-2 bg-white shadow-sm" },
          React.createElement("p", { className: "text-xs font-bold text-gray-500" }, `${t.tagId} ${id}`),
          React.createElement(QRImg, { value: url, size: 100 }),
          React.createElement("p", { className: "text-xs text-gray-400 text-center break-all" }, url)
        );
      })
    ),
    React.createElement("button", { onClick: () => window.print(), className: "w-full mt-6 bg-gray-800 text-white rounded-lg py-2 font-semibold text-sm" }, t.printAll)
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

  return React.createElement("div", { className: "min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4" },
    React.createElement("div", { className: "w-full max-w-sm" },
      React.createElement("div", { className: "flex items-center justify-between mb-4" },
        React.createElement("div", null,
          React.createElement("h1", { className: "text-xl font-bold text-gray-800" }, "🏷️ " + t.title),
          tagId && React.createElement("p", { className: "text-xs text-gray-400" }, `${t.tagId} #${tagId}`)
        ),
        React.createElement("div", { className: "flex gap-1" },
          ["pt", "en"].map(l => React.createElement("button", {
            key: l, onClick: () => setLang(l),
            className: `text-xs px-2 py-1 rounded-full border ${lang === l ? "bg-red-600 text-white border-red-600" : "text-gray-400 border-gray-300"}`
          }, l.toUpperCase()))
        )
      ),
      !tagId && React.createElement("div", { className: "flex gap-2 mb-4" },
        ["admin", "tag"].map(v => React.createElement("button", {
          key: v, onClick: () => setView(v),
          className: `flex-1 text-sm py-1.5 rounded-lg border ${view === v ? "bg-red-600 text-white border-red-600" : "text-gray-500 border-gray-300"}`
        }, v === "admin" ? t.adminPanel : `${t.tagId} (demo)`))
      ),
      React.createElement("div", { className: "bg-white rounded-2xl shadow p-5" },
        view === "admin" && !tagId ? React.createElement(AdminPanel, { lang, base }) :
        React.createElement(TagSimulator, { tagId: tagId || 1, lang })
      ),
      React.createElement("p", { className: "text-center text-xs text-gray-300 mt-4" }, "Oxygen Hub · Smart Luggage Tag")
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
