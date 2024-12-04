import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
}

export const PaginationControls = ({
                                       currentPage,
                                       totalPages,
                                       onPageChange,
                                       siblingCount = 1,
                                   }: PaginationProps) => {
    const generatePaginationItems = () => {
        const items = [];

        const addPageNumber = (pageNum: number) => {
            items.push(
                <PaginationItem key={pageNum}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                    >
                        {pageNum}
                    </PaginationLink>
                </PaginationItem>
            );
        };

        items.push(
            <PaginationItem key="prev">
                <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) onPageChange(currentPage - 1);
                    }}
                />
            </PaginationItem>
        );

        addPageNumber(1);

        if (currentPage - siblingCount > 2) {
            items.push(
                <PaginationItem key="leftEllipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        for (
            let i = Math.max(2, currentPage - siblingCount);
            i <= Math.min(totalPages - 1, currentPage + siblingCount);
            i++
        ) {
            addPageNumber(i);
        }

        if (currentPage + siblingCount < totalPages - 1) {
            items.push(
                <PaginationItem key="rightEllipsis">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        if (totalPages > 1) {
            addPageNumber(totalPages);
        }

        items.push(
            <PaginationItem key="next">
                <PaginationNext
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) onPageChange(currentPage + 1);
                    }}
                />
            </PaginationItem>
        );

        return items;
    };

    if (totalPages <= 1) return null;

    return (
        <Pagination>
            <PaginationContent>
                {generatePaginationItems()}
            </PaginationContent>
        </Pagination>
    );
};

export default PaginationControls;