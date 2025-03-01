import RatingForm from "../form/RatingForm";
import ModalContainer from "./ModalContainer";
import { updateReview } from "../../api/review";
import { useNotification } from "../../hooks";
import { useState } from "react";
import { toast } from "sonner";

function EditRatingModal({ visible, onClose, onSuccess, initialState }) {
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, message } = await updateReview(initialState.id, data);
    setBusy(false);

    if (error) return toast.error(error);

    onSuccess({ ...data });
    toast.success(message);
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm
        busy={busy}
        initialState={initialState}
        onSubmit={handleSubmit}
      />
    </ModalContainer>
  );
}

export default EditRatingModal;
