import { GalleryGrid } from "@/components/gallery/GalleryGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-primary text-secondary p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 animate-fade-down">Galleries</h1>
        <GalleryGrid />
      </div>
    </div>
  );
};

export default Index;