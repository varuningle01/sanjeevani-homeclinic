import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import GalleryCard from "../components/GalleryCard";

const galleryItems = [
  {
    id: "G001",
    title: "Eczema Treatment - Hands",
    beforeImage: "./face-chin-before.jpg",
    afterImage: "./face-chin-after.jpg",
  },
  {
    id: "G002",
    title: "Psoriasis Treatment - Scalp",
    beforeImage: "./face-eyelid-before.jpg",
    afterImage: "./face-eyelid-after.jpg",
  },
];

const GalleryPage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-3 text-gray-900">
            {t("gallery.title")}
          </h1>

          <p className="text-gray-600 text-center mb-12 text-lg">
            {t("gallery.subtitle")}
          </p>

          {/* Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
