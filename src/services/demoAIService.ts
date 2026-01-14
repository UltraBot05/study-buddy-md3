import type { AIService, OptionalFeatureType } from '../types'

/**
 * Demo AI Service for demonstration and manual testing purposes
 * Returns realistic fake responses without requiring a real AI backend
 * Implements the same AIService interface for easy swapping
 */

// Realistic demo response templates
const DEMO_RESPONSES = {
  'explain-simple': (question: string) => {
    const responses = [
      `Let me explain "${question}" in simple terms!\n\nThink of it like this: imagine you're explaining it to a friend who's never heard of it before. The main idea is pretty straightforward once you break it down.\n\nThe key points are:\n• It's based on a simple concept that builds on things you already know\n• You can see it in everyday life if you look for it\n• Once you understand the basics, everything else makes sense\n\nDoes that help clarify things?`,
      
      `Great question about "${question}"! Let me break this down simply.\n\nImagine you're learning to ride a bike. At first, it seems complicated, but really it's just a few basic steps working together. This topic is similar!\n\nHere's what you need to know:\n1. Start with the foundation - the basic idea\n2. Build on that with examples you can relate to\n3. Practice applying it to different situations\n\nThe more you work with it, the easier it becomes!`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  },
  
  'summarize': (question: string) => {
    const responses = [
      `**Summary: ${question}**\n\n**Key Points:**\n• Core concept: The fundamental principle underlying this topic\n• Main applications: How it's used in practice\n• Important considerations: What to keep in mind\n• Related concepts: How it connects to other ideas\n\n**Bottom Line:** This topic is essential for understanding the broader subject area and has practical applications in various contexts.`,
      
      `**Quick Summary of "${question}"**\n\n**Overview:** This is a foundational concept that appears frequently in academic and practical contexts.\n\n**Essential Facts:**\n- Definition and basic principles\n- Common use cases and examples\n- Why it matters for your studies\n- How it relates to other topics\n\n**Takeaway:** Understanding this will help you grasp more advanced concepts later.`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  },
  
  'generate-quiz': (question: string) => {
    return `**Quiz Questions: ${question}**\n\n**Question 1:** What is the primary definition or main concept?\n\n**Question 2:** Can you provide a real-world example of how this is applied?\n\n**Question 3:** What are the key characteristics or properties that define this?\n\n**Question 4:** How does this concept relate to or differ from similar ideas?\n\n**Question 5:** What would happen if you applied this concept incorrectly? What are common mistakes?\n\n*Tip: Try answering these without looking at your notes first, then check your answers!*`
  },
  
  'default': (question: string) => {
    const responses = [
      `Great question about "${question}"! Let me provide a comprehensive explanation.\n\n**Understanding the Concept:**\nThis topic involves several interconnected ideas that work together. At its core, it's about understanding how different elements interact and influence each other.\n\n**Key Components:**\n1. **Foundation:** The basic principles that everything else builds upon\n2. **Application:** How these principles are used in practice\n3. **Implications:** What this means for related areas of study\n\n**Practical Examples:**\nYou can see this concept in action in many everyday situations. For instance, when you encounter similar scenarios, you'll notice the same patterns emerging.\n\n**Why It Matters:**\nUnderstanding this helps you develop a deeper comprehension of the subject as a whole. It's a building block for more advanced topics you'll encounter later.\n\n**Study Tips:**\n- Review the main concepts regularly\n- Try to explain it in your own words\n- Look for examples in your daily life\n- Connect it to what you already know\n\nFeel free to ask follow-up questions if you need clarification on any part!`,
      
      `Excellent question about "${question}"! I'll break this down for you.\n\n**Core Explanation:**\nThis concept is fundamental to understanding the broader subject area. Think of it as one of the essential building blocks that supports more complex ideas.\n\n**What You Need to Know:**\n\n*The Basics:*\nAt its simplest level, this involves understanding the relationship between different factors and how they influence outcomes. It's not as complicated as it might seem at first!\n\n*How It Works:*\nThe process follows a logical sequence. Each step builds on the previous one, creating a coherent framework that you can apply to various situations.\n\n*Real-World Context:*\nYou encounter this principle more often than you might realize. From everyday decisions to complex problem-solving, these concepts are at work.\n\n**Common Misconceptions:**\nMany students initially think this is more complex than it actually is. Once you grasp the fundamental pattern, everything else falls into place naturally.\n\n**Moving Forward:**\nAs you continue studying, you'll see how this concept connects to other topics. Keep these core principles in mind, and you'll find that more advanced material becomes much more accessible.\n\nWould you like me to elaborate on any specific aspect?`,
      
      `Thanks for asking about "${question}"! This is an important topic worth understanding well.\n\n**Overview:**\nThis subject area encompasses several related concepts that together form a comprehensive understanding of the topic. Let's explore each component.\n\n**Main Ideas:**\n\n1. **Primary Concept**\n   The foundation of this topic rests on a central principle that guides everything else. Understanding this core idea is crucial for grasping the details.\n\n2. **Supporting Elements**\n   Several factors contribute to how this works in practice. Each plays a specific role in the overall framework.\n\n3. **Practical Applications**\n   You'll find this concept useful in various contexts, from theoretical understanding to practical problem-solving.\n\n**Learning Strategy:**\n- Start with the big picture before diving into details\n- Use analogies to connect new information to what you already know\n- Practice applying the concept to different scenarios\n- Review regularly to reinforce your understanding\n\n**Additional Context:**\nThis topic often appears in conjunction with related subjects. Understanding the connections between different areas will deepen your overall comprehension.\n\n**Remember:** Learning is a process. Don't worry if it doesn't all click immediately. With practice and review, these concepts will become second nature.\n\nLet me know if you'd like me to focus on any particular aspect!`,
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }
}

export class DemoAIService implements AIService {
  async generateResponse(question: string, mode?: OptionalFeatureType): Promise<string> {
    // Simulate realistic processing delay (500-1500ms)
    const delay = 500 + Math.random() * 1000
    await new Promise(resolve => setTimeout(resolve, delay))
    
    // Get appropriate response template based on mode
    const template = mode ? DEMO_RESPONSES[mode] : DEMO_RESPONSES.default
    return template(question)
  }
}

// Export a singleton instance
export const demoAIService = new DemoAIService()
