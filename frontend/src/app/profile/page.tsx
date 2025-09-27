import Profile from './profile'; // Import the component from the sibling file

export default function ProfilePage() {
  return (
    <section className="w-full max-w-md mx-auto flex flex-col items-center justify-start pt-8 px-4">
      <Profile />
    </section>
  );
}
