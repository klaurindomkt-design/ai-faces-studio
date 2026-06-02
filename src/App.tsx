import { useState, useMemo, ChangeEvent } from 'react';
import { modelsData } from './data/modelsData';
import { ImageCard, Model } from './types';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterSection from './components/FilterSection';
import ModelGallery from './components/ModelGallery';
import ContactSection from './components/ContactSection';
import Lightbox from './components/Lightbox';

// Custom design system additions
import EditModelModal from './components/EditModelModal';
import ImagePlacementModal from './components/ImagePlacementModal';
import NetlifyGuideModal from './components/NetlifyGuideModal';
import { Settings, RefreshCw, Eye, BookOpen, Sparkles, Download, Upload } from 'lucide-react';

export default function App() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Customizer and Edit state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isNetlifyGuideOpen, setIsNetlifyGuideOpen] = useState<boolean>(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [replacingImage, setReplacingImage] = useState<ImageCard | null>(null);
  const [isSavingSource, setIsSavingSource] = useState<boolean>(false);

  // Auto-detect whether to display customization bar.
  // It will show on Localhost, AI Studio live preview interfaces, or on Netlify if specifically adding `?edit=true` in the URL.
  const showCustomizer = useMemo(() => {
    try {
      const hostname = window.location.hostname;
      const searchParams = new URL(window.location.href).searchParams;
      const hasEditParam = searchParams.get('edit') === 'true' || searchParams.get('admin') === 'true';
      return (
        hostname === 'localhost' ||
        hostname.includes('127.0.0.1') ||
        hostname.includes('ais-dev') ||
        hostname.includes('ais-pre') ||
        hasEditParam
      );
    } catch (e) {
      return false;
    }
  }, []);

  // Load models from localStorage or default (safe with try/catch for sandbox iframes)
  const [models, setModels] = useState<Model[]>(() => {
    try {
      const saved = localStorage.getItem('ai_faces_models_v3');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('O acesso ao LocalStorage foi impedido pelo navegador (comportamento comum em sandbox iframes):', e);
    }
    return modelsData;
  });

  // Save utility helper
  const handleSaveModels = (newModels: Model[]) => {
    setModels(newModels);
    try {
      localStorage.setItem('ai_faces_models_v3', JSON.stringify(newModels));
    } catch (e) {
      console.error('Erro ao gravar no LocalStorage:', e);
      // Fail silently to keep application functioning flawlessly in active browser memory
    }
  };

  const handlePersistToSourceCode = async () => {
    setIsSavingSource(true);
    try {
      const response = await fetch('/api/save-portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ models }),
      });
      const data = await response.json();
      if (data.success) {
        alert('✨ SUCESSO! Suas novas fotos e textos de influenciadoras personalizadas foram gravados e consolidados diretamente no CÓDIGO-FONTE do projeto na nuvem.\n\nAgora o seu site final no Netlify carregará tudo perfeitamente! Para ver no ar, basta clicar em "Sync to GitHub" (ou no botão do GitHub no menu lateral de publicação) para enviar seu novo código-fonte automaticamente ao seu repositório Netlify!');
      } else {
        alert('Erro ao gravar no código-fonte do servidor: ' + data.message);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      alert('Erro de conexão ao servidor: certifique-se de que o servidor está rodando ou reconecte.');
    } finally {
      setIsSavingSource(false);
    }
  };

  // Export backup helper
  const handleExportBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(models, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "portfolio_backup.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Falha ao exportar backup.");
    }
  };

  // Import backup helper
  const handleImportBackup = (event: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0];
    if (!file) return;

    fileReader.onload = (e) => {
      try {
        const target = e.target?.result;
        if (typeof target === 'string') {
          const parsed = JSON.parse(target);
          if (Array.isArray(parsed)) {
            handleSaveModels(parsed);
            alert("✨ SUCESSO! Configurações do seu portfólio importadas e aplicadas com sucesso!");
          } else {
            alert("Arquivo JSON inválido. Deve ser uma lista de modelos.");
          }
        }
      } catch (err) {
        alert("Erro ao ler o arquivo de backup. Verifique se é um arquivo JSON válido.");
      }
    };
    fileReader.readAsText(file);
  };

  // Restore defaults
  const handleRestoreDefaults = () => {
    if (window.confirm('Deseja realmente restaurar as biografia e imagens padrão do portfólio?')) {
      setModels(modelsData);
      try {
        localStorage.removeItem('ai_faces_models_v3');
      } catch (e) {
        console.warn('Erro ao remover do LocalStorage:', e);
      }
    }
  };

  // Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Filter models based on active filter state
  const displayedModels = useMemo(() => {
    if (activeFilter === 'all') {
      return models;
    }
    return models.filter((m) => m.id === activeFilter);
  }, [activeFilter, models]);

  // Flattened image list containing only currently visible images
  const filteredImagesList = useMemo(() => {
    return displayedModels.flatMap((m) => m.images);
  }, [displayedModels]);

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const handleLightboxNavigate = (direction: number) => {
    setLightboxIndex((prevIdx) => {
      if (prevIdx === -1) return -1;
      const total = filteredImagesList.length;
      return (prevIdx + direction + total) % total;
    });
  };

  // Handle Model details alterations
  const handleSaveModelDetails = (updatedFields: Partial<Model>) => {
    if (!editingModel) return;

    const updated = models.map((m) => {
      if (m.id === editingModel.id) {
        const nextModel = { ...m, ...updatedFields };
        // Sync models name inside each image card too so lightbox aligns
        nextModel.images = nextModel.images.map((img) => ({
          ...img,
          modelName: `${nextModel.firstName} ${nextModel.lastName}`,
        }));
        return nextModel;
      }
      return m;
    });

    handleSaveModels(updated);
  };

  // Handle Image uploads replacement
  const handleImageUploaded = (base64String: string) => {
    if (!replacingImage) return;

    const updated = models.map((m) => {
      // Find which model has this image index
      const hasImage = m.images.some((img) => img.index === replacingImage.index);
      if (hasImage) {
        const nextImages = m.images.map((img) => {
          if (img.index === replacingImage.index) {
            return { ...img, src: base64String };
          }
          return img;
        });
        return { ...m, images: nextImages };
      }
      return m;
    });

    handleSaveModels(updated);
    setReplacingImage(null);
  };

  return (
    <div className="relative min-h-screen bg-black-pure text-txt-light selection:bg-gold/25 selection:text-gold selection:outline-none pb-20">
      {/* Interactive premium Cursor */}
      <Cursor />

      {/* Control Panel Deck Overlay */}
      {showCustomizer && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] shadow-2xl">
          <div className="bg-surface-bg/95 border border-gold/20 hover:border-gold/40 back-blur-md px-4 py-3 rounded-full flex items-center justify-center gap-3 md:gap-5 transition-all duration-300">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`cursor-pointer px-4 py-2 rounded-full text-[10px] md:text-xs tracking-wider uppercase font-medium transition-all duration-300 flex items-center gap-2 ${
                isEditMode 
                  ? 'bg-gold text-black-pure shadow-lg shadow-gold/15' 
                  : 'text-gold hover:bg-gold/5'
              }`}
            >
              {isEditMode ? <Eye className="w-3.5 h-3.5" /> : <Settings className="w-3.5 h-3.5" />}
              <span>{isEditMode ? 'Ver Portfólio' : 'Customizar Portfólio'}</span>
            </button>

            <div className="w-[1px] h-5 bg-surface-card" />

            <button
              onClick={() => setIsNetlifyGuideOpen(true)}
              className="cursor-pointer text-txt-light hover:text-gold px-3 py-1.5 rounded-full text-[10px] md:text-xs tracking-wider uppercase font-light transition-colors duration-200 flex items-center gap-1.5"
              title="Guia de Hospedagem"
            >
              <BookOpen className="w-3.5 h-3.5 text-gold-dim" />
              <span className="hidden md:inline">Publicar no Netlify</span>
              <span className="md:hidden">Publicar</span>
            </button>

            <button
              onClick={handleRestoreDefaults}
              className="cursor-pointer text-txt-muted hover:text-red-300 px-3 py-1.5 rounded-full text-[10px] md:text-xs tracking-wider uppercase font-light transition-colors duration-200 flex items-center gap-1.5"
              title="Restaurar Fotos e Textos Originais"
            >
              <RefreshCw className="w-3.5 h-3.5 text-txt-muted" />
              <span className="hidden md:inline">Resetar</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Header */}
      <Navbar />

      {/* Hero Welcome banner */}
      <Hero />

      {showCustomizer && isEditMode && (
        <div className="max-w-7xl mx-auto px-6 md:px-16 pt-10">
          <div className="bg-gold/5 border border-dashed border-gold/20 p-5 rounded-[2px] flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-left space-y-2">
              <p className="text-xs text-gold tracking-wide uppercase font-medium flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Modo de Customização Ativo
              </p>
              <p className="text-[11px] text-txt-muted mt-1 leading-relaxed">
                Clique em <strong className="text-white-pure">"Editar Visão"</strong> para mudar textos ou <strong className="text-white-pure">clique direto sobre qualquer imagem</strong> para substituí-la.
              </p>
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-[2px] text-[10px] text-red-300 max-w-xl space-y-1">
                <p>
                  ⚠️ <strong>Aviso Importante do AI Studio:</strong> Como cada mensagem de código reconstrói o servidor temporário, o código-fonte volta ao padrão e o navegador exclui suas customizações anteriores.
                </p>
                <p className="text-txt-muted font-light">
                  Para não perder nada, clique em <strong>"Exportar Backup (JSON)"</strong> abaixo. Caso suas fotos sumam na próxima atualização, basta carregar o arquivo exportado usando <strong>"Importar Backup"</strong>!
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 justify-center md:justify-start">
                <button
                  onClick={handleExportBackup}
                  className="cursor-pointer bg-surface-card hover:bg-gold/10 text-gold border border-gold/20 font-sans text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-2 rounded-[2px] transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95"
                  title="Salvar alterações em arquivo de backup"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Backup (JSON)</span>
                </button>
                <label
                  className="cursor-pointer bg-surface-card hover:bg-gold/10 text-gold border border-gold/20 font-sans text-[10px] font-bold tracking-[0.1em] uppercase px-3 py-2 rounded-[2px] transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95"
                  title="Restaurar backup exportado anteriormente"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importar Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportBackup}
                  />
                </label>
              </div>
            </div>
            
            <button
              onClick={handlePersistToSourceCode}
              disabled={isSavingSource}
              className="cursor-pointer bg-gold hover:bg-gold-light disabled:opacity-40 text-black-pure font-sans text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase px-6 py-3.5 rounded-[2px] transition-all duration-300 flex items-center justify-center gap-2 shrink-0 active:scale-95 shadow-lg shadow-gold/10"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSavingSource ? 'Gravando Alterações...' : 'Salvar Alterações no Código-Fonte'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Menu Tabs */}
      <FilterSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      {/* Dynamically Filtered Models Showcase */}
      <main className="max-w-7xl mx-auto px-6 md:px-16 pb-24">
        <div className="space-y-20">
          {displayedModels.map((model) => (
            <ModelGallery
              key={model.id}
              model={model}
              onImageClick={handleOpenLightbox}
              filteredImagesList={filteredImagesList}
              isEditMode={showCustomizer && isEditMode}
              onEditModelDetails={setEditingModel}
              onReplaceImage={setReplacingImage}
            />
          ))}
        </div>
      </main>

      {/* Booking Form Proposals */}
      <ContactSection />

      {/* Sleek Footing */}
      <footer className="border-t border-surface-card bg-black-pure/90 py-10 px-6 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[0.58rem] md:text-xs tracking-[0.2em] text-txt-muted uppercase">
          AI Faces Studio — © 2026
        </span>
        <div className="hidden md:block w-1.5 h-1.5 bg-gold-dim rounded-full" />
        <span className="text-[0.58rem] md:text-xs tracking-[0.2em] text-txt-muted uppercase">
          Criação de alta fidelidade 100% com IA
        </span>
      </footer>

      {/* Full-screen Picture Lightbox Dialog */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={filteredImagesList}
        currentIndex={lightboxIndex}
        onNavigate={handleLightboxNavigate}
      />

      {/* Customizer Edit Modal popup */}
      {editingModel && (
        <EditModelModal
          isOpen={editingModel !== null}
          onClose={() => setEditingModel(null)}
          model={editingModel}
          onSave={handleSaveModelDetails}
        />
      )}

      {/* Drag & Drop dynamic Image replacement modal */}
      {replacingImage && (
        <ImagePlacementModal
          isOpen={replacingImage !== null}
          onClose={() => setReplacingImage(null)}
          modelName={replacingImage.modelName}
          imageNum={replacingImage.num}
          onImageUploaded={handleImageUploaded}
        />
      )}

      {/* Step by Step Netlify Guide */}
      <NetlifyGuideModal
        isOpen={isNetlifyGuideOpen}
        onClose={() => setIsNetlifyGuideOpen(false)}
      />
    </div>
  );
}
