
import { useAuth } from "@/hooks/use-auth";
import { useNotes } from "@/hooks/use-notes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Search, 
  Plus,
  FileText,
  Book,
  ChevronRight,
  X,
  Folder,
  FolderOpen,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Note } from "@/types";

export function AppSidebar() {
  const { isAuthenticated } = useAuth();
  const { notes, searchNotes, getNoteHierarchy, getRootNotes } = useNotes();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const filteredNotes = searchQuery.trim() ? searchNotes(searchQuery) : [];
  const rootNotes = getRootNotes();
  const notebooks = rootNotes.filter(note => note.isNotebook);
  const standaloneNotes = rootNotes.filter(note => !note.isNotebook);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderNoteItem = (note: Note, level = 0, isChild = false) => {
    const isExpanded = expandedFolders[note.id] || false;
    const hasChildren = note.isNotebook && note.children && note.children.length > 0;
    
    return (
      <div key={note.id} className={`${level > 0 ? 'ml-' + (level * 3) : ''}`}>
        <Button
          variant="ghost"
          className={`w-full justify-start text-left h-auto py-2 px-2 ${isChild ? 'pl-5' : ''}`}
          onClick={() => navigate(`/editor/${note.id}`)}
        >
          <div className="flex items-start gap-2 w-full">
            {hasChildren ? (
              <div 
                className="flex items-center mt-0.5 h-4 w-4 cursor-pointer hover:bg-accent rounded-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(note.id);
                }}
              >
                <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </div>
            ) : (
              <div className="w-4"></div>
            )}
            
            {note.isNotebook ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
              ) : (
                <Folder className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
              )
            ) : (
              <FileText className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
            )}
            
            <div className="truncate flex-1">
              <div className="font-medium truncate">{note.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        </Button>
        
        {hasChildren && isExpanded && (
          <div className="border-l border-border ml-4 pl-1 mt-1">
            {note.children.map(childId => {
              const childNote = notes.find(n => n.id === childId);
              if (childNote) {
                return renderNoteItem(childNote, level + 1, true);
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  };

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
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-2">
            {searchQuery ? (
              filteredNotes.length === 0 ? (
                <div className="text-muted-foreground text-sm text-center p-4">
                  No notes match your search
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                    SEARCH RESULTS
                  </div>
                  {filteredNotes.map(note => (
                    <Button
                      key={note.id}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-2 px-2"
                      onClick={() => {
                        navigate(`/editor/${note.id}`);
                        setSearchQuery("");
                        setIsSearching(false);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {note.isNotebook ? (
                          <Book className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                        ) : (
                          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        )}
                        <div className="truncate">
                          <div className="font-medium truncate">{note.title}</div>
                          {note.content && (
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {note.content.substring(0, 60)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )
            ) : (
              <>
                {notebooks.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                      NOTEBOOKS
                    </div>
                    <div className="space-y-1">
                      {notebooks.map(notebook => renderNoteItem(notebook))}
                    </div>
                  </div>
                )}
                
                {standaloneNotes.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                      NOTES
                    </div>
                    <div className="space-y-1">
                      {standaloneNotes.map(note => renderNoteItem(note))}
                    </div>
                  </div>
                )}
                
                {notebooks.length === 0 && standaloneNotes.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                    <p className="text-muted-foreground text-sm mb-2">
                      No notes yet
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/editor/new")}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Create your first note
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
