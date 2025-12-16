import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassPage from "../components/ui/GlassPage";
import GlassCard from "../components/ui/GlassCard";
import GlassButton from "../components/ui/GlassButton";

export default function BusinessSetup() {
  const navigate = useNavigate();

  const auth = JSON.parse(localStorage.getItem("auth_user"));

  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const saveAndContinue = () => {
    if (!businessName || !ownerName) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem(
      "business_profile",
      JSON.stringify({
        businessName,
        ownerName,
        phone: auth.phone
      })
    );

    navigate("/dashboard");
  };

  return (
    <GlassPage>
      <GlassCard>
        <h1 className="text-xl font-bold mb-2">
          Setup Your Business
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          This helps us personalize your account
        </p>

        <label className="text-sm">Business Name</label>
        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Sharma Hardware"
          className="w-full px-4 py-2 mb-3 rounded-xl border"
        />

        <label className="text-sm">Owner Name</label>
        <input
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          placeholder="Sahil"
          className="w-full px-4 py-2 mb-4 rounded-xl border"
        />

        <GlassButton className="w-full" onClick={saveAndContinue}>
          Save & Continue
        </GlassButton>
      </GlassCard>
    </GlassPage>
  );
}
