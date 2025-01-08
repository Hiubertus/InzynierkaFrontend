export const useRealIndex = <T extends { deleted?: boolean }>(array: T[]) => {
    return (visibleIndex: number): number => {
        let deletedCount = 0;
        let realIndex = visibleIndex;

        for (let i = 0; i < array.length; i++) {
            if (array[i].deleted) {
                deletedCount++;
            }
            if (deletedCount + visibleIndex === i) {
                realIndex = i;
                break;
            }
        }

        return realIndex;
    };
};