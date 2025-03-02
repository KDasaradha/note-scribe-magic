
import { useAuth } from "@/hooks/use-auth";
import { useNotes } from "@/hooks/use-notes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Plus,
  FileText,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function AppSidebar() {
  const { isAuthenticated } = useAuth();
  const { notes, searchNotes } = useNotes();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const filteredNotes = searchQuery.trim() ? searchNotes(searchQuery) : notes;

  if (!isAuthenticated) return null;

  return (
    <Sidebar className="border-r w-[280px]">
      <SidebarHeader className="border-b h-16 flex items-center px-4">
        <div className="flex items-center justify-between w-full gap-1">
          {isSearching ? (
            <div className="flex gap-1 items-center w-full">
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 flex-shrink-0"
                onClick={() => {
                  setIsSearching(false);
                  setSearchQuery("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="font-medium text-lg">My Notes</div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsSearching(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => navigate("/editor/new")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        {filteredNotes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-muted-foreground text-sm mb-2">
              {searchQuery ? "No notes found" : "No notes yet"}
            </p>
            {!searchQuery && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate("/editor/new")}
              >
                <Plus className="mr-1 h-4 w-4" />
                Create your first note
              </Button>
            )}
          </div>
        )}
        
        <div className="space-y-1">
          {filteredNotes.map((note) => (
            <Button
              key={note.id}
              variant="ghost"
              className="w-full justify-start text-left h-auto py-3 px-3"
              onClick={() => navigate(`/editor/${note.id}`)}
            >
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <div className="truncate">
                  <div className="font-medium truncate">{note.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
