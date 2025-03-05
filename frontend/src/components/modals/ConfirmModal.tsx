import { FaSpinner } from "react-icons/fa";
import ModalContainer from "./ModalContainer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

function ConfirmModal({ busy, visible, onConfirm, onCancel, title, subtitle }) {
  const commonClass = "px-3 py-1 text-white rounded";

  return (
    <AlertDialog open={visible}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{subtitle}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={busy}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={busy}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // return (
  //   <ModalContainer visible={visible} ignoreContainer>
  //     <div className=" rounded p-3">
  //       <h1 className="text-red-400 font-semibold text-lg">{title}</h1>
  //       <p className="text-secondary dark:text-white text-sm">{subtitle}</p>
  //       <div className="flex items-center space-x-3 mt-3">
  //         {busy ? (
  //           <p className="flex items-center space-x-2 text-primary dark:text-white">
  //             <FaSpinner className="animate-spin" />
  //             <span>Please wait</span>
  //           </p>
  //         ) : (
  //           <>
  //             <button
  //               onClick={onConfirm}
  //               type="button"
  //               className={commonClass + " bg-red-400"}
  //             >
  //               Confirm
  //             </button>
  //             <button
  //               onClick={onCancel}
  //               type="button"
  //               className={commonClass + " bg-blue-400"}
  //             >
  //               Cancel
  //             </button>
  //           </>
  //         )}
  //       </div>
  //     </div>
  //   </ModalContainer>
  // );
}

export default ConfirmModal;
