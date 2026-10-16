import FacilityHeroBanner from "../../components/facility/FacilityHeroBanner";
import FacilityStatCards from "../../components/facility/FacilityStatCards";
import FacilityInfoCards from "../../components/facility/FacilityInfoCards";
import FacilityBottomCards from "../../components/facility/FacilityBottomCards";

export default function FacilityProfile() {
    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <FacilityHeroBanner />
            <FacilityStatCards />
            <FacilityInfoCards />
            <FacilityBottomCards />
        </div>
    );
}