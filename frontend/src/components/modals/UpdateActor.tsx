import { useState } from "react";
import { updateActor } from "../../api/actor";
import ActorForm from "../form/ActorForm";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// CORRECTED: The component now only accepts the props it actually receives.
export default function UpdateActor({ initialState, onSuccess }) {
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, actor, message } = await updateActor(initialState.id, data);
    setBusy(false);
    
    if (error) {
      return toast.error(t(error));
    }

    toast.success(t(message));
    // Call the function passed from the parent.
    // This will close the modal and refresh the list.
    onSuccess(actor);
  };

  return (
    <ActorForm
      onSubmit={!busy ? handleSubmit : null}
      busy={busy}
      initialState={initialState}
      isUpdate={true}
    />
  );
}