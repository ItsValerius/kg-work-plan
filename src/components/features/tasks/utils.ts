// Constants
export const ALMOST_FULL_THRESHOLD = 80;
const HIGH_PROGRESS_THRESHOLD = 67;
const MEDIUM_PROGRESS_THRESHOLD = 34;

// Helper function to get progress bar color based on percentage
export function getProgressBarColor(progressPercentage: number, isFull: boolean): string {
    if (isFull || progressPercentage >= HIGH_PROGRESS_THRESHOLD) {
        return "[&>div]:bg-green-600";
    }
    if (progressPercentage >= MEDIUM_PROGRESS_THRESHOLD) {
        return "[&>div]:bg-orange-500";
    }
    return "[&>div]:bg-red-500";
}
