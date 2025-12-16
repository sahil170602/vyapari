import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import icon from "../assets/vyapari-splash-icon.png"

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome") // or /login
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="vyapari-splash-root">
      <img
        src={icon}
        alt="Vyapari"
        className="vyapari-splash-icon"
      />

      <h1 className="vyapari-splash-title">Vyapari</h1>
      <p className="vyapari-splash-subtitle">
        Initializing app...
      </p>
    </div>
  )
}
