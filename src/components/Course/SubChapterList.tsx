import { SubChapterData } from "@/models/front_models/CourseData"
import { FC, useMemo } from "react"

interface SubChapterListProps {
    subchapters: SubChapterData[]
    handleSubchapterSelect?: (subchapter: SubChapterData) => void
}

export const SubChapterList: FC<SubChapterListProps> = ({
                                                            subchapters,
                                                            handleSubchapterSelect,
                                                        }) => {
    const sortedSubchapters = useMemo(
        () => [...subchapters].sort((a, b) => a.order - b.order),
        [subchapters]
    )

    return (
        <div className="pl-4 space-y-2">
            {sortedSubchapters.map((subchapter) => (
                <div
                    key={subchapter.id}
                    className={`flex items-center space-x-2 p-1 rounded ${handleSubchapterSelect ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    onClick={handleSubchapterSelect ? () => handleSubchapterSelect(subchapter) : undefined}
                >
                    <div className="flex-1 flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{`${subchapter.order}.`}</span>
                        <span>{subchapter.name}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}