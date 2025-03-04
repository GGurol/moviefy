import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getActorProfile } from "../../api/actor";
import { Dialog, DialogContent } from "../ui/dialog";

function ProfileModal({ visible, profileId, onClose }) {
  const [profile, setProfile] = useState({});

  const fetchActorProfile = async () => {
    const { error, actor } = await getActorProfile(profileId);
    if (error) return toast.error(error);

    setProfile(actor);
  };

  useEffect(() => {
    if (profileId) fetchActorProfile();
  }, [profileId]);

  const { avatar, name, about, gender } = profile;

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="flex gap-2 [&>button]:hidden max-w-[600px]">
        <div className="w-36 h-36 aspect-square flex items-center justify-center ">
          <img className="" src={avatar} alt="" />
        </div>
        <div className="overflow-auto">
          <div className="mb-1">
            <p className="capitalize ">{name}</p>
            <p className="capitalize text-muted-foreground  text-xs">
              {gender}
            </p>
          </div>
          <p className="text-xs">{about}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileModal;
