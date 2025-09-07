import Activities from "../sections/activities/activities"
import Descriptions from "../sections/activities/descriptions"
import MapaSection from "../sections/activities/map"

const activities = () => {
  return (
    <>
    <Descriptions />
    <Activities />
    <div className="h-12"></div>
    <MapaSection />
    <div className="h-12"></div>
    </>
  )
}

export default activities