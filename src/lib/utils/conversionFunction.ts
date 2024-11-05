export const convertPictureToFile = (pictureBase64: string | null, pictureType: string | null): File | null => {
    if (!pictureBase64 || !pictureType) {
        return null;
    }
    try {
        const byteCharacters = atob(pictureBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: pictureType });
        return new File([blob], 'profile-picture', { type: pictureType });
    } catch (error) {
        console.error('Error converting picture to File:', error);
        return null;
    }
};