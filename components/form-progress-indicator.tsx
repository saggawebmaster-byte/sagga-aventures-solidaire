"use client";

import { CheckCircle, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface FormProgressIndicatorProps {
  readonly steps: Step[];
  readonly currentStep: string;
}

export default function FormProgressIndicator({ steps, currentStep }: FormProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = step.id === currentStep;
          const isUpcoming = index > currentStepIndex;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="relative flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200",
                    {
                      "bg-green-500 text-white": isCompleted,
                      "bg-[#752D8B] text-white ring-4 ring-[#752D8B]/20": isCurrent,
                      "bg-gray-300 text-gray-600": isUpcoming,
                    }
                  )}
                  aria-label={`Étape ${index + 1}: ${step.title} - ${step.status === 'completed' ? 'Terminée' : step.status === 'current' ? 'En cours' : 'À venir'}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : isCurrent ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </div>

                {/* Step Info */}
                <div className="ml-4 min-w-0 flex-1">
                  <div
                    className={cn(
                      "text-sm font-medium transition-colors",
                      {
                        "text-green-600": isCompleted,
                        "text-[#752D8B]": isCurrent,
                        "text-gray-500": isUpcoming,
                      }
                    )}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-16 h-0.5 mx-4 transition-colors",
                    {
                      "bg-green-500": index < currentStepIndex,
                      "bg-[#752D8B]": index === currentStepIndex - 1,
                      "bg-gray-300": index >= currentStepIndex,
                    }
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
