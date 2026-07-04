import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  FileText,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

export function AppSidebar() {

  const notes = [
    { id: 1, name: "Getting Started.md" },
    { id: 2, name: "Machine Learning Notes.md" },
    { id: 3, name: "Portfolio Ideas.md" },
  ];

  const tables = [
    {
      id: 1,
      name: "DSA",
      notes: [
        "Arrays.md",
        "Linked List.md",
        "Trees.md",
        "Graphs.md",
      ],
    },
    {
      id: 2,
      name: "Research",
      notes: [
        "Paper Notes.md",
        "Ideas.md",
      ],
    },
  ];

  return (
    <Sidebar className={'bg-[#FCF9F4]'}>
      <SidebarHeader className={'mt-3 px-3 text-start flex flex-col gap-1'}>
        <h1 className="text-3xl font-semibold tracking-tight leading-6 h-fit">
          AutoDocs
        </h1>
        <p className="text-sm text-neutral-500 h-fit">
          Your Second Brain
        </p>
      </SidebarHeader>
      <SidebarContent className={'bg-[#FCF9F4] h-full'}>

        <SidebarGroup>

          <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Tables
          </h3>

          <Accordion type="multiple" className="space-y-2">
            {tables.map((table) => (
              <AccordionItem
                key={table.id}
                value={String(table.id)}
                className="
                  rounded-lg
                  border
                  border-neutral-200
                  bg-white/40
                  px-2
                "
              >
                <div className="items-center w-full justify-between">
                  <AccordionTrigger hideChavron={true} className="hover:no-underline py-3 cursor-pointer">
                    <div className="flex items-center w-full gap-2">
                      <FolderOpen className="h-4 w-4 text-[#CE9C4D]" />
                      <span className="font-medium">
                        {table.name}
                      </span>
                    </div>
                    <Menu />
                  </AccordionTrigger>
                </div>

                <AccordionContent>
                  <div className="space-y-1 pb-2">
                    {table.notes.map((note) => (
                      <div
                        key={note}
                        className="
                          group
                          flex
                          items-center
                          justify-between
                          rounded-md
                          px-2
                          py-2
                        hover:bg-[#CE9C4D]/20
                          transition
                          cursor-pointer
                        "
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#CE9C4D]" />
                          <span className="text-sm">
                            {note}
                          </span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition">
                          <Menu />
                        </div>
                      </div>
                    ))}

                  </div>

                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </SidebarGroup>

        {/* Individual Notes */}

        <SidebarGroup className="mt-4">

          <h3 className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Notes
          </h3>

          <SidebarMenu>

            <div className="space-y-1 pb-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="
                          group
                          flex
                          items-center
                          justify-between
                          rounded-md
                          px-2
                          py-2
                          hover:bg-[#CE9C4D]/20
                          transition
                          cursor-pointer
                        "
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#CE9C4D]" />
                    <span className="text-sm line-clamp-1 text-start">
                      {note.name}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition">
                    <Menu />
                  </div>
                </div>
              ))}

            </div>

          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>
    </Sidebar>
  )
}

function Menu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-md p-1 hover:bg-[#F2E6D3] transition">
          <MoreHorizontal className="h-4 w-4 text-neutral-600" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-500 focus:text-red-500">
          <Trash2 className="mr-2 h-4 w-4 stroke-red-500" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}