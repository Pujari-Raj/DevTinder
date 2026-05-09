import { FaCircleExclamation } from "react-icons/fa6";
import { Tooltip } from "react-tooltip";

interface TooltipMessageProps {
  success?: boolean;
  message: string;
}

const TooltipMessage = ({ success, message }: TooltipMessageProps) => {
  return (
    <div className="absolute top-4/6 -translate-y-1/2 right-4 z-50">
      <div
        data-tooltip-id="my-tooltip"
        data-tooltip-content={message}
        className={`${success ? "text-green-500" : "text-red-500"}`}
      >
        <FaCircleExclamation />
      </div>
      <Tooltip
        id="my-tooltip"
        className="z-10 absolute max-w-xs break-words bg-gray-800 text-white text-base p-2 rounded"
      />
    </div>
  );
};

export default TooltipMessage;
