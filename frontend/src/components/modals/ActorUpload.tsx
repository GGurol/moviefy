import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../api/actor";
import ActorForm from "../form/ActorForm";
import { useTranslation } from "react-i18next";

// CORRECTED: The component now accepts an 'onSuccess' callback function
export default function ActorUpload({ onSuccess }) {
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation("translation");

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, actor } = await createActor(data);
    setBusy(false);

    if (error) {
      return toast.error(t(error));
    }

    toast.success(t("Actor created successfully"));
    // Call the function passed from the parent to close the modal and refresh the list
    onSuccess();
  };

  return <ActorForm onSubmit={!busy ? handleSubmit : null} busy={busy} />;
}