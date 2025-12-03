import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Download } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CVUploadSection from '../components/cv-improviser/CVUploadSection';
import SectionTabs from '../components/cv-improviser/SectionTabs';
import BulletEditorCard from '../components/cv-improviser/BulletEditorCard';
import AISuggestionDrawer from '../components/cv-improviser/AISuggestionDrawer';
import CVPreview from '../components/cv-improviser/CVPreview';
import ScoreDisplay from '../components/cv-improviser/ScoreDisplay';
import { parseCVFile, ParsedCV } from '../services/cvParserService';
import { generatePDFFromCV } from '../services/pdfGeneratorService';

interface BulletPoint {
  id: string;
  content: string;
}

export default function CVImproviser() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvData, setCvData] = useState<ParsedCV | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [bullets, setBullets] = useState<Record<string, BulletPoint[]>>({});
  const [cvScore, setCvScore] = useState(72);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [currentBulletId, setCurrentBulletId] = useState<string>('');
  const [currentBulletText, setCurrentBulletText] = useState('');
  const [updatedContent, setUpdatedContent] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);

  // Error display
  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F7FE] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading CV Improviser</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="bg-[#2782EA] text-white px-4 py-2 rounded-lg"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const handleUploadComplete = useCallback((file: File) => {
    setUploadedFile(file);
  }, []);

  const handleAnalyze = useCallback(async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const parsed = await parseCVFile(file);
      setCvData(parsed);
      
      // Initialize bullets from parsed content
      const initialBullets: Record<string, BulletPoint[]> = {};
      for (const section of parsed.sections) {
        const sectionContent = parsed.content[section];
        if (Array.isArray(sectionContent)) {
          initialBullets[section] = sectionContent.map((bullet, idx) => ({
            id: `${section}-${idx}`,
            content: bullet,
          }));
        } else if (section === 'Personal Information') {
          // Personal info is handled separately in preview
          initialBullets[section] = [];
        } else {
          initialBullets[section] = [];
        }
      }
      
      setBullets(initialBullets);
      setActiveSection(parsed.sections[0] || '');
      
      // Initialize updated content
      const initialUpdated: Record<string, string[]> = {};
      for (const section of parsed.sections) {
        const sectionContent = parsed.content[section];
        if (Array.isArray(sectionContent)) {
          initialUpdated[section] = [...sectionContent];
        }
      }
      setUpdatedContent(initialUpdated);
    } catch (error) {
      console.error('Error parsing CV:', error);
      setError(error instanceof Error ? error.message : 'Failed to parse CV. Please try again.');
      setIsAnalyzing(false);
    }
  }, []);

  const handleBulletUpdate = useCallback((id: string, content: string) => {
    setBullets(prev => {
      const updated = { ...prev };
      for (const section of Object.keys(updated)) {
        const index = updated[section].findIndex(b => b.id === id);
        if (index !== -1) {
          updated[section] = [...updated[section]];
          updated[section][index] = { ...updated[section][index], content };
          
          // Update preview content
          setUpdatedContent(prevContent => ({
            ...prevContent,
            [section]: updated[section].map(b => {
              // Strip HTML tags for preview
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = b.content;
              return tempDiv.textContent || tempDiv.innerText || '';
            }),
          }));
          
          // Recalculate score
          calculateScore(updated);
          break;
        }
      }
      return updated;
    });
  }, []);

  const handleBulletDelete = useCallback((id: string) => {
    setBullets(prev => {
      const updated = { ...prev };
      for (const section of Object.keys(updated)) {
        const index = updated[section].findIndex(b => b.id === id);
        if (index !== -1) {
          updated[section] = updated[section].filter(b => b.id !== id);
          setUpdatedContent(prevContent => ({
            ...prevContent,
            [section]: updated[section].map(b => {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = b.content;
              return tempDiv.textContent || tempDiv.innerText || '';
            }),
          }));
          calculateScore(updated);
          break;
        }
      }
      return updated;
    });
  }, []);

  const handleAddBullet = useCallback(() => {
    if (!activeSection) return;
    
    const newBullet: BulletPoint = {
      id: `${activeSection}-${Date.now()}`,
      content: '',
    };
    
    setBullets(prev => ({
      ...prev,
      [activeSection]: [...(prev[activeSection] || []), newBullet],
    }));
  }, [activeSection]);

  const handleGenerateAI = useCallback((id: string, content: string, section: string) => {
    setCurrentBulletId(id);
    setCurrentBulletText(content);
    setAiDrawerOpen(true);
  }, []);

  const handleApplySuggestion = useCallback((suggestion: string) => {
    if (currentBulletId) {
      handleBulletUpdate(currentBulletId, suggestion);
      setAiDrawerOpen(false);
    }
  }, [currentBulletId, handleBulletUpdate]);

  const calculateScore = (bulletsData: Record<string, BulletPoint[]>) => {
    let totalScore = 0;
    let totalBullets = 0;
    
    for (const sectionBullets of Object.values(bulletsData)) {
      for (const bullet of sectionBullets) {
        totalBullets++;
        let bulletScore = 50; // Base score
        
        const content = bullet.content.toLowerCase();
        
        // Check for quantification (numbers, percentages)
        if (/\d+/.test(content)) bulletScore += 15;
        
        // Check for action verbs
        const actionVerbs = ['led', 'managed', 'developed', 'created', 'improved', 'increased', 'achieved', 'implemented'];
        if (actionVerbs.some(verb => content.includes(verb))) bulletScore += 15;
        
        // Check for impact/results
        if (content.includes('by') || content.includes('to') || content.includes('from')) bulletScore += 10;
        
        // Check length (not too short, not too long)
        const wordCount = content.split(/\s+/).length;
        if (wordCount >= 10 && wordCount <= 30) bulletScore += 10;
        
        totalScore += Math.min(bulletScore, 100);
      }
    }
    
    const avgScore = totalBullets > 0 ? totalScore / totalBullets : 72;
    setCvScore(Math.round(avgScore));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !activeSection) return;
    
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    
    setBullets(prev => {
      const sectionBullets = [...(prev[activeSection] || [])];
      const [removed] = sectionBullets.splice(sourceIndex, 1);
      sectionBullets.splice(destIndex, 0, removed);
      
      return {
        ...prev,
        [activeSection]: sectionBullets,
      };
    });
    
    // Update preview
    setUpdatedContent(prevContent => ({
      ...prevContent,
      [activeSection]: bullets[activeSection].map(b => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = b.content;
        return tempDiv.textContent || tempDiv.innerText || '';
      }),
    }));
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!cvData) return;
    
    try {
      const contentForPDF: Record<string, string[]> = {};
      for (const section of cvData.sections) {
        if (bullets[section]) {
          contentForPDF[section] = bullets[section].map(b => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = b.content;
            return tempDiv.textContent || tempDiv.innerText || '';
          });
        } else if (Array.isArray(cvData.content[section])) {
          contentForPDF[section] = cvData.content[section] as string[];
        }
      }
      
      await generatePDFFromCV({
        sections: cvData.sections,
        content: { ...cvData.content, ...contentForPDF },
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  }, [cvData, bullets]);

  // Show upload screen if no CV data
  if (!cvData) {
    return (
      <div className="min-h-screen bg-[#F7F7FE]">
        <Header />
        <CVUploadSection
          onUploadComplete={handleUploadComplete}
          onAnalyze={handleAnalyze}
        />
        <Footer />
      </div>
    );
  }

  // Show two-panel workspace
  return (
    <div className="min-h-screen bg-[#F7F7FE]" style={{ fontFamily: 'Lato, sans-serif' }}>
      <Header />
      
      {/* Top Bar with Score and Download */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <ScoreDisplay score={cvScore} />
          <button
            onClick={handleDownloadPDF}
            className="bg-[#2782EA] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1e6bc7] transition-colors flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Updated CV
          </button>
        </div>
      </div>

      {/* Two-Panel Workspace */}
      <div className="flex h-[calc(100vh-200px)] max-w-7xl mx-auto px-8 py-6 gap-6">
        {/* Left Panel - Editing */}
        <div className="w-1/2 bg-white rounded-xl shadow-sm p-6 overflow-y-auto">
          <SectionTabs
            sections={cvData.sections}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={activeSection}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {(bullets[activeSection] || []).map((bullet, index) => (
                    <Draggable key={bullet.id} draggableId={bullet.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <BulletEditorCard
                            id={bullet.id}
                            content={bullet.content}
                            index={index}
                            onUpdate={handleBulletUpdate}
                            onDelete={handleBulletDelete}
                            onGenerateAI={handleGenerateAI}
                            section={activeSection}
                            isDragging={snapshot.isDragging}
                            dragHandleProps={provided.dragHandleProps}
                          />
                          {provided.placeholder}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <button
            onClick={handleAddBullet}
            className="w-full mt-4 border-2 border-dashed border-gray-300 rounded-lg py-4 text-gray-600 hover:border-[#2782EA] hover:text-[#2782EA] transition-colors font-semibold"
          >
            + Add More CV Points
          </button>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-1/2">
          <CVPreview cvData={cvData} updatedContent={updatedContent} />
        </div>
      </div>

      {/* AI Suggestion Drawer */}
      <AISuggestionDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        bulletText={currentBulletText}
        section={activeSection}
        onApplySuggestion={handleApplySuggestion}
      />

      <Footer />
    </div>
  );
}

