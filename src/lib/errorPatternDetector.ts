// Real-time error monitoring and pattern detection

interface ErrorPattern {
  id: string;
  pattern: string;
  frequency: number;
  lastSeen: Date;
  category: string;
  commonCauses: string[];
  preventionTips: string[];
}

interface ErrorHistory {
  timestamp: Date;
  errorText: string;
  category: string;
  resolved: boolean;
  timeTaken?: number;
}

interface PredictedError {
  type: string;
  probability: number;
  description: string;
  prevention: string;
}

export class ErrorPatternDetector {
  private patterns: Map<string, ErrorPattern> = new Map();
  private userHistory: ErrorHistory[] = [];

  // Detect common error patterns
  detectPattern(errorText: string): ErrorPattern | null {
    const normalizedError = this.normalizeError(errorText);
    
    for (const [patternId, pattern] of this.patterns) {
      if (this.matchesPattern(normalizedError, pattern.pattern)) {
        pattern.frequency++;
        pattern.lastSeen = new Date();
        return pattern;
      }
    }

    return null;
  }

  // Learn from user's error history
  learnFromHistory(errorText: string, category: string, resolved: boolean = false) {
    this.userHistory.push({
      timestamp: new Date(),
      errorText,
      category,
      resolved
    });

    // Update patterns based on user behavior
    this.updatePatterns();
  }

  // Get personalized suggestions based on user's common errors
  getPersonalizedSuggestions(errorText: string): string[] {
    const userFrequentErrors = this.getUserFrequentErrors();
    const currentCategory = this.categorizeError(errorText);
    
    return userFrequentErrors
      .filter(error => error.category === currentCategory)
      .map(error => `You've encountered similar ${error.category} errors ${error.count} times. Consider: ${error.suggestion}`)
      .slice(0, 3);
  }

  // Predict potential future errors
  predictPotentialErrors(codeContext?: string): PredictedError[] {
    const predictions: PredictedError[] = [];
    const userPatterns = this.analyzeUserPatterns();

    // Based on common mistakes in user's history
    userPatterns.forEach(pattern => {
      if (pattern.frequency > 3 && !pattern.recentlyResolved) {
        predictions.push({
          type: pattern.category,
          probability: Math.min(pattern.frequency * 0.2, 0.9),
          description: `You often encounter ${pattern.category} errors`,
          prevention: pattern.preventionTip
        });
      }
    });

    return predictions.sort((a, b) => b.probability - a.probability);
  }

  private normalizeError(errorText: string): string {
    return errorText
      .toLowerCase()
      .replace(/line \d+/g, 'line X')
      .replace(/column \d+/g, 'column X')
      .replace(/\d+/g, 'N')
      .replace(/["'].*?["']/g, 'STRING');
  }

  private matchesPattern(text: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i');
    return regex.test(text);
  }

  private categorizeError(errorText: string): string {
    const categories = {
      'syntax': /syntax.*error|unexpected token|missing|expected/i,
      'reference': /reference.*error|not defined|undefined/i,
      'type': /type.*error|cannot read property|null|undefined/i,
      'import': /module.*not found|cannot resolve/i,
      'network': /network|fetch|cors|connection/i,
      'permission': /permission|access|denied|forbidden/i
    };

    for (const [category, regex] of Object.entries(categories)) {
      if (regex.test(errorText)) return category;
    }

    return 'general';
  }

  private getUserFrequentErrors() {
    const errorCounts = new Map<string, { count: number; category: string; suggestion: string }>();
    
    this.userHistory.forEach(entry => {
      const key = this.normalizeError(entry.errorText);
      const current = errorCounts.get(key) || { count: 0, category: entry.category, suggestion: '' };
      current.count++;
      errorCounts.set(key, current);
    });

    return Array.from(errorCounts.values()).filter(error => error.count > 1);
  }

  private analyzeUserPatterns() {
    // Analyze patterns in user's error history
    const patterns = new Map<string, { frequency: number; category: string; recentlyResolved: boolean; preventionTip: string }>();
    
    this.userHistory.forEach(entry => {
      const category = entry.category;
      const current = patterns.get(category) || { 
        frequency: 0, 
        category, 
        recentlyResolved: false,
        preventionTip: this.getPreventionTip(category)
      };
      current.frequency++;
      
      // Check if recently resolved
      const recentEntries = this.userHistory
        .filter(e => e.category === category && e.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      current.recentlyResolved = recentEntries.length > 0 && recentEntries[0].resolved;
      patterns.set(category, current);
    });

    return Array.from(patterns.values());
  }

  private getPreventionTip(category: string): string {
    const tips: Record<string, string> = {
      'syntax': 'Use a linter like ESLint to catch syntax errors early',
      'reference': 'Double-check variable names and imports',
      'type': 'Use TypeScript for better type safety',
      'import': 'Verify file paths and package installations',
      'network': 'Check API endpoints and network connectivity',
      'permission': 'Review file permissions and access rights'
    };

    return tips[category] || 'Follow coding best practices';
  }

  private updatePatterns() {
    // Update internal patterns based on new data
    // This would typically involve machine learning algorithms
    // For now, we'll use simple frequency-based updates
  }
}

interface PredictedError {
  type: string;
  probability: number;
  description: string;
  prevention: string;
}

export const errorDetector = new ErrorPatternDetector();
