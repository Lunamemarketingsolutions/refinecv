import type { ATSSuggestion, ATSAnalysis, PDFEdit } from '../../types/ats';
import { supabase } from '../../lib/supabase';
import { updateSuggestionStatus } from './aiSuggestionService';
import { generateEditedPDFFromURL, createPDFFile } from './pdfEditService';
import { uploadResumeToStorage } from './storageService';
import { analyzePDFForATS } from './pdfProcessor';

interface EditApplicationResult {
  success: boolean;
  newFileUrl?: string;
  newAnalysis?: ATSAnalysis;
  error?: string;
}

export async function applySuggestionEdit(
  suggestion: ATSSuggestion,
  currentPDFUrl: string,
  cvUploadId: string,
  userId: string
): Promise<EditApplicationResult> {
  try {
    // Check if this is an image-based resume suggestion (entire resume needs recreation)
    const isImageBasedResume = suggestion.sectionKey === 'resume_content' &&
                                suggestion.suggestionReason.includes('image-based');

    if (isImageBasedResume) {
      // For image-based resumes, we can't automatically fix them
      // Just mark the suggestion as accepted so it doesn't keep appearing
      await updateSuggestionStatus(suggestion.id, userId, 'accepted');

      return {
        success: true,
        newFileUrl: currentPDFUrl,
        newAnalysis: undefined,
        error: undefined
      };
    }

    const editedPDFBytes = await generateEditedPDFFromURL(currentPDFUrl, [suggestion]);

    const timestamp = new Date().getTime();
    const filename = `resume_edited_${timestamp}.pdf`;
    const editedPDFFile = createPDFFile(editedPDFBytes, filename);

    const uploadResult = await uploadResumeToStorage(editedPDFFile, userId, filename);

    if (!uploadResult.publicUrl) {
      throw new Error('Failed to upload edited PDF');
    }

    const newAnalysis = await analyzePDFForATS(editedPDFFile);

    // Update cv_uploads with new file
    await supabase
      .from('cv_uploads')
      .update({
        file_path: uploadResult.path,
        file_name: filename,
        file_size: editedPDFFile.size,
        extracted_text: newAnalysis.extractedText,
      })
      .eq('id', cvUploadId)
      .eq('user_id', userId);

    await updateSuggestionStatus(suggestion.id, userId, 'accepted');

    const editRecord: Omit<PDFEdit, 'id' | 'createdAt'> = {
      cvUploadId,
      suggestionId: suggestion.id,
      editType: 'suggestion_applied',
      sectionAffected: suggestion.sectionName,
      changesMade: {
        originalContent: suggestion.originalContent,
        newContent: suggestion.suggestedContent,
        reason: suggestion.suggestionReason
      }
    };

    await supabase
      .from('resume_edits')
      .insert({
        cv_upload_id: editRecord.cvUploadId,
        user_id: userId,
        suggestion_id: editRecord.suggestionId,
        edit_type: editRecord.editType,
        section_affected: editRecord.sectionAffected,
        changes_made: editRecord.changesMade
      });

    return {
      success: true,
      newFileUrl: uploadResult.publicUrl,
      newAnalysis
    };
  } catch (error) {
    console.error('Error applying suggestion edit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function applyMultipleSuggestionEdits(
  suggestions: ATSSuggestion[],
  currentPDFUrl: string,
  cvUploadId: string,
  userId: string
): Promise<EditApplicationResult> {
  try {
    const editedPDFBytes = await generateEditedPDFFromURL(currentPDFUrl, suggestions);

    const timestamp = new Date().getTime();
    const filename = `resume_edited_${timestamp}.pdf`;
    const editedPDFFile = createPDFFile(editedPDFBytes, filename);

    const uploadResult = await uploadResumeToStorage(editedPDFFile, userId, filename);

    if (!uploadResult.publicUrl) {
      throw new Error('Failed to upload edited PDF');
    }

    const newAnalysis = await analyzePDFForATS(editedPDFFile);

    // Update cv_uploads with new file
    await supabase
      .from('cv_uploads')
      .update({
        file_path: uploadResult.path,
        file_name: filename,
        file_size: editedPDFFile.size,
        extracted_text: newAnalysis.extractedText,
      })
      .eq('id', cvUploadId)
      .eq('user_id', userId);

    for (const suggestion of suggestions) {
      await updateSuggestionStatus(suggestion.id, userId, 'accepted');

      await supabase
        .from('resume_edits')
        .insert({
          cv_upload_id: cvUploadId,
          user_id: userId,
          suggestion_id: suggestion.id,
          edit_type: 'suggestion_applied',
          section_affected: suggestion.sectionName,
          changes_made: {
            originalContent: suggestion.originalContent,
            newContent: suggestion.suggestedContent,
            reason: suggestion.suggestionReason
          }
        });
    }

    return {
      success: true,
      newFileUrl: uploadResult.publicUrl,
      newAnalysis
    };
  } catch (error) {
    console.error('Error applying multiple suggestion edits:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getEditHistory(cvUploadId: string, userId: string): Promise<PDFEdit[]> {
  const { data, error } = await supabase
    .from('resume_edits')
    .select('*')
    .eq('cv_upload_id', cvUploadId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching edit history:', error);
    return [];
  }

  return data.map(row => ({
    id: row.id,
    cvUploadId: row.cv_upload_id,
    suggestionId: row.suggestion_id,
    editType: row.edit_type,
    sectionAffected: row.section_affected,
    changesMade: row.changes_made,
    createdAt: row.created_at
  }));
}
