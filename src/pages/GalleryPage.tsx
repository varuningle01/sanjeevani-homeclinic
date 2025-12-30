import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import GalleryCard from "../components/GalleryCard";
import { useTenant } from "../context/TenantContext";
import labels from "../locales/en-us.json";

const GalleryPage = () => {
  const { config } = useTenant();

  const galleryItems = config?.assets?.gallery?.length
    ? config.assets.gallery.map((item, index) => ({
        id: `G-${index}`,
        title: item.caption || labels.gallery.title,
        beforeImage: item.before || "https://placehold.co/400x300?text=Before",
        afterImage: item.after || "https://placehold.co/400x300?text=After",
      }))
    : [
        {
          id: "G001",
          title: "Title 1",
          beforeImage: "https://placehold.co/400x300?text=Before",
          afterImage: "https://placehold.co/400x300?text=After",
        },
        {
          id: "G002",
          title: "Title 2",
          beforeImage: "https://placehold.co/400x300?text=Before",
          afterImage: "https://placehold.co/400x300?text=After",
        },
        {
          id: "G003",
          title: "Title 3",
          beforeImage: "https://placehold.co/400x300?text=Before",
          afterImage: "https://placehold.co/400x300?text=After",
        },
      ];

  return (
    <div className="bg-[#F4FAFB] min-h-screen">
      <Navbar />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-primary">
            {labels.gallery.title}
          </h1>

          <p className="text-gray-600 text-center mt-2 mb-12 text-lg">
            {labels.gallery.subtitle}
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
