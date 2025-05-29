
import { useAuth } from "@/hooks/use-auth";
import { useNotes } from "@/hooks/use-notes";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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
  MoreHorizontal,
  Clock,
  Star,
  StarOff,
  Home,
  Settings,
  Archive,
  Trash2,
  FileUp,
  Sparkles,
  PanelRight,
  User,
  LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Note } from "@/types";
import { toast } from "sonner";

interface SidebarLinkProps {
  icon: LucideIcon;
  label: string;
  to: string;
  badge?: number;
  active?: boolean;
}

function SidebarLink({ icon: Icon, label, to, badge, active }: SidebarLinkProps) {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start h-9 px-2 ${active ? 'bg-muted' : ''}`}
      onClick={() => navigate(to)}
    >
      <Icon className="h-4 w-4 mr-2" />
      <span className="truncate">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
          {badge}
        </span>
      )}
    </Button>
  );
}

export function AppSidebar() {
  const { isAuthenticated, user } = useAuth();
  const { notes, searchNotes, getNoteHierarchy, getRootNotes, createNote, createNotebook, deleteNote, updateNote } = useNotes();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dragCounter = useRef(0);

  useEffect(() => {
    // Load expanded folders from local storage
    const savedExpandedFolders = localStorage.getItem('expandedFolders');
    if (savedExpandedFolders) {
      setExpandedFolders(JSON.parse(savedExpandedFolders));
    }
    
    // Load recent searches from local storage
    const savedRecentSearches = localStorage.getItem('recentSearches');
    if (savedRecentSearches) {
      setRecentSearches(JSON.parse(savedRecentSearches));
    }
  }, []);
  
  useEffect(() => {
    // Save expanded folders to local storage when it changes
    localStorage.setItem('expandedFolders', JSON.stringify(expandedFolders));
  }, [expandedFolders]);
  
  useEffect(() => {
    // Auto-expand folder if current note is nested inside
    if (location.pathname.startsWith('/editor/')) {
      const noteId = location.pathname.split('/editor/')[1];
      
      const expandParents = (noteId: string) => {
        const note = notes.find(n => n.id === noteId);
        if (note && note.parentId) {
          setExpandedFolders(prev => ({ ...prev, [note.parentId!]: true }));
          expandParents(note.parentId);
        }
      };
      
      expandParents(noteId);
    }
  }, [location.pathname, notes]);

  const filteredNotes = searchQuery.trim() ? searchNotes(searchQuery) : [];
  const rootNotes = getRootNotes();
  const notebooks = rootNotes.filter(note => note.isNotebook);
  const standaloneNotes = rootNotes.filter(note => !note.isNotebook);
  
  // Recent notes - last 5 updated notes
  const recentNotes = [...notes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 5);

  const toggleFolder = (id: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleDragStart = (e: React.DragEvent, noteId: string) => {
    e.dataTransfer.setData('text/plain', noteId);
    setDraggedNote(noteId);
    
    // Set a custom drag image (optional)
    const dragImage = document.createElement('div');
    dragImage.className = 'bg-card border p-2 rounded shadow text-sm';
    dragImage.textContent = notes.find(n => n.id === noteId)?.title || 'Note';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };
  
  const handleDragOver = (e: React.DragEvent, noteId: string) => {
    e.preventDefault();
    
    if (draggedNote === noteId) return;
    
    const note = notes.find(n => n.id === noteId);
    if (!note?.isNotebook && !note?.children?.length) return;
    
    setDropTarget(noteId);
  };
  
  const handleDragEnter = (e: React.DragEvent, noteId: string) => {
    e.preventDefault();
    dragCounter.current += 1;
    
    if (draggedNote === noteId) return;
    
    const note = notes.find(n => n.id === noteId);
    if (!note?.isNotebook && !note?.children?.length) return;
    
    setDropTarget(noteId);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    
    if (dragCounter.current === 0) {
      setDropTarget(null);
    }
  };
  
  const handleDrop = async (e: React.DragEvent, noteId: string) => {
    e.preventDefault();
    dragCounter.current = 0;
    const droppedNoteId = e.dataTransfer.getData('text/plain');
    setDraggedNote(null);
    setDropTarget(null);
    
    if (droppedNoteId === noteId) return;
    
    try {
      const targetNote = notes.find(n => n.id === noteId);
      if (!targetNote) return;
      
      if (!targetNote.isNotebook) {
        // Convert to notebook if it's not already
        await updateNote(targetNote.id, targetNote.title, targetNote.content);
      }
      
      // Move the note
      const movedNote = notes.find(n => n.id === droppedNoteId);
      if (movedNote) {
        await updateNote(movedNote.id, movedNote.title, movedNote.content);
        toast.success(`Moved "${movedNote.title}" to "${targetNote.title}"`);
        
        // Auto-expand the target folder
        setExpandedFolders(prev => ({ ...prev, [noteId]: true }));
      }
    } catch (error) {
      console.error("Error moving note:", error);
      toast.error("Failed to move note");
    }
  };
  
  const handleDragEnd = () => {
    setDraggedNote(null);
    setDropTarget(null);
    dragCounter.current = 0;
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Add to recent searches if not already included
      if (!recentSearches.includes(searchQuery)) {
        const newRecentSearches = [searchQuery, ...recentSearches].slice(0, 5);
        setRecentSearches(newRecentSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      }
    }
  };
  
  const handleNoteAction = async (action: string, noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    switch (action) {
      case 'star':
        await updateNote(noteId, note.title, note.content);
        toast.success(`${note.isStarred ? 'Removed from' : 'Added to'} favorites`);
        break;
        
      case 'delete':
        await deleteNote(noteId);
        toast.success(`Deleted "${note.title}"`);
        break;
        
      case 'duplicate':
        const newTitle = `${note.title} (Copy)`;
        const newNote = await createNote(newTitle, note.content, note.parentId);
        toast.success(`Duplicated "${note.title}"`);
        navigate(`/editor/${newNote.id}`);
        break;
        
      case 'convert':
        const updatedNote = await updateNote(noteId, note.title, note.content);
        toast.success(`Converted "${note.title}" to ${note.isNotebook ? 'page' : 'notebook'}`);
        break;
    }
  };

  const renderNoteItem = (note: Note, level = 0, isChild = false) => {
    const isExpanded = expandedFolders[note.id] || false;
    const hasChildren = note.isNotebook && note.children && note.children.length > 0;
    const isCurrentNote = location.pathname === `/editor/${note.id}`;
    const isDropTarget = dropTarget === note.id;
    
    return (
      <div 
        key={note.id} 
        className={`${level > 0 ? 'ml-' + (level * 3) : ''}`}
        draggable
        onDragStart={(e) => handleDragStart(e, note.id)}
        onDragOver={(e) => handleDragOver(e, note.id)}
        onDragEnter={(e) => handleDragEnter(e, note.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, note.id)}
        onDragEnd={handleDragEnd}
      >
        <div 
          className={`flex items-center group ${
            isDropTarget ? 'bg-primary/10 rounded-md' : ''
          }`}
        >
          <Button
            variant="ghost"
            className={`w-full justify-start text-left h-auto py-2 px-2 ${
              isChild ? 'pl-5' : ''
            } ${isCurrentNote ? 'bg-muted' : ''}`}
            onClick={() => navigate(`/editor/${note.id}`)}
          >
            <div className="flex items-start gap-2 w-full">
              {hasChildren ? (
                <div 
                  className="flex items-center mt-0.5 h-4 w-4 cursor-pointer hover:bg-accent rounded-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(note.id, e);
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
              
              {note.isStarred && (
                <Star className="h-3 w-3 text-yellow-400 opacity-70" />
              )}
            </div>
          </Button>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity mr-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleNoteAction(note.isStarred ? 'unstar' : 'star', note.id)}>
                  {note.isStarred ? (
                    <>
                      <StarOff className="h-4 w-4 mr-2" />
                      Remove from favorites
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Add to favorites
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNoteAction('duplicate', note.id)}>
                  <FileUp className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNoteAction('convert', note.id)}>
                  {note.isNotebook ? (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Convert to page
                    </>
                  ) : (
                    <>
                      <Folder className="h-4 w-4 mr-2" />
                      Convert to notebook
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNoteAction('delete', note.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
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
            <form className="flex gap-1 items-center w-full" onSubmit={handleSearchSubmit}>
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
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <>
              <div className="font-medium text-lg flex items-center">
                <PanelRight className="h-5 w-5 mr-2 text-primary" />
                NotesScrib
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsSearching(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      navigate("/editor/new");
                    }}>
                      <FileText className="h-4 w-4 mr-2" />
                      New Page
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={async () => {
                      const notebook = await createNotebook("Untitled Notebook");
                      navigate(`/editor/${notebook.id}`);
                    }}>
                      <Folder className="h-4 w-4 mr-2" />
                      New Notebook
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Sparkles className="h-4 w-4 mr-2" />
                      From Template
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          {searchQuery ? (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                SEARCH RESULTS
              </div>
              
              {filteredNotes.length === 0 ? (
                <div className="text-muted-foreground text-sm text-center p-4">
                  No notes match your search
                </div>
              ) : (
                <div className="space-y-1">
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
              )}
              
              {recentSearches.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                    RECENT SEARCHES
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-2 px-2"
                        onClick={() => {
                          setSearchQuery(search);
                        }}
                      >
                        <Search className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span className="truncate text-sm">{search}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-2">
              <div className="mb-4">
                <div className="space-y-1">
                  <SidebarLink 
                    icon={Home} 
                    label="Home" 
                    to="/dashboard" 
                    active={location.pathname === '/dashboard'}
                  />
                  
                  <div className="px-2 py-1.5 flex justify-between items-center">
                    <span className="text-xs font-medium text-muted-foreground">RECENT</span>
                  </div>
                  
                  {recentNotes.map(note => (
                    <Button
                      key={note.id}
                      variant="ghost"
                      className={`w-full justify-start text-left h-auto py-2 px-2 ${
                        location.pathname === `/editor/${note.id}` ? 'bg-muted' : ''
                      }`}
                      onClick={() => navigate(`/editor/${note.id}`)}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate text-sm">{note.title}</span>
                      </div>
                    </Button>
                  ))}
                  
                  <div className="px-2 py-1.5 flex justify-between items-center">
                    <span className="text-xs font-medium text-muted-foreground">NOTEBOOKS</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={async () => {
                        const notebook = await createNotebook("Untitled Notebook");
                        navigate(`/editor/${notebook.id}`);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {notebooks.length > 0 ? (
                    <div className="space-y-1">
                      {notebooks.map(notebook => renderNoteItem(notebook))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground px-2 py-1">
                      No notebooks yet
                    </div>
                  )}
                  
                  <div className="px-2 py-1.5 flex justify-between items-center">
                    <span className="text-xs font-medium text-muted-foreground">PAGES</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => navigate("/editor/new")}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {standaloneNotes.length > 0 ? (
                    <div className="space-y-1">
                      {standaloneNotes.map(note => renderNoteItem(note))}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground px-2 py-1">
                      No standalone pages yet
                    </div>
                  )}
                </div>
              </div>
              
              <div className="fixed bottom-0 border-t border-border w-[280px] bg-background p-2">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {user?.name || 'User'}
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
