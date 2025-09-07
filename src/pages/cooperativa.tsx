import AboutMe from "../sections/cooperativa/aboutme"
import Cooperativeservices from "../sections/cooperativa/cooperativeservices"
import Gallery from "../sections/cooperativa/gallery"
import Mision from "../sections/cooperativa/mision"

const cooperativa = () => {
  return (
    <>
    <AboutMe />
    <Mision />
    <Cooperativeservices />
    <div className="h-12"></div>
    <Gallery />
    </>
  )
}
export default cooperativa