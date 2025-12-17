import { useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../assets/vyapari-icon.png";
import { supabase } from "../lib/supabase";

export default function Welcome() {
  const navigate = useNavigate();

  const [step, setStep] = useState("welcome"); // welcome | login | otp | business
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const SUPABASE_FUNCTION_URL =
  "https://ocqovijbeyneydbjvzdz.supabase.co/functions/v1";


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

  /* ---------------- OTP SEND ---------------- */
  const sendOtp = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      `${SUPABASE_FUNCTION_URL}/send-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          phone: `+91${phone}`,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to send OTP");
    }

    setStep("otp");
  } catch (e) {
    alert(e.message);
  } finally {
    setLoading(false);
  }
};



  /* ---------------- OTP VERIFY ---------------- */
  const verifyOtp = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      `${SUPABASE_FUNCTION_URL}/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          phone: `+91${phone}`,
          otp,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Invalid OTP");
    }

    localStorage.setItem(
      "auth_user",
      JSON.stringify({ isVerified: true, phone })
    );

    setStep("business");
  } catch (e) {
    alert(e.message);
  } finally {
    setLoading(false);
  }
};


  /* ---------------- SAVE BUSINESS ---------------- */
  const saveBusiness = async () => {
    try {
      setLoading(true);

      const { data: user } = await supabase
        .from("users")
        .upsert({ phone })
        .select()
        .single();

      await supabase.from("business_profiles").insert({
        user_id: user.id,
        business_name: businessName,
        owner_name: ownerName,
      });

      localStorage.setItem(
        "business_profile",
        JSON.stringify({ businessName, ownerName, phone })
      );

      navigate("/dashboard");
    } catch (e) {
      alert("Failed to save business");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(180deg,#2a0a3d,#12041d)" }}>

      <div className="flex justify-center pt-24">
        <img src={icon} className="w-56 h-56" />
      </div>

      <div className="absolute bottom-0 w-full h-[48%] bg-[#ded6e3] rounded-t-[36px] overflow-hidden">
        <div className="relative w-full h-full">

          {/* WELCOME */}
          <div style={panelStyle("welcome", "left")}
            className="absolute inset-0 px-6 pt-10 flex flex-col items-center">
            <h1 className="text-3xl font-extrabold">VYAPARI</h1>
            <p className="text-center text-sm mt-4">
              Manage your wholesale business effortlessly
            </p>
            <button onClick={() => setStep("login")}
              className="mt-8 px-10 py-3 rounded-full bg-purple-600 text-white">
              Let’s Start →
            </button>
          </div>

          {/* LOGIN */}
          <div style={panelStyle("login", "right")}
            className="absolute inset-0 px-6 pt-10 flex flex-col items-center">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter phone number"
              className="mt-10 w-full max-w-sm p-3 rounded-xl"
            />
            <button onClick={sendOtp}
              disabled={phone.length !== 10 || loading}
              className="mt-6 px-10 py-3 rounded-full bg-purple-600 text-white">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>

          {/* OTP */}
          <div style={panelStyle("otp", "right")}
            className="absolute inset-0 px-6 pt-10 flex flex-col items-center">
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter OTP"
              maxLength={6}
              className="mt-10 w-full max-w-sm p-3 rounded-xl text-center"
            />
            <button onClick={verifyOtp}
              disabled={otp.length !== 6 || loading}
              className="mt-6 px-10 py-3 rounded-full bg-purple-600 text-white">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          {/* BUSINESS */}
          <div style={panelStyle("business", "right")}
            className="absolute inset-0 px-6 pt-10 flex flex-col items-center">
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
            <button onClick={saveBusiness}
              disabled={!businessName || !ownerName || loading}
              className="mt-6 px-10 py-3 rounded-full bg-purple-600 text-white">
              Save & Continue →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
