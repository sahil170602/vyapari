import { useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../assets/vyapari-icon.png";
import { supabase } from "../lib/supabase";

export default function Welcome() {
  const navigate = useNavigate();

  const [step, setStep] = useState("welcome");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- SLIDE STYLE ---------------- */
  const panelStyle = (active, from) => ({
    transform:
      step === active
        ? "translateX(0)"
        : from === "left"
        ? "translateX(-100%)"
        : "translateX(100%)",
    opacity: step === active ? 1 : 0,
    transition: "all 350ms ease-in-out",
  });

  /* ---------------- SAVE BUSINESS ---------------- */
  const saveBusiness = async () => {
    try {
      setLoading(true);

      const phoneNumber = `+91${phone}`;

      // 1️⃣ Create or get user
      const { data: user, error: userError } = await supabase
        .from("users")
        .upsert({ phone: phoneNumber })
        .select()
        .single();

      if (userError) {
        console.error(userError);
        alert("Failed to create user");
        return;
      }

      // 2️⃣ Create business profile
      const { error: bizError } = await supabase
        .from("business_profiles")
        .insert({
          user_id: user.id,
          business_name: businessName,
          owner_name: ownerName,
        });

      if (bizError) {
        console.error(bizError);
        alert("Failed to create business");
        return;
      }

      // 3️⃣ Save local auth (IMPORTANT)
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          isVerified: true,
          phone: phoneNumber,
          userId: user.id,
        })
      );

      localStorage.setItem(
        "business_profile",
        JSON.stringify({
          businessName,
          ownerName,
        })
      );

      // 4️⃣ Navigate
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,#2a0a3d,#12041d)" }}
    >
      <div className="flex justify-center pt-24">
        <img src={icon} className="w-56 h-56" />
      </div>

      <div className="absolute bottom-0 w-full h-[48%] bg-[#ded6e3] rounded-t-[36px] overflow-hidden">
        <div className="relative w-full h-full">

          {/* WELCOME */}
          <div
            style={panelStyle("welcome", "left")}
            className="absolute inset-0 px-6 pt-10 flex flex-col items-center"
          >
            <h1 className="text-3xl font-extrabold">VYAPARI</h1>
            <p className="text-center text-sm mt-4">
              Manage your wholesale business effortlessly
            </p>
            <button
              onClick={() => setStep("login")}
              className="mt-8 px-10 py-3 rounded-full bg-purple-600 text-white"
            >
              Let’s Start →
            </button>
          </div>

          {/* LOGIN */}
          <div
            style={panelStyle("login", "right")}
            className="absolute inset-0 px-6 pt-10 flex flex-col items-center"
          >
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter phone number"
              className="mt-10 w-full max-w-sm p-3 rounded-xl"
            />

            <button
              onClick={() => setStep("business")}
              disabled={phone.length !== 10}
              className="mt-6 px-10 py-3 rounded-full
              bg-gradient-to-r from-[#6a00ff] to-[#8f2bff]
              text-white font-semibold text-lg disabled:opacity-50"
            >
              Continue
            </button>
          </div>

          {/* BUSINESS */}
          <div
            style={panelStyle("business", "right")}
            className="absolute inset-0 px-6 pt-10 flex flex-col items-center"
          >
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Business Name"
              className="mt-8 w-full max-w-sm p-3 rounded-xl"
            />
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Owner Name"
              className="mt-4 w-full max-w-sm p-3 rounded-xl"
            />

            <button
              onClick={saveBusiness}
              disabled={!businessName || !ownerName || loading}
              className="mt-6 px-10 py-3 rounded-full
              bg-gradient-to-r from-[#6a00ff] to-[#8f2bff]
              text-white font-semibold text-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save & Continue →"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
