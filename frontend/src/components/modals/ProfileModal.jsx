import { useEffect, useState } from 'react';
import ModalContainer from './ModalContainer';
import { getActorProfile } from '../../api/actor';
import { useNotification } from '../../hooks';

function ProfileModal({ visible, profileId, onClose }) {
  const [profile, setProfile] = useState({});
  const { updateNotification } = useNotification();

  const fetchActorProfile = async () => {
    const { error, actor } = await getActorProfile(profileId);
    if (error) return updateNotification('error', error);

    setProfile(actor);
  };

  useEffect(() => {
    if (profileId) fetchActorProfile();
  }, [profileId]);

  const { avatar, name, about } = profile;

  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <div className='w-72  flex flex-col items-center p-5 rounded bg-white dark:bg-primary space-y-3'>
        <img className='w-28 h-28' src={avatar} alt='' />
        <h1 className='dark:text-white text-primary font-semibold'>{name}</h1>
        <p className='dark:text-white text-primary '>{about}</p>
      </div>
    </ModalContainer>
  );
}

export default ProfileModal;
