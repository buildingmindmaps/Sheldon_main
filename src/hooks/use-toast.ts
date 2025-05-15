
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

import {
  useToast as useToastOriginal,
  toast as toastOriginal,
} from "@radix-ui/react-toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export const useToast = useToastOriginal;
export const toast = toastOriginal;

export type { ToasterToast }
