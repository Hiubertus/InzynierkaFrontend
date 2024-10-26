import React, {useCallback, useState} from 'react';
import {useDropzone, Accept} from 'react-dropzone';
import {UploadCloud, X, FileImage, File as FileIcon, AudioWaveform, Video, FolderArchive} from 'lucide-react';
import {DeleteButton} from "@/components/CourseCreator/DeleteButton";

interface FileUploadProps {
    onFileUploaded: (file: File) => void;
    accept?: Accept;
    maxSize?: number;
    removeContent?: () => void;
}

const FileTypes = {
    Image: 'image',
    Pdf: 'application/pdf',
    Audio: 'audio',
    Video: 'video',
    Other: 'other',
} as const;

type FileType = typeof FileTypes[keyof typeof FileTypes];

const FileTypeColors: Record<FileType, { bgColor: string; fillColor: string }> = {
    [FileTypes.Image]: {bgColor: 'bg-purple-600', fillColor: 'fill-purple-600'},
    [FileTypes.Pdf]: {bgColor: 'bg-blue-400', fillColor: 'fill-blue-400'},
    [FileTypes.Audio]: {bgColor: 'bg-yellow-400', fillColor: 'fill-yellow-400'},
    [FileTypes.Video]: {bgColor: 'bg-green-400', fillColor: 'fill-green-400'},
    [FileTypes.Other]: {bgColor: 'bg-gray-400', fillColor: 'fill-gray-400'},
};

export const FileUpload: React.FC<FileUploadProps> = ({
                                                          onFileUploaded,
                                                          accept = {
                                                              'image/*': [],
                                                              'application/pdf': [],
                                                              'audio/*': [],
                                                              'video/*': []
                                                          },
                                                          maxSize = 10 * 1024 * 1024,
                                                          removeContent
                                                      }) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const uploadedFile = acceptedFiles[0];
            setFile(uploadedFile);
            onFileUploaded(uploadedFile);
        }
    }, [onFileUploaded]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple: false
    });

    const removeFile = useCallback(() => {
        setFile(null);
    }, []);

    const getFileIconAndColor = (file: File) => {
        let fileType: FileType = FileTypes.Other;
        if (file.type.startsWith('image/')) fileType = FileTypes.Image;
        else if (file.type === 'application/pdf') fileType = FileTypes.Pdf;
        else if (file.type.startsWith('audio/')) fileType = FileTypes.Audio;
        else if (file.type.startsWith('video/')) fileType = FileTypes.Video;

        const {bgColor, fillColor} = FileTypeColors[fileType];

        const icons: Record<FileType, JSX.Element> = {
            [FileTypes.Image]: <FileImage size={40} className={fillColor}/>,
            [FileTypes.Pdf]: <FileIcon size={40} className={fillColor}/>,
            [FileTypes.Audio]: <AudioWaveform size={40} className={fillColor}/>,
            [FileTypes.Video]: <Video size={40} className={fillColor}/>,
            [FileTypes.Other]: <FolderArchive size={40} className={fillColor}/>,
        };

        return {icon: icons[fileType], color: bgColor};
    };

    return (
        <div className={"w-full"}>
            <div className={"flex"}>
                <div
                    {...getRootProps()}
                    className={`relative flex flex-col items-center justify-center w-full py-6 px-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="text-center">
                        <div className="border p-2 rounded-md max-w-min mx-auto">
                            <UploadCloud size={20}/>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                            File should be under {maxSize / 1024 / 1024} MB
                        </p>
                    </div>

                </div>
                {removeContent && (<DeleteButton
                    onClick={() =>
                        removeContent()
                    }
                />)}

            </div>


            {file && (
                <div className="mt-4 w-full">
                    <div className="flex flex-col rounded-lg overflow-hidden border border-slate-300">
                        <div className="flex justify-between gap-2">
                            <div className="flex items-center flex-1 p-2">
                                <div className="text-white">
                                    {getFileIconAndColor(file).icon}
                                </div>
                                <div className="ml-2 truncate">
                                    <p className="text-sm text-gray-700 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="bg-red-500 text-white transition-all items-center justify-center px-2 flex"
                            >
                                <X size={20}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

