import React, { useId } from 'react';
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils";

interface DraggableItemProps {
    id: string | number;
    children: React.ReactNode;
    className?: string;
}

const DraggableItem = ({ id, children, className }: DraggableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: isDragging ? 'relative' : 'static',
        opacity: isDragging ? 0.5 : 1,
    } as React.CSSProperties;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "touch-manipulation",
                isDragging && "shadow-lg",
                className
            )}
            {...attributes}
            {...listeners}
        >
            {children}
        </div>
    );
};

interface DraggableListProps<T> {
    items: T[];
    onReorder: (newOrder: T[]) => void;
    getId: (item: T) => string | number;
    renderItem: (item: T, index: number) => React.ReactNode;
    className?: string;
    itemClassName?: string;
    activationDelay?: number;
}

export function DraggableList<T>({
                                     items,
                                     onReorder,
                                     getId,
                                     renderItem,
                                     className,
                                     itemClassName,
                                     activationDelay = 250, // 250ms domyślne opóźnienie
                                 }: DraggableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: activationDelay,
                tolerance: 5, // Dodajemy małą tolerancję na ruch podczas przytrzymania
            },
        }),
    );

    const contextId = useId();

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => getId(item) === active.id);
            const newIndex = items.findIndex((item) => getId(item) === over.id);

            const newItems = [...items];
            const [movedItem] = newItems.splice(oldIndex, 1);
            newItems.splice(newIndex, 0, movedItem);

            onReorder(newItems);
        }
    };

    return (
        <DndContext
            id={contextId}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map(getId)}
                strategy={verticalListSortingStrategy}
            >
                <div className={className}>
                    {items.map((item, index) => (
                        <DraggableItem
                            key={getId(item)}
                            id={getId(item)}
                            className={cn(
                                "transition-shadow duration-200",
                                itemClassName
                            )}
                        >
                            {renderItem(item, index)}
                        </DraggableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

export default DraggableList;