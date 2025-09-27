import Listings from './listing'; // Import the new component

export default function ListingsPage() {
  return (
    <section className="w-full max-w-md mx-auto flex flex-col items-center justify-start pt-8 px-4">
      <Listings />
    </section>
  );
}
