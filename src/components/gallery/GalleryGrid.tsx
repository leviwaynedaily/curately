import { Storefront } from "@/types/storefront";

export const GalleryGrid = ({ galleries }: { galleries: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {galleries.map((gallery) => {
        const processedGallery = {
          ...gallery,
          header_display: gallery.header_display as "text" | "logo", // Type assertion to ensure correct type
        } as Storefront;

        return (
          <div key={processedGallery.id} className="border p-4 rounded">
            <h2 className="text-lg font-bold">{processedGallery.name}</h2>
            {processedGallery.header_display === "logo" && processedGallery.logo && (
              <img src={processedGallery.logo} alt={`${processedGallery.name} logo`} className="w-full h-auto" />
            )}
            <p>{processedGallery.description}</p>
          </div>
        );
      })}
    </div>
  );
};
