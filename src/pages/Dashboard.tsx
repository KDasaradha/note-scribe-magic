import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { NotesList } from "@/components/notes/NotesList";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { 
  Book, 
  Plus, 
  Search, 
  Clock, 
  Star, 
  Archive, 
  FileText,
  Sparkles,
  Package,
  Filter,
  List
} from "lucide-react";
import { useNotes } from "@/hooks/use-notes";
import { Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { X } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { notes, createNote, createNotebook, getRootNotes } = useNotes();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"updated" | "created" | "title">("updated");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Set page title
    document.title = "My Notebooks - Notes App";
    
    return () => {
      document.title = "Notes App";
    };
  }, []);

  const rootNotes = getRootNotes();
  
  // Filter notes based on active tab and search query
  const getFilteredNotes = () => {
    let filtered = [...rootNotes];
    
    if (searchQuery) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    switch (activeTab) {
      case "notebooks":
        filtered = filtered.filter(note => note.isNotebook);
        break;
      case "pages":
        filtered = filtered.filter(note => !note.isNotebook);
        break;
      case "recent":
        filtered = filtered.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ).slice(0, 10);
        break;
      case "starred":
        filtered = filtered.filter(note => note.isStarred);
        break;
      default:
        break;
    }
    
    // Apply sorting
    filtered = filtered.sort((a, b) => {
      if (sortBy === "updated") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortBy === "created") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
    
    return filtered;
  };
  
  const filteredNotes = getFilteredNotes();
  
  const handleCreateNew = async (type: "page" | "notebook") => {
    if (type === "notebook") {
      const notebook = await createNotebook("Untitled Notebook");
      navigate(`/editor/${notebook.id}`);
    } else {
      const page = await createNote("Untitled Page", "");
      navigate(`/editor/${page.id}`);
    }
  };
  
  if (isLoading || !isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="container max-w-6xl py-6 px-4 md:px-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Book className="text-primary h-8 w-8 mr-3" />
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Workspace</h1>
                    <p className="text-muted-foreground mt-1">
                      {user?.name}'s notes and notebooks
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isSearching ? (
                    <div className="relative w-64">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes..."
                        className="pr-8"
                        autoFocus
                      />
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => {
                          setSearchQuery("");
                          setIsSearching(false);
                        }}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsSearching(true)}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Sort
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => setSortBy("updated")}
                        className={sortBy === "updated" ? "bg-muted" : ""}
                      >
                        Last updated
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortBy("created")}
                        className={sortBy === "created" ? "bg-muted" : ""}
                      >
                        Recently created
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setSortBy("title")}
                        className={sortBy === "title" ? "bg-muted" : ""}
                      >
                        Alphabetical
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => handleCreateNew("page")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        New Page
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleCreateNew("notebook")}
                      >
                        <Book className="h-4 w-4 mr-2" />
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
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-between items-center border-b">
                  <TabsList className="mb-1">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="notebooks">Notebooks</TabsTrigger>
                    <TabsTrigger value="pages">Pages</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="starred">Starred</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`px-2 ${view === "grid" ? "bg-muted" : ""}`}
                      onClick={() => setView("grid")}
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`px-2 ${view === "list" ? "bg-muted" : ""}`}
                      onClick={() => setView("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <TabsContent value="all" className="mt-4">
                  {filteredNotes.length > 0 ? (
                    <div className={view === "grid" ? 
                      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : 
                      "flex flex-col space-y-2"
                    }>
                      {filteredNotes.map(note => (
                        <div
                          key={note.id}
                          className={view === "grid" ? 
                            "bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" :
                            "flex items-center bg-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                          }
                          onClick={() => navigate(`/editor/${note.id}`)}
                        >
                          {view === "grid" ? (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  {note.isNotebook ? (
                                    <Book className="h-5 w-5 text-primary mr-2" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                                  )}
                                  <h3 className="font-medium truncate">{note.title}</h3>
                                </div>
                                {note.isStarred && <Star className="h-4 w-4 text-yellow-400" />}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {note.content || (note.isNotebook ? "Notebook" : "No content")}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3 mr-1" />
                                Updated {new Date(note.updatedAt).toLocaleDateString()}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mr-3">
                                {note.isNotebook ? (
                                  <Book className="h-5 w-5 text-primary" />
                                ) : (
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{note.title}</h3>
                                <p className="text-xs text-muted-foreground truncate">
                                  {note.content || (note.isNotebook ? "Notebook" : "No content")}
                                </p>
                              </div>
                              <div className="flex items-center ml-4">
                                {note.isStarred && <Star className="h-4 w-4 text-yellow-400 mr-2" />}
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(note.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Book className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No notes found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? 
                          "No notes match your search query" : 
                          "Create your first note or notebook to get started"
                        }
                      </p>
                      <Button onClick={() => handleCreateNew("page")}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Page
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="notebooks" className="mt-4">
                  {filteredNotes.filter(note => note.isNotebook).length > 0 ? (
                    <div className={view === "grid" ? 
                      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : 
                      "flex flex-col space-y-2"
                    }>
                      {filteredNotes.filter(note => note.isNotebook).map(note => (
                        <div
                          key={note.id}
                          className={view === "grid" ? 
                            "bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" :
                            "flex items-center bg-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                          }
                          onClick={() => navigate(`/editor/${note.id}`)}
                        >
                          {view === "grid" ? (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  {note.isNotebook ? (
                                    <Book className="h-5 w-5 text-primary mr-2" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                                  )}
                                  <h3 className="font-medium truncate">{note.title}</h3>
                                </div>
                                {note.isStarred && <Star className="h-4 w-4 text-yellow-400" />}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {note.content || (note.isNotebook ? "Notebook" : "No content")}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3 mr-1" />
                                Updated {new Date(note.updatedAt).toLocaleDateString()}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mr-3">
                                {note.isNotebook ? (
                                  <Book className="h-5 w-5 text-primary" />
                                ) : (
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{note.title}</h3>
                                <p className="text-xs text-muted-foreground truncate">
                                  {note.content || (note.isNotebook ? "Notebook" : "No content")}
                                </p>
                              </div>
                              <div className="flex items-center ml-4">
                                {note.isStarred && <Star className="h-4 w-4 text-yellow-400 mr-2" />}
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(note.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Book className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No notebooks found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? 
                          "No notebooks match your search query" : 
                          "Create your first notebook to get started"
                        }
                      </p>
                      <Button onClick={() => handleCreateNew("notebook")}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Notebook
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="pages" className="mt-4">
                  {filteredNotes.filter(note => !note.isNotebook).length > 0 ? (
                    <div className={view === "grid" ? 
                      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : 
                      "flex flex-col space-y-2"
                    }>
                      {filteredNotes.filter(note => !note.isNotebook).map(note => (
                        <div
                          key={note.id}
                          className={view === "grid" ? 
                            "bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" :
                            "flex items-center bg-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                          }
                          onClick={() => navigate(`/editor/${note.id}`)}
                        >
                          {view === "grid" ? (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  {note.isNotebook ? (
                                    <Book className="h-5 w-5 text-primary mr-2" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                                  )}
                                  <h3 className="font-medium truncate">{note.title}</h3>
                                </div>
                                {note.isStarred && <Star className="h-4 w-4 text-yellow-400" />}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {note.content || (note.isNotebook ? "Notebook" : "No content")}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3 mr-1" />
                                Updated {new Date(note.updatedAt).toLocaleDateString()}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mr-3">
                                {note.isNotebook ? (
                                  <Book className="h-5 w-5 text-primary" />
                                ) : (
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{note.title}</h3>
                                <p className="text-xs text-muted-foreground truncate">
                                  {note.content || (note.isNotebook ? "Notebook" : "No content")}
                                </p>
                              </div>
                              <div className="flex items-center ml-4">
                                {note.isStarred && <Star className="h-4 w-4 text-yellow-400 mr-2" />}
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(note.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No pages found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? 
                          "No pages match your search query" : 
                          "Create your first page to get started"
                        }
                      </p>
                      <Button onClick={() => handleCreateNew("page")}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Page
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="recent" className="mt-4">
                  {filteredNotes.filter((note, index) => index < 10).length > 0 ? (
                    <div className={view === "grid" ? 
                      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : 
                      "flex flex-col space-y-2"
                    }>
                      {filteredNotes.filter((note, index) => index < 10).map(note => (
                        <div
                          key={note.id}
                          className={view === "grid" ? 
                            "bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" :
                            "flex items-center bg-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                          }
                          onClick={() => navigate(`/editor/${note.id}`)}
                        >
                          {view === "grid" ? (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  {note.isNotebook ? (
                                    <Book className="h-5 w-5 text-primary mr-2" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                                  )}
                                  <h3 className="font-medium truncate">{note.title}</h3>
                                </div>
                                {note.isStarred && <Star className="h-4 w-4 text-yellow-400" />}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {note.content || (note.isNotebook ? "Notebook" : "No content")}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3 mr-1" />
                                Updated {new Date(note.updatedAt).toLocaleDateString()}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mr-3">
                                {note.isNotebook ? (
                                  <Book className="h-5 w-5 text-primary" />
                                ) : (
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{note.title}</h3>
                                <p className="text-xs text-muted-foreground truncate">
                                  {note.content || (note.isNotebook ? "Notebook" : "No content")}
                                </p>
                              </div>
                              <div className="flex items-center ml-4">
                                {note.isStarred && <Star className="h-4 w-4 text-yellow-400 mr-2" />}
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(note.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No recent notes found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? 
                          "No recent notes match your search query" : 
                          "Your recently updated notes will appear here"
                        }
                      </p>
                      <Button onClick={() => handleCreateNew("page")}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Page
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="starred" className="mt-4">
                  {filteredNotes.filter(note => note.isStarred).length > 0 ? (
                    <div className={view === "grid" ? 
                      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : 
                      "flex flex-col space-y-2"
                    }>
                      {filteredNotes.filter(note => note.isStarred).map(note => (
                        <div
                          key={note.id}
                          className={view === "grid" ? 
                            "bg-card border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow" :
                            "flex items-center bg-card border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                          }
                          onClick={() => navigate(`/editor/${note.id}`)}
                        >
                          {view === "grid" ? (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  {note.isNotebook ? (
                                    <Book className="h-5 w-5 text-primary mr-2" />
                                  ) : (
                                    <FileText className="h-5 w-5 text-muted-foreground mr-2" />
                                  )}
                                  <h3 className="font-medium truncate">{note.title}</h3>
                                </div>
                                {note.isStarred && <Star className="h-4 w-4 text-yellow-400" />}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {note.content || (note.isNotebook ? "Notebook" : "No content")}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Clock className="h-3 w-3 mr-1" />
                                Updated {new Date(note.updatedAt).toLocaleDateString()}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="mr-3">
                                {note.isNotebook ? (
                                  <Book className="h-5 w-5 text-primary" />
                                ) : (
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium truncate">{note.title}</h3>
                                <p className="text-xs text-muted-foreground truncate">
                                  {note.content || (note.isNotebook ? "Notebook" : "No content")}
                                </p>
                              </div>
                              <div className="flex items-center ml-4">
                                {note.isStarred && <Star className="h-4 w-4 text-yellow-400 mr-2" />}
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {new Date(note.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                        <Star className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No starred notes found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? 
                          "No starred notes match your search query" : 
                          "Star your favorite notes to find them easily"
                        }
                      </p>
                      <Button onClick={() => handleCreateNew("page")}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Page
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
