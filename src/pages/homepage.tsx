import Hero from "../sections/homepage/hero"
import Menu from "../sections/homepage/menu"
import ReservasPage from "../sections/homepage/reservas"

const homepage = () => {
  return (
    <>
    <Hero />
    <div className="h-12"></div>
    <Menu />
    <div className="h-12"></div>
    <ReservasPage />
    </>
  )
}

export default homepage