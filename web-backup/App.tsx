import { useState } from 'react';
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import Login from "@/pages/login";
import CardsPage from "@/pages/cards";
import ExcelPage from "@/pages/excel";
import GalleryPage from "@/pages/gallery";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('cards');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleAddClick = () => {
    setShowAddForm(true);
  };

  const handleCloseAddForm = () => {
    setShowAddForm(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'cards':
        return (
          <CardsPage
            onShowAddForm={handleAddClick}
            showAddForm={showAddForm}
            onCloseAddForm={handleCloseAddForm}
          />
        );
      case 'excel':
        return (
          <ExcelPage
            onShowAddForm={handleAddClick}
            showAddForm={showAddForm}
            onCloseAddForm={handleCloseAddForm}
          />
        );
      case 'gallery':
        return <GalleryPage />;
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      <div className="min-h-screen">
        <Header
          currentPage={currentPage}
          onMenuOpen={() => setSidebarOpen(true)}
          onAddClick={currentPage !== 'gallery' ? handleAddClick : undefined}
        />
        
        <main>
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
