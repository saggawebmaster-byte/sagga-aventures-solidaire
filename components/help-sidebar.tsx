"use client";

import { useState } from 'react';
import { HelpCircle, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HelpTip {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'tip';
}

interface HelpSidebarProps {
  readonly tips: HelpTip[];
  readonly isVisible: boolean;
  readonly onToggle: () => void;
}

export default function HelpSidebar({ tips, isVisible, onToggle }: HelpSidebarProps) {
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'info':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-[#752D8B] hover:bg-[#5a2269] text-white rounded-full w-12 h-12 shadow-lg"
        aria-label="Ouvrir l'aide"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed right-4 top-4 bottom-4 w-80 z-50">
      <Card className="h-full shadow-xl border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-[#752D8B] to-[#5a2269] text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Aide contextuelle
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-white/20 h-8 w-8 p-0"
              aria-label="Fermer l'aide"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 overflow-y-auto h-full">
          <div className="space-y-3">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className={`border rounded-lg transition-all duration-200 ${getTypeColor(tip.type)}`}
              >
                <button
                  className="w-full p-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#752D8B] focus:ring-opacity-50 rounded-lg"
                  onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                  aria-expanded={expandedTip === tip.id}
                  aria-controls={`tip-content-${tip.id}`}
                >
                  <div className="flex items-center space-x-2">
                    {getIcon(tip.type)}
                    <span className="font-medium text-sm">{tip.title}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {tip.type}
                  </Badge>
                </button>
                {expandedTip === tip.id && (
                  <div
                    id={`tip-content-${tip.id}`}
                    className="p-3 pt-0 text-sm leading-relaxed"
                  >
                    {tip.content}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-sm text-gray-900 mb-2">
              📞 Besoin d&apos;aide supplémentaire ?
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              Notre équipe est disponible pour vous accompagner
            </p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>📧 Email: aide@commune-apatou.fr</p>
              <p>📞 Tél: 05 94 XX XX XX</p>
              <p>🕒 Lun-Ven: 8h-12h / 14h-17h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
