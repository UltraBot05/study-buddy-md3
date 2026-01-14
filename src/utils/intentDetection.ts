import type { OptionalFeatureType } from '../types';

/**
 * Intent detection utility for identifying optional feature modes from user input
 * Uses simple string matching without external libraries
 */

// Patterns for explain-simple intent
const EXPLAIN_SIMPLE_PATTERNS = [
  /explain\s+like\s+i'?m\s+\d+/i,           // "explain like I'm 5", "explain like I'm 12"
  /explain\s+like\s+i'?m\s+a\s+\w+/i,       // "explain like I'm a donkey"
  /explain\s+this\s+simply/i,                // "explain this simply"
  /explain\s+simply/i,                       // "explain simply"
  /simple\s+explanation/i,                   // "simple explanation"
  /eli5/i,                                   // "ELI5"
  /eli\d+/i,                                 // "ELI12"
];

// Patterns for summarize intent
const SUMMARIZE_PATTERNS = [
  /summarize\s+this/i,                       // "summarize this"
  /give\s+me\s+a\s+(short\s+)?summary/i,    // "give me a summary", "give me a short summary"
  /tl;?dr/i,                                 // "tldr", "tl;dr"
  /brief\s+summary/i,                        // "brief summary"
  /quick\s+summary/i,                        // "quick summary"
  /sum\s+it\s+up/i,                          // "sum it up"
];

/**
 * Detects the intent from user input text
 * @param text - The user's input text
 * @returns The detected OptionalFeatureType or null if no intent detected
 */
export function detectIntent(text: string): OptionalFeatureType | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const trimmedText = text.trim();
  
  // Check for explain-simple patterns
  for (const pattern of EXPLAIN_SIMPLE_PATTERNS) {
    if (pattern.test(trimmedText)) {
      return 'explain-simple';
    }
  }
  
  // Check for summarize patterns
  for (const pattern of SUMMARIZE_PATTERNS) {
    if (pattern.test(trimmedText)) {
      return 'summarize';
    }
  }
  
  return null;
}

/**
 * Removes intent phrases from the question text
 * @param text - The user's input text
 * @param detectedIntent - The detected intent type
 * @returns The cleaned question text
 */
export function cleanQuestionText(text: string, detectedIntent: OptionalFeatureType | null): string {
  if (!detectedIntent || !text) {
    return text;
  }

  let cleaned = text.trim();

  // Remove explain-simple phrases
  if (detectedIntent === 'explain-simple') {
    cleaned = cleaned
      .replace(/explain\s+like\s+i'?m\s+\d+[,:]?\s*/gi, '')
      .replace(/explain\s+like\s+i'?m\s+a\s+\w+[,:]?\s*/gi, '')
      .replace(/explain\s+this\s+simply[,:]?\s*/gi, '')
      .replace(/explain\s+simply[,:]?\s*/gi, '')
      .replace(/simple\s+explanation[,:]?\s*/gi, '')
      .replace(/eli5[,:]?\s*/gi, '')
      .replace(/eli\d+[,:]?\s*/gi, '');
  }

  // Remove summarize phrases
  if (detectedIntent === 'summarize') {
    cleaned = cleaned
      .replace(/summarize\s+this[,:]?\s*/gi, '')
      .replace(/give\s+me\s+a\s+(short\s+)?summary[,:]?\s*/gi, '')
      .replace(/tl;?dr[,:]?\s*/gi, '')
      .replace(/brief\s+summary[,:]?\s*/gi, '')
      .replace(/quick\s+summary[,:]?\s*/gi, '')
      .replace(/sum\s+it\s+up[,:]?\s*/gi, '');
  }

  return cleaned.trim();
}
