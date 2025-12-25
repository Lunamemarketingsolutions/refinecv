import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import { useDashboardData } from '../hooks/useDashboardData';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CVUploadSection from '../components/cv-enhancer/CVUploadSection';
import SectionTabs from '../components/cv-enhancer/SectionTabs';
import BulletEditorCard from '../components/cv-enhancer/BulletEditorCard';
import AISuggestionDrawer from '../components/cv-enhancer/AISuggestionDrawer';
import CVPreview from '../components/cv-enhancer/CVPreview';
import ScoreDisplay from '../components/cv-enhancer/ScoreDisplay';
import { parseCVFile, ParsedCV } from '../services/cvParserService';
import { generatePDFFromCV } from '../services/pdfGeneratorService';
import { extractTextFromFile } from '../utils/fileExtractor';
import { saveCVEnhancement, validateCVFile } from '../services/cvEnhancerService';
import { trackFeatureUsage } from '../services/usageTrackingService';
import { checkUsageLimit, getToolDisplayName } from '../services/usageLimitService';

interface BulletPoint {
  id: string;
  content: string;
}

export default function CVEnhancer() {
  const { user } = useAuth();
  const { data } = useDashboardData();
  const navigate = useNavigate();
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
  const [cvUploadId, setCvUploadId] = useState<string | null>(null);
  const [enhancementId, setEnhancementId] = useState<string | null>(null);

  const handleUploadComplete = useCallback((file: File) => {
    setUploadedFile(file);
  }, []);

  const handleAnalyze = useCallback(async (file: File) => {
    if (!user) {
      setError('Please log in to use this feature');
      return;
    }

    // Check usage limit for free plan users
    const limitCheck = await checkUsageLimit(user.id, 'cv_enhancer', 3);
    if (!limitCheck.allowed) {
      // Redirect to pricing page with message
      navigate('/pricing', { 
        state: { 
          message: limitCheck.reason || `You've reached the limit for ${getToolDisplayName('cv_enhancer')}. Upgrade to premium for unlimited access.`,
          toolName: getToolDisplayName('cv_enhancer')
        } 
      });
      return;
    }

    // Verify user session is valid
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('❌ Session error:', sessionError);
      setError('Session expired. Please log in again.');
      return;
    }

    console.log('✅ User authenticated:', {
      user_id: user.id,
      email: user.email,
      session_valid: !!session,
    });

    setIsAnalyzing(true);
    setError(null);
    setCvUploadId(null);
    setEnhancementId(null);

    try {
      // Step 1: Extract text from file
      const extractionResult = await extractTextFromFile(file);
      if (!extractionResult.success || !extractionResult.text) {
        throw new Error(extractionResult.error || 'Failed to extract text from file');
      }

      // Step 2: Upload file to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        // Continue anyway - we can still analyze without storage
      }

      // Step 3: Save to cv_uploads table
      let savedCvUploadId: string | null = null;
      try {
        // Verify current auth session
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !currentSession) {
          console.error('❌ No active session:', sessionError);
          setError('Session expired. Please log out and log back in.');
          setIsAnalyzing(false);
          return;
        }

        const authUserId = currentSession.user.id;
        console.log('Auth check:', {
          context_user_id: user.id,
          auth_uid: authUserId,
          match: user.id === authUserId,
          session_valid: !!currentSession,
        });

        if (user.id !== authUserId) {
          console.error('❌ User ID mismatch!');
          setError('Authentication mismatch. Please refresh the page.');
          setIsAnalyzing(false);
          return;
        }

        console.log('Attempting to save cv_uploads:', {
          user_id: user.id,
          auth_uid: authUserId,
          file_name: file.name,
          file_path: uploadData?.path || fileName,
          file_size: file.size,
          extracted_text_length: extractionResult.text.length,
        });

        const insertPayload = {
          user_id: authUserId, // Use auth.uid() value directly
          session_id: authUserId, // Legacy field for compatibility
          file_name: file.name,
          file_path: uploadData?.path || fileName,
          file_size: file.size,
          extracted_text: extractionResult.text,
        };

        console.log('Insert payload:', {
          ...insertPayload,
          extracted_text: `[${extractionResult.text.length} chars]`,
        });

        const { data: cvUpload, error: cvError } = await supabase
          .from('cv_uploads')
          .insert(insertPayload)
          .select()
          .single();

        if (cvError) {
          console.error('❌ CV upload save error:', cvError);
          console.error('Error details:', {
            message: cvError.message,
            details: cvError.details,
            hint: cvError.hint,
            code: cvError.code,
          });
          setError(`Failed to save CV: ${cvError.message}. Please check browser console for details.`);
          // Don't continue - this is critical
          setIsAnalyzing(false);
          return;
        } else if (cvUpload) {
          savedCvUploadId = cvUpload.id;
          setCvUploadId(savedCvUploadId);
          console.log('✅ CV upload saved successfully:', savedCvUploadId);
        } else {
          console.error('❌ CV upload returned no data');
          setError('Failed to save CV: No data returned. Please try again.');
          setIsAnalyzing(false);
          return;
        }
      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        setError(`Database error: ${dbError instanceof Error ? dbError.message : 'Unknown error'}. Please try again.`);
        setIsAnalyzing(false);
        return;
      }

      // Step 4: Parse CV
      const parsed = await parseCVFile(file);
      setCvData(parsed);
      
      // Step 5: Initialize bullets from parsed content (un-bulleted by default)
      const initialBullets: Record<string, BulletPoint[]> = {};
      for (const section of parsed.sections) {
        const sectionContent = parsed.content[section];
        if (Array.isArray(sectionContent)) {
          initialBullets[section] = sectionContent.map((bullet, idx) => {
            // Strip any existing list formatting to ensure clean paragraphs
            const cleaned = bullet.replace(/^<ul[^>]*>/i, '').replace(/<\/ul>$/i, '')
                                  .replace(/<li[^>]*>/gi, '').replace(/<\/li>/gi, '')
                                  .trim();
            return {
              id: `${section}-${idx}`,
              content: `<p>${cleaned}</p>`, // Wrap in <p> for Quill (un-bulleted)
            };
          });
        } else if (section === 'Personal Information') {
          // Personal info is handled separately in preview
          initialBullets[section] = [];
        } else {
          initialBullets[section] = [];
        }
      }
      
      setBullets(initialBullets);
      setActiveSection(parsed.sections[0] || '');
      
      // Step 6: Initialize updated content (un-bulleted by default)
      const initialUpdated: Record<string, string[]> = {};
      for (const section of parsed.sections) {
        const sectionContent = parsed.content[section];
        if (Array.isArray(sectionContent)) {
          // Wrap each bullet in <p> tags to ensure un-bulleted display
          // Strip any existing list formatting to ensure clean paragraphs
          initialUpdated[section] = sectionContent.map(bullet => {
            // Remove any existing list tags that might have been parsed
            const cleaned = bullet.replace(/^<ul[^>]*>/i, '').replace(/<\/ul>$/i, '')
                                  .replace(/<li[^>]*>/gi, '').replace(/<\/li>/gi, '')
                                  .trim();
            // Wrap in <p> tag (un-bulleted)
            return `<p>${cleaned}</p>`;
          });
        }
      }
      setUpdatedContent(initialUpdated);

      // Step 7: Save enhancement session to cv_enhancements
      if (savedCvUploadId) {
        try {
          console.log('Attempting to save cv_enhancements:', {
            user_id: user.id,
            cv_upload_id: savedCvUploadId,
            original_text_length: extractionResult.text.length,
            overall_score_before: cvScore,
          });

          const { data: enhancement, error: enhancementError } = await supabase
            .from('cv_enhancements')
            .insert({
              user_id: user.id,
              cv_upload_id: savedCvUploadId,
              original_text: extractionResult.text,
              overall_score_before: cvScore,
              overall_score_after: cvScore,
              status: 'editing',
            })
            .select()
            .single();

          if (enhancementError) {
            console.error('❌ Enhancement save error:', enhancementError);
            console.error('Error details:', {
              message: enhancementError.message,
              details: enhancementError.details,
              hint: enhancementError.hint,
              code: enhancementError.code,
            });
            // Non-critical - user can still use feature, but log the error
            console.warn('⚠️ Enhancement not saved, but continuing with analysis');
          } else if (enhancement) {
            setEnhancementId(enhancement.id);
            console.log('✅ Enhancement saved successfully:', enhancement.id);

            // Track feature usage (non-blocking)
            trackFeatureUsage(user.id, 'cv_enhancer', savedCvUploadId).catch((err) => {
              console.error('Failed to track CV enhancer usage:', err);
              // Don't throw - tracking failure shouldn't break the upload flow
            });

            // Save sections to cv_enhancement_sections
            let sectionsSaved = 0;
            for (const section of parsed.sections) {
              const sectionContent = parsed.content[section];
              if (Array.isArray(sectionContent) && sectionContent.length > 0) {
                const { error: sectionError } = await supabase
                  .from('cv_enhancement_sections')
                  .insert({
                    enhancement_id: enhancement.id,
                    section_name: section,
                    section_order: parsed.sections.indexOf(section),
                    rating_before: 3,
                    rating_after: 3,
                    total_bullets: sectionContent.length,
                    enhanced_bullets: 0,
                    is_complete: false,
                  });

                if (sectionError) {
                  console.error(`❌ Error saving section "${section}":`, sectionError);
                } else {
                  sectionsSaved++;
                  console.log(`✅ Section "${section}" saved`);
                }
              }
            }
            console.log(`✅ Saved ${sectionsSaved} sections to cv_enhancement_sections`);
          } else {
            console.error('❌ Enhancement returned no data');
          }
        } catch (enhancementErr) {
          console.error('❌ Enhancement creation exception:', enhancementErr);
          // Non-critical - user can still use the feature
        }
      } else {
        console.warn('⚠️ No cv_upload_id available, skipping enhancement save');
      }
    } catch (error) {
      console.error('Error parsing CV:', error);
      setError(error instanceof Error ? error.message : 'Failed to parse CV. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [user, cvScore]);

  const handleBulletUpdate = useCallback((id: string, content: string) => {
    setBullets(prev => {
      const updated = { ...prev };
      for (const section of Object.keys(updated)) {
        const index = updated[section].findIndex(b => b.id === id);
        if (index !== -1) {
          updated[section] = [...updated[section]];
          updated[section][index] = { ...updated[section][index], content };
          
          // Update preview content - PRESERVE HTML FORMATTING
          setUpdatedContent(prevContent => ({
            ...prevContent,
            [section]: updated[section].map(b => {
              // Preserve HTML formatting instead of stripping it
              return b.content || '';
            }),
          }));
          
          // Recalculate score
          calculateScore(updated);
          
          // Auto-save to database (debounced) if enhancement exists
          if (enhancementId && user) {
            setTimeout(async () => {
              try {
                const sections = Object.entries(updated).map(([sectionName, bullets]) => ({
                  name: sectionName,
                  bullets: bullets.map(b => ({ id: b.id, content: b.content })),
                }));

                await saveCVEnhancement({
                  enhancementId,
                  userId: user.id,
                  cvUploadId,
                  overallScore: cvScore,
                  sections,
                });
              } catch (error) {
                console.error('Error auto-saving enhancement:', error);
                // Silent fail - auto-save is background operation
              }
            }, 2000);
          }
          
          break;
        }
      }
      return updated;
    });
  }, [enhancementId, user, cvUploadId, cvScore]);

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
              // Preserve HTML formatting instead of stripping it
              return b.content || '';
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
    
    // Update preview - PRESERVE HTML FORMATTING
    setUpdatedContent(prevContent => ({
      ...prevContent,
      [activeSection]: bullets[activeSection].map(b => {
        // Preserve HTML formatting instead of stripping it
        return b.content || '';
      }),
    }));
  };

  const handleDownloadPDF = useCallback(async () => {
    if (!cvData) return;
    
    try {
      // Preserve HTML formatting for PDF generation
      const contentForPDF: Record<string, string[]> = {};
      for (const section of cvData.sections) {
        if (bullets[section]) {
          // Preserve HTML formatting instead of stripping it
          contentForPDF[section] = bullets[section].map(b => b.content || '');
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totalUsageToday = data.usageToday.atsAnalyzer.used + data.usageToday.jdMatch.used + data.usageToday.cvEnhancer.used;
  const totalLimit = data.usageToday.atsAnalyzer.limit + data.usageToday.jdMatch.limit + data.usageToday.cvEnhancer.limit;

  // Error display
  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar
          user={data.user}
          usageToday={data.user.plan === 'free' ? { total: totalUsageToday, limit: totalLimit } : undefined}
        />
        <main className="flex-1 ml-60 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading CV Enhancer</h2>
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
        </main>
      </div>
    );
  }

  // Show upload screen if no CV data
  if (!cvData) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar
          user={data.user}
          usageToday={data.user.plan === 'free' ? { total: totalUsageToday, limit: totalLimit } : undefined}
        />
        <main className="flex-1 ml-60">
          <Header />
          <CVUploadSection
            onUploadComplete={handleUploadComplete}
            onAnalyze={handleAnalyze}
          />
          <Footer />
        </main>
      </div>
    );
  }

  // Show two-panel workspace
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        user={data.user}
        usageToday={data.user.plan === 'free' ? { total: totalUsageToday, limit: totalLimit } : undefined}
      />
      <main className="flex-1 ml-60" style={{ fontFamily: 'Lato, sans-serif' }}>
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
      </main>
    </div>
  );
}

