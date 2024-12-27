import dynamic from "next/dynamic";

// Dynamically import Lottie with ssr: false to disable server-side rendering
const LottieAnimation = dynamic(() => import("lottie-react"), { ssr: false });

const Animation = ({ path }) => {
  return (
    <div className="">
      <LottieAnimation animationData={path} loop={true} />
    </div>
  );
};

export default Animation;
