import Container from "./Container";
import HeroSlidShow from "./user/HeroSlidShow";
import NotVerified from "./user/NotVerified";
import TopRatedDrama from "./user/TopRatedDrama";
import TopRatedThriller from "./user/TopRatedThriller";
import TopRatedAction from "./user/TopRatedAction";

function Home() {
  return (
    <div className="min-h-screen">
      <NotVerified />
      <Container className="px-2 xl:p-0">
        {/* slider */}
        <HeroSlidShow />
        {/* Most rated movies */}
        <div className="space-y-3 py-8">
          <TopRatedDrama />
          <TopRatedThriller />
          <TopRatedAction />
        </div>
      </Container>
    </div>
  );
}

export default Home;
