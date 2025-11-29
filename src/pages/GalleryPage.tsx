import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import GalleryCard from "../components/GalleryCard";

const galleryItems = [
  {
    id: "G001",
    title: "Vitiligo",
    beforeImage: "./face-chin-before.jpg",
    afterImage: "./face-chin-after.jpg",
  },
  {
    id: "G002",
    title: "Vitiligo",
    beforeImage: "./face-eyelid-before.jpg",
    afterImage: "./face-eyelid-after.jpg",
  },
];

const GalleryPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#F4FAFB] min-h-screen">
      <Navbar />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-[#0B7A75]">
            {t("gallery.title")}
          </h1>

          <p className="text-gray-600 text-center mt-2 mb-12 text-lg">
            {t("gallery.subtitle")}
          </p>

          {/* GALLERY GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {galleryItems.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GalleryPage;
