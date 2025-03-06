import { useParams } from "react-router-dom";
import RatingForm from "../form/RatingForm";
import ModalContainer from "./ModalContainer";
import { addReview } from "../../api/review";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useTranslation } from "react-i18next";

export default function AddRatingModal({ visible, onClose, onSuccess }) {
  const { movieId } = useParams();
  const { t } = useTranslation();

  const handleSubmit = async (data) => {
    const { error, message, reviews } = await addReview(movieId, data);
    if (error) return toast.error(t(error));
    toast.success(t(message));
    onSuccess(reviews);
    onClose();
  };

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      {/* <DialogContent className="w-[30%]"> */}
      <RatingForm onSubmit={handleSubmit} />
      {/* </DialogContent> */}
    </Dialog>
  );

  // return (
  //   <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
  //     <RatingForm onSubmit={handleSubmit} />
  //   </ModalContainer>
  // );
}
