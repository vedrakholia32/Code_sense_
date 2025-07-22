'use client';

import { useState } from 'react';

interface QuickFix {
  description: string;
  code?: string;
  confidence: number;
}

interface DetailedSolution {
  steps: Array<{
    step: number;
    action: string;
    code?: string;
    explanation: string;
  }>;
  preventionTips: string[];
  bestPractices: string[];
}

interface LearningResource {
  title: string;
  type: 'documentation' | 'tutorial' | 'video';
  description: string;
}

interface CodeQuality {
  score: number;
  improvements: string[];
  securityConcerns: string[];
}

interface DebuggingTip {
  technique: string;
  description: string;
  example: string;
}

interface ErrorAnalysisData {
  type: 'error' | 'warning' | 'no_error' | 'code_review';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  errorType?: string;
  category: 'runtime' | 'compile_time' | 'logic' | 'performance' | 'security' | 'style';
  file?: string;
  line?: number;
  column?: number;
  explanation: string;
  rootCause: string;
  impact: string;
  quickFix: QuickFix;
  detailedSolution: DetailedSolution;
  relatedErrors: string[];
  learningResources: LearningResource[];
  codeQuality: CodeQuality;
  debuggingTips: DebuggingTip[];
}

interface ErrorAnalysisProps {
  data: ErrorAnalysisData;
}

export default function ErrorAnalysis({ data }: ErrorAnalysisProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'solution' | 'learning' | 'quality'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'from-red-600 to-red-700';
      case 'high': return 'from-orange-600 to-orange-700';
      case 'medium': return 'from-yellow-600 to-yellow-700';
      case 'low': return 'from-blue-600 to-blue-700';
      case 'info': return 'from-green-600 to-green-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'code_review': return '🔍';
      default: return '✅';
    }
  };

  const copyToClipboard = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'solution', label: 'Solution', icon: '🔧' },
    { id: 'learning', label: 'Learn More', icon: '📚' },
    { id: 'quality', label: 'Code Quality', icon: '⭐' },
  ];

  return (
    <div className="w-full max-w-6xl bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getSeverityColor(data.severity)} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeIcon(data.type)}</span>
            <div>
              <h2 className="text-xl font-bold text-white">
                {data.errorType || 'Analysis Complete'}
              </h2>
              <p className="text-white/80 text-sm">
                {data.file && `${data.file}${data.line ? `:${data.line}` : ''}`} • {data.category} • {data.severity}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 px-3 py-1 rounded-full text-white text-sm font-medium">
              Confidence: {Math.round(data.quickFix.confidence * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-700/50 bg-gray-900/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800/50'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-3">Explanation</h3>
              <p className="text-gray-300 leading-relaxed">{data.explanation}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                <h4 className="font-medium text-gray-100 mb-2">🎯 Root Cause</h4>
                <p className="text-gray-300 text-sm">{data.rootCause}</p>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                <h4 className="font-medium text-gray-100 mb-2">💥 Impact</h4>
                <p className="text-gray-300 text-sm">{data.impact}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-4 border border-blue-700/30">
              <h4 className="font-medium text-gray-100 mb-2 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Fix
              </h4>
              <p className="text-gray-300 text-sm mb-3">{data.quickFix.description}</p>
              {data.quickFix.code && (
                <div className="relative">
                  <pre className="bg-gray-900 rounded-lg p-3 text-green-400 text-sm overflow-x-auto">
                    <code>{data.quickFix.code}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(data.quickFix.code!)}
                    className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs transition-colors"
                  >
                    {copiedCode === data.quickFix.code ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'solution' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-4">
                {data.detailedSolution.steps.map((step, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-100 mb-2">{step.action}</h4>
                        <p className="text-gray-300 text-sm mb-3">{step.explanation}</p>
                        {step.code && (
                          <div className="relative">
                            <pre className="bg-gray-900 rounded-lg p-3 text-green-400 text-sm overflow-x-auto">
                              <code>{step.code}</code>
                            </pre>
                            <button
                              onClick={() => copyToClipboard(step.code!)}
                              className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs transition-colors"
                            >
                              {copiedCode === step.code ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-100 mb-3">🛡️ Prevention Tips</h4>
                <ul className="space-y-2">
                  {data.detailedSolution.preventionTips.map((tip, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-100 mb-3">✨ Best Practices</h4>
                <ul className="space-y-2">
                  {data.detailedSolution.bestPractices.map((practice, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {practice}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Learning Resources</h3>
              <div className="grid gap-4">
                {data.learningResources.map((resource, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-100">{resource.title}</h4>
                        <p className="text-gray-300 text-sm mt-1">{resource.description}</p>
                      </div>
                      <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-100 mb-3">🔧 Debugging Techniques</h4>
              <div className="space-y-4">
                {data.debuggingTips.map((tip, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                    <h5 className="font-medium text-gray-100 mb-2">{tip.technique}</h5>
                    <p className="text-gray-300 text-sm mb-3">{tip.description}</p>
                    <div className="relative">
                      <pre className="bg-gray-900 rounded-lg p-3 text-yellow-400 text-sm overflow-x-auto">
                        <code>{tip.example}</code>
                      </pre>
                      <button
                        onClick={() => copyToClipboard(tip.example)}
                        className="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs transition-colors"
                      >
                        {copiedCode === tip.example ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {data.relatedErrors.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-100 mb-3">🔗 Related Errors</h4>
                <div className="flex flex-wrap gap-2">
                  {data.relatedErrors.map((error, index) => (
                    <span key={index} className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-sm">
                      {error}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-700/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Code Quality Score</h3>
                <div className="text-3xl font-bold text-purple-400">
                  {data.codeQuality.score}/10
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(data.codeQuality.score / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-100 mb-3">💡 Improvements</h4>
              <div className="space-y-3">
                {data.codeQuality.improvements.map((improvement, index) => (
                  <div key={index} className="bg-blue-900/20 rounded-lg p-3 border border-blue-700/30">
                    <p className="text-gray-300 text-sm">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>

            {data.codeQuality.securityConcerns.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-100 mb-3 flex items-center">
                  <span className="mr-2">🔒</span>
                  Security Concerns
                </h4>
                <div className="space-y-3">
                  {data.codeQuality.securityConcerns.map((concern, index) => (
                    <div key={index} className="bg-red-900/20 rounded-lg p-3 border border-red-700/30">
                      <p className="text-gray-300 text-sm">{concern}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
