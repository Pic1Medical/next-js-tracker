import { toast } from "sonner";

export function handleError(error: unknown) {
  if (error instanceof Error) {
    toast.error(error.message, { description: error.stack });
  } else {
    toast.error(String(error));
  }
}

export default toast;
