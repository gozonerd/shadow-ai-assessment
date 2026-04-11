import type { ShadowAIResult } from '$lib/types.js';

/**
 * Generates and triggers download of a Shadow AI Risk Brief PDF.
 * Full implementation added in Stage 07.
 */
export async function generateReport(_results: ShadowAIResult): Promise<void> {
	// Stage 07 implementation — this stub allows Stage 06 to type-check cleanly.
	// Dynamic jsPDF import will be added here: const { jsPDF } = await import('jspdf');
	return Promise.resolve();
}
