import Hero from "../sections/homepage/hero"
import Manzanillo from "../sections/homepage/manzanillo"
import Menu from "../sections/homepage/menu"
import Mudecoop from "../sections/homepage/mudecoop"
import Reservas from "../sections/homepage/reservas"



const homepage = () => {
  return (
    <main className="bg-app text-app">
    <Hero />
    <div className="h-12 bg-app" />
    <Menu />
    <div className="h-12 bg-app" />
    <Reservas />
    <div className="h-12 bg-app" />
    <Mudecoop />
    <Manzanillo />
  </main>
  )
}

export default homepage