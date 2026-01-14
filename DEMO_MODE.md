# Demo Mode Documentation

## Overview
Demo Mode allows the AI Study Assistant to show realistic AI responses without requiring a real AI backend. This is useful for:
- Manual testing and verification
- Demonstrations and presentations
- UI/UX development and testing
- Showcasing the full user flow

## How It Works

### Architecture
The demo mode uses a simple service swap pattern:
- **DemoAIService**: Provides realistic fake responses
- **KiroAIService**: Real AI service (requires backend)
- **Toggle**: Simple boolean flag in `src/services/aiService.ts`

### Implementation Details

**File: `src/services/demoAIService.ts`**
- Implements the same `AIService` interface
- Returns realistic, varied responses based on question and mode
- Simulates realistic processing delays (500-1500ms)
- Supports all optional modes:
  - Normal explanations
  - Explain Simply
  - Summarize
  - Generate Quiz

**File: `src/services/aiService.ts`**
- Contains `DEMO_MODE` constant (line 4)
- Exports `isDemoMode` for UI indicator
- Swaps between demo and real service based on flag

**File: `src/components/Header.tsx`**
- Shows "Demo Mode" badge when active
- Badge is subtle and non-intrusive
- Includes tooltip explaining demo mode

## Enabling/Disabling Demo Mode

### To Enable Demo Mode (Default)
In `src/services/aiService.ts`, line 4:
```typescript
const DEMO_MODE = true
```

### To Disable Demo Mode
In `src/services/aiService.ts`, line 4:
```typescript
const DEMO_MODE = false
```

**Note:** When disabled, the app will attempt to use the real AI service and will show errors if no backend is available.

## Demo Response Behavior

### Response Characteristics
- **Realistic Content**: Responses mimic actual study assistant explanations
- **Varied Responses**: Multiple templates per mode for variety
- **Processing Delay**: 500-1500ms to simulate real AI processing
- **Mode Support**: Respects all optional feature modes

### Response Types

**Normal Mode:**
- Comprehensive explanations
- Multiple paragraphs with structure
- Study tips and examples
- Encourages follow-up questions

**Explain Simply Mode:**
- Simplified language
- Analogies and everyday examples
- Shorter, more digestible content
- Friendly, encouraging tone

**Summarize Mode:**
- Bullet-point format
- Key points highlighted
- Concise overview
- Bottom-line takeaway

**Generate Quiz Mode:**
- 5 quiz questions
- Covers different aspects
- Includes study tips
- Formatted for easy reading

## UI Indicator

### Demo Badge
- **Location**: Top-right corner of header (desktop), below title (mobile)
- **Style**: Material Design 3 Assist Chip
- **Color**: Tertiary container (purple/pink tint)
- **Interaction**: Hover shows tooltip
- **Tooltip**: "Demo mode is active - responses are simulated"

### Responsive Behavior
- **Desktop**: Positioned absolutely in top-right
- **Tablet/Mobile**: Positioned below title, centered
- **Always visible**: When demo mode is active

## Testing

### All Tests Pass
- ✅ 82 tests passing
- ✅ No test modifications needed
- ✅ Demo mode doesn't affect test behavior
- ✅ Tests use MockAIService, not DemoAIService

### Manual Testing
1. Enable demo mode
2. Run `npm run dev`
3. Submit questions with different modes
4. Verify realistic responses appear
5. Check demo badge is visible

## Future AI Integration

### Switching to Real AI
When ready to integrate a real AI provider:

1. **Update `src/services/aiService.ts`:**
   ```typescript
   const DEMO_MODE = false
   ```

2. **Implement real AI in `KiroAIService.makeRequest()`:**
   - Replace fetch endpoint
   - Add API key handling
   - Update error handling as needed

3. **No other changes needed:**
   - UI remains the same
   - Component logic unchanged
   - Tests continue to work

### Benefits of This Approach
- ✅ Clean separation of concerns
- ✅ Easy to toggle between demo and real
- ✅ No code duplication
- ✅ Interface-based design
- ✅ Future-proof architecture

## Technical Details

### Service Interface
Both services implement `AIService`:
```typescript
interface AIService {
  generateResponse(question: string, mode?: OptionalFeatureType): Promise<string>;
}
```

### No Breaking Changes
- All existing code works unchanged
- Tests remain valid
- Component props unchanged
- Type safety maintained

### Performance
- Demo responses: 500-1500ms delay
- Real AI: Depends on backend
- No performance impact when disabled

## Troubleshooting

### Demo Badge Not Showing
- Check `DEMO_MODE` is `true` in `src/services/aiService.ts`
- Rebuild: `npm run build`
- Clear browser cache

### Responses Still Show Errors
- Verify `DEMO_MODE = true`
- Check console for import errors
- Ensure `demoAIService.ts` exists

### Tests Failing
- Tests should not be affected by demo mode
- Tests use MockAIService directly
- Check for unrelated code changes

## Summary

Demo Mode provides a zero-cost, zero-dependency way to demonstrate the full AI Study Assistant experience without requiring a real AI backend. It's perfect for development, testing, and demonstrations while keeping the architecture clean and ready for future AI integration.
