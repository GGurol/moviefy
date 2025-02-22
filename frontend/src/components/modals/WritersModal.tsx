import { AiOutlineClose } from "react-icons/ai";
import ModalContainer from "./ModalContainer";

function WritersModal({ profiles = [], visible, onClose, onRemoveClick }) {
  return (
    <ModalContainer ignoreContainer onClose={onClose} visible={visible}>
      <div className="space-y-2   rounded max-w-[45rem] max-h-[40rem] overflow-auto p-2 custom-scroll-bar">
        {profiles.map(({ id, name, avatar }) => {
          return (
            <div key={id} className="flex space-x-3  drop-shadow-md rounded">
              <img
                className="w-16 h-16 aspect-square rounded object-cover"
                src={avatar}
                alt={name}
              />
              <p className="w-full font-semibold ">{name}</p>
              <button
                onClick={() => onRemoveClick(id)}
                className=" hover:opacity-80 transition p-2"
              >
                <AiOutlineClose />
              </button>
            </div>
          );
        })}
      </div>
    </ModalContainer>
  );
}

export default WritersModal;
