import {useState} from 'react';
import {Dialog} from '@/components/ui/dialog';
import {DialogContent} from '@/components/ui/dialog';
import {Play} from "lucide-react"

type Props = {
    file: File | null,
    mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'video/mp4' | 'video/webm',
    type: 'image' | 'video',
}

export const MediaContent = ({content}: {content : Props}) => {
    const [isOpen, setIsOpen] = useState(false);
    const isImage = content.type === 'image';

    return (
        <div>
            {content.file ? (
                <div>
                    <div
                        className="w-full h-[300px] rounded-lg shadow-lg cursor-pointer overflow-hidden relative group"
                        onClick={() => setIsOpen(true)}
                    >
                        {isImage ? (
                            <div
                                className="w-full h-full bg-cover bg-center hover:opacity-90 transition-opacity"
                                style={{backgroundImage: `url(${URL.createObjectURL(content.file)})`}}
                            />
                        ) : (
                            <div className="w-full h-full bg-black flex items-center justify-center">
                                <video
                                    className="max-h-full max-w-full object-contain"
                                    src={URL.createObjectURL(content.file)}
                                    controls={false}
                                    muted
                                    style={{pointerEvents: 'none'}}
                                >
                                    <source src={URL.createObjectURL(content.file)} type={content.mediaType}/>
                                    Your browser does not support the video tag.
                                </video>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center group-hover:bg-opacity-70 transition-all">
                                        <Play className="w-8 h-8 text-white ml-1" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogContent className="max-w-screen-xl w-full p-0 bg-transparent border-0">
                            <div className="relative w-full h-full flex items-center justify-center">
                                {isImage ? (
                                    <img
                                        src={URL.createObjectURL(content.file)}
                                        alt="Content"
                                        className="max-w-full max-h-[90vh] object-contain"
                                    />
                                ) : (
                                    <video
                                        className="max-w-full max-h-[90vh]"
                                        controls
                                        autoPlay
                                    >
                                        <source src={URL.createObjectURL(content.file)} type={content.mediaType}/>
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
                                >
                                    ✕
                                </button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default MediaContent;