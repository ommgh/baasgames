import Footer from "@/components/home/footer";
import Navbar from "@/components/home/navbar";

const Homelayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Homelayout;
