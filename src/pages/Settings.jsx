import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlassPage from "../components/ui/GlassPage";
import GlassCard from "../components/ui/GlassCard";
import GlassButton from "../components/ui/GlassButton";
import { generateTallyCSV } from "../utils/tallyCsv";

export default function Settings() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");

  const [defaultStatus, setDefaultStatus] = useState("pending");
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  const [theme, setTheme] = useState("light");
  const [profilePhoto, setProfilePhoto] = useState(null);

  const [showTally, setShowTally] = useState(false);

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth_user") || "{}");
    if (auth?.phone) setPhone(auth.phone);

    const profile = JSON.parse(
      localStorage.getItem("business_profile") || "{}"
    );
    if (profile.businessName) setBusinessName(profile.businessName);
    if (profile.ownerName) setOwnerName(profile.ownerName);

    const settings = JSON.parse(
      localStorage.getItem("vyapari_settings") || "{}"
    );

    if (settings.defaultStatus) setDefaultStatus(settings.defaultStatus);
    if (typeof settings.whatsappEnabled === "boolean")
      setWhatsappEnabled(settings.whatsappEnabled);
    if (typeof settings.paymentAlerts === "boolean")
      setPaymentAlerts(settings.paymentAlerts);
    if (settings.theme) setTheme(settings.theme);
    if (settings.profilePhoto) setProfilePhoto(settings.profilePhoto);

    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark"
    );
  }, []);

  /* ---------------- SAVE ---------------- */
  const saveSettings = () => {
    localStorage.setItem(
      "business_profile",
      JSON.stringify({ businessName, ownerName })
    );

    localStorage.setItem(
      "vyapari_settings",
      JSON.stringify({
        defaultStatus,
        whatsappEnabled,
        paymentAlerts,
        theme,
        profilePhoto,
      })
    );

    alert("Settings saved successfully");
  };

  /* ---------------- PHOTO ---------------- */
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  /* ---------------- THEME ---------------- */
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("auth_user");
    navigate("/welcome");
  };

  return (
    <GlassPage>
      <h1 className="text-xl font-bold mb-4">Settings</h1>

      {/* PROFILE */}
      <GlassCard>
        <h2 className="font-semibold mb-3">Profile</h2>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
            {profilePhoto ? (
              <img src={profilePhoto} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-gray-500">
                Photo
              </div>
            )}
          </div>

          <label className="text-purple-600 cursor-pointer text-sm">
            Upload Photo
            <input type="file" hidden onChange={handlePhotoUpload} />
          </label>
        </div>

        <input
          className="w-full mb-2 px-4 py-2 rounded-xl border"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <input
          className="w-full mb-2 px-4 py-2 rounded-xl border"
          placeholder="Owner Name"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />

        <input
          disabled
          className="w-full px-4 py-2 rounded-xl border bg-gray-100"
          value={phone}
        />

        <GlassButton className="mt-4" onClick={saveSettings}>
          Save Profile
        </GlassButton>
      </GlassCard>

      {/* ✅ TALLY BRIDGE (NEW) */}
      <GlassCard className="mt-4">
        <h2 className="font-semibold mb-2">Tally Bridge</h2>
        <p className="text-sm text-gray-600 mb-3">
          Export all customer & supplier data for your accountant.
        </p>

        <GlassButton onClick={() => setShowTally(true)}>
          Generate CSV
        </GlassButton>
      </GlassCard>

      {/* APP PREFERENCES */}
      <GlassCard className="mt-4">
        <h2 className="font-semibold mb-3">App Preferences</h2>

        <select
          className="w-full mb-3 px-4 py-2 rounded-xl border"
          value={defaultStatus}
          onChange={(e) => setDefaultStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex justify-between mb-2">
          WhatsApp Reminders
          <input
            type="checkbox"
            checked={whatsappEnabled}
            onChange={(e) => setWhatsappEnabled(e.target.checked)}
          />
        </div>

        <div className="flex justify-between">
          Dark Theme
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
        </div>
      </GlassCard>

      {/* LOGOUT */}
      <GlassCard className="mt-4">
        <GlassButton className="bg-gray-800 text-white" onClick={logout}>
          Log Out
        </GlassButton>
      </GlassCard>

      {/* TALLY POPUP */}
      {showTally && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm">
            <h3 className="font-semibold mb-2">Tally CSV Ready</h3>

            <GlassButton
              className="w-full mb-3"
              onClick={() => {
                const csv = generateTallyCSV();
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "vyapari-tally-export.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download CSV
            </GlassButton>

            <GlassButton
              className="w-full bg-green-600 text-white mb-2"
              onClick={() =>
                window.open("https://wa.me/?text=Vyapari%20Tally%20CSV", "_blank")
              }
            >
              Share on WhatsApp
            </GlassButton>

            <button
              onClick={() => setShowTally(false)}
              className="w-full text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </GlassPage>
  );
}
