/**
 * Unit tests for intent detection utility
 */

import { detectIntent, cleanQuestionText } from '../intentDetection';

describe('Intent Detection', () => {
  describe('detectIntent', () => {
    describe('explain-simple patterns', () => {
      it('should detect "explain like I\'m 5"', () => {
        expect(detectIntent("explain like I'm 5")).toBe('explain-simple');
        expect(detectIntent("Explain like I'm 5")).toBe('explain-simple');
        expect(detectIntent("EXPLAIN LIKE I'M 5")).toBe('explain-simple');
      });

      it('should detect "explain like I\'m 12"', () => {
        expect(detectIntent("explain like I'm 12")).toBe('explain-simple');
        expect(detectIntent("explain like im 12")).toBe('explain-simple');
      });

      it('should detect "explain like I\'m a donkey"', () => {
        expect(detectIntent("explain like I'm a donkey")).toBe('explain-simple');
        expect(detectIntent("explain like I'm a child")).toBe('explain-simple');
      });

      it('should detect "explain this simply"', () => {
        expect(detectIntent("explain this simply")).toBe('explain-simple');
        expect(detectIntent("Explain this simply")).toBe('explain-simple');
      });

      it('should detect "explain simply"', () => {
        expect(detectIntent("explain simply")).toBe('explain-simple');
      });

      it('should detect "ELI5"', () => {
        expect(detectIntent("ELI5")).toBe('explain-simple');
        expect(detectIntent("eli5")).toBe('explain-simple');
      });

      it('should detect "ELI12"', () => {
        expect(detectIntent("ELI12")).toBe('explain-simple');
        expect(detectIntent("eli10")).toBe('explain-simple');
      });
    });

    describe('summarize patterns', () => {
      it('should detect "summarize this"', () => {
        expect(detectIntent("summarize this")).toBe('summarize');
        expect(detectIntent("Summarize this")).toBe('summarize');
        expect(detectIntent("SUMMARIZE THIS")).toBe('summarize');
      });

      it('should detect "give me a summary"', () => {
        expect(detectIntent("give me a summary")).toBe('summarize');
        expect(detectIntent("give me a short summary")).toBe('summarize');
      });

      it('should detect "tldr"', () => {
        expect(detectIntent("tldr")).toBe('summarize');
        expect(detectIntent("tl;dr")).toBe('summarize');
        expect(detectIntent("TLDR")).toBe('summarize');
        expect(detectIntent("TL;DR")).toBe('summarize');
      });

      it('should detect "brief summary"', () => {
        expect(detectIntent("brief summary")).toBe('summarize');
      });

      it('should detect "quick summary"', () => {
        expect(detectIntent("quick summary")).toBe('summarize');
      });

      it('should detect "sum it up"', () => {
        expect(detectIntent("sum it up")).toBe('summarize');
      });
    });

    describe('no intent detected', () => {
      it('should return null for regular questions', () => {
        expect(detectIntent("What is photosynthesis?")).toBeNull();
        expect(detectIntent("How does gravity work?")).toBeNull();
        expect(detectIntent("Tell me about quantum physics")).toBeNull();
      });

      it('should return null for empty or invalid input', () => {
        expect(detectIntent("")).toBeNull();
        expect(detectIntent("   ")).toBeNull();
        expect(detectIntent(null as any)).toBeNull();
        expect(detectIntent(undefined as any)).toBeNull();
      });
    });

    describe('intent in context', () => {
      it('should detect intent when embedded in longer text', () => {
        expect(detectIntent("explain like I'm 5: What is gravity?")).toBe('explain-simple');
        expect(detectIntent("tldr: What happened in World War 2?")).toBe('summarize');
        expect(detectIntent("Can you summarize this topic for me?")).toBe('summarize');
      });
    });
  });

  describe('cleanQuestionText', () => {
    describe('explain-simple cleaning', () => {
      it('should remove "explain like I\'m X" phrases', () => {
        expect(cleanQuestionText("explain like I'm 5: What is gravity?", 'explain-simple'))
          .toBe("What is gravity?");
        expect(cleanQuestionText("explain like I'm 12 What is gravity?", 'explain-simple'))
          .toBe("What is gravity?");
      });

      it('should remove "explain like I\'m a X" phrases', () => {
        expect(cleanQuestionText("explain like I'm a donkey: What is gravity?", 'explain-simple'))
          .toBe("What is gravity?");
      });

      it('should remove "explain this simply" phrases', () => {
        expect(cleanQuestionText("explain this simply: What is gravity?", 'explain-simple'))
          .toBe("What is gravity?");
      });

      it('should remove "ELI5" phrases', () => {
        expect(cleanQuestionText("ELI5: What is gravity?", 'explain-simple'))
          .toBe("What is gravity?");
        expect(cleanQuestionText("eli12 What is gravity?", 'explain-simple'))
          .toBe("What is gravity?");
      });
    });

    describe('summarize cleaning', () => {
      it('should remove "summarize this" phrases', () => {
        expect(cleanQuestionText("summarize this: World War 2", 'summarize'))
          .toBe("World War 2");
      });

      it('should remove "give me a summary" phrases', () => {
        expect(cleanQuestionText("give me a summary: World War 2", 'summarize'))
          .toBe("World War 2");
        expect(cleanQuestionText("give me a short summary of World War 2", 'summarize'))
          .toBe("of World War 2");
      });

      it('should remove "tldr" phrases', () => {
        expect(cleanQuestionText("tldr: World War 2", 'summarize'))
          .toBe("World War 2");
        expect(cleanQuestionText("tl;dr World War 2", 'summarize'))
          .toBe("World War 2");
      });

      it('should remove "sum it up" phrases', () => {
        expect(cleanQuestionText("sum it up: World War 2", 'summarize'))
          .toBe("World War 2");
      });
    });

    describe('no cleaning when no intent', () => {
      it('should return original text when intent is null', () => {
        const text = "What is photosynthesis?";
        expect(cleanQuestionText(text, null)).toBe(text);
      });

      it('should return original text when no patterns match', () => {
        const text = "What is photosynthesis?";
        expect(cleanQuestionText(text, 'explain-simple')).toBe(text);
      });
    });
  });
});
