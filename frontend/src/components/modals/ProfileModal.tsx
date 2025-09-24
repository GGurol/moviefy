import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getActorProfile } from "../../api/actor";
import { Dialog, DialogContent } from "../ui/dialog";
import { useTranslation } from "react-i18next";

const BACKEND_URL = "http://localhost:8000"; // Backend adresini tanımlıyoruz

function ProfileModal({ visible, profileId, onClose }) {
  const [profile, setProfile] = useState<any>({}); // Tip için 'any' kullanıldı, daha iyi bir tip tanımı yapılabilir
  const { t } = useTranslation();

  const fetchActorProfile = async () => {
    const { error, actor } = await getActorProfile(profileId);
    if (error) return toast.error(t(error));

    setProfile(actor);
  };

  useEffect(() => {
    if (profileId) fetchActorProfile();
  }, [profileId]);

  // Hatalı getName fonksiyonunu kaldırdık.

  const { avatar, name, about, gender } = profile;

  // Avatar için tam URL oluşturuyoruz
  const avatarUrl = avatar ? `${BACKEND_URL}${avatar}` : "";

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="flex gap-2 [&>button]:hidden max-w-[600px]">
        <div className="w-36 h-54 aspect-[2/3]] flex-shrink-0 flex items-center justify-center">
          <img className="w-full h-full object-cover" src={avatarUrl} alt={name} />
        </div>
        <div className="overflow-auto">
          <div className="mb-1">

            <p className="capitalize font-semibold text-lg">{name}</p>
            <p className="capitalize text-muted-foreground text-xs">
              {t(gender)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{about}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileModal;