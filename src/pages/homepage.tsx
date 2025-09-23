import Hero from "../sections/homepage/hero"
import Manzanillo from "../sections/homepage/manzanillo"
import Menu from "../sections/homepage/menu"
import Mudecoop from "../sections/homepage/mudecoop"
import Reservas from "../sections/homepage/reservas"



const homepage = () => {
  return (
    <>
    <Hero />
    <div className="h-12"></div>
    <Menu />
    <div className="h-12"></div>
    <Reservas />
    <div className="h-12"></div>
    <Mudecoop />
    <Manzanillo />
    </>
  )
}

export default homepage