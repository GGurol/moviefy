import { useState } from "react";
import { toast } from "sonner";
import { updateReview } from "../../api/review";
import RatingForm from "../form/RatingForm";
import { Dialog } from "../ui/dialog";
import { useTranslation } from "react-i18next";

export default function EditRatingModal({
  visible,
  onClose,
  onSuccess,
  initialState,
}) {
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, message } = await updateReview(initialState.id, data);
    setBusy(false);

    if (error) return toast.error(t(error));

    onSuccess({ ...data });
    toast.success(t(message));
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
