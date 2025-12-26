import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import GalleryCard from "../components/GalleryCard";
import { useTenant } from "../context/TenantContext";



const GalleryPage = () => {
  const { t } = useTranslation();
  const { config } = useTenant();

  const galleryItems = config?.assets?.gallery?.length 
    ? config.assets.gallery.map((item, index) => ({
        id: `G-${index}`,
        title: item.caption || t("gallery.title"),
        beforeImage: item.url, // Note: For real dynamic, we might need before/after pairs in DB
        afterImage: item.url,
      }))
    : [
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

  return (
    <div className="bg-[#F4FAFB] min-h-screen">
      <Navbar />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
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
