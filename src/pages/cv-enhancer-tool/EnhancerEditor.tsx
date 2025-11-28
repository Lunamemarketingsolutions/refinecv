import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SectionProgressBar from '../../components/cv-enhancer-tool/SectionProgressBar';
import BulletEditor from '../../components/cv-enhancer-tool/BulletEditor';
import CVPreview from '../../components/cv-enhancer-tool/CVPreview';

interface Section {
  id: string;
  section_name: string;
  rating_after: number;
  total_bullets: number;
  enhanced_bullets: number;
  is_complete: boolean;
}

interface Bullet {
  id: string;
  section_id: string;
  original_text: string;
  current_text: string;
  rating_before: number;
  rating_after: number | null;
  issues: string[];
  suggestions: any[];
  is_enhanced: boolean;
}

export default function EnhancerEditor() {
  const { enhancementId } = useParams<{ enhancementId: string }>();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [overallScore, setOverallScore] = useState(72);
  const [loading, setLoading] = useState(true);
  const [isSample, setIsSample] = useState(false);

  useEffect(() => {
    loadData();
  }, [enhancementId]);

  useEffect(() => {
    if (sections.length > 0) {
      loadBullets(sections[currentSectionIndex].id);
    }
  }, [currentSectionIndex, sections]);

  const loadData = async () => {
    try {
      const { data: sectionsData } = await supabase
        .from('cv_enhancement_sections')
        .select('*')
        .eq('enhancement_id', enhancementId)
        .order('section_order');

      setSections(sectionsData || []);

      const { data: enhancementData } = await supabase
        .from('cv_enhancements')
        .select('overall_score_after, is_sample')
        .eq('id', enhancementId)
        .maybeSingle();

      if (enhancementData) {
        setOverallScore(enhancementData.overall_score_after);
        setIsSample(enhancementData.is_sample || false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBullets = async (sectionId: string) => {
    try {
      const { data } = await supabase
        .from('cv_bullets')
        .select('*')
        .eq('section_id', sectionId)
        .order('bullet_order');

      setBullets((data || []).map(b => ({
        ...b,
        issues: typeof b.issues === 'string' ? JSON.parse(b.issues) : b.issues,
        suggestions: typeof b.suggestions === 'string' ? JSON.parse(b.suggestions) : b.suggestions
      })));
    } catch (error) {
      console.error('Error loading bullets:', error);
    }
  };

  const handleBulletUpdate = async (bulletId: string, updates: Partial<Bullet>) => {
    try {
      await supabase.from('cv_bullets').update(updates).eq('id', bulletId);
      setBullets(prev => prev.map(b => (b.id === bulletId ? { ...b, ...updates } : b)));

      if (updates.is_enhanced) {
        const currentSection = sections[currentSectionIndex];
        const enhancedCount = bullets.filter(b => b.is_enhanced || b.id === bulletId).length;
        const newRating = Math.min(5, Math.ceil(3 + (enhancedCount / bullets.length) * 2));

        await supabase.from('cv_enhancement_sections').update({
          enhanced_bullets: enhancedCount,
          rating_after: newRating,
          is_complete: enhancedCount === bullets.length
        }).eq('id', currentSection.id);

        setSections(prev => prev.map((s, idx) =>
          idx === currentSectionIndex
            ? { ...s, enhanced_bullets: enhancedCount, rating_after: newRating }
            : s
        ));

        const newScore = Math.min(95, overallScore + 1);
        setOverallScore(newScore);

        await supabase.from('cv_enhancements').update({ overall_score_after: newScore }).eq('id', enhancementId);
      }
    } catch (error) {
      console.error('Error updating bullet:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {isSample && (
        <div className="bg-blue-50 border-b-2 border-blue-200 px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-blue-900 font-semibold text-base">
                  Sample Results - Demo Mode
                </p>
                <p className="text-blue-700 text-sm">
                  This is a demo using sample data. Upload your own CV to get personalized enhancements.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/cv-enhancer')}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors whitespace-nowrap"
            >
              Enhance My CV →
            </button>
          </div>
        </div>
      )}

      <SectionProgressBar
        sections={sections}
        currentSectionIndex={currentSectionIndex}
        overallScore={overallScore}
        onSectionChange={setCurrentSectionIndex}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 bg-white overflow-y-auto border-r border-gray-200">
          <div className="p-8">
            {sections[currentSectionIndex] && (
              <>
                <select
                  value={currentSectionIndex}
                  onChange={(e) => setCurrentSectionIndex(Number(e.target.value))}
                  className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg text-lg font-semibold focus:border-purple-600 focus:outline-none"
                >
                  {sections.map((section, idx) => (
                    <option key={section.id} value={idx}>
                      {section.section_name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg">
                    {'⭐'.repeat(sections[currentSectionIndex].rating_after)}
                    {'☆'.repeat(5 - sections[currentSectionIndex].rating_after)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {sections[currentSectionIndex].enhanced_bullets}/{sections[currentSectionIndex].total_bullets} enhanced
                  </span>
                </div>
              </>
            )}

            <div className="space-y-6">
              {bullets.map((bullet) => (
                <BulletEditor
                  key={bullet.id}
                  bullet={bullet}
                  onUpdate={(updates) => handleBulletUpdate(bullet.id, updates)}
                />
              ))}
            </div>
          </div>
        </div>

        <CVPreview sections={sections} bullets={bullets} />
      </div>
    </div>
  );
}
