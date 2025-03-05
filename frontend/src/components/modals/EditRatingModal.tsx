import { useState } from "react";
import { toast } from "sonner";
import { updateReview } from "../../api/review";
import RatingForm from "../form/RatingForm";
import { Dialog } from "../ui/dialog";

export default function EditRatingModal({
  visible,
  onClose,
  onSuccess,
  initialState,
}) {
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
    <Dialog open={visible} onOpenChange={onClose}>
      <RatingForm
        busy={busy}
        initialState={initialState}
        onSubmit={handleSubmit}
      />
    </Dialog>
  );
}
