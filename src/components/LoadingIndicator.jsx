import { LoaderCircle } from "lucide-react";

function Loader({ className, ...props }) {
  return <LoaderCircle {...props} className={`animate-spin ${className}`} />;
}

function LoadingIndicator() {
  return (
    <section className="absolute inset-0 bg-stone-950/70 flex items-center justify-center">
      <Loader className="text-yellow-400" size={64} />
    </section>
  );
}

export default LoadingIndicator;
