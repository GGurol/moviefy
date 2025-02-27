import { useState } from "react";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";

function ActorUpload({ visible, onClose, setOpen }) {
  const [busy, setBusy] = useState(false);
  const { updateNotification } = useNotification();
  const [disable, setDisable] = useState(false);

  const handleSubmit = async (data) => {
    setBusy(true);
    setDisable(true);
    const { error, actor } = await createActor(data);
    setBusy(false);
    setDisable(false);
    if (error) {
      return updateNotification("error", error);
    }
    if (!error) {
      setOpen(false);
    }

    updateNotification("success", "Actor created successfully!");
  };

  return (
    // <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
    <ActorForm
      onSubmit={!busy ? handleSubmit : null}
      title="Create New Actor"
      btnTitle="Create"
      busy={busy}
      disable={disable}
    />
    // </ModalContainer>
  );
}

export default ActorUpload;
