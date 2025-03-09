import { useState } from "react";
import { useNotification } from "../../hooks";
import { updateActor } from "../../api/actor";
import ModalContainer from "./ModalContainer";
import ActorForm from "../form/ActorForm";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

function UpdateActor({ visible, onClose, initialState, onSuccess, setOpen }) {
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, actor } = await updateActor(initialState.id, data);
    setBusy(false);
    if (error) {
      return toast.error(t("Failed to update actor"));
    }

    setOpen(false);

    onSuccess(actor);
    toast.success(t("Actor updated successfully"));
  };

  return (
    <>
      {/* <ModalContainer visible={visible} onClose={onClose} ignoreContainer> */}
      <ActorForm
        onSubmit={!busy ? handleSubmit : null}
        busy={busy}
        initialState={initialState}
        isUpdate={true}
      />
      {/* </ModalContainer> */}
    </>
  );
}

export default UpdateActor;
