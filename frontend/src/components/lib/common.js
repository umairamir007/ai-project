
import toast from 'react-hot-toast';



const notifySuccessToastId = { current: null };
const errorToastId = { current: null };

// Function to notify success, avoiding duplicate toasts
export const NotifySuccess = (msg) => {
    // Check if there's an active success toast
    if (notifySuccessToastId.current) {
        toast.dismiss(notifySuccessToastId.current); // Dismiss the current toast
    }

    // Show a new success toast and store its ID
    notifySuccessToastId.current = toast.success(msg, {
        duration: 5000
    });
};

// Function to notify error, avoiding duplicate toasts
export const NotifyError = (msg ,durationInMs) => {
    try {
        // Check if there's an active error toast
        if (errorToastId.current) {
            toast.dismiss(errorToastId.current); // Dismiss the current toast
        }

        // Show a new error toast and store its ID
        errorToastId.current = toast.error(msg, {
            duration: durationInMs || 5000
        });
    } catch (error) {
        console.log('🚀 ~ NotifyError ~ error:', error);
    }
};