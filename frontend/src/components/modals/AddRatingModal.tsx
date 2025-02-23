import { useParams } from 'react-router-dom';
import RatingForm from '../form/RatingForm';
import ModalContainer from './ModalContainer';
import { addReview } from '../../api/review';
import { useNotification } from '../../hooks';

function AddRatingModal({ visible, onClose, onSuccess }) {
  const { updateNotification } = useNotification();
  const { movieId } = useParams();

  const handleSubmit = async (data) => {
    const { error, message, reviews } = await addReview(movieId, data);
    if (error) return updateNotification('error', error);
    updateNotification('success', message);
    onSuccess(reviews);
    onClose();
  };

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm onSubmit={handleSubmit} />
    </ModalContainer>
  );
}

export default AddRatingModal;
