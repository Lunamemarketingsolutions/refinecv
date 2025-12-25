import { supabase } from '../lib/supabase';

// This file was renamed from cvImproviserService.ts to cvEnhancerService.ts

export interface SaveEnhancementParams {
  enhancementId: string;
  userId: string;
  cvUploadId: string | null;
  overallScore: number;
  sections: Array<{
    name: string;
    bullets: Array<{
      id: string;
      content: string;
    }>;
  }>;
}

/**
 * Save or update CV enhancement session
 */
export async function saveCVEnhancement(params: SaveEnhancementParams): Promise<void> {
  const { enhancementId, userId, cvUploadId, overallScore, sections } = params;

  try {
    // Update enhancement record
    const { error: updateError } = await supabase
      .from('cv_enhancements')
      .update({
        overall_score_after: overallScore,
        status: 'editing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', enhancementId)
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating enhancement:', updateError);
      throw new Error(`Failed to save enhancement: ${updateError.message}`);
    }

    // Update sections and bullets
    for (const section of sections) {
      const sectionBullets = section.bullets || [];
      
      // Find or create section
      const { data: existingSection } = await supabase
        .from('cv_enhancement_sections')
        .select('id')
        .eq('enhancement_id', enhancementId)
        .eq('section_name', section.name)
        .maybeSingle();

      let sectionId: string;
      
      if (existingSection) {
        sectionId = existingSection.id;
        // Update section
        await supabase
          .from('cv_enhancement_sections')
          .update({
            total_bullets: sectionBullets.length,
            enhanced_bullets: sectionBullets.filter(b => b.content.includes('<strong>') || b.content.includes('<em>')).length,
            updated_at: new Date().toISOString(),
          })
          .eq('id', sectionId);
      } else {
        // Create new section
        const { data: newSection, error: sectionError } = await supabase
          .from('cv_enhancement_sections')
          .insert({
            enhancement_id: enhancementId,
            section_name: section.name,
            section_order: sections.indexOf(section),
            rating_before: 3,
            rating_after: 3,
            total_bullets: sectionBullets.length,
            enhanced_bullets: 0,
            is_complete: false,
          })
          .select()
          .single();

        if (sectionError || !newSection) {
          console.error('Error creating section:', sectionError);
          continue; // Skip this section
        }
        
        sectionId = newSection.id;
      }

      // Update bullets
      for (let i = 0; i < sectionBullets.length; i++) {
        const bullet = sectionBullets[i];
        
        // Extract plain text from HTML for original_text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = bullet.content;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        // Find or create bullet
        const { data: existingBullet } = await supabase
          .from('cv_bullets')
          .select('id')
          .eq('section_id', sectionId)
          .eq('bullet_order', i)
          .maybeSingle();

        if (existingBullet) {
          // Update existing bullet
          await supabase
            .from('cv_bullets')
            .update({
              current_text: bullet.content,
              is_enhanced: bullet.content !== plainText,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingBullet.id);
        } else {
          // Create new bullet
          await supabase
            .from('cv_bullets')
            .insert({
              section_id: sectionId,
              original_text: plainText,
              current_text: bullet.content,
              bullet_order: i,
              rating_before: 3,
              is_enhanced: false,
            });
        }
      }
    }

    // Update cv_uploads with latest extracted text if available
    if (cvUploadId) {
      const allText = sections
        .flatMap(s => s.bullets.map(b => {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = b.content;
          return tempDiv.textContent || tempDiv.innerText || '';
        }))
        .join('\n');

      await supabase
        .from('cv_uploads')
        .update({
          extracted_text: allText,
        })
        .eq('id', cvUploadId)
        .eq('user_id', userId);
    }
  } catch (error) {
    console.error('Error saving CV enhancement:', error);
    throw error;
  }
}

/**
 * Validate file before upload
 */
export function validateCVFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 10MB' };
  }

  // Check file type
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  ];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF and DOCX files are supported' };
  }

  return { valid: true };
}

