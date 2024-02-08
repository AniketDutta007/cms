import { ModeToggle } from "./mode-toggle";
import { ProfileAvatar } from "./profile-avatar";

export function Navbar() {
  return (
    <div className="w-full px-5 py-3 flex justify-between items-center gap-3">
      {/* navbar */}
      <div className="flex items-center gap-3"></div>
      <div className="flex gap-3">
        <ModeToggle />
        <div className="block lg:hidden">
          <ProfileAvatar />
        </div>
      </div>
    </div>
  );
}
