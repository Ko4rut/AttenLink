"use client"

import { useRouter, useSearchParams } from "next/navigation"

type Props = {
  totalPages: number
}

export default function Pagination({ totalPages }: Props) {

  const router = useRouter()
  const searchParams = useSearchParams()
  const safeTotalPages = Math.max(0, totalPages)
  const currentPage =
    safeTotalPages === 0
      ? 0
      : Math.min(
        Math.max(1, Number(searchParams.get("page")) || 1),
        safeTotalPages
      )

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
    router.refresh()
  }

  // Tạo list page (có ... giống UI bạn)
  const getPages = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    }
    else {
      pages.push(1)

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)


      if (start > 2) pages.push("...")

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages - 1) pages.push("...")

      pages.push(totalPages)
    }

    return pages
  }
  return (
    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600">

      {/* Info */}
      <div>
        Page {currentPage} of {totalPages}
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2">

        {/* Prev */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          ← Previous
        </button>

        {/* Pages */}
        <nav className="hidden md:flex gap-1">
          {getPages().map((p, idx) =>
            <button
              key={idx}
              onClick={() => goToPage(p as number)}
              className={`px-4 cursor-pointer py-2 border rounded-md ${currentPage === p
                ? "bg-black text-white"
                : "border-gray-300 hover:bg-gray-50"
                }`}
            >
              {p}
            </button>
          )}
        </nav>

        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border cursor-pointer border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Next →
        </button>
      </div>
    </div>
  )
}