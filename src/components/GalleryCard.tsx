import labels from "../locales/en-us.json";

interface GalleryItem {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
}

const GalleryCard = ({ item }: { item: GalleryItem }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4">
      {/* Title */}
      <h3 className="font-semibold text-gray-800 text-lg mb-4 text-center">
        {item.title}
      </h3>

      {/* TWO IMAGE GRID */}
      <div className="grid grid-cols-2 gap-3">
        {/* Before Section */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden h-56 flex items-center justify-center">
          <img
            src={item.beforeImage}
            alt="Before Treatment"
            className="w-full h-full object-cover"
          />

          <span className="absolute bottom-2 left-2 bg-gray-900 text-white text-xs px-3 py-1 rounded">
            {labels.gallery.before}
          </span>
        </div>

        {/* After Section */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden h-56 flex items-center justify-center">
          <img
            src={item.afterImage}
            alt="After Treatment"
            className="w-full h-full object-cover"
          />

          <span className="absolute bottom-2 right-2 bg-gray-900 text-white text-xs px-3 py-1 rounded">
            {labels.gallery.after}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;
