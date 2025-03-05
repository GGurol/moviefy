import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../api/actor";
import ActorForm from "../form/ActorForm";
import { useTranslation } from "react-i18next";

function ActorUpload({ visible, onClose, setOpen }) {
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation("translation");

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, actor } = await createActor(data);
    setBusy(false);
    if (error) {
      return toast.error(error);
    }
    setOpen(false);

    toast.success(t("Actor created successfully"));
  };

  return <ActorForm onSubmit={!busy ? handleSubmit : null} busy={busy} />;
}

export default ActorUpload;
