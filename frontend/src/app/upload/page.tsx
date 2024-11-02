// import GlucoseChart from "@/components/gc";
import ZipDropZone from "@/components/zip-dropzone";
export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="mt-60 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold pb-8 text-center">
          Start by uploading the pump zip file
        </h1>
        <ZipDropZone />
      </div>
    </div>
  );
}
